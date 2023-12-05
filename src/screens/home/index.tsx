import React, { useCallback, useEffect, useState } from "react";
import { Image, TouchableWithoutFeedback, View } from "react-native";
import { Photo, User } from "@domain/User";
import { BorderBox, Chip, CustomText, MainWrapper } from "@components/index";
import * as userService from "@serv/userService";
import { PhotoChipWrapper, PhotoSwipeChips, SwipePhotoButton, UserDataView } from "./components";
import EmptyImage from "@assets/empty_image.png";

interface Props {
  user?: User
}

const HomeScreen: React.FC<Props> = ({ children, style, ...rest }: any) => {
  const id =  "Lye42fLFNWSZ4HGHCifr";

  useEffect(() => {
    (async () => {
      const user: User = await userService.getById(id)
      const photos: Photo[] = user?.photos || []
      setUser(user)
      setPhotosBase64(photos.length ? photos?.map(p => p.value) : [])
    })();
  }, [])

  const [user, setUser] = useState<User | null>(null);
  const [currentPhotoId, setCurrentPhotoId] = useState<number>(0);
  const [photosBase64, setPhotosBase64] = useState<string[]>([]);

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
    <MainWrapper
      style={{justifyContent: "center"}}>
      { user &&  <>
      
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

          {
            photosBase64.length ? <>
              <PhotoChipWrapper>
                {
                  user.photos?.map((p, i) => 
                    <PhotoSwipeChips 
                      photoCount={user.photos?.length || 0}
                      currentPhoto={currentPhotoId == i}
                      key={i}
                      ></PhotoSwipeChips>
                )}
              </PhotoChipWrapper>

              <Image style= {{flex:1 , width: "100%", height: "100%"}}    
                    source={{uri: photosBase64[currentPhotoId]}}/> 


              </> :  <Image style= {{flex:1 , width: "100%", height: "100%"}}    
                    source={EmptyImage}/> 
          }
          </View>

          <UserDataView>
            <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
              <CustomText size={25} fontFam={"BD"}>{user.username+" "}</CustomText>
              <CustomText size={25}>{user.yearsOld}</CustomText>
            </View>
            <Chip>{user.city?.name}</Chip>
            <Chip>{"spritz"}</Chip>

            <View style={{ width: "100%", display:"flex",flexDirection:"row",justifyContent: "flex-start", alignItems:"center"}}>
              { 
                user?.langKnown?.length ?
                user.langKnown.map((lang, i) => {
                return <Chip key={i}>{lang.name}</Chip>})
                : null
              }
            </View>
          </UserDataView>

          <View style={{ zIndex:5, width: "100%", height: "100%", position: "absolute",opacity:0, flexDirection: "row"}}>
              <TouchableWithoutFeedback 
                onPress={swipePhotoLeft}>
                  <View style={{opacity: 0, width: "50%", height: "100%"}} />
                </TouchableWithoutFeedback>
              <TouchableWithoutFeedback 
                onPress={swipePhotoRight}>
                  <View style={{opacity: 0, width: "50%", height: "100%"}} />
              </TouchableWithoutFeedback>
          </View>

      </BorderBox>
      </>
   }
   
                        
    </MainWrapper>
  );
}

export default HomeScreen;
