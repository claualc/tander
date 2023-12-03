module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: [
      [
         'module-resolver',
         {
           root: ['./src'],
           extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
           alias: {
            "@serv": "./src/services",
            "@firebaseServ": "./src/services/firebase",
            "@": "src/",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@api": "./src/api",
            "@domain": "./src/api/domain",
            "@assets": "./assets",
           }
         }
      ]
    ]
  };
};
