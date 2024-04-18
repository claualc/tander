import { Animated, Dimensions, Image, ImageBackground, PanResponder, TouchableWithoutFeedback, View } from "react-native";
import { ActionGif, AnimationView, PhotoChipWrapper, PhotoSwipeChips, UserDataView } from "./style";
import { Chip, CustomText } from "@components/index";
import EmptyImage from "@imgs/empty_image.png";
import BlackBottomBlur from "@imgs/black_blur_user_card.png";
import { useCallback, useMemo, useRef, useState } from "react";
import { INITIAL_GESTURE_VALS, coordsI, panRes } from "./PanResponder";
import { responsiveValue, theme } from "@screens/globalstyle";
import { User } from "@domain/User";

import UnLikedGif from "@imgs/unliked_user.gif";
import LikedGif from "@imgs/liked_user.gif";

interface CardProps {
    onScrollUp?: () => void | null;
    onScrollDown?: () => void | null; 
    onSwipeLeft?: () => void | null;
    onSwipeRigth?: () => void | null;
    isScrolledUp: boolean | undefined;
    zIndex: number | undefined;
    renderController: boolean | undefined;
    user: User;
    top: string;
}

const Card: React.FC<CardProps> = ({
        onScrollUp,
        onScrollDown,
        onSwipeLeft,
        onSwipeRigth,
        isScrolledUp,
        zIndex,
        renderController, 
        user,
        top
    }) => {

        
    const [animationGifCoords, setAnimationGifCoords] = useState<coordsI>({
        swipeLeft: {x:0, y:0},
        swipeRigth: {x:0, y:0},
    } as coordsI);
    const [showGif, setShowGif] = useState<boolean[]>([false, false]);
    const [currentPhotoId, setCurrentPhotoId] = useState<number>(0);
    const [photosBase64, setPhotosBase64] = useState<string[]>(
        user?.photos?.length ? 
        user?.photos?.map(p => p.value) 
        : []
    );

    const pan = useRef(new Animated.ValueXY(INITIAL_GESTURE_VALS.pan)).current;
    const scale = useRef(new Animated.Value(INITIAL_GESTURE_VALS.scale)).current; // width (x) and height (y)
    
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
            isScrolledUp==undefined ? false : isScrolledUp,
            pan,
            scale,
            tapPhotoLeft,
            tapPhotoRight,
            onScrollUp ? onScrollUp : () => {},
            onScrollDown ? onScrollDown : () => {},
            onSwipeRigth ? onSwipeRigth : () => {},
            onSwipeLeft ? onSwipeLeft : () => {},
            setAnimationGifCoords,
            setShowGif,
            animationGifCoords)
        , [isScrolledUp]
    );

    return !((renderController==undefined) ? true : renderController) ? <></> : (
    <>
    {
        showGif[0] &&
        <ActionGif source={UnLikedGif} x={animationGifCoords?.swipeLeft.x} y={animationGifCoords?.swipeLeft.y} />
    }
     {
        showGif[1] &&
        <ActionGif source={LikedGif} x={animationGifCoords?.swipeRigth.x} y={animationGifCoords?.swipeRigth.y} />
    }
    <Animated.View {...panResponder.panHandlers}  style={{
        width:responsiveValue("85%",`60%`),
        aspectRatio: "2/2.8",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: top as any,
        padding: 0,
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          { scaleX: scale
            // .interpolate({
            //     inputRange: [INITIAL_GESTURE_VALS.scale, 100],
            //     outputRange: [1,1/INITIAL_GESTURE_VALS.scale]
            // })
         },
        ],
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 10,
        shadowColor: theme.secondary_dark,
        shadowOffset: { 
            height: 10, 
            width:  0
        },
        borderRadius: isScrolledUp ? 0 : 13,
        overflow: "hidden",
        zIndex: 100+(zIndex||0),
      }}>
        
        <View style={{ 
            width: "100%",
            position: "absolute",
            height: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: theme.light_background,
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
            <ImageBackground
                style= {{
                    width: "100%",
                    aspectRatio: "2/2.8",
                    flex:1,
                    zIndex:-1,
                    position: "absolute"
                }} 
                source={photosBase64[currentPhotoId] ?
                    {uri: `data:image/jpeg;base64,${photosBase64[currentPhotoId]}`}
                    : EmptyImage}/> 

            <Image resizeMode={"cover"} style= {{flex:1 , width: "100%", height: "100%", zIndex:0, position: "absolute"}}    
                    source={BlackBottomBlur}/> 
            </> :
                <Image style= {{flex:1 , width: "100%", height: "100%"}}    
                source={EmptyImage}/> 
        }
            </View>

            {
                !isScrolledUp && 
                <UserDataView>
                    <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
                        <CustomText color={theme.text_ligth_primary} size={25} fontFam={"BD"}>{user.shortusername+" "}</CustomText>
                        <CustomText color={theme.text_ligth_primary} size={25}>{user.yearsOld}</CustomText>
                    </View>
                    <Chip textColor={theme.text_ligth_primary} >{`${user.countryFlag} ${user.countryName}`}</Chip>
                    <Chip textColor={theme.text_ligth_primary} >{"Spritz"}</Chip>

                    <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
                        { 
                            user.langKnown?.map((lang, i) => {
                            return <Chip textColor={theme.text_ligth_primary} key={i}>{lang.language_code.toLocaleUpperCase()}</Chip>})
                        }
                    </View>
                </UserDataView>
            }

            
    </Animated.View>
    </>
    
    );
}

export default Card;
