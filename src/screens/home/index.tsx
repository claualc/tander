import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Photo, User } from "@domain/User";
import { BOTTOM_TABNAV_HEIGTH, Chip, ColorWrapper, CustomText, ScreenView, Wrapper } from "@components/index";
import * as userService from "@serv/userService";
import Card from "@components/userCard";
import { Dimensions, ScrollView, Text, View } from "react-native";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Section, UserDecSections, UserDescWrapper } from "./style";
import { theme } from "../theme";
import AlbumComponent from "@components/musicAlbum";


const USER_CARDS_BATCH_COUNT = 10;
const TRUE_ARRAY = new Array(USER_CARDS_BATCH_COUNT).fill(true);
const FALSE_ARRAY = new Array(USER_CARDS_BATCH_COUNT).fill(false);

const HomeScreen: React.FC = () => {

  /*
     Screen like tinder homme
     Each card displays some information and the imgs of the user
     The card has 4 different swap movements (upw, down, left, right)
        - up: see more about the user
        - down: nothing
        - left: unliked user
        - right: liked user
  */

  useEffect(() => {
    (async () => {
      const users: User[] = await userService.listAll()
      const user: User = users[0]
      setuIndex(users.length? users.length-1 : 0)
      setUsers(users)
      setRenderUserCards(users.map(p => true))
      setSwipedUserCards(users.map(p => false))
      
    })();
  }, []);

  const [uIndex, setuIndex] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [seeDescription, setSeeDescription] = useState<boolean>(false);

  const [renderUserCards, setRenderUserCards ] = useState<boolean[]>([]);
  const [swipedUserCards, setSwipedUserCards ] = useState<boolean[]>([]);

  const renderOnlyThisCard = useCallback((id: number) => {
    setRenderUserCards(cards => cards.map(
      (c, i) => i == id));
  }, [renderUserCards, uIndex]);

  const renderAllNonSwipedUsers = useCallback(() => {
    setRenderUserCards(swipedUserCards.map(s => !s));
  }, [renderUserCards, swipedUserCards]);

  const userSwiped = useCallback((id: number) => {
    if (uIndex > 0)
      setuIndex(uIndex-1)
    setSwipedUserCards(newSwp => newSwp.map(
      (sw, i) => i == id ? true : sw));
    setRenderUserCards(cards => cards.map(
      (c, i) => i == id ? false : c));
  }, [swipedUserCards, renderUserCards,uIndex]);

  return (
    <ScreenView>
         <ScrollView
              style={{ height: "100%", width: "100%" }}
              contentContainerStyle={{flexGrow:1, justifyContent: "flex-end", alignItems: "center", paddingBottom: "10%"}}
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

                   {/* ######### BASIC INFO SECTION */}
                  <UserDecSections>
                    <CustomText size={30} fontFam="BD">{users[uIndex].username || ""}</CustomText>
                    <CustomText  size={30}>{" " + users[uIndex].yearsOld}</CustomText>
                  </UserDecSections>
                  <UserDecSections>
                    <AntDesign name="book" size={24} color={theme.tertiary_dark} />
                    <CustomText color={theme.tertiary_dark}>{" " + users[uIndex].courseName}</CustomText>
                  </UserDecSections>
                  <UserDecSections>
                    <Ionicons name="earth-outline" size={24} color={theme.tertiary_dark} />
                    <CustomText color={theme.tertiary_dark}>{` ${users[uIndex].countryName}`}</CustomText>
                  </UserDecSections>
                  <UserDecSections>
                    <SimpleLineIcons name="graduation" size={24} color={theme.tertiary_dark} />
                    <CustomText color={theme.tertiary_dark}>{" " +  users[uIndex].universityName}</CustomText>
                  </UserDecSections>

                  {/* ######### LANGUAGES SECTION */}
                  <Section style={{justifyContent: "flex-start",width:"100%"}}>
                    <ColorWrapper inColor={theme.secondary}>
                      <View style={{flex:1, alignItems: "center"}}>
                        <CustomText size={30}>🤓</CustomText>
                      </View>
                      <View style={{flex:4, alignItems: "flex-start"}}>
                        <CustomText size={13} color={theme.secondary}>Here To Help With</CustomText>
                        <View style={{flex:2, flexDirection: "row", alignItems: "flex-start"}}>
                        {
                            users[uIndex].langKnown.map((lang, i) => {
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
                            users[uIndex].langToLearn.map((lang, i) => {
                            return <CustomText key={i} size={20} color={theme.tertiary} fontFam="DM" >{lang.name + " "}</CustomText>})
                        }
                        </View>
                      </View>
                    </ColorWrapper>
                  </Section>

                  {/* ######### BIO  */}
                  <Section>
                    <CustomText size={20} fontFam="DM" color={theme.secondary_dark}>Qualcosa di me</CustomText>
                    <CustomText size={17}  style={{marginTop: 10}}>
                      {users[uIndex].bio}
                    </CustomText>
                  </Section>

                  {/* ######### ALBUM SECTION  */
                    (users[uIndex].musicInterest) ? <Section style={{width: "100%"}}>
                    <CustomText size={20} fontFam="DM" color={theme.secondary_dark}>On repeat</CustomText>
                        <AlbumComponent
                          albumInfo={users[uIndex].musicInterest} />
                  </Section>
                  : <></>
                  }
                  </>
                }

              </UserDescWrapper>
          </ScrollView>
    </ScreenView>
  );
}

export default HomeScreen;
