import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { theme } from "../theme";

import { CustomText, ScreenView } from "@components/index";
import { LoggedUserContext, UserContextType } from "@screens/contexts/user";
import { CenteredView, DescriptionView, Item, MainWrapper } from "./styles";
import { ProfileFormPageId, profileOptions } from "./components/settingOption";
import { Forms } from "@components/forms";

import * as userService from "@serv/userService";
import { convertUserToCreateDTO } from "@serv/userService/DTO";
import albumService, { MusicInterestDTO } from "@serv/albumService";
import photoServices from "@serv/photoServices";
import { Photo, User } from "@api/domain/User";
import Avatar from "@components/avatar";
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
        ans=[loggedUser?.photos]
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
        ans=[
          loggedUser?.bio,
          !loggedUser?.musicInterest ? null :
            albumService.convertMusicInterectToDTO(loggedUser?.musicInterest)]
        break;
    }
    return [ans]
  }, [userAttribute])

  const onSend = useCallback(async(inputs: any[][]) => {

      setLoading(true)
      setUserAttribute(ProfileFormPageId.NONE)

      if (loggedUser?.id) {
      let dto = convertUserToCreateDTO(loggedUser);


      let updatedU: User = loggedUser;
        switch (userAttribute) {
          case ProfileFormPageId.PHOTOS:
            let newPhotos = await photoServices.updateUserPhotos(
              inputs[0][0] as Photo[], loggedUser )
            dto.photoChunkRefs = newPhotos
            break;
          case ProfileFormPageId.PHONE_NUM_INPUT:
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
            dto.musicInterest=inputs[0][1] as MusicInterestDTO
            break;
      }

      updatedU = await userService.update(dto, loggedUser.id)
      await setLoggedUser(updatedU)
      setLoading(false)
    }

  }, [userAttribute])

  return (userAttribute != ProfileFormPageId.NONE) ?
  <ScreenView style={{
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
    : <ScreenView>

      <MainWrapper 
        style={{
          elevation: 10,
          shadowColor: "black",
          shadowOffset: { height: 10, width:0} }}>
          <Avatar 
            borderColor={theme.main}
            width="35%"
            imgURL={loggedUser?.photos[0]?.value}
            onPress={() => {setUserAttribute(ProfileFormPageId.PHOTOS)}} />
          <View style={{marginTop: "3%"}}>
            <CustomText size={22}>{`${loggedUser?.shortusername}, ${loggedUser?.yearsOld} `}</CustomText>
          </View>
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
