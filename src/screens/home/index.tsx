import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";

import { theme } from "@screens/theme";
import { User } from "@domain/User";
import Card from "@components/userCard";
import { CustomText, Loading, ScreenView } from "@components/index";
import AlbumComponent from "@components/musicAlbum";

import { LanguageView, Section, UserDecSections, UserDescWrapper } from "./style";
import { LoggedUserContext, UserContextType } from "@screens/contexts/user";
import matchServices, { MatchState } from "@serv/matchServices";
import { MatchContext, MatchContextType } from "../contexts/match";
import NewMatchView from "./newMatch";

const HomeScreen: React.FC = () => {

  const { loggedUser } = useContext(LoggedUserContext) as UserContextType; 
  const { potentialMatches, loadMoreMatches } = useContext(MatchContext) as MatchContextType; 

  /*
     Screen like tinder homme
     Each card displays some information and the imgs of the user
     The card has 4 different swap movements (upw, down, left, right)
        - up: see more about the user
        - down: nothing
        - left: unliked user
        - right: liked user
  */

  const [uIndex, setuIndex] = useState<number>(-1);
  // when card is scrolled up
  const [seeDescription, setSeeDescription] = useState<boolean>(false);
  const [noMoreUsersAvailable, setNoMoreUsersAvailable] = useState<boolean>(false);
  // to animated after two users matched
  const [newMatch, setNewMatch] = useState<boolean>(false);

  const [renderUserCards, setRenderUserCards ] = useState<boolean[]>([]);
  const [swipedUserCards, setSwipedUserCards ] = useState<boolean[]>([]);

  const users: User[] = useMemo(() => {
    let potentialMatchesCount = potentialMatches?.length
    setuIndex(potentialMatches.length-1)
    setRenderUserCards(new Array(potentialMatchesCount).fill(true))
    setSwipedUserCards(new Array(potentialMatchesCount).fill(false))
    setNoMoreUsersAvailable(potentialMatches.length == 0)
    return potentialMatches
  }, [potentialMatches])

  useEffect(() => {
    if (uIndex==-1)
      loadMoreMatches()
  }, [uIndex])

  const renderOnlyThisCard = useCallback((id: number) => {
    setRenderUserCards(cards => cards.map(
      (c, i) => i == id));
  }, [renderUserCards]);

  const renderAllNonSwipedUsers = useCallback(() => {
    setRenderUserCards(swipedUserCards.map(s => !s));
  }, [renderUserCards, swipedUserCards]);

  const onHorizontalSwipe = useCallback(async (leftSwiped: boolean, user: User) => {
    let state = leftSwiped ?
      await matchServices.userUnLiked(loggedUser,user)
      : await matchServices.userLiked(loggedUser,user)
    console.log("state",state)
    
    if (state == MatchState.TRUE)
      setNewMatch(true)
  }, [newMatch]);

  const userSwiped = useCallback((id: number) => {
    setuIndex(u => u-1)
    setSwipedUserCards(newSwp => newSwp.map(
      (sw, i) => i == id ? true : sw));
    setRenderUserCards(cards => cards.map(
      (c, i) => i == id ? false : c));
  }, [swipedUserCards, renderUserCards,uIndex]);

  return (
    <ScreenView>
      <NewMatchView show={newMatch} onPress={() => {setNewMatch(false)}}/>
      {
      /* {noMoreUsersAvailable ?
      <View style={{flex:1 , justifyContent: "center", alignItems: "center", padding: "10%"}}>
        <CustomText style={{textAlign: "center"}} color={theme.tertiary_dark}>{"UAU!! You are a machine! \n\n\n You will have to wait for more users... 🥲"}</CustomText>
      </View>:  */}
      {
      uIndex == -1 ? 
        <Loading height="100%"/> :        
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
                      renderOnlyThisCard(i);
                      setSeeDescription(true)}}
                    onScrollDown={() => {
                      renderAllNonSwipedUsers()
                      setSeeDescription(false)}}
                    onSwipeLeft={() => {
                      onHorizontalSwipe(true, user)
                      userSwiped(i);
                    }}
                    onSwipeRigth={() => {
                      onHorizontalSwipe(false, user)
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
    }
    </ScreenView>
  );
}

export default HomeScreen;
