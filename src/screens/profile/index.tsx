import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { theme } from "../theme";

import { CustomText, ScreenView } from "@components/index";
import { LoggedUserContext, UserContextType } from "@context/user";
import { CenteredView, DescriptionView, Item, ItemView, LogOutItem, MainWrapper } from "./styles";
import { ProfileFormPageId, profileOptions } from "./components/settingOption";
import { Forms } from "@components/forms";

import * as userService from "@serv/userService";
import { convertUserToCreateDTO } from "@serv/userService/DTO";
import albumService, { MusicInterestDTO } from "@serv/albumService";
import photoServices from "@serv/photoServices";
import { Photo, User } from "@api/domain/User";
import Avatar from "@components/avatar";
import authService from "@serv/authService";
import { FormsInputs } from "@components/forms/components/formDTOs";
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

  const { loggedUser, setLoading, updateLoggedUser, logOut } = useContext(LoggedUserContext) as UserContextType;

  // user attribute to modify
  const [userAttribute, setUserAttribute] = useState<ProfileFormPageId>(ProfileFormPageId.NONE);

  const inputs = useMemo(() => {
    let inputs = {} as FormsInputs;
    switch (userAttribute) {
      case ProfileFormPageId.NONE:
        break;
      case ProfileFormPageId.PHOTOS:
        inputs.photos=loggedUser?.photos
        break;
      case ProfileFormPageId.PHONE_NUM_INPUT:
        inputs.phoneNumber=loggedUser?.phoneNumber
        break;
      case ProfileFormPageId.STUDENT_INFO:
        inputs.university=loggedUser?.university.id 
        inputs.course=loggedUser?.course.id
        break;
      case ProfileFormPageId.LANG_TO_KNOW_INFO:
        inputs.langKnown=loggedUser?.langKnown.map(l => l.id)
        break;
      case ProfileFormPageId.LANG_TO_LEARN_INFO:
        inputs.langToLearn=loggedUser?.langToLearn.map(l => l.id)
        break;
      case ProfileFormPageId.MORE_ABOUT_USER:
        inputs.bio= loggedUser?.bio
        inputs.musicInterest= !loggedUser?.musicInterest 
            ? null : albumService.convertMusicInterectToDTO(loggedUser?.musicInterest)
        break;
    }
    return inputs
  }, [userAttribute])

  const onSend = useCallback(async(inputs: FormsInputs) => {
      setLoading(true)
      setUserAttribute(ProfileFormPageId.NONE)

      if (loggedUser?.id) {
      let dto = convertUserToCreateDTO(loggedUser);
      let updatedU: User = loggedUser;
        switch (userAttribute) {
          case ProfileFormPageId.PHOTOS:
            let newPhotos = await photoServices.updateUserPhotos(
              inputs.photos as Photo[], loggedUser )
            dto.photoChunkRefs = newPhotos
            break;
          case ProfileFormPageId.PHONE_NUM_INPUT:
            dto.phoneNumber = inputs.phoneNumber
            break;
          case ProfileFormPageId.STUDENT_INFO:
            dto.university= inputs.university
            dto.course= inputs.course
            break;
          case ProfileFormPageId.LANG_TO_KNOW_INFO:
            dto.langKnown= inputs.langKnown
            break;
          case ProfileFormPageId.LANG_TO_LEARN_INFO:
            dto.langToLearn= inputs.langToLearn
            break;
          case ProfileFormPageId.MORE_ABOUT_USER:
            dto.bio= inputs.bio
            dto.musicInterest=inputs.musicInterest as MusicInterestDTO
            break;
      }

      updatedU = await userService.update(dto, loggedUser.id)
      await updateLoggedUser(updatedU)
      console.log("aaaaaaaaaaa")
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
        defaultInputs={inputs} />
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
              title={"A little about me"}/>

            <LogOutItem onPress={() => logOut()} />
                  
          </CenteredView>
        </ScrollView>
      </View>
  </ScreenView>
}

export default ProfileScreen;
