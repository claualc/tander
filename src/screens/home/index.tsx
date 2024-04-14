import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { DEV_DIM, responsiveValue, theme } from "@screens/theme";
import { User } from "@domain/User";
import Card from "@components/userCard";
import { CustomText, Loading, ScreenView } from "@components/index";

import { UserDetails } from "./style";
import { LoggedUserContext, UserContextType } from "@context/user";
import matchServices, { MatchState } from "@serv/matchServices";
import { MatchContext, MatchContextType } from "@context/match";
import NewMatchView from "./newMatch";

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
  const [newMatch, setNewMatch] = useState<boolean>(false);

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
      setNewMatch(true)
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
    <ScreenView>
      <NewMatchView show={newMatch} onPress={() => {setNewMatch(false)}}/>
      {
        timeoutTrigguered && potentialMatches.length == 0 ?
        <View style={{flex:1 , justifyContent: "center", alignItems: "center", padding: "15%"}}>
          <CustomText style={{textAlign: "center"}} color={theme.tertiary_dark}>{"UAU!! You are a machine! \n\n\n You will have to wait for more users... 🥲"}</CustomText>
        </View> : uIndex == -1 ? 
          <Loading height="100%"/> :        
          <ScrollView 
            style={{width: "100%", flex: 1, position: "relative", zIndex: 0}} 
            contentContainerStyle={{width: "100%", alignItems: "center"}}
            scrollEnabled={seeDescription}>

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
                      top={ responsiveValue("7%","9%")}
                      isScrolledUp={seeDescription}
                      renderController={renderUserCards[i]}
                    /> )
                  }

                  <View style={{alignItems: "center", marginTop: responsiveValue("95%","96%") ,width: "100%", position: "relative", zIndex: 0}}>
                    <UserDetails user={users[uIndex]} show={seeDescription} />
                  </View>

            </ScrollView>
      }
    </ScreenView>
  );
}

export default HomeScreen;
