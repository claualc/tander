import { Animated, Dimensions, PanResponder } from "react-native";
import { isLeftTap, isRightTap, isScrollDown, isScrollUp, isSwipeLeft, isSwipeRight } from "./motionDefinitions";


export const INITIAL_GESTURE_VALS = {
    pan: {x:0, y:0},
    scale: {x:0.85, y: 0.82},
}

export interface coordsI {
    x: number ;
    y: number;
}

const randomInside = (arr: number[]) => {
    let [min,max] = arr
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getRandomCoordinateY = () => {
    let heightTop = [20,30];
    return randomInside(heightTop)
}

const getRandomCoordinateX = (moveRigth:boolean) => {
    let swipedRigt = [50,70]
    let swipedLeft = [10,30]
    
    return moveRigth ? 
            randomInside(swipedRigt)
            : randomInside(swipedLeft)
}
export const panRes = (
    isScrolledUp: boolean,
    pan: Animated.ValueXY,
    scale: Animated.ValueXY,
    tapPhotoLeft: () => void,
    tapPhotoRight: () => void,
    whenScrollUp: () => void,
    whenScrollDown: () => void,
    onSwipeRigth: () => void,
    onSwipeLeft: () => void,
    setGifCoords: React.Dispatch<React.SetStateAction<coordsI | null>>,
    gifCoords: coordsI | null
    ) => PanResponder.create({

    onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove:(event, ges) => {
        if (!isScrolledUp) {
            pan.setValue({
                x: ges.dx,
                y: ges.dy,
            });

            let dx = 5
            const moveLeft = ges.dx < -dx 
            const moveRigth = ges.dx > dx 

            if (!gifCoords?.x && !gifCoords?.y) {
                setGifCoords({
                    x: getRandomCoordinateX(moveRigth),
                    y: getRandomCoordinateY()
                });
            }
        }
      },
      onPanResponderRelease: (ev, ges) => {

            setGifCoords(null)

            let animations: any[] = []
            const width = Dimensions.get('screen').width;
            const height = Dimensions.get('screen').height;

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
                            {toValue: {
                                x: 1,
                                y: INITIAL_GESTURE_VALS.scale.y
                            }, useNativeDriver: true}, // Back to zero
                        ),
                        Animated.spring(
                            pan,
                            {toValue: {
                                x: INITIAL_GESTURE_VALS.pan.x,
                                y: INITIAL_GESTURE_VALS.pan.y -0.12*height
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