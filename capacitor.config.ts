import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.relaxationer.relaxt',
  appName: 'Relaxationer',
  webDir: 'www',
  bundledWebRuntime: false,
  loggingBehavior: 'none',
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      showSpinner: true,
      launchShowDuration: 3000,
      androidSplashResourceName: "splash",
      backgroundColor: "#ffffffff",
      // layoutName: "launch_screen",
      // useDialog: true
    },
    GoogleAuth: {
      scopes: ["profile","email"],
      serverClientId: "811413869838-lo812o9g5knkgeo9fpchhsnfq9ruhg2r.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;



// appId: 'com.relaxationer.relaxt', // for android
// appId: 'com.relaxationer.relaxt', // for iOS (Piyush Account)