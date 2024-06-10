import { Animated, Dimensions, Image, ImageBackground, PanResponder, TouchableWithoutFeedback, View } from "react-native";
import { ActionGif, AnimationView, PhotoChipWrapper, PhotoSwipeChips, UserDataView } from "./style";
import { Chip, CustomText } from "@components/index";
import EmptyImage from "@imgs/empty_image.png";
import BlackBottomBlur from "@imgs/black_blur_user_card.png";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { INITIAL_GESTURE_VALS, coordsI, panRes } from "./PanResponder";
import { gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import { User } from "@domain/User";

import LikedGerman from "@imgs/userCardAnimations/liked/german.gif";
import LikedFrench from "@imgs/userCardAnimations/liked/french.gif";
import LikedEnglish from "@imgs/userCardAnimations/liked/english.gif";
import LikedItalian from "@imgs/userCardAnimations/liked/italian.gif";
import LikedKorean from "@imgs/userCardAnimations/liked/korean.gif";
import LikedMandarim from "@imgs/userCardAnimations/liked/mandarim.gif";
import LikedPortugeuse from "@imgs/userCardAnimations/liked/portuguese.gif";


import UnlikedGerman from "@imgs/userCardAnimations/unliked/german.gif";
import UnlikedFrench from "@imgs/userCardAnimations/unliked/french.gif";
import UnlikedEnglish from "@imgs/userCardAnimations/unliked/english.gif";
import UnlikedItalian from "@imgs/userCardAnimations/unliked/italian.gif";
import UnlikedKorean from "@imgs/userCardAnimations/unliked/korean.gif";
import UnlikedMandarim from "@imgs/userCardAnimations/unliked/mandarim.gif";
import UnlikedPortugeuse from "@imgs/userCardAnimations/unliked/portuguese.gif";


const USER_ACTION_LIKED_GIFS = [LikedGerman ,LikedFrench ,LikedEnglish ,LikedItalian ,LikedKorean ,LikedMandarim,LikedPortugeuse];
const USER_ACTION_UNLIKED_GIFS = [UnlikedGerman ,UnlikedFrench ,UnlikedEnglish ,UnlikedItalian ,UnlikedKorean ,UnlikedMandarim,UnlikedPortugeuse];

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
    doNotScrollUp?: boolean;
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
        top,
        doNotScrollUp=false
    }) => {

    const getRandomActionGif = useCallback((liked: boolean) => {
        let userActionGifs = liked ? USER_ACTION_LIKED_GIFS : USER_ACTION_UNLIKED_GIFS
        const randomId = Math.floor(Math.random() * (userActionGifs.length-1))
        return userActionGifs[randomId]
    },[USER_ACTION_LIKED_GIFS,USER_ACTION_UNLIKED_GIFS])

        
    const [animationGifCoords, setAnimationGifCoords] = useState<coordsI>({
        swipeLeft: {x:0, y:0},
        swipeRigth: {x:0, y:0},
    } as coordsI);
    const [currentPhotoId, setCurrentPhotoId] = useState<number>(0);
    const [photosBase64, setPhotosBase64] = useState<string[]>(
        user?.photos?.length ? 
        user?.photos?.map(p => p.value) 
        : []
    );

    const [showGif, setShowGif] = useState<boolean[]>([false, false]);
    const [likedAnimationGif, setLikedAnimationGif] = useState(USER_ACTION_UNLIKED_GIFS[0]);
    const [unlikedAnimationGif, setUnLikedAnimationGif] = useState(USER_ACTION_LIKED_GIFS[0]);
    useEffect(() => {
        setLikedAnimationGif(
            getRandomActionGif(true)
        )},[showGif[0]])
    useEffect(() => {
        setUnLikedAnimationGif(
            getRandomActionGif(false)
        )},[showGif[1]])

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
            doNotScrollUp)
        , [isScrolledUp]
    );

    return !((renderController==undefined) ? true : renderController) ? <></> : (
    <>
    {
        !isScrolledUp && showGif[0] &&
        <ActionGif source={unlikedAnimationGif} x={animationGifCoords?.swipeLeft.x} y={animationGifCoords?.swipeLeft.y} />
    }
     {
        !isScrolledUp && showGif[1] &&
        <ActionGif source={likedAnimationGif} x={animationGifCoords?.swipeRigth.x} y={animationGifCoords?.swipeRigth.y} />
    }
    <Animated.View {...panResponder.panHandlers}  style={{
        width:responsiveValue("90%",`60%`,`75%`),
        aspectRatio: responsiveValue(
            isScrolledUp ? "2/2.8" : "2/3.2",
            isScrolledUp ? "2/2.8" : "2/3.2",
            "3/4.5"),
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: top as any,
        padding: 0,
        transform: [
          { translateX: pan.x },
          { translateY: pan.y },
          { scaleX: scale
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
            <View style= {{
                    width: isScrolledUp ? "100%": "100%",
                    height: "100%",
                    flex:1,
                    zIndex:-1,
                    position: "absolute"
                }} >

            <ImageBackground
                style= {{
                    height: "100%",
                }} 
                source={photosBase64[currentPhotoId] ?
                    {uri: `data:image/jpeg;base64,${photosBase64[currentPhotoId]}`}
                    : EmptyImage}/> 

            <Image resizeMode={"cover"} style= {{flex:1 , width: "100%", height: "100%", zIndex:0, position: "absolute"}}    
                    source={BlackBottomBlur}/> 

            </View>

            </> :
                <Image style= {{flex:1 , width: "100%", height: "100%"}}    
                source={EmptyImage}/> 
        }
            </View>

            {
                !isScrolledUp && 
                <UserDataView>
                    <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
                        <CustomText size={gobalFont.size.title*0.8} color={theme.text_ligth_primary} fontFam={"BD"}>{user.shortusername+" "}</CustomText>
                        <CustomText size={gobalFont.size.title*0.8} color={theme.text_ligth_primary}>{user.yearsOld}</CustomText>
                    </View>
                    <Chip textColor={theme.text_ligth_primary} >{`${user.countryFlag} ${user.countryName}`}</Chip>
                    <Chip textColor={theme.text_ligth_primary} >{"Spritz"}</Chip>

                    <View style={{ 
                        width: "100%", 
                        display:"flex",
                        flexDirection:"row",
                        justifyContent: "flex-start", alignItems:"center"}}>
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
