import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

task("task:opinion-research-address")
  .setDescription("Get OpinionResearchPlatform contract address")
  .setAction(async function (taskArguments: TaskArguments, { deployments }) {
    const opinionResearchPlatform = await deployments.get("OpinionResearchPlatform");
    console.log("OpinionResearchPlatform contract address:", opinionResearchPlatform.address);
  });

task("task:launch-survey")
  .setDescription("Launch a new survey")
  .addParam("topic", "Survey topic")
  .addParam("description", "Survey description")
  .addParam("choices", "Survey choices (comma-separated)")
  .addParam("duration", "Survey duration in seconds")
  .addParam("openaccess", "Is open access survey (true/false)")
  .setAction(async function (taskArguments: TaskArguments, { ethers, deployments }) {
    const opinionResearchPlatform = await deployments.get("OpinionResearchPlatform");
    const signers = await ethers.getSigners();
    const contract = await ethers.getContractAt("OpinionResearchPlatform", opinionResearchPlatform.address);
    
    const choices = taskArguments.choices.split(",").map((choice: string) => choice.trim());
    const launchTime = Math.floor(Date.now() / 1000);
    const closeTime = launchTime + parseInt(taskArguments.duration);
    const isOpenAccess = taskArguments.openaccess === "true";
    
    console.log("Launching survey...");
    const transaction = await contract.connect(signers[0]).launchSurvey(
      taskArguments.topic,
      taskArguments.description,
      choices,
      launchTime,
      closeTime,
      isOpenAccess
    );
    
    await transaction.wait();
    console.log(`Survey launched! Transaction hash: ${transaction.hash}`);
  });

task("task:submit-response")
  .setDescription("Submit a response to a survey")
  .addParam("surveyId", "Survey ID")
  .addParam("choice", "Choice index (0-based)")
  .setAction(async function (taskArguments: TaskArguments, { ethers, deployments }) {
    const opinionResearchPlatform = await deployments.get("OpinionResearchPlatform");
    const signers = await ethers.getSigners();
    const contract = await ethers.getContractAt("OpinionResearchPlatform", opinionResearchPlatform.address);
    
    console.log("Submitting response...");
    // Note: This is a simplified version. In real implementation, we need to encrypt the choice
    // For now, we'll use a placeholder that would need FHEVM integration
    console.log("Warning: This task needs FHEVM integration for encrypted responses");
    console.log(`Would submit choice ${taskArguments.choice} for survey ${taskArguments.surveyId}`);
  });

task("task:get-survey-info")
  .setDescription("Get survey information")
  .addParam("surveyId", "Survey ID")
  .setAction(async function (taskArguments: TaskArguments, { ethers, deployments }) {
    const opinionResearchPlatform = await deployments.get("OpinionResearchPlatform");
    const contract = await ethers.getContractAt("OpinionResearchPlatform", opinionResearchPlatform.address);
    
    console.log("Getting survey info...");
    const surveyInfo = await contract.getSurveyInfo(taskArguments.surveyId);
    
    console.log("Survey Information:");
    console.log("- Topic:", surveyInfo.topic);
    console.log("- Description:", surveyInfo.description);
    console.log("- Choices:", surveyInfo.choices);
    console.log("- Researcher:", surveyInfo.researcher);
    console.log("- Launch Time:", new Date(Number(surveyInfo.launchTime) * 1000).toLocaleString());
    console.log("- Close Time:", new Date(Number(surveyInfo.closeTime) * 1000).toLocaleString());
    console.log("- Is Active:", surveyInfo.isActive);
    console.log("- Is Open Access:", surveyInfo.isOpenAccess);
    console.log("- Total Responses:", surveyInfo.totalResponses.toString());
  });

task("task:get-encrypted-counts")
  .setDescription("Get encrypted response counts for a survey")
  .addParam("surveyId", "Survey ID")
  .setAction(async function (taskArguments: TaskArguments, { ethers, deployments }) {
    const opinionResearchPlatform = await deployments.get("OpinionResearchPlatform");
    const contract = await ethers.getContractAt("OpinionResearchPlatform", opinionResearchPlatform.address);
    
    console.log("Getting encrypted response counts...");
    const surveyInfo = await contract.getSurveyInfo(taskArguments.surveyId);
    
    console.log(`Survey: ${surveyInfo.topic}`);
    console.log("Encrypted Response Counts:");
    
    for (let i = 0; i < surveyInfo.choices.length; i++) {
      try {
        const encryptedCount = await contract.getEncryptedResponseCount(taskArguments.surveyId, i);
        console.log(`- ${surveyInfo.choices[i]}: [Encrypted Handle: ${encryptedCount}]`);
      } catch (error) {
        console.log(`- ${surveyInfo.choices[i]}: Error getting count`);
      }
    }
  });

task("task:close-survey")
  .setDescription("Close a survey")
  .addParam("surveyId", "Survey ID")
  .setAction(async function (taskArguments: TaskArguments, { ethers, deployments }) {
    const opinionResearchPlatform = await deployments.get("OpinionResearchPlatform");
    const signers = await ethers.getSigners();
    const contract = await ethers.getContractAt("OpinionResearchPlatform", opinionResearchPlatform.address);
    
    console.log("Closing survey...");
    const transaction = await contract.connect(signers[0]).closeSurvey(taskArguments.surveyId);
    
    await transaction.wait();
    console.log(`Survey closed! Transaction hash: ${transaction.hash}`);
  });

task("task:publish-insights")
  .setDescription("Publish survey insights (make results public)")
  .addParam("surveyId", "Survey ID")
  .setAction(async function (taskArguments: TaskArguments, { ethers, deployments }) {
    const opinionResearchPlatform = await deployments.get("OpinionResearchPlatform");
    const signers = await ethers.getSigners();
    const contract = await ethers.getContractAt("OpinionResearchPlatform", opinionResearchPlatform.address);
    
    console.log("Publishing insights...");
    const transaction = await contract.connect(signers[0]).publishInsights(taskArguments.surveyId);
    
    await transaction.wait();
    console.log(`Insights published! Transaction hash: ${transaction.hash}`);
  });

