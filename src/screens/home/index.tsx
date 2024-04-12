import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";

import { theme } from "@screens/theme";
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

  useEffect(() => {
    setLoading(false)
  }, [])

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
                  <UserDetails user={users[uIndex]} show={seeDescription} />
            </ScrollView>
      }
    </ScreenView>
  );
}

export default HomeScreen;
