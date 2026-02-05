import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.benisuef.hospital.surgery',
  appName: 'نظام الجراحة العامة',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    // For development, you can set the URL to your dev server
    // url: 'http://localhost:5000',
    // cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: '',
      keystoreAlias: '',
      releaseType: 'APK'
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false
    }
  }
};

export default config;
