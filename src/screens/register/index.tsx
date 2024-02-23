import React from 'react';
import { View } from 'react-native';
import { ProgressBar } from './style';


const RegisterScreen = () => {
  return <View style={{
      flex: 1,
      paddingTop: "12%"
      }}>

    <ProgressBar percentage={100}></ProgressBar>
    
  </View>
}

export default RegisterScreen;
