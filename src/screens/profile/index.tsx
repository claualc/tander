import { useContext, useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { theme } from "../theme";


import { CustomText, ScreenView } from "@components/index";
import { LoggedUserContext, UserContextType } from "@screens/context";
import { Avatar, CenteredView, DescriptionView, Item, MainWrapper } from "./styles";
import { settingOptions } from "./components/settingOption";
import { PageId } from "../register/components/Questions";



/*
    This screen allows the user to modify its 
    personal information.
    When one Item is selected to change, the 
    settingsComponent opens a new view
    with the format of the questions of the 
    resgistration forms.
    Here, the user cna update the desired info.

 */

const ProfileScreen = () => {

  const { loggedUser } = useContext(LoggedUserContext) as UserContextType;
  const [answers, setAnswers] = useState<any>();

  // user attribute to modify
  const [userAttribute, setUserAttribute] = useState<PageId>(PageId.NONE);

  return (userAttribute != PageId.NONE) ?
    <></>
    : <ScreenView style={{flexDirection: "column"}}>
    <MainWrapper 
      style={{
        elevation: 10,
        shadowColor: "black",
        shadowOffset: { height: 10, width:0} }}>
        
        <Avatar 
          style={{ borderRadius: 300 }}>
            <Image 
                resizeMode="cover"
                style={{flex:1}} 
                source={{uri: `data:image/jpeg;base64,${loggedUser?.photos[0]?.value || ""}`}}/>
      </Avatar>
      <CustomText size={27}>{`${loggedUser?.shortusername}, ${loggedUser?.yearsOld} `}</CustomText>
    </MainWrapper>

    <View style={{flex: 3, width: "100%", alignItems: "center"}}>
      <ScrollView style={{width: "100%", flexDirection: "column"}}>
        <DescriptionView>
          <CustomText size={14} style={{textAlign: "center"}} color={theme.tertiary_dark}>Here you can modify informations from your profile. Some are unchangeable for your security!</CustomText>
        </DescriptionView>
        <CenteredView style={{height: "100%", paddingRight: "6%",paddingLeft: "6%", justifyContent: "flex-start"}}>
          <Item 
            onPress={() => {setUserAttribute(PageId.PHONE_NUM_INPUT)}}
            icon={"phone"}
            title={"Cellphone number"} />

          <Item 
            onPress={() => {setUserAttribute(PageId.STUDENT_INFO)}}
            icon={"graduation"}
            title={"University and course"} />

          <Item 
            onPress={() => {setUserAttribute(PageId.LANG_TO_LEARN_INFO)}}
            icon={"globe"}
            title={"Known languages"} />

          <Item 
            onPress={() => {setUserAttribute(PageId.LANG_TO_KNOW_INFO)}}
            icon={"bubble"}
            title={"Learning languages"} />


          <Item 
            onPress={() => {setUserAttribute(PageId.MUSIC_INTEREST)}}
            icon={"music-tone-alt"}
            title={"A little about me"}
            noBorder={true} />
        </CenteredView>
      </ScrollView>
    </View>

  </ScreenView>
}

export default ProfileScreen;
