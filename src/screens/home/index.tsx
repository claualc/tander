import React, { useCallback, useEffect, useState } from "react";
import { Photo, User } from "@domain/User";
import { Chip, ColorWrapper, CustomText, MainWrapper, Wrapper } from "@components/index";
import * as userService from "@serv/userService";
import Card from "./components/Card";
import { ScrollView, Text, View } from "react-native";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Section, UserDecSections, UserDescWrapper } from "./components";
import { theme } from "../theme";
import AlbumComponent from "@components/musicAlbum";

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

  const [currentUser, setCurrentUser] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [seeDescription, setSeeDescription] = useState<boolean>(false);

  const [renderUserCards, setRenderUserCards ] = useState<boolean[]>([]);
  const [swipedUserCards, setSwipedUserCards ] = useState<boolean[]>([]);

  const renderOnlyThisCard = useCallback((id: number) => {
    setRenderUserCards(cards => cards.map(
      (c, i) => i == id));
  }, [renderUserCards, currentUser]);

  const renderAllNonSwipedUsers = useCallback(() => {
    setRenderUserCards(swipedUserCards.map(s => !s));
  }, [renderUserCards, swipedUserCards]);

  const userSwiped = useCallback((id: number) => {
    if (currentUser > 0)
      setCurrentUser(currentUser-1)
    setSwipedUserCards(newSwp => newSwp.map(
      (sw, i) => i == id ? true : sw));
    setRenderUserCards(cards => cards.map(
      (c, i) => i == id ? false : c));
  }, [swipedUserCards, renderUserCards,currentUser]);

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
      <View style={{flex: 1, width: "100%"}} >
         <ScrollView  
              style={{padding: 0, width: "100%", flex: 1}}
              contentContainerStyle={{flexGrow:1, justifyContent: "flex-end", alignItems: "center"}}
              scrollEnabled={true}>
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
                    nationality={user?.city?.country?.nationality || ""}
                    userTeam={"Spritz"}
                    langKnown={user?.langKnown || []}
                    onScrollUp={() => {
                      console.log("onScrollUp", i)
                      renderOnlyThisCard(i);
                      setSeeDescription(true)}}
                    onScrollDown={() => {
                      console.log("onScrollDown")
                      renderAllNonSwipedUsers()
                      setSeeDescription(false)}}
                    onSwipeLeft={() => {
                      console.log("onSwipeLeft")
                      console.log("USER LIKED")
                      userSwiped(i);
                    }}
                    onSwipeRigth={() => {
                      console.log("onSwipeRigth")
                      console.log("USER DiSLIKED")
                      userSwiped(i);
                    }}
                    isScrolledUp={seeDescription}
                    render={renderUserCards[i]}
                  /> )
                } 
                <UserDescWrapper>
                  { seeDescription && <>

                  <UserDecSections>
                    <CustomText size={30} fontFam="BD">{users[currentUser]?.username || ""}</CustomText>   
                    <CustomText  size={30}>{" " + users[currentUser]?.yearsOld}</CustomText>  
                  </UserDecSections> 
                  <UserDecSections>
                    <AntDesign name="book" size={24} color={theme.text_dark_priamry} />
                    <CustomText>{" " + users[currentUser]?.course?.name}</CustomText>  
                  </UserDecSections> 
                  <UserDecSections>
                    <SimpleLineIcons name="graduation" size={24} color={theme.text_dark_priamry} />
                    <CustomText>{" " +  users[currentUser]?.university?.name}</CustomText>  
                  </UserDecSections> 
                  <UserDecSections>
                    <Ionicons name="earth-outline" size={24} color={theme.text_dark_priamry} />
                    <CustomText>{" " +  users[currentUser]?.university?.name}</CustomText>  
                  </UserDecSections> 

                  <Section style={{justifyContent: "flex-start",width:"100%", flexDirection: "row"}}>
                    
                    <ColorWrapper inColor={theme.secondary}>
                      <View style={{flex:1, justifyContent: "center", alignItems: "center"}}>
                        <CustomText size={30}>🤓</CustomText>
                      </View>
                      <View style={{flex:3, flexDirection: "column",justifyContent: "center", alignItems: "center"}}>
                        <CustomText size={13} color={theme.secondary}>Here To learn</CustomText>
                        <View style={{flex:2, flexDirection: "row", justifyContent: "space-between"}}>
                        {
                            users[currentUser]?.langKnown?.map((lang, i) => {
                            return <CustomText key={i} size={25} >{" " + lang.flag + " "}</CustomText>})
                        }
                        </View>
                      </View>
                    </ColorWrapper>
        
                    <ColorWrapper inColor={theme.tertiary}>
                      <View style={{flex:1}}>
                        <CustomText size={30}>😎</CustomText>
                      </View>
                      <View style={{flex:3, justifyContent: "center", alignItems: "center"}}>
                        <CustomText size={13}  color={theme.tertiary}>Here To learn</CustomText>
                        <View style={{flex:2, flexDirection: "row", justifyContent: "space-between"}}>
                        {
                            users[currentUser]?.langToLearn?.map((lang, i) => {
                            return <CustomText key={i} size={25} >{" " + lang.flag + " "}</CustomText>})
                        }
                        </View>
                      </View>
                    </ColorWrapper>

                  </Section>

                  <Section>
                    <CustomText size={20} fontFam="DM" color={theme.secondary_dark}>Qualcosa di me</CustomText>
                    <CustomText size={17}  style={{marginTop: 10}}>
                      {users[currentUser].profileDescription}
                    </CustomText>
                  </Section>

                  <Section style={{width: "100%"}}>
                    <CustomText size={20} fontFam="DM" color={theme.secondary_dark}>On repeat</CustomText>
                    <AlbumComponent />
                   
                  </Section>
                </>
                }
                  
                </UserDescWrapper>
          </ScrollView>
          </View>
    </MainWrapper>
  );
}

export default HomeScreen;
