import React from "react";
import { MainWrapper } from "@components/index";
import { Image, StyleSheet, Text, TextProps, TextStyle, View } from "react-native";
import { User } from "@domain/User";


interface Props {
  user?: User
}

const HomeScreen: React.FC<Props> = ({ children, style, user, ...rest }: any) => {
  return (
    <MainWrapper>
      <View
        style={{
          width: "80%",
          height: "80%",
          backgroundColor: "red",
          shadowOpacity: 0.20,
          shadowRadius: 3.453,
          elevation: 3,
          shadowColor: "black",
          shadowOffset: { height: 3.453, width: 0},
          borderRadius: 13
      }}
    
    ></View>
  </MainWrapper>);
}

export default HomeScreen;
