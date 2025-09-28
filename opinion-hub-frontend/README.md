# OpinionHub Frontend - Advanced Public Opinion Research Platform

A cutting-edge frontend application for the OpinionHub platform, built with Next.js 15, TypeScript, and modern UI technologies. Features a beautiful neumorphic design system with smooth animations and comprehensive FHEVM integration.

## 🌟 Features

### Modern User Interface
- **Neumorphic Design**: Soft, extruded surfaces with subtle shadows and depth
- **Gradient Text Effects**: Beautiful gradient text throughout the application
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Glass Effects**: Backdrop blur and transparency for modern aesthetics
- **Responsive Design**: Optimized for all device sizes and screen types

### Advanced Functionality
- **Real-time Survey Management**: Live survey status and analytics updates
- **Encrypted Response Submission**: Full FHEVM integration for privacy
- **Interactive Data Visualization**: Charts and graphs for survey insights
- **User Feedback System**: Built-in feedback collection with ratings
- **Bilingual Support**: Chinese (中文) and English language options

### Technical Excellence
- **Next.js 15**: Latest React framework with App Router
- **TypeScript**: Full type safety throughout the application
- **Tailwind CSS**: Custom design system with utility-first approach
- **Framer Motion**: Professional animations and transitions
- **FHEVM Integration**: Complete encrypted computation support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MetaMask browser extension

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd opinion-hub-frontend

# Install dependencies
npm install

# Generate ABI files (requires deployed contracts)
npm run genabi

# Start development server
npm run dev:mock  # For local development with Hardhat
# or
npm run dev       # For Sepolia testnet
```

### Environment Configuration

Create a `.env.local` file:

**For Local Development:**
```bash
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RELAYER_URL=http://localhost:8545
```

**For Sepolia Testnet:**
```bash
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RELAYER_URL=https://relayer.sepolia.zama.ai
NEXT_PUBLIC_INFURA_API_KEY=your_infura_api_key
```

## 🏗️ Architecture

### Component Structure
```
components/
├── ui/                          # Base UI components
│   ├── NeumorphicCard.tsx      # Card component with neumorphic design
│   ├── GlowButton.tsx          # Animated buttons with glow effects
│   ├── StatusBadge.tsx         # Colorful status indicators
│   └── GlassInput.tsx          # Glass-effect input fields
├── ResearchCard.tsx            # Survey display component
├── InsightsChart.tsx           # Data visualization component
└── FeedbackSystem.tsx          # User feedback collection
```

### Hooks
```
hooks/
├── useOpinionResearch.tsx      # Main survey management hook
├── useMetaMask.tsx            # Wallet connection management
└── useInMemoryStorage.tsx     # Local storage utilities
```

### Styling System
```
app/globals.css                 # Global styles and animations
tailwind.config.ts             # Custom design system configuration
```

## 🎨 Design System

### Color Palette
- **Research**: Blue tones for primary actions and research-related elements
- **Insight**: Yellow/amber tones for insights and analytics
- **Analysis**: Purple tones for advanced features and analysis
- **Status Colors**: Green (success), Red (error), Amber (warning), Blue (info)

### Typography
- **Primary Font**: Inter (system font)
- **Display Font**: Poppins (headings and emphasis)
- **Gradient Text**: Multi-color gradients for titles and emphasis

### Components
- **Neumorphic Cards**: Soft shadows with raised/pressed states
- **Glow Buttons**: Animated buttons with hover effects and glow
- **Glass Inputs**: Backdrop blur with subtle transparency
- **Status Badges**: Rounded badges with gradient backgrounds

## 🔧 Development

### Available Scripts
```bash
npm run dev:mock      # Development with local Hardhat node
npm run dev          # Development with Sepolia testnet
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run genabi       # Generate ABI files from contracts
npm run ishhrunning  # Check if Hardhat node is running
```

### Project Structure
```
opinion-hub-frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx          # Home page
│   └── providers.tsx     # Context providers
├── components/            # React components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── abi/                  # Generated ABI files
├── scripts/              # Build and utility scripts
└── public/              # Static assets
```

### Key Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animation library
- **Recharts**: Data visualization library
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

## 🎯 Features

### Survey Management
- **Browse Surveys**: View all available surveys with status indicators
- **Participate**: Submit encrypted responses to active surveys
- **View Insights**: Decrypt and visualize survey results
- **Real-time Updates**: Live status updates and response counts

### User Experience
- **Wallet Integration**: Seamless MetaMask connection and management
- **Language Support**: Switch between English and Chinese
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Advanced Features
- **Data Visualization**: Interactive charts and graphs for survey insights
- **Feedback System**: Built-in user feedback collection with ratings
- **Animation System**: Smooth transitions and engaging micro-interactions
- **Error Handling**: Comprehensive error management and user feedback

## 🔐 Security & Privacy

### FHEVM Integration
- **Encrypted Responses**: All survey responses are encrypted using FHEVM
- **Privacy Preservation**: Participant identities are not linked to responses
- **Secure Aggregation**: Vote counting happens in encrypted space
- **Controlled Decryption**: Results only revealed when authorized

### Wallet Security
- **MetaMask Integration**: Secure wallet connection and transaction signing
- **Network Validation**: Automatic network detection and switching prompts
- **Transaction Safety**: Clear transaction previews and confirmations

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Adaptive Features
- **Navigation**: Collapsible navigation on mobile devices
- **Cards**: Responsive grid layouts that adapt to screen size
- **Modals**: Full-screen modals on mobile, centered on desktop
- **Typography**: Scalable text sizes for optimal readability

## 🌐 Internationalization

### Supported Languages
- **English**: Default language
- **Chinese (中文)**: Complete translation coverage

### Translation System
- **Context-based**: Organized by feature and component
- **Dynamic Switching**: Real-time language switching without reload
- **Fallback Support**: Graceful fallback to English for missing translations

## 🧪 Testing

### Development Testing
```bash
# Start local development environment
npm run dev:mock

# Test wallet connection
# Test survey participation
# Test insights visualization
# Test feedback system
```

### Browser Compatibility
- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🚀 Deployment

### Build for Production
```bash
# Install dependencies
npm install

# Generate ABI files
npm run genabi

# Build application
npm run build

# Start production server
npm start
```

### Environment Variables
Ensure all required environment variables are set for production deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use the established design system
- Write accessible components
- Include proper error handling
- Test on multiple devices and browsers

## 📄 License

This project is licensed under the BSD-3-Clause-Clear License.

## 🙏 Acknowledgments

- **Next.js Team**: For the excellent React framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations and interactions
- **Zama**: For FHEVM technology and development tools

---

**Built with ❤️ for the future of private opinion research.**

