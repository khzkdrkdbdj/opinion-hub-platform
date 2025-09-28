import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const opinionResearchPlatform = await deploy("OpinionResearchPlatform", {
    from: deployer,
    args: [],
    log: true,
    deterministicDeployment: false,
  });

  console.log(`OpinionResearchPlatform contract deployed at: ${opinionResearchPlatform.address}`);
};

export default func;
func.id = "deploy_opinion_research_platform";
func.tags = ["OpinionResearchPlatform"];

