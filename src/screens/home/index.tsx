import React, { useCallback, useEffect, useRef, useState } from "react";
import { Photo, User } from "@domain/User";
import { MainWrapper } from "@components/index";
import * as userService from "@serv/userService";
import Card from "./components/Card";
import { Animated, Dimensions, GestureResponderEvent, PanResponder, PanResponderGestureState } from "react-native";

interface Props {
  user?: User
}

const HomeScreen: React.FC<Props> = ({ children, style, ...rest }: any) => {
  const id =  "Lye42fLFNWSZ4HGHCifr";

  useEffect(() => {
    (async () => {
      const user: User = await userService.getById(id)
      setUser(user)
      console.log(user)
    })();
  }, []);

  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([
      null,
      { dx: pan.x, dy: pan.y },
    ],
    {useNativeDriver: false}),
    onPanResponderRelease: (ev, {x0}) => {
      let animations: any[] = [];

      const swipe = x0 / Dimensions.get('window').width;
      console.log(swipe)
      if (swipe > 0.75 || swipe < 0.25) {
        console.log("SWWWIIIPE")
        animations = [
          ...animations,
          Animated.spring(
            opacity,
            {speed: 16,toValue: 0, useNativeDriver: true}, // Back to zero
          )
        ]
      }

      animations = [...animations,
        Animated.spring(
          pan,
          {toValue: {x: 0, y: 0}, useNativeDriver: true}, // Back to zero
        )
      ]

      Animated.parallel(animations).start();
    },
  });

  const [user, setUser] = useState<User | null>(null);

  return (
    <MainWrapper
      style={{justifyContent: "center"}}>
        { user && 
           <Card 
                photosDisplayArray={
                    user?.photos?.length ? 
                      user?.photos?.map(p => p.value) 
                      : []
                }
                username={user?.username || ""}
                yearsOld={user?.yearsOld || 0}
                nationality={"Brasiliano" || ""}
                userTeam={"Spritz" || ""}
                langKnown={user?.langKnown || []}
                
              /> 
        }
    </MainWrapper>
  );
}

export default HomeScreen;
