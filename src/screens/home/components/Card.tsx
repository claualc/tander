import React from "react-native";

const Card = () => {

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

    </BorderBox>);
}

export default Card;
