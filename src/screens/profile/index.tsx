import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { theme } from "../theme";

import { CustomText, ScreenView } from "@components/index";
import { LoggedUserContext, UserContextType } from "@screens/context";
import { Avatar, CenteredView, DescriptionView, Item, MainWrapper } from "./styles";
import { ProfileFormPageId, profileOptions } from "./components/settingOption";
import { Forms } from "@components/forms";

import * as userService from "@serv/userService";
import { convertUserToCreateDTO } from "@serv/userService/DTO";
/*
    This screen allows the user to modify its 
    personal information.
    When one Item is selected to change, the 
    settingsComponent opens a new view
    with the format of the questions of the 
    resgistration forms.
    Here, the user cna update the desired info.
 */


const formQuestions = profileOptions();

const ProfileScreen = () => {

  const { loggedUser, setLoading, setLoggedUser } = useContext(LoggedUserContext) as UserContextType;

  // user attribute to modify
  const [userAttribute, setUserAttribute] = useState<ProfileFormPageId>(ProfileFormPageId.NONE);

  const answers = useMemo(() => {
    let ans: any;
    switch (userAttribute) {
      case ProfileFormPageId.NONE:
        break;
      case ProfileFormPageId.PHOTOS:
        break;
      case ProfileFormPageId.PHONE_NUM_INPUT:
        ans=[loggedUser?.phoneNumber]
        break;
      case ProfileFormPageId.STUDENT_INFO:
        ans=[loggedUser?.university.id, loggedUser?.course.id]
        break;
        case ProfileFormPageId.LANG_TO_KNOW_INFO:
          ans=[loggedUser?.langKnown.map(l => l.id)]
          break;
      case ProfileFormPageId.LANG_TO_LEARN_INFO:
        ans=[loggedUser?.langToLearn.map(l => l.id)]
        break;
      case ProfileFormPageId.MORE_ABOUT_USER:
        ans=[loggedUser?.bio, loggedUser?.musicInterest]
        break;
    }
    return [ans]
  }, [userAttribute])

  const onSend = useCallback(async(inputs: any[][]) => {

      setLoading(true)
      setUserAttribute(ProfileFormPageId.NONE)
      console.log("update values", inputs)

      if (loggedUser?.id) {
      let dto = convertUserToCreateDTO(loggedUser);
      
      switch (userAttribute) {
        case ProfileFormPageId.PHOTOS:
          break;
        case ProfileFormPageId.PHONE_NUM_INPUT:
          console.log("updatingg phone number")
          dto.phoneNumber = inputs[0][0]
          break;
        case ProfileFormPageId.STUDENT_INFO:
          dto.university= inputs[0][0]
          dto.course= inputs[0][1]
          break;
        case ProfileFormPageId.LANG_TO_KNOW_INFO:
          dto.langKnown= inputs[0][0]
          break;
        case ProfileFormPageId.LANG_TO_LEARN_INFO:
          dto.langToLearn= inputs[0][0]
          break;
        case ProfileFormPageId.MORE_ABOUT_USER:
          dto.bio= inputs[0][0]
          dto.musicInterestRef=""
          break;
      }
      console.log("dto", dto)

      const updatedU = await userService.update(dto, loggedUser.id)
      let {photos_, ...rest} = updatedU
      console.log("updated u", rest)
      await setLoggedUser(updatedU)
      setLoading(false)
    }

  }, [userAttribute])

  return (userAttribute != ProfileFormPageId.NONE) ?
  <ScreenView style={{
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flexDirection: "column",
    paddingLeft: "8%",
    paddingRight:"8%",
    paddingTop:"15%" }}>
      <Forms 
        totalPagesCount={1} // only one page per attribute
        pages={[formQuestions.pages[userAttribute]]}
        onSend={onSend}
        onClose={() => setUserAttribute(ProfileFormPageId.NONE)}
        defaultAnswers={answers} />
    </ScreenView>
    : <ScreenView style={{
        width: "100%",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column"}}>
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
              onPress={() => {setUserAttribute(ProfileFormPageId.PHONE_NUM_INPUT)}}
              icon={"phone"}
              title={"Cellphone number"} />

            <Item 
              onPress={() => {setUserAttribute(ProfileFormPageId.STUDENT_INFO)}}
              icon={"graduation"}
              title={"University and course"} />

            <Item 
              onPress={() => {setUserAttribute(ProfileFormPageId.LANG_TO_LEARN_INFO)}}
              icon={"globe"}
              title={"Known languages"} />

            <Item 
              onPress={() => {setUserAttribute(ProfileFormPageId.LANG_TO_KNOW_INFO)}}
              icon={"bubble"}
              title={"Learning languages"} />

            <Item 
              onPress={() => {setUserAttribute(ProfileFormPageId.MORE_ABOUT_USER)}}
              icon={"music-tone-alt"}
              title={"A little about me"}
              noBorder={true} />
          </CenteredView>
        </ScrollView>
      </View>
  </ScreenView>
}

export default ProfileScreen;
