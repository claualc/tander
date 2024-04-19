import { Animated, Dimensions, PanResponder } from "react-native";
import { isLeftTap, isRightTap, isScrollDown, isScrollUp, isSwipeLeft, isSwipeRight } from "./motionDefinitions";
import { DEV_DIM, responsiveValue } from "@screens/globalstyle";


export const INITIAL_GESTURE_VALS = {
    pan: {x:0, y:0},
    scale: 1,
}

export interface coordsI {
    swipeLeft: {
        x: number ;
        y: number;
        show: boolean;
    };
    swipeRigth: {
        x: number ;
        y: number;
        show: boolean;
    }
}

const randomInside = (arr: number[]) => {
    let [min,max] = arr
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomCoordinateY = () => {
    let heightTop = [10,20];
    return randomInside(heightTop)
}

const getRandomCoordinateX = (moveRigth:boolean) => {
    let swipedRigt = [50,60]
    let swipedLeft = [5,20]
    
    return moveRigth ? 
            randomInside(swipedRigt)
            : randomInside(swipedLeft)
}

export const panRes = (
    isScrolledUp: boolean,
    pan: Animated.ValueXY,
    scale: Animated.Value,
    tapPhotoLeft: () => void,
    tapPhotoRight: () => void,
    whenScrollUp: () => void,
    whenScrollDown: () => void,
    onSwipeRigth: () => void,
    onSwipeLeft: () => void,
    setGifCoords: React.Dispatch<React.SetStateAction<coordsI>>,
    setShowGif: React.Dispatch<React.SetStateAction<boolean[]>>,
    gifCoords: coordsI | null
    ) => PanResponder.create({

    onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderStart: (event,ges) => {
            setGifCoords({
                swipeLeft: {
                    x: getRandomCoordinateX(false),
                    y: getRandomCoordinateY(),
                    show: false,
                },
                swipeRigth: {
                    x: getRandomCoordinateX(true),
                    y: getRandomCoordinateY(),
                    show: false,
                }
            });
        },
      onPanResponderMove:(event, ges) => {
        if (!isScrolledUp)
            pan.setValue({
                x: ges.dx,
                y: ges.dy,
            });

            let motion = ges.dx/DEV_DIM.width;
            if (Math.abs(motion) > 0.10) {
                if (motion > 0)
                    setShowGif([false, true])
                else 
                    setShowGif([true, false])
            }

      },
      onPanResponderRelease: (ev, ges) => {
            setShowGif([false, false])

            let animations: any[] = []
            const height = DEV_DIM.height;

            if (isLeftTap(ges))
                tapPhotoLeft();
            if (isRightTap(ges))
                tapPhotoRight();
            
            if (!isScrolledUp) {
            switch(true) {
                case isSwipeRight(ges):
                    animations = [
                        Animated.spring(
                        pan,
                        {toValue:  {x:10000, y: INITIAL_GESTURE_VALS.pan.y}, speed: 2, useNativeDriver: true}, // Back to zero
                        )
                    ]
                    onSwipeRigth();
                    break;
                case isSwipeLeft(ges):
                    animations = [
                        Animated.spring(
                        pan,
                        {toValue:  {x:-10000, y: INITIAL_GESTURE_VALS.pan.y}, speed: 2, useNativeDriver: true}, // Back to zero
                        )
                    ]
                    onSwipeLeft();
                    break;
                case isScrollUp(ges):
                    animations = [
                        Animated.spring(
                            scale,
                            {toValue: 1.3, useNativeDriver: true}, // Back to zero
                        ),
                        Animated.spring(
                            pan,
                            {toValue: {
                                x: INITIAL_GESTURE_VALS.pan.x,
                                y: INITIAL_GESTURE_VALS.pan.y-responsiveValue(0.05, 0.05,0.05)*height
                            }, useNativeDriver: true}, // Back to zero
                        )
                    ]
                    whenScrollUp();
                    break;
                default:
                    animations = [
                        Animated.spring(
                        scale,
                        {toValue: INITIAL_GESTURE_VALS.scale, useNativeDriver: true}, // Back to zero
                        ),
                        Animated.spring(
                        pan,
                        {toValue:  INITIAL_GESTURE_VALS.pan, useNativeDriver: true}, // Back to zero
                        )
                    ]
            } 

        } else {
            if (isScrollDown(ges)) {
                whenScrollDown();
                animations = [ 
                    Animated.spring(
                        scale,
                        {toValue: INITIAL_GESTURE_VALS.scale, useNativeDriver: true}, // Back to zero
                    ),
                    Animated.spring(
                        pan,
                        {toValue:  INITIAL_GESTURE_VALS.pan, useNativeDriver: true}, // Back to zero
                    )
                ]
            }
        }

        Animated.parallel(animations).start();

        },
    })