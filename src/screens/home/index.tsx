import React, { useCallback, useEffect, useState } from "react";
import { Image, ImageBackground, TouchableWithoutFeedback, View } from "react-native";
import { Photo, User } from "@domain/User";
import { BorderBox, MainWrapper } from "@components/index";
import * as userService from "@serv/userService";
import { PhotoChipWrapper, PhotoSwipeChips, SwipePhotoButton } from "./components";
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

  useEffect(() => console.log("photosBase64",photosBase64[currentPhotoId]), [photosBase64,currentPhotoId])

  const swipePhotoRight = useCallback(() => {
    console.log("swipe right", currentPhotoId)
    if (photosBase64.length) {
      setCurrentPhotoId(p => (
          (p+1) >= photosBase64.length
            ? p : (p+1)))
    }
  },[photosBase64,currentPhotoId])

  const swipePhotoLeft = useCallback(() => {
    console.log("swipe left", currentPhotoId)
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
              zIndex:4,
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
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

          <View style={{ zIndex:6,width: "100%", height: "100%", position: "absolute",opacity:0, flexDirection: "row"}}>
              <TouchableWithoutFeedback 
                onPress={swipePhotoLeft}>
                  <View style={{opacity: 0, width: "50%", height: "100%"}} />
                </TouchableWithoutFeedback>
               <TouchableWithoutFeedback 
                onPress={swipePhotoRight}>
                  <View style={{opacity: 0, width: "50%", height: "100%",}} />
                </TouchableWithoutFeedback>
          </View>

      </BorderBox>
      </>
   }
   
                        
    </MainWrapper>
  );
}

export default HomeScreen;
