import { Animated, Dimensions, Image, PanResponder, TouchableWithoutFeedback, View } from "react-native";
import { PhotoChipWrapper, PhotoSwipeChips, UserDataView } from "./index";
import { Chip, CustomText } from "@components/index";
import EmptyImage from "@assets/empty_image.png";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Language } from "@api/domain/Language";
import { isLeftTap, isRightTap, isSwipeLeft, isSwipeRight, isScrollDown, isScrollUp } from "./motionDefinitions";


const INITIAL_GESTURE_VALS = {
    pan: {x:0, y:0},
    scale: {x:0.9, y: 0.85},
}

interface CardProps {
    photosDisplayArray: string[];
    username: String;
    yearsOld: number;
    nationality: String;
    langKnown: Language[];
    userTeam: String;
    whenScrollUp: () => void;
    whenScrollDown: () => void;
    isScrolledUp: boolean;
}

const Card: React.FC<CardProps> = ({
        photosDisplayArray,
        username,
        yearsOld,
        nationality,
        langKnown,
        userTeam,
        whenScrollUp,
        whenScrollDown,
        isScrolledUp
    }) => {

    const [currentPhotoId, setCurrentPhotoId] = useState<number>(0);
    const [photosBase64, setPhotosBase64] = useState<string[]>(photosDisplayArray);
  
    const pan = useRef(new Animated.ValueXY(INITIAL_GESTURE_VALS.pan)).current;
    const scale = useRef(new Animated.ValueXY(INITIAL_GESTURE_VALS.scale)).current; // width (x) and height (y)
    
    const swipePhotoRight = useCallback(() => {
    if (photosBase64.length) {
        setCurrentPhotoId(p => (
            (p+1) >= photosBase64.length
            ? p : (p+1)))
    }
    },[photosBase64,currentPhotoId])

    const swipePhotoLeft = useCallback(() => {
        setCurrentPhotoId(p => (p-1) >= 0 ? (p-1) : p)
    },[currentPhotoId])


    const panResponder = useMemo(
        () => PanResponder.create({
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
                console.log(isScrolledUp,"x0", ges.x0, "y0",ges.y0, "dx",ges.dx/width,"dy", ges.dy/width)


                switch(true) {
                    case isLeftTap(ges):
                        console.log("isLeftTap")
                        swipePhotoLeft()
                    case isRightTap(ges):
                        console.log("isRightTap")
                        swipePhotoRight()
                }
                
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
        }), [isScrolledUp]
      );

    return (
    <Animated.View {...panResponder.panHandlers}  style={{
        width: Dimensions.get("window").width*INITIAL_GESTURE_VALS.scale.x,
        height:  Dimensions.get("window").height*INITIAL_GESTURE_VALS.scale.y,
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
        transform: [
          // or pan.getTranslateTransform()
          { translateX: pan.x },
          { translateY: pan.y },
          { scaleX: scale.x.interpolate({
                inputRange: [0.9, 1],
                outputRange: [1,1/0.9]
            })
         },
          { scaleY: scale.y },
        ],
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 10,
        shadowColor: "black",
        shadowOffset: { 
            height: 10, 
            width:  0
        },
        borderRadius: isScrolledUp ? 0 : 13,
        overflow: "hidden",
        zIndex: 0
      }}>
        
        <View style={{ 
            width: "100%",
            position: "absolute",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: "column" }}>
       
        {  photosBase64.length ? <>

            {/* 
                Load the top chipsin the card that
                will show wich is the current picture 
            */}
            <PhotoChipWrapper>
            {
                photosBase64.map((p, i) => 
                <PhotoSwipeChips 
                    photoCount={photosBase64.length || 0}
                    currentPhoto={currentPhotoId == i}
                    key={i}
                    ></PhotoSwipeChips>
            )}
            </PhotoChipWrapper>
                
            {/* 
                Display the current image selected
            */}
                <Image resizeMode={"cover"} 
                    style= {{
                        flex:1,
                        width: Dimensions.get("window").width,
                        height: Dimensions.get("window").height,
                    }} 
                    source={{uri: photosBase64[currentPhotoId]}}/> 
                </> :  <Image style= {{flex:1 , width: "100%", height: "100%"}}    
                    source={EmptyImage}/> 
            }
            </View>

            {
                !isScrolledUp && 
                <UserDataView>
                    <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
                        <CustomText size={25} fontFam={"BD"}>{username+" "}</CustomText>
                        <CustomText size={25}>{yearsOld}</CustomText>
                    </View>
                    <Chip>{nationality}</Chip>
                    <Chip>{userTeam}</Chip>

                    <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
                        { 
                            langKnown.map((lang, i) => {
                            return <Chip key={i}>{lang.name}</Chip>})
                        }
                    </View>
                </UserDataView>
            }

            
    </Animated.View>
    
    );
}

export default Card;
