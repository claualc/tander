import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { User } from "@domain/User";
import { MainWrapper } from "@components/index";
import userService from "@serv/userService";


interface Props {
  user?: User
}

const HomeScreen: React.FC<Props> = ({ children, style, ...rest }: any) => {
  const id =  "Lye42fLFNWSZ4HGHCifr";
  useEffect(() => {
    (async () => {
      const user = await userService.getById(id)
      console.log("user",user)
    })();

  })

  const [user, setUser] = useState<User>();

  return (
    <MainWrapper>
      <View
        style={{
          width: "80%",
          height: "80%",
          backgroundColor: "red",
          shadowOpacity: 1,
          shadowRadius: 1,
          elevation: 10,
          shadowColor: "black",
          shadowOffset: { height: 10, width: 0},
          borderRadius: 13
      }}
    
    ></View>
  </MainWrapper>);
}

export default HomeScreen;
