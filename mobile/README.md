# ML Onramp Mobile App

A React Native mobile app for machine learning education with gamified quest-based learning.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS testing) or Android Studio (for Android testing)

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Open `src/config/supabase.ts`
   - Replace the placeholder values with your actual Supabase credentials:
     ```typescript
     export const SUPABASE_CONFIG = {
       url: 'https://your-project.supabase.co',
       anonKey: 'your-anon-key-here',
     };
     ```
   - **Important**: Never commit real credentials to git!

3. **Start the development server:**
   ```bash
   npx expo start
   ```

### Testing Platforms

#### Web Browser
```bash
npm run web
# or
npx expo start --web
```

#### iOS Simulator
```bash
npm run ios
# or
npx expo start --ios
```

#### Android Emulator
```bash
npm run android
# or
npx expo start --android
```

#### Physical Device
1. Install Expo Go app on your phone
2. Scan the QR code from the terminal
3. The app will load on your device

## 📱 Features

- **6 Beautiful Themes**: Dark Quest, Light Mode, Neon Cyber, Ocean Depths, Forest Quest, Sunset Magic
- **Gamified Learning**: Quest-based interface with XP, levels, and achievements
- **Supabase Integration**: Real-time authentication and data sync
- **Cross-Platform**: Works on iOS, Android, and Web
- **Offline Support**: Theme preferences saved locally

## 🎨 Theme System

The app includes 6 carefully crafted themes:
- **Dark Quest** 🌙 - Classic dark theme with purple accents
- **Light Mode** ☀️ - Clean and bright interface
- **Neon Cyber** ⚡ - Cyberpunk vibes with neon colors
- **Ocean Depths** 🌊 - Deep blue ocean theme
- **Forest Quest** 🌲 - Nature-inspired green theme
- **Sunset Magic** 🌅 - Warm orange and red tones

## 🔧 Development

### Project Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Theme, etc.)
├── navigation/         # Navigation configuration
├── screens/           # App screens
├── lib/              # Utilities and configurations
└── config/           # App configuration
```

### Key Dependencies
- **React Native** - Mobile framework
- **Expo** - Development platform
- **React Navigation** - Navigation library
- **Supabase** - Backend as a Service
- **Expo Linear Gradient** - Gradient backgrounds
- **AsyncStorage** - Local data persistence

## 🚀 Deployment

### Expo Application Services (EAS)
1. Install EAS CLI: `npm install -g eas-cli`
2. Login: `eas login`
3. Configure: `eas build:configure`
4. Build: `eas build --platform all`

### App Store / Google Play
- Follow EAS Build documentation for store deployment
- Configure app.json with proper bundle identifiers
- Submit through EAS Submit or manually

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues:**
   ```bash
   npx expo start --clear
   ```

2. **iOS Simulator not opening:**
   - Make sure Xcode is installed
   - Run `sudo xcode-select --install`

3. **Android emulator issues:**
   - Make sure Android Studio is installed
   - Create an AVD (Android Virtual Device)

4. **Dependency conflicts:**
   ```bash
   npm install --legacy-peer-deps
   ```

## 📄 License

MIT License - see LICENSE file for details.
