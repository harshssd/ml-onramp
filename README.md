# ML Onramp - Quest-Based Machine Learning Platform

A gamified machine learning education platform with both web and mobile applications, featuring interactive quests, achievements, and hands-on learning experiences.

## 🚀 Features

- **🎮 Gamified Learning**: Quest-based interface with XP, levels, and achievements
- **📱 Cross-Platform**: Web app (Next.js) and Mobile app (React Native)
- **🎨 6 Beautiful Themes**: Dark Quest, Light Mode, Neon Cyber, Ocean Depths, Forest Quest, Sunset Magic
- **🔐 Authentication**: Supabase-powered user management
- **📊 Progress Tracking**: Visual progress indicators and statistics
- **🎯 Interactive Content**: Hands-on playgrounds and challenges

## 📁 Project Structure

```
ml-onramp/
├── src/                    # Web app (Next.js)
│   ├── app/               # App Router pages
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Theme, etc.)
│   └── lib/               # Utilities and configurations
├── mobile/                # Mobile app (React Native)
│   ├── src/               # Mobile app source code
│   ├── screens/           # Mobile screens
│   └── navigation/        # Navigation configuration
└── supabase/              # Database schema and migrations
```

## 🌐 Web Application

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Create a `.env.local` file with your Supabase credentials
   - Run the database schema from `supabase/schema.sql`

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open [http://localhost:3000](http://localhost:3000)** to see the web app

### Deployment
- **Live Demo**: [https://ml-onramp.vercel.app](https://ml-onramp.vercel.app)
- **Platform**: Vercel
- **Status**: ✅ Deployed and running

## 📱 Mobile Application

### Getting Started

1. **Navigate to mobile directory:**
   ```bash
   cd mobile
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Supabase:**
   - Update `src/config/supabase.ts` with your credentials
   - **Important**: Never commit real credentials to git!

4. **Point the mobile app to your web API (for progression sync):**
   - In development, set an environment variable so the mobile app can call the web API:
     - Bash: `export EXPO_PUBLIC_API_BASE_URL=http://YOUR_DEV_MACHINE_IP:3000`
     - Windows (Powershell): `$env:EXPO_PUBLIC_API_BASE_URL="http://YOUR_DEV_MACHINE_IP:3000"`
   - Replace `YOUR_DEV_MACHINE_IP` with your machine IP on the same network (not `localhost`).
   - The mobile app will include the Supabase session as a Bearer token when calling `GET /api/progression`.

4. **Start development server:**
   ```bash
   npx expo start
   ```

5. **Test on device:**
   - Install Expo Go app on your phone
   - Scan QR code or use manual connection
   - Test on iOS Simulator or Android Emulator

### Testing Platforms
- ✅ **Web Browser**: `npm run web`
- ✅ **Physical Device**: Expo Go app
- ✅ **iOS Simulator**: `npm run ios` (requires Xcode)
- ✅ **Android Emulator**: `npm run android` (requires Android Studio)

## 🛠️ Technology Stack

### Web App
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Deployment**: Vercel

### Mobile App
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **Styling**: StyleSheet with theme system
- **State Management**: React Context
- **Backend**: Supabase (shared with web app)

## 🎨 Theme System

Both web and mobile apps feature 6 beautiful themes:
- **Dark Quest** 🌙 - Classic dark theme with purple accents
- **Light Mode** ☀️ - Clean and bright interface
- **Neon Cyber** ⚡ - Cyberpunk vibes with neon colors
- **Ocean Depths** 🌊 - Deep blue ocean theme
- **Forest Quest** 🌲 - Nature-inspired green theme
- **Sunset Magic** 🌅 - Warm orange and red tones

## 🔧 Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- For mobile: Expo CLI, iOS Simulator (optional), Android Studio (optional)

### Scripts
```bash
# Web app
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Mobile app
cd mobile
npm run web          # Run in web browser
npm run ios          # Run on iOS Simulator
npm run android      # Run on Android Emulator
npx expo start       # Start Expo development server
```

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support, please open an issue on GitHub.
