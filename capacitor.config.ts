import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'np.afterwork.kitchenbot',
  appName: 'kitchen-bot',
  webDir: 'www',
  server: {
    androidScheme: 'https',
  },
};

export default config;
