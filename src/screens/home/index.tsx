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
      setRenderUserCards(users.map(p => true))
      setSwipedUserCards(users.map(p => false))
    })();
  }, []);

  const [currentUser, setCurrentUser] = useState<Number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [seeDescription, setSeeDescription] = useState<boolean>(false);

  const [renderUserCards, setRenderUserCards ] = useState<boolean[]>([]);
  const [swipedUserCards, setSwipedUserCards ] = useState<boolean[]>([]);

  useEffect(() => console.log(swipedUserCards), [swipedUserCards])

  const renderOnlyTopStackUser = useCallback(() => {
    let updated = renderUserCards.map(u => false);
    updated[updated.length-1] = true
    setRenderUserCards(updated);
  }, [renderUserCards]);

  const renderAllNonSwipedUsers = useCallback(() => {
    let updated = renderUserCards.map(u => true);
    setRenderUserCards(updated);
  }, [renderUserCards]);

  const userSwiped = useCallback((id: number) => {
    setSwipedUserCards(newSwp => newSwp.map(
      (sw, i) => i == id ? true : sw));
  }, [swipedUserCards]);

  // const toLikeUser = useCallback((id: number) => {
  //   console.log("USER LIKED")
  //   userSwiped(id);
  // }, []);

  // const toDislikeUser = useCallback((id: number) => {
  //   console.log("USER DISLIKED")
  //   userSwiped(id)
  // }, []);


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
                    onScrollUp={() => {setSeeDescription(true)}}
                    onScrollDown={() => {setSeeDescription(false)}}
                    onSwipeLeft={() => {
                      console.log("USER LIKED")
                      userSwiped(i);
                    }}
                    onSwipeRigth={() => {
                      console.log("USER DiSLIKED")
                      userSwiped(i);
                    }}
                    isScrolledUp={seeDescription}
                    render={renderUserCards[i]}
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
