# OpinionHub - Advanced Public Opinion Research Platform

A cutting-edge privacy-preserving opinion research platform built with FHEVM (Fully Homomorphic Encryption Virtual Machine) technology, enabling confidential surveys with encrypted responses and advanced analytics.

## 🌟 Key Features

### Core Research Capabilities
- **Confidential Surveys**: All responses are encrypted using FHEVM, ensuring complete privacy
- **Multi-Choice Support**: Support for 2-4 response options per survey
- **Time-Controlled Research**: Set launch and close times for each survey
- **Access Management**: Open access or restricted participant surveys
- **Real-time Analytics**: Live response tracking with encrypted data
- **Researcher Privileges**: Survey creators have default decryption access
- **Insight Publication**: Secure result revelation after survey completion

### Advanced User Experience
- **Modern Neumorphic UI**: Beautiful, contemporary interface with soft shadows and depth
- **Bilingual Platform**: Chinese (中文) and English language support
- **MetaMask Integration**: Seamless wallet connection and transaction signing
- **Real-time Updates**: Live survey status and analytics updates
- **Responsive Design**: Optimized for all device sizes and screen types
- **Animated Interactions**: Smooth transitions and engaging micro-interactions

### Technical Excellence
- **FHEVM Integration**: Complete encrypted computation support
- **Multi-network Support**: Localhost development and Sepolia testnet
- **Mock Development Mode**: Local development with `@fhevm/mock-utils`
- **Production Ready**: Real relayer SDK integration for mainnet deployment
- **Type Safety**: Full TypeScript implementation throughout
- **Comprehensive Testing**: Complete test suite for smart contracts

## 🏗️ Architecture

### Smart Contracts (`fhevm-hardhat-template/`)
- **OpinionResearchPlatform.sol**: Main contract handling all survey logic
- **FHEVM Integration**: Uses encrypted data types (`euint8`, `euint32`, `ebool`)
- **Access Control**: Role-based permissions for platform owners and researchers
- **Encrypted Operations**: All response counting happens in encrypted space
- **Researcher Permissions**: Automatic decryption access for survey creators

### Frontend (`opinion-hub-frontend/`)
- **Next.js 15**: Modern React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Framer Motion**: Smooth animations and transitions
- **FHEVM Hooks**: Custom React hooks for blockchain interaction

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension
- Git

### 1. Clone and Setup
```bash
git clone <repository-url>
cd zama_voting_003

# Install smart contract dependencies
cd fhevm-hardhat-template
npm install

# Install frontend dependencies
cd ../opinion-hub-frontend
npm install
```

### 2. Local Development Mode

**Terminal 1: Start Hardhat Node**
```bash
cd fhevm-hardhat-template
npx hardhat node --verbose
```

**Terminal 2: Deploy Contracts**
```bash
cd fhevm-hardhat-template
npx hardhat --network localhost deploy --tags OpinionResearchPlatform
```

**Terminal 3: Start Frontend**
```bash
cd opinion-hub-frontend
npm run dev:mock
```

**Access**: http://localhost:3000

### 3. Sepolia Testnet Mode

**Deploy to Sepolia**:
```bash
cd fhevm-hardhat-template
npx hardhat --network sepolia deploy --tags OpinionResearchPlatform
```

**Update Frontend**:
```bash
cd opinion-hub-frontend
npm run genabi
npm run dev  # Production mode
```

**Configure MetaMask**:
- Network: Sepolia Test Network
- Chain ID: 11155111
- RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY

## 📖 Usage Guide

### For Researchers

#### Launching a Survey
1. Connect your MetaMask wallet
2. Click "Launch Survey" tab
3. Fill in survey details:
   - **Topic**: Research question or topic
   - **Description**: Detailed description
   - **Choices**: 2-4 response options
   - **Time**: Launch and close timestamps
   - **Access**: Open access or restricted participation
4. Submit and wait for transaction confirmation

#### Managing Surveys
- **Close Survey**: Manually close active surveys
- **View Insights**: Decrypt and view final results (researchers have default access)
- **Access Management**: Add/remove addresses for restricted surveys
- **Publish Insights**: Share results with non-researchers

### For Participants

#### Participating in Surveys
1. Browse available surveys on the Research Hub
2. Check survey status (Active/Closed/Upcoming)
3. Click "Participate" on active surveys you're eligible for
4. Select your preferred response in the modal
5. Confirm the encrypted transaction

#### Viewing Insights
- Insights are available after survey closes
- Click "View Insights" to decrypt and view response counts
- Researchers can view insights immediately
- Non-researchers need insights to be published first

## 🔧 Smart Contract Interaction

### Using Hardhat Tasks

```bash
# Get contract address
npx hardhat --network <network> task:opinion-research-address

# Launch a survey
npx hardhat --network <network> task:launch-survey \
  --topic "Test Survey" \
  --description "A test survey" \
  --choices "Option A,Option B,Option C" \
  --duration 3600 \
  --openaccess true

# Submit a response
npx hardhat --network <network> task:submit-response \
  --survey-id 0 \
  --choice 1

# Get survey information
npx hardhat --network <network> task:get-survey-info \
  --survey-id 0

# View encrypted response counts (researchers can decrypt)
npx hardhat --network <network> task:get-encrypted-counts \
  --survey-id 0

# Close a survey
npx hardhat --network <network> task:close-survey \
  --survey-id 0

# Publish insights (for non-researchers)
npx hardhat --network <network> task:publish-insights \
  --survey-id 0
```

Replace `<network>` with `localhost` or `sepolia`.

### Contract Functions

#### Researcher Functions
- `launchSurvey()`: Create new survey with automatic researcher permissions
- `grantAccess()`: Add addresses to restricted survey
- `revokeAccess()`: Remove addresses from access list
- `closeSurvey()`: Manually close survey
- `publishInsights()`: Make insights decryptable for everyone

#### Participant Functions
- `submitResponse()`: Submit encrypted response
- `getSurveyInfo()`: Get survey details
- `hasResponded()`: Check if address has responded
- `canParticipateInSurvey()`: Check survey eligibility

#### View Functions
- `getTotalSurveys()`: Get total number of surveys
- `getEncryptedResponseCount()`: Get encrypted response counts
- `getSurveyResults()`: Get decrypted results (after decryption)

## 🧪 Testing

### Smart Contract Tests
```bash
cd fhevm-hardhat-template
npm test
```

### Test Coverage
- ✅ Contract deployment and initialization
- ✅ Researcher management (add/remove researchers)
- ✅ Survey creation with validation
- ✅ Access management for restricted surveys
- ✅ Encrypted response submission
- ✅ Response counting and result decryption
- ✅ Researcher default permissions
- ✅ Access control and permissions
- ✅ Time-based survey restrictions

## 🔐 Security Features

### Encryption
- **Response Privacy**: All responses encrypted with FHEVM
- **Anonymous Participation**: Participant identities not linked to response choices
- **Secure Counting**: Response tallying in encrypted space
- **Controlled Decryption**: Results only revealed when authorized

### Access Control
- **Role-based Permissions**: Platform owner, researcher, and participant roles
- **Researcher Privileges**: Survey creators have default decryption access
- **Access List Support**: Restricted surveys with address whitelisting
- **Time Restrictions**: Participation only allowed within specified timeframes
- **Double-response Prevention**: Each address can only respond once per survey

### Smart Contract Security
- **Input Validation**: All inputs validated before processing
- **Reentrancy Protection**: Safe external calls
- **Integer Overflow Protection**: Safe math operations
- **Access Modifiers**: Proper function access restrictions

## 🌐 Network Support

### Supported Networks
- **Localhost (31337)**: Development with Hardhat node
- **Sepolia Testnet (11155111)**: Ethereum testnet deployment
- **Custom Networks**: Configurable for other FHEVM-compatible chains

### Environment Configuration

**For Sepolia Testnet** (`.env.local`):
```bash
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_NETWORK_NAME=sepolia
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
NEXT_PUBLIC_RELAYER_URL=https://relayer.sepolia.zama.ai
```

**For Local Development**:
```bash
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RELAYER_URL=http://localhost:8545
```

## 🛠️ Development

### Project Structure
```
zama_voting_003/
├── fhevm-hardhat-template/          # Smart contracts
│   ├── contracts/                   # Solidity contracts
│   │   └── OpinionResearchPlatform.sol  # Main research contract
│   ├── deploy/                      # Deployment scripts
│   ├── test/                        # Contract tests
│   └── tasks/                       # Hardhat tasks
├── opinion-hub-frontend/            # Frontend application
│   ├── app/                         # Next.js app directory
│   ├── components/                  # React components
│   │   ├── ResearchCard.tsx         # Survey display component
│   │   └── ui/                      # UI components
│   ├── hooks/                       # Custom React hooks
│   ├── fhevm/                       # FHEVM integration
│   └── lib/                         # Utility functions
└── zama-voting-frontend/            # Reference implementation (read-only)
```

### Key Technologies
- **Solidity 0.8.24**: Smart contract language
- **FHEVM**: Fully homomorphic encryption
- **Next.js 15**: React framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS with custom design system
- **Framer Motion**: Animation library
- **Ethers.js**: Ethereum library
- **Hardhat**: Development environment

### Design System
- **Neumorphic Design**: Soft, extruded surfaces with subtle shadows
- **Custom Color Palette**: Research, Insight, and Analysis color schemes
- **Gradient Text**: Beautiful gradient text effects
- **Glass Effects**: Backdrop blur and transparency
- **Smooth Animations**: Framer Motion powered interactions

## 🎨 User Interface

### Research Card Component
```
┌─────────────────────────────────────┐
│ 🧠 Climate Change Awareness    [🟢] │
│ How concerned are you about...      │
├─────────────────────────────────────┤
│ Response Options:                   │
│ ┌─────────────────────────────────┐ │
│ │ 1. Very concerned           🔵  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 2. Somewhat concerned       🟡  │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 3. Not concerned            🟣  │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 👥 156 responses  👤 0x1234...      │
│ ⏰ Time left: 2 hours 15 minutes    │
│                                     │
│ [🔍 Participate] [📊 View Insights] │
└─────────────────────────────────────┘
```

### Insights Viewing Modal
```
┌─────────────────────────────────────┐
│ 📊 Survey Insights             ✕   │
│ Climate Change Awareness            │
├─────────────────────────────────────┤
│ Total Responses: 156  Status: Closed│
│                                     │
│ 🏆 Most Popular Response            │
│ Very concerned with 89 responses    │
│                                     │
│ Detailed Analysis:                  │
│ ┌─────────────────────────────────┐ │
│ │ Very concerned 🏆  89 (57%)     │ │
│ │ ████████████████████░░░░░░░░░░░ │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Somewhat concerned  45 (29%)    │ │
│ │ ███████████░░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────────┘ │
│                                     │
│                    [Back]           │
└─────────────────────────────────────┘
```

## 🔄 Network Switching

### Switch to Local Development
```bash
# 1. Start Hardhat node
cd fhevm-hardhat-template
npx hardhat node --verbose

# 2. Deploy contracts
npx hardhat --network localhost deploy --tags OpinionResearchPlatform

# 3. Update environment
# Edit .env.local:
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RELAYER_URL=http://localhost:8545

# 4. Start frontend
cd opinion-hub-frontend
npm run dev:mock
```

### Switch to Sepolia Testnet
```bash
# 1. Stop local node
pkill -f "hardhat node"

# 2. Deploy to Sepolia
cd fhevm-hardhat-template
npx hardhat --network sepolia deploy --tags OpinionResearchPlatform

# 3. Update environment
# Edit .env.local:
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RELAYER_URL=https://relayer.sepolia.zama.ai

# 4. Start frontend
cd opinion-hub-frontend
npm run dev
```

## 👑 Researcher Privileges

### Default Decryption Access
- **Automatic Authorization**: Researchers receive decryption permissions when launching surveys
- **Real-time Monitoring**: View survey progress without waiting for completion
- **No Additional Steps**: No need to call `publishInsights` for own surveys
- **Persistent Access**: Permissions maintained throughout survey lifecycle

### Permission Model
1. **Platform Owner**: Full system access, can manage all researchers and surveys
2. **Researcher**: Can launch surveys, manage own surveys, default decryption access
3. **Participants**: Access to response counts they have permissions for
4. **Public**: Access only after researcher publishes insights

## 🧪 Testing & Verification

### Automated Tests
```bash
cd fhevm-hardhat-template
npm test
```

**Test Results**: 25+ tests passing, including:
- Contract deployment and initialization
- Researcher and platform owner permission management
- Encrypted response submission and counting
- Access control validation
- Researcher default decryption access

### Manual Testing
```bash
# Launch test survey
npx hardhat --network localhost task:launch-survey \
  --topic "Test Survey" \
  --description "Testing the system" \
  --choices "Yes,No,Maybe" \
  --duration 3600 \
  --openaccess true

# Submit response
npx hardhat --network localhost task:submit-response --survey-id 0 --choice 1

# Check results (researcher can decrypt immediately)
npx hardhat --network localhost task:get-encrypted-counts --survey-id 0
```

## 🔐 Privacy & Security

### Encryption Features
- **Response Confidentiality**: Individual responses are completely encrypted
- **Anonymous Participation**: Participant identities separated from response choices
- **Secure Aggregation**: Response counting in encrypted space
- **Selective Disclosure**: Results revealed only when authorized

### Access Control
- **Multi-level Permissions**: Platform Owner > Researcher > Participant > Public
- **Time-based Restrictions**: Participation only within specified periods
- **Access List Support**: Restricted surveys with controlled access
- **Researcher Privileges**: Default decryption access for survey creators

### Smart Contract Security
- **Input Validation**: Comprehensive validation of all inputs
- **Overflow Protection**: Safe arithmetic operations
- **Reentrancy Guards**: Protection against reentrancy attacks
- **Access Modifiers**: Strict function access control

## 🎯 Key Features Implemented

### ✅ Completed Features
1. **Encrypted Survey System**: Full FHEVM implementation
2. **Multi-choice Support**: 2-4 choices per survey
3. **Researcher Privileges**: Default decryption access
4. **Access Control**: Open access/restricted survey modes
5. **Time Management**: Launch/close time controls
6. **Access List Support**: Restricted survey with address control
7. **Insight Visualization**: Beautiful analytics and statistics
8. **Bilingual Interface**: English/Chinese support
9. **Mobile Responsive**: Works on all devices
10. **Network Flexibility**: Localhost and Sepolia support

### 🎨 UI Components
- **ResearchCard**: Display survey information and actions with neumorphic design
- **ParticipationModal**: Interactive response selection interface
- **InsightsModal**: Comprehensive results viewing with charts
- **LaunchSurveyForm**: Intuitive survey creation interface
- **NeumorphicCard**: Custom card component with soft shadows
- **GlowButton**: Animated buttons with glow effects
- **StatusBadge**: Colorful status indicators

### 🔧 Technical Implementation
- **FHEVM Integration**: Complete encrypted computation support
- **TypeScript**: Full type safety and IntelliSense
- **Error Handling**: Comprehensive error management
- **State Management**: Optimized React state handling
- **Performance**: Smooth animations and transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 📊 Project Statistics

- **Smart Contracts**: 1 main contract, 600+ lines of Solidity
- **Frontend Code**: 30+ components, 4000+ lines of TypeScript
- **Test Coverage**: 25+ test cases covering all major functionality
- **Documentation**: Complete README + inline code comments
- **Internationalization**: 80+ translation strings for bilingual support
- **Design System**: Custom Tailwind configuration with 3 color schemes

## 🚀 Getting Started

### Quick Demo
1. **Visit**: http://localhost:3000
2. **Connect Wallet**: Click "Connect Wallet" button
3. **Switch Network**: Ensure MetaMask is on the correct network
4. **Start Researching**: Launch surveys, participate, and view insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Zama**: For FHEVM technology and development tools
- **Ethereum Foundation**: For the underlying blockchain infrastructure
- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations and interactions

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the test files for usage examples
- Review the Hardhat tasks for CLI interaction patterns

## 🔮 Future Enhancements

### Short-term
- [ ] Advanced insight visualization with interactive charts
- [ ] Batch response functionality
- [ ] Survey history and analytics dashboard
- [ ] PWA support for mobile devices
- [ ] Real-time notifications

### Long-term
- [ ] Multi-chain deployment support
- [ ] DAO governance integration
- [ ] NFT-based participation rights
- [ ] Advanced statistical analysis
- [ ] AI-powered insight generation

---

**Built with ❤️ using FHEVM technology for a more private and insightful research future.**

## 🎯 Quick Reference

### Essential Commands
```bash
# Local Development
npm run dev:mock          # Start with local Hardhat node

# Sepolia Testnet
npm run dev              # Start with Sepolia network

# Contract Deployment
npx hardhat --network <network> deploy --tags OpinionResearchPlatform

# Launch Survey
npx hardhat --network <network> task:launch-survey --topic "Title" --choices "A,B,C"

# Submit Response
npx hardhat --network <network> task:submit-response --survey-id 0 --choice 1

# View Insights
npx hardhat --network <network> task:get-encrypted-counts --survey-id 0
```

### Network Information
- **Localhost**: Chain ID 31337, RPC http://localhost:8545
- **Sepolia**: Chain ID 11155111, RPC https://sepolia.infura.io/v3/YOUR_KEY

**Ready to revolutionize opinion research! Start your confidential survey experience today! 🚀**