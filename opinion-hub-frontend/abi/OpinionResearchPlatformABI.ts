// Auto-generated ABI file
// Generated at: 2025-09-28T17:36:33.680Z

export const OpinionResearchPlatformABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "insights",
        "type": "uint256[]"
      }
    ],
    "name": "InsightsRevealed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "participant",
        "type": "address"
      }
    ],
    "name": "ResponseSubmitted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      }
    ],
    "name": "SurveyClosed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "surveyId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "topic",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "researcher",
        "type": "address"
      }
    ],
    "name": "SurveyLaunched",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_participant",
        "type": "address"
      }
    ],
    "name": "canParticipateInSurvey",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      }
    ],
    "name": "closeSurvey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_choiceIndex",
        "type": "uint256"
      }
    ],
    "name": "getEncryptedResponseCount",
    "outputs": [
      {
        "internalType": "euint32",
        "name": "",
        "type": "bytes32"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      }
    ],
    "name": "getSurveyInfo",
    "outputs": [
      {
        "internalType": "string",
        "name": "topic",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "choices",
        "type": "string[]"
      },
      {
        "internalType": "address",
        "name": "researcher",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "launchTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "closeTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isOpenAccess",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalResponses",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalSurveys",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "_addresses",
        "type": "address[]"
      }
    ],
    "name": "grantAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "_participant",
        "type": "address"
      }
    ],
    "name": "hasResponded",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_topic",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_description",
        "type": "string"
      },
      {
        "internalType": "string[]",
        "name": "_choices",
        "type": "string[]"
      },
      {
        "internalType": "uint256",
        "name": "_launchTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_closeTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_isOpenAccess",
        "type": "bool"
      }
    ],
    "name": "launchSurvey",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "platformOwner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "protocolId",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      }
    ],
    "name": "publishInsights",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "researchers",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "address[]",
        "name": "_addresses",
        "type": "address[]"
      }
    ],
    "name": "revokeAccess",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_researcher",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_isResearcher",
        "type": "bool"
      }
    ],
    "name": "setResearcher",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_surveyId",
        "type": "uint256"
      },
      {
        "internalType": "externalEuint8",
        "name": "_encryptedChoice",
        "type": "bytes32"
      },
      {
        "internalType": "bytes",
        "name": "_inputProof",
        "type": "bytes"
      }
    ],
    "name": "submitResponse",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "surveyCounter",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "surveys",
    "outputs": [
      {
        "internalType": "string",
        "name": "topic",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "researcher",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "launchTime",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "closeTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isActive",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isOpenAccess",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalResponses",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export type OpinionResearchPlatformABI = typeof OpinionResearchPlatformABI;
