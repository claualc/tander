import React, { useCallback, useEffect, useRef, useState } from "react";
import { Photo, User } from "@domain/User";
import { MainWrapper } from "@components/index";
import * as userService from "@serv/userService";
import Card from "./components/Card";
import { Animated, Dimensions, PanResponder } from "react-native";

interface Props {
  user?: User
}

const HomeScreen: React.FC<Props> = ({ children, style, ...rest }: any) => {
  const id =  "Lye42fLFNWSZ4HGHCifr";

  useEffect(() => {
    (async () => {
      const user: User = await userService.getById(id)
      setUser(user)
      console.log(user)
    })();
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [seeDescription, setSeeDescription] = useState<boolean>(false);

  return (
    <MainWrapper>
         { user && 
            <Card 
                  photosDisplayArray={
                      user?.photos?.length ? 
                        user?.photos?.map(p => p.value) 
                        : []
                  }
                  username={user?.username || ""}
                  yearsOld={user?.yearsOld || 0}
                  nationality={"Brasiliano" || ""}
                  userTeam={"Spritz"}
                  langKnown={user?.langKnown || []}
                  whenScroll={() => {setSeeDescription(true)}}
                  isScrolledUp={seeDescription}
                /> 
          }

    </MainWrapper>
  );
}

export default HomeScreen;
