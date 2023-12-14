import { Animated, Dimensions, Image, PanResponder, TouchableWithoutFeedback, View } from "react-native";
import { PhotoChipWrapper, PhotoSwipeChips, UserDataView } from "./index";
import { BorderBox, Chip, CustomText } from "@components/index";
import EmptyImage from "@assets/empty_image.png";
import { useCallback, useEffect, useRef, useState } from "react";
import { Language } from "@api/domain/Language";
import { isLeftTap, isRightTap, isSwipeLeft, isSwipeRight, isScroll } from "./motionDefinitions";


const INITIAL_GESTURE_VALS = {
    pan: {x:0, y:0},
    scale: {x:0.85, y: 0.80},
}


interface CardProps {
    photosDisplayArray: string[];
    username: String;
    yearsOld: number;
    nationality: String;
    langKnown: Language[];
    userTeam: String;
    whenScroll: () => void;
    isScrolledUp: boolean;
}

const Card: React.FC<CardProps> = ({
        photosDisplayArray,
        username,
        yearsOld,
        nationality,
        langKnown,
        userTeam,
        whenScroll,
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

    useEffect(() => console.log(pan, scale), [pan, scale])


    const panResponder = useRef(
        PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
          onStartShouldSetPanResponder: () => true,
          onPanResponderMove:(event, ges) => {
            let scroll = isScroll(ges);
            // if(scroll) {
            //         scale.setValue({
            //             x: 1 + scrollPercentage,
            //             y: INITIAL_GESTURE_VALS.scale.y,
            //         })
            //         pan.setValue({
            //             x: INITIAL_GESTURE_VALS.pan.x,
            //             y: ges.dy
            //         })
            pan.setValue({
                x: ges.dx,
                y: ges.dy,
            });
          },
          onPanResponderRelease: (ev, ges) => {
            let animations: any[] = []
            const width = Dimensions.get('window').width;
            const height = Dimensions.get('window').height;
            console.log(ges.x0, ges.y0, ges.dx/width, ges.dy/width)
            switch(true) {
                case isLeftTap(ges):
                    swipePhotoLeft()
                    break;
                case isRightTap(ges):
                    swipePhotoRight()
                    break;
                case isSwipeRight(ges):
                    animations = [
                        Animated.spring(
                          pan,
                          {toValue:  {x:10000, y: INITIAL_GESTURE_VALS.pan.y}, speed: 2, useNativeDriver: true}, // Back to zero
                        )
                    ]
                    break;
                case isSwipeLeft(ges):
                    animations = [
                        Animated.spring(
                          pan,
                          {toValue:  {x:-10000, y: INITIAL_GESTURE_VALS.pan.y}, speed: 2, useNativeDriver: true}, // Back to zero
                        )
                    ]
                    break;
                case isScroll(ges):
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
                              y: INITIAL_GESTURE_VALS.pan.y - 0.10*height
                            }, useNativeDriver: true}, // Back to zero
                          )
                    ]
                    whenScroll();
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

            Animated.parallel(animations).start();
          },
        })
      ).current;

    return (
    <Animated.View {...panResponder.panHandlers}  style={{
        width: '100%',
        height: '100%',
        marginTop: "25%",
        justifyContent: "center",
        alignItems: "center",
        transform: [
          // or pan.getTranslateTransform()
          { translateX: pan.x },
          { translateY: pan.y },
          { scaleX: scale.x },
          { scaleY: scale.y },
        ],
        
      }}>
        
    <BorderBox>
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
                <Image resizeMode={"cover"} style= {{flex:1 , width: "100%", height: "100%"}}    
                    source={{uri: photosBase64[currentPhotoId]}}/> 
                </> :  <Image style= {{flex:1 , width: "100%", height: "100%"}}    
                    source={EmptyImage}/> 
            }
            </View>

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
        </BorderBox>
    </Animated.View>
    
    );
}

export default Card;
