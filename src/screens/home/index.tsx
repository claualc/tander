import React, { useCallback, useEffect, useState } from "react";
import { Photo, User } from "@domain/User";
import { MainWrapper } from "@components/index";
import * as userService from "@serv/userService";
import Card from "./components/Card";
import { ScrollView, Text } from "react-native";

interface Props {
  currentUser?: User
}

const HomeScreen: React.FC<Props> = ({ children, style, ...rest }: any) => {
  const id =  "Lye42fLFNWSZ4HGHCifr";

  useEffect(() => {
    (async () => {
      const users: User[] = await userService.listAll()
      const user: User = users[0]
      setCurrentUser(users.length? users.length-1 : 0)
      setUsers(users)
      setShowUsers(users.map(p => true))
      console.log(user)
    })();
  }, []);

  const [currentUser, setCurrentUser] = useState<Number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [seeDescription, setSeeDescription] = useState<boolean>(false);

  const [showUsers, setShowUsers ] = useState<boolean[]>([]);

  const showOnlyTopStackUser = useCallback(() => {
    let updated = showUsers.map(u => false);
    updated[-1] = true;
    setShowUsers(updated);
  }, []);

  return (
    <MainWrapper>
         <ScrollView  
              style={{padding: 0, width: "100%", height: "100%", flex: 1}}
              contentContainerStyle={{flexGrow:1, justifyContent: "flex-end", alignItems: "center"}}
              scrollEnabled={seeDescription}>
                {
                  users.map((user, i) => <Card 
                    key={i}
                    photosDisplayArray={
                        user?.photos?.length ? 
                          user?.photos?.map(p => p.value) 
                          : []
                    }
                    zIndex={i}
                    username={user?.username || ""}
                    yearsOld={user?.yearsOld || 0}
                    nationality={"Brasiliano" || ""}
                    userTeam={"Spritz"}
                    langKnown={user?.langKnown || []}
                    whenScrollUp={() => {setSeeDescription(true)}}
                    whenScrollDown={() => {setSeeDescription(false)}}
                    isScrolledUp={seeDescription}
                    render={showUsers[i]}
                  /> )
                }
                
              
              { seeDescription && <>
               
              </>
              }
             
          </ScrollView>
    </MainWrapper>
  );
}

export default HomeScreen;
