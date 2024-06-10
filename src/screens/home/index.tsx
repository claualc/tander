import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { DEVICE_WINDOW_TYPE, DEV_DIM, SCREEN_TYPES, gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import { User } from "@domain/User";
import Card from "@components/userCard";
import { CustomText, Loading, ScreenView, ScrollDownAlarm } from "@components/index";

import { UserDetails } from "./style";
import { LoggedUserContext, UserContextType } from "@context/user";
import matchServices, { MatchState } from "@serv/matchServices";
import { MatchContext, MatchContextType } from "@context/match";
import NewMatchView from "./newMatch";
import { isScrollUp } from "@components/userCard/motionDefinitions";


const DEFAULT_ASPECT_RAT= DEV_DIM.width/DEV_DIM.height
const HomeScreen: React.FC = () => {

  const { loggedUser, setLoading } = useContext(LoggedUserContext) as UserContextType; 
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
  const [timeoutTrigguered, setTimeoutTrigguered] = useState<boolean>(false);
  // to animated after two users matched
  const [newMatch, setNewMatch] = useState<User[]>([]);

  const [renderUserCards, setRenderUserCards ] = useState<boolean[]>([]);
  const [swipedUserCards, setSwipedUserCards ] = useState<boolean[]>([]);

  const users: User[] = useMemo(() => {
    let potentialMatchesCount = potentialMatches?.length
    if (potentialMatchesCount != 0) {
      setuIndex(potentialMatches.length-1)
      setRenderUserCards(new Array(potentialMatchesCount).fill(true))
      setSwipedUserCards(new Array(potentialMatchesCount).fill(false))
    } else {
      setTimeout(() => {
        setTimeoutTrigguered(true)
      }, 6000);
    }
   
    return potentialMatches
  }, [potentialMatches?.length])  

  useEffect(() => {
    if (uIndex==-1)
      loadMoreMatches()
  }, [uIndex])

  useEffect(() => {
    setLoading(false)
  }, [])

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
    
    if (state == MatchState.TRUE)
      setNewMatch([...newMatch,user])
  }, [newMatch]);

  const userSwiped = useCallback((id: number) => {
    setTimeoutTrigguered(false)
    setuIndex(u => u-1)
    setSwipedUserCards(newSwp => newSwp.map(
      (sw, i) => i == id ? true : sw));
    setRenderUserCards(cards => cards.map(
      (c, i) => i == id ? false : c));
  }, [swipedUserCards, renderUserCards,uIndex, timeoutTrigguered]);

  return (
    <ScreenView testID='screen-home'>
      { newMatch.map((m, i) =>  <NewMatchView key={i} match={m} onPress={() => {setNewMatch(ms => ms.filter(mss => mss.id != m.id))}}/> )}
      {
        timeoutTrigguered && potentialMatches.length == 0 ?
        <View style={{flex:1 ,
          justifyContent: "center", 
          alignItems: "center", 
          padding: responsiveValue("15%","15%","0%")}}>
          <CustomText 
            size={gobalFont.size.default*responsiveValue(1,1,1.5)}
            style={{textAlign: "center", backgroundColor: "red"}} 
            color={theme.tertiary_dark}>{"UAU!! You are a machine! \n\n\n You will have to wait for more users... 🥲"}</CustomText>
        </View> : uIndex == -1 ? 
          <Loading height="13%" /> : 
                 
          <ScrollView 
            nestedScrollEnabled = {true}
            style={{width: "100%", zIndex: 0, flex:1}} 
            contentContainerStyle={{
              width: "100%", 
              alignItems: "center",
              flexDirection: responsiveValue("column", "column","row")}}
              scrollEnabled={DEVICE_WINDOW_TYPE!=SCREEN_TYPES.LANDSCAPE && seeDescription}>

                <View style={{
                  alignItems: "center", 
                  width: responsiveValue("100%","100%","40%"), 
                  aspectRatio: responsiveValue( 
                      seeDescription ? "2/2.9": DEFAULT_ASPECT_RAT,
                      seeDescription ? "2/2.9": DEFAULT_ASPECT_RAT,
                      "3/3.5") ,
                  position: "relative", 
                  overflow: "visible",
                  zIndex: 1}}>
                {
                    users.map((user, i) => <Card
                      key={i}
                      zIndex={i}
                      user={user}
                      doNotScrollUp={DEVICE_WINDOW_TYPE==SCREEN_TYPES.LANDSCAPE}
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
                      top={responsiveValue(
                        seeDescription?"18%":"13%", 
                        seeDescription?"10%": "10%", 
                        "0%")}
                      isScrolledUp={seeDescription}
                      renderController={renderUserCards[i]}
                    /> )
                  }

              </View>
              
              <ScrollDownAlarm 
                    bottom="22%"
                    width={responsiveValue("","","6%")}
                    left={responsiveValue("80%","80%","88%")}
                    show={!seeDescription && SCREEN_TYPES.LANDSCAPE != DEVICE_WINDOW_TYPE}/>

              <UserDetails 
                user={users[uIndex]} 
                show={responsiveValue(
                  seeDescription,
                  seeDescription,
                  true)} />
            </ScrollView>
      }
    </ScreenView>
  );
}

export default HomeScreen;
