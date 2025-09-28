// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint8, euint32, ebool, externalEuint8} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title OpinionHub - Confidential Public Opinion Research Platform using FHEVM
/// @author OpinionHub Research Team
/// @notice A privacy-preserving opinion research platform where responses are encrypted and anonymous
contract OpinionResearchPlatform is SepoliaConfig {
    using FHE for euint8;
    using FHE for euint32;
    using FHE for ebool;

    // Events
    event SurveyLaunched(uint256 indexed surveyId, string topic, address indexed researcher);
    event ResponseSubmitted(uint256 indexed surveyId, address indexed participant);
    event SurveyClosed(uint256 indexed surveyId);
    event InsightsRevealed(uint256 indexed surveyId, uint256[] insights);

    // Structs
    struct Survey {
        string topic;
        string description;
        string[] choices;
        address researcher;
        uint256 launchTime;
        uint256 closeTime;
        bool isActive;
        bool isOpenAccess; // true for open survey, false for restricted access
        uint256 totalResponses;
        mapping(uint256 => euint32) encryptedResponseCounts; // choiceIndex => encrypted count
        mapping(address => bool) hasResponded;
        mapping(address => bool) accessList; // for restricted surveys
    }

    // State variables
    uint256 public surveyCounter;
    mapping(uint256 => Survey) public surveys;
    
    // Access control
    mapping(address => bool) public researchers;
    address public platformOwner;

    // Modifiers
    modifier onlyPlatformOwner() {
        require(msg.sender == platformOwner, "Only platform owner can call this function");
        _;
    }

    modifier onlyResearcher() {
        require(researchers[msg.sender] || msg.sender == platformOwner, "Only researcher can call this function");
        _;
    }

    modifier surveyExists(uint256 _surveyId) {
        require(_surveyId < surveyCounter, "Survey does not exist");
        _;
    }

    modifier surveyActive(uint256 _surveyId) {
        require(surveys[_surveyId].isActive, "Survey is not active");
        require(block.timestamp >= surveys[_surveyId].launchTime, "Survey has not started yet");
        require(block.timestamp <= surveys[_surveyId].closeTime, "Survey has ended");
        _;
    }

    modifier canRespond(uint256 _surveyId) {
        require(!surveys[_surveyId].hasResponded[msg.sender], "Already responded");
        if (!surveys[_surveyId].isOpenAccess) {
            // Creator always has access to their own survey
            require(
                surveys[_surveyId].accessList[msg.sender] || msg.sender == surveys[_surveyId].researcher, 
                "Not authorized to respond"
            );
        }
        _;
    }

    constructor() {
        platformOwner = msg.sender;
        researchers[msg.sender] = true;
    }

    /// @notice Add or remove researcher
    /// @param _researcher Address to modify researcher status
    /// @param _isResearcher True to add researcher, false to remove
    function setResearcher(address _researcher, bool _isResearcher) external onlyPlatformOwner {
        researchers[_researcher] = _isResearcher;
    }

    /// @notice Launch a new survey
    /// @param _topic Topic of the survey
    /// @param _description Description of the survey
    /// @param _choices Array of survey choices (2-4 choices)
    /// @param _launchTime Launch timestamp
    /// @param _closeTime Close timestamp
    /// @param _isOpenAccess True for open survey, false for restricted access
    function launchSurvey(
        string memory _topic,
        string memory _description,
        string[] memory _choices,
        uint256 _launchTime,
        uint256 _closeTime,
        bool _isOpenAccess
    ) external onlyResearcher {
        require(_choices.length >= 2 && _choices.length <= 4, "Must have 2-4 choices");
        require(_launchTime < _closeTime, "Invalid time range");
        require(_closeTime > block.timestamp, "Close time must be in the future");

        uint256 surveyId = surveyCounter++;
        Survey storage newSurvey = surveys[surveyId];
        
        newSurvey.topic = _topic;
        newSurvey.description = _description;
        newSurvey.choices = _choices;
        newSurvey.researcher = msg.sender;
        newSurvey.launchTime = _launchTime;
        newSurvey.closeTime = _closeTime;
        newSurvey.isActive = true;
        newSurvey.isOpenAccess = _isOpenAccess;
        newSurvey.totalResponses = 0;

        // Initialize encrypted response counts to 0 and grant researcher access
        for (uint256 i = 0; i < _choices.length; i++) {
            newSurvey.encryptedResponseCounts[i] = FHE.asEuint32(0);
            FHE.allowThis(newSurvey.encryptedResponseCounts[i]);
            FHE.allow(newSurvey.encryptedResponseCounts[i], msg.sender); // Grant researcher access
        }

        emit SurveyLaunched(surveyId, _topic, msg.sender);
    }

    /// @notice Add addresses to survey access list
    /// @param _surveyId Survey ID
    /// @param _addresses Array of addresses to grant access
    function grantAccess(uint256 _surveyId, address[] memory _addresses) 
        external 
        surveyExists(_surveyId) 
        onlyResearcher 
    {
        require(!surveys[_surveyId].isOpenAccess, "Cannot restrict open access survey");
        
        for (uint256 i = 0; i < _addresses.length; i++) {
            surveys[_surveyId].accessList[_addresses[i]] = true;
        }
    }

    /// @notice Remove addresses from survey access list
    /// @param _surveyId Survey ID
    /// @param _addresses Array of addresses to remove access
    function revokeAccess(uint256 _surveyId, address[] memory _addresses) 
        external 
        surveyExists(_surveyId) 
        onlyResearcher 
    {
        for (uint256 i = 0; i < _addresses.length; i++) {
            surveys[_surveyId].accessList[_addresses[i]] = false;
        }
    }

    /// @notice Submit an encrypted response
    /// @param _surveyId Survey ID
    /// @param _encryptedChoice Encrypted choice index (0-3)
    /// @param _inputProof Input proof for the encrypted value
    function submitResponse(
        uint256 _surveyId,
        externalEuint8 _encryptedChoice,
        bytes calldata _inputProof
    ) external surveyExists(_surveyId) surveyActive(_surveyId) canRespond(_surveyId) {
        euint8 encryptedChoice = FHE.fromExternal(_encryptedChoice, _inputProof);
        uint256 choicesLength = surveys[_surveyId].choices.length;
        
        // Simplified response logic - increment all choices based on encrypted comparison
        for (uint256 i = 0; i < choicesLength; i++) {
            ebool isThisChoice = FHE.eq(encryptedChoice, FHE.asEuint8(uint8(i)));
            euint32 increment = FHE.select(isThisChoice, FHE.asEuint32(1), FHE.asEuint32(0));
            
            surveys[_surveyId].encryptedResponseCounts[i] = FHE.add(
                surveys[_surveyId].encryptedResponseCounts[i], 
                increment
            );
            
            FHE.allowThis(surveys[_surveyId].encryptedResponseCounts[i]);
            FHE.allow(surveys[_surveyId].encryptedResponseCounts[i], msg.sender);
            FHE.allow(surveys[_surveyId].encryptedResponseCounts[i], surveys[_surveyId].researcher); // Always allow researcher
        }

        surveys[_surveyId].hasResponded[msg.sender] = true;
        surveys[_surveyId].totalResponses++;

        emit ResponseSubmitted(_surveyId, msg.sender);
    }

    /// @notice Close a survey (only researcher or platform owner)
    /// @param _surveyId Survey ID
    function closeSurvey(uint256 _surveyId) external surveyExists(_surveyId) {
        require(
            msg.sender == surveys[_surveyId].researcher || researchers[msg.sender] || msg.sender == platformOwner,
            "Not authorized to close survey"
        );
        require(surveys[_surveyId].isActive, "Survey already closed");

        surveys[_surveyId].isActive = false;
        emit SurveyClosed(_surveyId);
    }

    /// @notice Make survey insights publicly decryptable (simplified approach)
    /// @param _surveyId Survey ID
    function publishInsights(uint256 _surveyId) external surveyExists(_surveyId) {
        require(!surveys[_surveyId].isActive, "Survey is still active");
        require(
            msg.sender == surveys[_surveyId].researcher || researchers[msg.sender] || msg.sender == platformOwner,
            "Not authorized to publish insights"
        );

        uint256 choicesLength = surveys[_surveyId].choices.length;
        
        for (uint256 i = 0; i < choicesLength; i++) {
            // Make each response count publicly decryptable
            FHE.makePubliclyDecryptable(surveys[_surveyId].encryptedResponseCounts[i]);
        }

        emit InsightsRevealed(_surveyId, new uint256[](choicesLength));
    }

    /// @notice Get survey information
    /// @param _surveyId Survey ID
    /// @return topic Topic of the survey
    /// @return description Description of the survey
    /// @return choices Array of survey choices
    /// @return researcher Address of the survey researcher
    /// @return launchTime Launch timestamp
    /// @return closeTime Close timestamp
    /// @return isActive Whether the survey is active
    /// @return isOpenAccess Whether the survey is open access
    /// @return totalResponses Total number of responses submitted
    function getSurveyInfo(uint256 _surveyId) 
        external 
        view 
        surveyExists(_surveyId) 
        returns (
            string memory topic,
            string memory description,
            string[] memory choices,
            address researcher,
            uint256 launchTime,
            uint256 closeTime,
            bool isActive,
            bool isOpenAccess,
            uint256 totalResponses
        ) 
    {
        Survey storage survey = surveys[_surveyId];
        return (
            survey.topic,
            survey.description,
            survey.choices,
            survey.researcher,
            survey.launchTime,
            survey.closeTime,
            survey.isActive,
            survey.isOpenAccess,
            survey.totalResponses
        );
    }

    /// @notice Get encrypted response count for a choice
    /// @param _surveyId Survey ID
    /// @param _choiceIndex Choice index
    /// @return Encrypted response count handle
    function getEncryptedResponseCount(uint256 _surveyId, uint256 _choiceIndex) 
        external 
        view 
        surveyExists(_surveyId) 
        returns (euint32) 
    {
        require(_choiceIndex < surveys[_surveyId].choices.length, "Invalid choice index");
        return surveys[_surveyId].encryptedResponseCounts[_choiceIndex];
    }


    /// @notice Check if an address has responded
    /// @param _surveyId Survey ID
    /// @param _participant Participant address
    /// @return True if responded, false otherwise
    function hasResponded(uint256 _surveyId, address _participant) 
        external 
        view 
        surveyExists(_surveyId) 
        returns (bool) 
    {
        return surveys[_surveyId].hasResponded[_participant];
    }

    /// @notice Check if an address has access to a survey
    /// @param _surveyId Survey ID
    /// @param _participant Participant address
    /// @return True if has access or survey is open access, false otherwise
    function canParticipateInSurvey(uint256 _surveyId, address _participant) 
        external 
        view 
        surveyExists(_surveyId) 
        returns (bool) 
    {
        if (surveys[_surveyId].isOpenAccess) {
            return true;
        }
        // Creator always has access to their own survey
        if (_participant == surveys[_surveyId].researcher) {
            return true;
        }
        return surveys[_surveyId].accessList[_participant];
    }

    /// @notice Get total number of surveys
    /// @return Total survey count
    function getTotalSurveys() external view returns (uint256) {
        return surveyCounter;
    }
}
