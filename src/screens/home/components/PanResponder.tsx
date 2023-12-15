import { Animated, Dimensions, PanResponder } from "react-native";
import { isLeftTap, isRightTap, isScrollDown, isScrollUp, isSwipeLeft, isSwipeRight } from "./motionDefinitions";


export const INITIAL_GESTURE_VALS = {
    pan: {x:0, y:0},
    scale: {x:0.85, y: 0.80},
}

export const panRes = (
    isScrolledUp: boolean,
    pan: Animated.ValueXY,
    scale: Animated.ValueXY,
    swipePhotoLeft: () => void,
    swipePhotoRight: () => void,
    whenScrollUp: () => void,
    whenScrollDown: () => void,
    ) => PanResponder.create({

    onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove:(event, ges) => {
        if (!isScrolledUp) {
            pan.setValue({
                x: ges.dx,
                y: ges.dy,
            });
        }
      },
      onPanResponderRelease: (ev, ges) => {

            let animations: any[] = []
            const width = Dimensions.get('screen').width;
            const height = Dimensions.get('screen').height;

            if (isLeftTap(ges))
                swipePhotoLeft();
            if (isRightTap(ges))
                swipePhotoRight();
            
            if (!isScrolledUp) {
            switch(true) {
                case isSwipeRight(ges):
                    console.log("SWIPE RIGTH")
                    animations = [
                        Animated.spring(
                        pan,
                        {toValue:  {x:10000, y: INITIAL_GESTURE_VALS.pan.y}, speed: 2, useNativeDriver: true}, // Back to zero
                        )
                    ]
                    break;
                case isSwipeLeft(ges):
                    console.log("SWIPE LEFT")
                    animations = [
                        Animated.spring(
                        pan,
                        {toValue:  {x:-10000, y: INITIAL_GESTURE_VALS.pan.y}, speed: 2, useNativeDriver: true}, // Back to zero
                        )
                    ]
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
                                y: INITIAL_GESTURE_VALS.pan.y -0.01*height
                            }, useNativeDriver: true}, // Back to zero
                        )
                    ]
                    console.log("SCROLLL UP")
                    whenScrollUp();
                    break;
                default:
                    console.log("DEFAULT CASE")
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
                console.log("SCROLLL DOWN")
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
                whenScrollDown();
            }
        }

        Animated.parallel(animations).start();

        },
    })