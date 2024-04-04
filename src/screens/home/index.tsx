import React, { useCallback, useContext, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";

import { theme } from "@screens/theme";
import { User } from "@domain/User";
import Card from "@components/userCard";
import { CustomText, ScreenView } from "@components/index";
import AlbumComponent from "@components/musicAlbum";

import { LanguageView, Section, UserDecSections, UserDescWrapper } from "./style";
import { LoggedUserContext, UserContextType } from "@screens/context";
import matchServices from "@serv/matchServices";

const USER_CARDS_BATCH_COUNT = 10;

const HomeScreen: React.FC = () => {

  const { loggedUser } = useContext(LoggedUserContext) as UserContextType; 

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
      if (loggedUser.id ) {
      const users: User[] = await matchServices.listUsersForMatching(loggedUser.id)
      console.log("      HomseScreen: ", users.length, "potential matches found")
      if (users.length) {
        setuIndex(users.length? users.length-1 : 0)
        setUsers(users)
        setRenderUserCards(users.map(p => true))
        setSwipedUserCards(users.map(p => false))
      } else {
        console.log("no matches found")
      }
      }
    })();
  }, [loggedUser]);

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
              style={{ height: "100%", width: "100%", zIndex:1 }}
              contentContainerStyle={{flexGrow:1, justifyContent: "flex-end", alignItems: "center", paddingBottom: "10%"}}
              scrollEnabled={true}>
                {
                  users.map((user, i) => <Card
                    key={i}
                    zIndex={i}
                    user={user}
                    onScrollUp={() => {
                      console.log("onScrollUp")
                      renderOnlyThisCard(i);
                      setSeeDescription(true)}}
                    onScrollDown={() => {
                      console.log("onScrollDown")
                      renderAllNonSwipedUsers()
                      setSeeDescription(false)}}
                    onSwipeLeft={() => {
                      console.log("onSwipeLeft")
                      matchServices.userUnLiked(loggedUser,user)
                      userSwiped(i);
                    }}
                    onSwipeRigth={() => {
                      console.log("onSwipeRigth")
                      matchServices.userLiked(loggedUser,user)
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
                    <CustomText size={30} fontFam="BD">{users[uIndex].shortusername || ""}</CustomText>
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
                    <LanguageView 
                      lang={users[uIndex].langKnown} 
                      emoji={"🤓"} 
                      color={theme.tertiary}
                      title={"Here To Help With"}  />
                    
                    <LanguageView 
                      lang={users[uIndex].langToLearn} 
                      emoji={"😎"}  
                      color={theme.secondary}
                      title={"Here To learn"}  />
                  </Section>

                  {/* ######### BIO  */}
                  {users[uIndex].bio && <Section>
                    <CustomText size={20} fontFam="DM" color={theme.secondary_dark}>Qualcosa di me</CustomText>
                    <CustomText size={17}  style={{marginTop: 10}}>
                      {users[uIndex].bio}
                    </CustomText>
                  </Section>
                  }

                  {/* ######### ALBUM SECTION  */
                    (users[uIndex].musicInterest) ? <Section style={{width: "100%"}}>
                    <CustomText size={20} fontFam="DM" color={theme.secondary_dark}>On repeat</CustomText>
                        <AlbumComponent
                          artistName={users[uIndex].MIArtistName || ""}
                          albumName={users[uIndex].MIAlbumName || ""} 
                          imageUrl={users[uIndex].MIImgURL || ""}
                          />
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
