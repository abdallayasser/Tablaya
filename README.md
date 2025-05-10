# Tablaya

Tablaya is a cross-platform mobile application that connects restaurant owners with customers through intuitive menu management and browsing functionalities, emphasizing dietary awareness and real-time updates.

## Features

### For Restaurant Owners
- Upload menus as image or PDF files via drag-and-drop or file picker
- OCR processes the uploaded menu to extract text content
- Edit the extracted menu manually via an intuitive in-app editor
- AI scans the menu text for common allergens, highlights them, and suggests warnings
- Manage offers and promotions visible to customers
- View basic analytics (menu views, allergen warnings shown, offer engagement)
- Sync menu updates with external services in real-time

### For Customers
- Create a user profile with saved dietary preferences and allergen restrictions
- Browse nearby or favorited restaurant menus using filters
- View menus in a clean card-based format with allergen icons and highlights
- Receive AI-personalized recommendations based on profile settings
- Save favorite restaurants and receive push notifications for updates or new offers

## Core App Features
- OCR-Based Menu Reading
- AI Allergen Detection
- Manual Text Editing
- Menu Filtering & Custom Views
- Real-Time Syncing
- Push Notifications

## Technology Stack
- **Framework**: React Native (via Expo)
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **OCR Integration**: Cloud-based OCR services
- **AI Integration**: Serverless functions for allergen detection
- **Backend**: Firebase (Authentication, Firestore, Storage, Cloud Functions)
- **Deployment**: Expo for iOS and Android

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation
1. Clone the repository
```bash
git clone https://github.com/yourusername/tablaya.git
cd tablaya
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npx expo start
```

4. Open the app on your device using the Expo Go app or run it on an emulator

## Project Structure
```
tablaya/
├── src/
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable UI components
│   ├── config/           # Configuration files
│   ├── navigation/       # Navigation setup
│   ├── screens/          # Screen components
│   ├── services/         # API and service functions
│   ├── store/            # Redux store setup
│   └── types/            # TypeScript type definitions
├── App.tsx              # Main app component
└── package.json         # Dependencies and scripts
```

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.
