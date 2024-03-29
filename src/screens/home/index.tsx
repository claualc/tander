import React, { useCallback, useEffect, useState } from "react";
import { Photo, User } from "@domain/User";
import { Chip, ColorWrapper, CustomText, MainWrapper, Wrapper } from "@components/index";
import * as userService from "@serv/userService";
import Card from "@components/userCard";
import { ScrollView, Text, View } from "react-native";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Section, UserDecSections, UserDescWrapper } from "./style";
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
                    zIndex={i}
                    user={user}
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
                    renderController={renderUserCards[i]}
                  /> )
                } 
                <UserDescWrapper>
                  { seeDescription && <>

                  <UserDecSections>
                    <CustomText size={30} fontFam="BD">{users[currentUser]?.username || ""}</CustomText>   
                    <CustomText  size={30}>{" " + users[currentUser]?.yearsOld}</CustomText>  
                  </UserDecSections> 
                  <UserDecSections>
                    <AntDesign name="book" size={24} color={theme.tertiary_dark} />
                    <CustomText color={theme.tertiary_dark}>{" " + users[currentUser]?.course?.name}</CustomText>  
                  </UserDecSections> 
                  <UserDecSections>
                    <Ionicons name="earth-outline" size={24} color={theme.tertiary_dark} />
                    <CustomText color={theme.tertiary_dark}>{` ${users[currentUser]?.city?.name}, ${users[currentUser]?.city?.country?.name}`}</CustomText>  
                  </UserDecSections> 
                  <UserDecSections>
                    <SimpleLineIcons name="graduation" size={24} color={theme.tertiary_dark} />
                    <CustomText color={theme.tertiary_dark}>{" " +  users[currentUser]?.university?.name}</CustomText>  
                  </UserDecSections> 
                  <Section style={{justifyContent: "flex-start",width:"100%"}}>
                    
                    <ColorWrapper inColor={theme.secondary}>
                      <View style={{flex:1, alignItems: "center"}}>
                        <CustomText size={30}>🤓</CustomText>
                      </View>
                      <View style={{flex:4, alignItems: "flex-start"}}>
                        <CustomText size={13} color={theme.secondary}>Here To Help With</CustomText>
                        <View style={{flex:2, flexDirection: "row", alignItems: "flex-start"}}>
                        {
                            users[currentUser]?.langKnown?.map((lang, i) => {
                            return <CustomText key={i} size={20} color={theme.secondary} fontFam="DM">{lang.name + " "}</CustomText>})
                        }
                        </View>
                      </View>
                    </ColorWrapper>
        
                    <ColorWrapper inColor={theme.tertiary}>
                      <View style={{flex:1, alignItems: "center"}}>
                        <CustomText size={30}>😎</CustomText>
                      </View>
                      <View style={{flex:4,justifyContent: "flex-start", alignItems: "flex-start"}}>
                        <CustomText size={13}  color={theme.tertiary}>Here To learn</CustomText>
                        <View style={{flex:2, flexDirection: "row", justifyContent: "space-between"}}>
                        {
                            users[currentUser]?.langToLearn?.map((lang, i) => {
                            return <CustomText key={i} size={20} color={theme.tertiary} fontFam="DM" >{lang.name + " "}</CustomText>})
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

                  <Section style={{width: "100%", marginBottom: "5%"}}>
                    <CustomText size={20} fontFam="DM" color={theme.secondary_dark}>On repeat</CustomText>
                    <AlbumComponent
                      artistName={users[currentUser]?.musicInterest.artistName} 
                      albumName={users[currentUser]?.musicInterest.albumName} />
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
