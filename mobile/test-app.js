// Simple test script to verify the mobile app is working
const { exec } = require('child_process');
const http = require('http');

console.log('🧪 Testing ML Onramp Mobile App...\n');

// Test 1: Check if Expo server is running
function testExpoServer() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8081', (res) => {
      console.log('✅ Expo development server is running on port 8081');
      resolve(true);
    });
    
    req.on('error', (err) => {
      console.log('❌ Expo development server is not running');
      console.log('   Run: npx expo start');
      resolve(false);
    });
  });
}

// Test 2: Check if web version is accessible
function testWebVersion() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:8081', (res) => {
      if (res.statusCode === 200) {
        console.log('✅ Web version is accessible');
        console.log('   Open: http://localhost:8081 in your browser');
        resolve(true);
      } else {
        console.log('❌ Web version returned status:', res.statusCode);
        resolve(false);
      }
    });
    
    req.on('error', (err) => {
      console.log('❌ Web version is not accessible');
      resolve(false);
    });
  });
}

// Test 3: Check dependencies
function testDependencies() {
  return new Promise((resolve) => {
    exec('npm list --depth=0', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Error checking dependencies:', error.message);
        resolve(false);
        return;
      }
      
      const hasReactNative = stdout.includes('react-native');
      const hasExpo = stdout.includes('expo');
      const hasSupabase = stdout.includes('@supabase/supabase-js');
      
      if (hasReactNative && hasExpo && hasSupabase) {
        console.log('✅ All required dependencies are installed');
        resolve(true);
      } else {
        console.log('❌ Missing dependencies:');
        if (!hasReactNative) console.log('   - react-native');
        if (!hasExpo) console.log('   - expo');
        if (!hasSupabase) console.log('   - @supabase/supabase-js');
        resolve(false);
      }
    });
  });
}

// Run all tests
async function runTests() {
  console.log('1. Checking Expo development server...');
  const serverRunning = await testExpoServer();
  
  console.log('\n2. Checking web version accessibility...');
  const webAccessible = await testWebVersion();
  
  console.log('\n3. Checking dependencies...');
  const depsInstalled = await testDependencies();
  
  console.log('\n📊 Test Results:');
  console.log(`   Server Running: ${serverRunning ? '✅' : '❌'}`);
  console.log(`   Web Accessible: ${webAccessible ? '✅' : '❌'}`);
  console.log(`   Dependencies: ${depsInstalled ? '✅' : '❌'}`);
  
  if (serverRunning && webAccessible && depsInstalled) {
    console.log('\n🎉 All tests passed! Your mobile app is ready to use.');
    console.log('\n📱 Next steps:');
    console.log('   1. Open http://localhost:8081 in your browser');
    console.log('   2. Configure Supabase credentials in src/config/supabase.ts');
    console.log('   3. Test on physical device with Expo Go app');
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues above.');
  }
}

runTests();

