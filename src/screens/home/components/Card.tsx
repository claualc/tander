import { Image, TouchableWithoutFeedback, View } from "react-native";
import { PhotoChipWrapper, PhotoSwipeChips, UserDataView } from "./index";
import { BorderBox, Chip, CustomText } from "@components/index";
import EmptyImage from "@assets/empty_image.png";
import { useCallback, useState } from "react";
import { Language } from "@api/domain/Language";

interface CardProps {
    photosDisplayArray: string[];
    username: String;
    yearsOld: number;
    nationality: String;
    langKnown: Language[];
    userTeam: String;
}

const Card: React.FC<CardProps> = ({
    photosDisplayArray,
    username,
    yearsOld,
    nationality,
    langKnown,
    userTeam
    }) => {

    const [currentPhotoId, setCurrentPhotoId] = useState<number>(0);
    const [photosBase64, setPhotosBase64] = useState<string[]>(photosDisplayArray);
  
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

    return (
    <BorderBox
    width={"85%"}
    height={"85%"}>

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
            <Image style= {{flex:1 , width: "100%", height: "100%"}}    
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

        <View style={{ zIndex:5, width: "100%", height: "100%", position: "absolute",opacity:0, flexDirection: "row"}}>
            <TouchableWithoutFeedback 
            onPress={swipePhotoLeft}>
                <View style={{opacity: 0, width: "50%",backgroundColor:"green", height: "100%"}} />
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback 
            onPress={swipePhotoRight}>
                <View style={{opacity: 0, width: "50%",backgroundColor:"purple", height: "100%"}} />
            </TouchableWithoutFeedback>
        </View>

    </BorderBox>);
}

export default Card;
