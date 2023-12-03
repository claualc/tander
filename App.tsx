import Main from "@screens/index";
import 'react-native-gesture-handler';
import { useFonts } from 'expo-font';

const App = () => {
  const [fontsLoaded] = useFonts({
    // demibold: btwn regular and bold
    'Format-Sans-DM': require('./assets/fonts/OCFormatSans-Dm.otf'),
    // medium:   btwn demibold and regular
    'Format-Sans-MD': require('./assets/fonts/OCFormatSans-Md.otf'),
    // regular
    'Format-Sans-RG': require('./assets/fonts/OCFormatSans-Rg.otf'),
  });

  return <Main/>;
}

export default App;
