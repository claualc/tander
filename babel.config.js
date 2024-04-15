module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ['@babel/preset-env', {targets: {node: 'current'}}],
      '@babel/preset-typescript',
      ['module:metro-react-native-babel-preset']],
    plugins: [
      [
         'module-resolver',
         {
           root: ['./src'],
           extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
           alias: {
            "@serv": "./src/services",
            "@firebaseServ": "./src/services/infra/firebase",
            "@context": "./src/context",
            "@components": "./src/components",
            "@screens": "./src/screens",
            "@domain": "./src/domain",
            "@assets": "./assets",
            "@imgs": "./assets/imgs",
            "@dict": "./assets/dictionaries",
           }
         }
      ]
    ]
  };
};
