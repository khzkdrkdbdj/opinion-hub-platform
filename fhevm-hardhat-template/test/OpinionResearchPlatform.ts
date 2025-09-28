import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import { OpinionResearchPlatform } from "../types";
import { Signer } from "ethers";

describe("OpinionResearchPlatform", function () {
  let opinionResearchPlatform: OpinionResearchPlatform;
  let owner: Signer;
  let researcher: Signer;
  let participant1: Signer;
  let participant2: Signer;
  let ownerAddress: string;
  let researcherAddress: string;
  let participant1Address: string;
  let participant2Address: string;

  beforeEach(async function () {
    await deployments.fixture(["OpinionResearchPlatform"]);
    const opinionResearchPlatformDeployment = await deployments.get("OpinionResearchPlatform");
    opinionResearchPlatform = await ethers.getContractAt("OpinionResearchPlatform", opinionResearchPlatformDeployment.address);

    [owner, researcher, participant1, participant2] = await ethers.getSigners();
    ownerAddress = await owner.getAddress();
    researcherAddress = await researcher.getAddress();
    participant1Address = await participant1.getAddress();
    participant2Address = await participant2.getAddress();
  });

  describe("Deployment", function () {
    it("Should set the right platform owner", async function () {
      expect(await opinionResearchPlatform.platformOwner()).to.equal(ownerAddress);
    });

    it("Should set owner as researcher", async function () {
      expect(await opinionResearchPlatform.researchers(ownerAddress)).to.be.true;
    });

    it("Should initialize survey counter to 0", async function () {
      expect(await opinionResearchPlatform.surveyCounter()).to.equal(0);
    });
  });

  describe("Researcher Management", function () {
    it("Should allow platform owner to add researchers", async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
      expect(await opinionResearchPlatform.researchers(researcherAddress)).to.be.true;
    });

    it("Should allow platform owner to remove researchers", async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, false);
      expect(await opinionResearchPlatform.researchers(researcherAddress)).to.be.false;
    });

    it("Should not allow non-owner to manage researchers", async function () {
      await expect(
        opinionResearchPlatform.connect(researcher).setResearcher(participant1Address, true)
      ).to.be.revertedWith("Only platform owner can call this function");
    });
  });

  describe("Survey Creation", function () {
    beforeEach(async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
    });

    it("Should allow researchers to launch surveys", async function () {
      const topic = "Favorite Programming Language";
      const description = "What is your favorite programming language?";
      const choices = ["JavaScript", "Python", "Rust", "Go"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600; // 1 hour later
      const isOpenAccess = true;

      await expect(
        opinionResearchPlatform.connect(researcher).launchSurvey(
          topic,
          description,
          choices,
          launchTime,
          closeTime,
          isOpenAccess
        )
      ).to.emit(opinionResearchPlatform, "SurveyLaunched")
        .withArgs(0, topic, researcherAddress);

      expect(await opinionResearchPlatform.surveyCounter()).to.equal(1);
    });

    it("Should validate survey choices count", async function () {
      const topic = "Test Survey";
      const description = "Test Description";
      const choices = ["Only One Choice"]; // Invalid: less than 2 choices
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = true;

      await expect(
        opinionResearchPlatform.connect(researcher).launchSurvey(
          topic,
          description,
          choices,
          launchTime,
          closeTime,
          isOpenAccess
        )
      ).to.be.revertedWith("Must have 2-4 choices");
    });

    it("Should validate time range", async function () {
      const topic = "Test Survey";
      const description = "Test Description";
      const choices = ["Choice A", "Choice B"];
      const launchTime = Math.floor(Date.now() / 1000) + 3600;
      const closeTime = launchTime - 1800; // Invalid: close time before launch time
      const isOpenAccess = true;

      await expect(
        opinionResearchPlatform.connect(researcher).launchSurvey(
          topic,
          description,
          choices,
          launchTime,
          closeTime,
          isOpenAccess
        )
      ).to.be.revertedWith("Invalid time range");
    });

    it("Should not allow non-researchers to launch surveys", async function () {
      const topic = "Test Survey";
      const description = "Test Description";
      const choices = ["Choice A", "Choice B"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = true;

      await expect(
        opinionResearchPlatform.connect(participant1).launchSurvey(
          topic,
          description,
          choices,
          launchTime,
          closeTime,
          isOpenAccess
        )
      ).to.be.revertedWith("Only researcher can call this function");
    });
  });

  describe("Survey Information", function () {
    let surveyId: number;

    beforeEach(async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
      
      const topic = "Test Survey";
      const description = "Test Description";
      const choices = ["Choice A", "Choice B", "Choice C"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = true;

      await opinionResearchPlatform.connect(researcher).launchSurvey(
        topic,
        description,
        choices,
        launchTime,
        closeTime,
        isOpenAccess
      );
      
      surveyId = 0;
    });

    it("Should return correct survey information", async function () {
      const surveyInfo = await opinionResearchPlatform.getSurveyInfo(surveyId);
      
      expect(surveyInfo.topic).to.equal("Test Survey");
      expect(surveyInfo.description).to.equal("Test Description");
      expect(surveyInfo.choices).to.deep.equal(["Choice A", "Choice B", "Choice C"]);
      expect(surveyInfo.researcher).to.equal(researcherAddress);
      expect(surveyInfo.isActive).to.be.true;
      expect(surveyInfo.isOpenAccess).to.be.true;
      expect(surveyInfo.totalResponses).to.equal(0);
    });

    it("Should return total surveys count", async function () {
      expect(await opinionResearchPlatform.getTotalSurveys()).to.equal(1);
    });
  });

  describe("Access Control", function () {
    let surveyId: number;

    beforeEach(async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
      
      const topic = "Private Survey";
      const description = "Restricted Access Survey";
      const choices = ["Choice A", "Choice B"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = false; // Restricted access

      await opinionResearchPlatform.connect(researcher).launchSurvey(
        topic,
        description,
        choices,
        launchTime,
        closeTime,
        isOpenAccess
      );
      
      surveyId = 0;
    });

    it("Should allow researchers to grant access", async function () {
      await opinionResearchPlatform.connect(researcher).grantAccess(surveyId, [participant1Address]);
      
      expect(await opinionResearchPlatform.canParticipateInSurvey(surveyId, participant1Address)).to.be.true;
      expect(await opinionResearchPlatform.canParticipateInSurvey(surveyId, participant2Address)).to.be.false;
    });

    it("Should allow researchers to revoke access", async function () {
      await opinionResearchPlatform.connect(researcher).grantAccess(surveyId, [participant1Address]);
      await opinionResearchPlatform.connect(researcher).revokeAccess(surveyId, [participant1Address]);
      
      expect(await opinionResearchPlatform.canParticipateInSurvey(surveyId, participant1Address)).to.be.false;
    });

    it("Should not allow access control on open access surveys", async function () {
      // Create an open access survey
      const topic = "Open Survey";
      const description = "Open Access Survey";
      const choices = ["Choice A", "Choice B"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = true;

      await opinionResearchPlatform.connect(researcher).launchSurvey(
        topic,
        description,
        choices,
        launchTime,
        closeTime,
        isOpenAccess
      );
      
      const openSurveyId = 1;

      await expect(
        opinionResearchPlatform.connect(researcher).grantAccess(openSurveyId, [participant1Address])
      ).to.be.revertedWith("Cannot restrict open access survey");
    });
  });

  describe("Survey Closure", function () {
    let surveyId: number;

    beforeEach(async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
      
      const topic = "Test Survey";
      const description = "Test Description";
      const choices = ["Choice A", "Choice B"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = true;

      await opinionResearchPlatform.connect(researcher).launchSurvey(
        topic,
        description,
        choices,
        launchTime,
        closeTime,
        isOpenAccess
      );
      
      surveyId = 0;
    });

    it("Should allow researcher to close survey", async function () {
      await expect(
        opinionResearchPlatform.connect(researcher).closeSurvey(surveyId)
      ).to.emit(opinionResearchPlatform, "SurveyClosed")
        .withArgs(surveyId);

      const surveyInfo = await opinionResearchPlatform.getSurveyInfo(surveyId);
      expect(surveyInfo.isActive).to.be.false;
    });

    it("Should allow platform owner to close any survey", async function () {
      await expect(
        opinionResearchPlatform.connect(owner).closeSurvey(surveyId)
      ).to.emit(opinionResearchPlatform, "SurveyClosed")
        .withArgs(surveyId);

      const surveyInfo = await opinionResearchPlatform.getSurveyInfo(surveyId);
      expect(surveyInfo.isActive).to.be.false;
    });

    it("Should not allow non-authorized users to close survey", async function () {
      await expect(
        opinionResearchPlatform.connect(participant1).closeSurvey(surveyId)
      ).to.be.revertedWith("Not authorized to close survey");
    });

    it("Should not allow closing already closed survey", async function () {
      await opinionResearchPlatform.connect(researcher).closeSurvey(surveyId);
      
      await expect(
        opinionResearchPlatform.connect(researcher).closeSurvey(surveyId)
      ).to.be.revertedWith("Survey already closed");
    });
  });

  describe("Response Status", function () {
    let surveyId: number;

    beforeEach(async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
      
      const topic = "Test Survey";
      const description = "Test Description";
      const choices = ["Choice A", "Choice B"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = true;

      await opinionResearchPlatform.connect(researcher).launchSurvey(
        topic,
        description,
        choices,
        launchTime,
        closeTime,
        isOpenAccess
      );
      
      surveyId = 0;
    });

    it("Should correctly report response status", async function () {
      expect(await opinionResearchPlatform.hasResponded(surveyId, participant1Address)).to.be.false;
    });

    it("Should correctly report participation eligibility for open access", async function () {
      expect(await opinionResearchPlatform.canParticipateInSurvey(surveyId, participant1Address)).to.be.true;
      expect(await opinionResearchPlatform.canParticipateInSurvey(surveyId, participant2Address)).to.be.true;
    });
  });

  describe("Edge Cases", function () {
    it("Should revert when getting info for non-existent survey", async function () {
      await expect(
        opinionResearchPlatform.getSurveyInfo(999)
      ).to.be.revertedWith("Survey does not exist");
    });

    it("Should revert when getting encrypted count for invalid choice", async function () {
      await opinionResearchPlatform.connect(owner).setResearcher(researcherAddress, true);
      
      const topic = "Test Survey";
      const description = "Test Description";
      const choices = ["Choice A", "Choice B"];
      const launchTime = Math.floor(Date.now() / 1000);
      const closeTime = launchTime + 3600;
      const isOpenAccess = true;

      await opinionResearchPlatform.connect(researcher).launchSurvey(
        topic,
        description,
        choices,
        launchTime,
        closeTime,
        isOpenAccess
      );

      await expect(
        opinionResearchPlatform.getEncryptedResponseCount(0, 999)
      ).to.be.revertedWith("Invalid choice index");
    });
  });
});

