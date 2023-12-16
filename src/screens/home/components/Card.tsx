import { Animated, Dimensions, Image, PanResponder, TouchableWithoutFeedback, View } from "react-native";
import { PhotoChipWrapper, PhotoSwipeChips, UserDataView } from "./index";
import { Chip, CustomText } from "@components/index";
import EmptyImage from "@assets/empty_image.png";
import { useCallback, useMemo, useRef, useState } from "react";
import { Language } from "@api/domain/Language";
import { INITIAL_GESTURE_VALS, panRes } from "./PanResponder";
import { theme } from "@screens/theme";


interface CardProps {
    photosDisplayArray: string[];
    username: String;
    yearsOld: number;
    nationality: String;
    langKnown: Language[];
    userTeam: String;
    onScrollUp: () => void;
    onScrollDown: () => void;
    onSwipeLeft: () => void;
    onSwipeRigth: () => void;
    isScrolledUp: boolean;
    zIndex: number;
    render: boolean;
}

const Card: React.FC<CardProps> = ({
        photosDisplayArray,
        username,
        yearsOld,
        nationality,
        langKnown,
        userTeam,
        onScrollUp,
        onScrollDown,
        onSwipeLeft,
        onSwipeRigth,
        isScrolledUp,
        zIndex,
        render
    }) => {

    const [currentPhotoId, setCurrentPhotoId] = useState<number>(0);
    const [photosBase64, setPhotosBase64] = useState<string[]>(photosDisplayArray);
  
    const pan = useRef(new Animated.ValueXY(INITIAL_GESTURE_VALS.pan)).current;
    const scale = useRef(new Animated.ValueXY(INITIAL_GESTURE_VALS.scale)).current; // width (x) and height (y)
    
    const tapPhotoRight = useCallback(() => {
        if (photosBase64.length) {
            setCurrentPhotoId(p => (
                (p+1) >= photosBase64.length
                ? p : (p+1))) 
        }
    },[photosBase64,currentPhotoId])

    const tapPhotoLeft = useCallback(() => {
        setCurrentPhotoId(p => (p-1) >= 0 ? (p-1) : p)
    },[currentPhotoId])

    const panResponder = useMemo(
        () => panRes(
            isScrolledUp,
            pan,
            scale,
            tapPhotoLeft,
            tapPhotoRight,
            onScrollUp,
            onScrollDown,
            onSwipeRigth,
            onSwipeLeft)
        , [isScrolledUp]
    );


    return !render ? <></> : (
    <Animated.View {...panResponder.panHandlers}  style={{
        width: Dimensions.get("window").width*INITIAL_GESTURE_VALS.scale.x,
        height:  Dimensions.get("window").height*INITIAL_GESTURE_VALS.scale.y,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: Dimensions.get("window").width/4,
        margin: 0,
        padding: 0,
        transform: [
          // or pan.getTranslateTransform()
          { translateX: pan.x },
          { translateY: pan.y },
          { scaleX: scale.x.interpolate({
                inputRange: [INITIAL_GESTURE_VALS.scale.x, 1],
                outputRange: [1,1/INITIAL_GESTURE_VALS.scale.x]
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
        zIndex: 1000+zIndex,
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
                        <CustomText color={theme.text_ligth_primary} size={25} fontFam={"BD"}>{username+" "}</CustomText>
                        <CustomText color={theme.text_ligth_primary} size={25}>{yearsOld}</CustomText>
                    </View>
                    <Chip textColor={theme.text_ligth_primary} >{nationality}</Chip>
                    <Chip textColor={theme.text_ligth_primary} >{userTeam}</Chip>

                    <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
                        { 
                            langKnown.map((lang, i) => {
                            return <Chip textColor={theme.text_ligth_primary} key={i}>{lang.flag}</Chip>})
                        }
                    </View>
                </UserDataView>
            }

            
    </Animated.View>
    
    );
}

export default Card;
