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
    tapPhotoLeft: () => void,
    tapPhotoRight: () => void,
    whenScrollUp: () => void,
    whenScrollDown: () => void,
    onSwipeLeft: () => void,
    onSwipeRigth: () => void,
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
                                y: INITIAL_GESTURE_VALS.pan.y -0.1*height
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