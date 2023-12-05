import React, { useCallback, useEffect, useState } from "react";
import { Photo, User } from "@domain/User";
import { MainWrapper } from "@components/index";
import * as userService from "@serv/userService";
import Card from "./components/Card";


interface Props {
  user?: User
}

const HomeScreen: React.FC<Props> = ({ children, style, ...rest }: any) => {
  const id =  "Lye42fLFNWSZ4HGHCifr";

  useEffect(() => {
    (async () => {
      const user: User = await userService.getById(id)
      setUser(user)
    })();
  }, [])

  const [user, setUser] = useState<User | null>(null);

  return (
    <MainWrapper
      style={{justifyContent: "center"}}>
      { user &&  <>
        <Card 
            photosDisplayArray={
                user.photos?.length ? 
                  user.photos?.map(p => p.value) 
                  : []
            }
            username={user.username}
            yearsOld={user.yearsOld}
            nationality={"Brasiliano"}
            userTeam={"Spritz"}
            langKnown={user.langKnown || []}
            
            ></Card>
        </>
      }
    </MainWrapper>
  );
}

export default HomeScreen;
