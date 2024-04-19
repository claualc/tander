
import React, { useCallback, useContext } from 'react';
import { ScreenView } from '@components/index';
import { FormsInputs, FormsPage, inputTypes } from '@components/forms/components/formDTOs';
import { validatePhoneNumber } from '@components/utils';
import { Forms } from '@components/forms';
import { LoggedUserContext, UserContextType } from '@context/user';
import authService from '@serv/authService';
import { stackNavigateTo } from '@screens/stackNavigator/navigateService';
import { routeNames } from '@screens/stackNavigator/routes';
import { responsiveValue } from '@screens/globalstyle';

export enum LoginFormPageId {
      INIT,
}

const loginInputs = () => {
  let pages: {
      [key: number]: FormsPage
  } = {
      [LoginFormPageId.INIT]: {
          title: "Welcome back!",
          subtitle: "We are happy you are here! Use the information you provided when you made your account to login.",
          questions:  [{
              id: 0,
              name: "phoneNumber",
              inputType: inputTypes.NUMERIC_PHONE,
              validate: validatePhoneNumber,
              placeholder: "Telephone number"
          },
          {
            id: 1,
            name: "password",
            inputType: inputTypes.TEXT,
            validate: authService.validatePassword,
            placeholder: "Password",
            maxCharacters: 8,
            hideText: true
          }]
      },
  }
  return { pages };
}

const initQuest = loginInputs()
const pages = Object.keys(initQuest.pages).map((p )=> initQuest.pages[Number(p)])

const LoginScreen = () => {

  const { setLoading } = useContext(LoggedUserContext) as UserContextType;

  const onSend = useCallback(async (inputs: FormsInputs) => {
      await authService.signIn(inputs.phoneNumber, inputs.password)
      setLoading(true)
  }, [])

  return  <ScreenView style={{padding: responsiveValue("8%","8%","15%")}} testID='screen-login'>
      <Forms 
          totalPagesCount={pages.length}
          onSend={onSend}
          pages={pages}
          onSendButtonTitle={"Login"}
          onClose={() => {stackNavigateTo(routeNames.INITIALIZATION_SCREEN)}}
        />
  </ScreenView>
}

export default LoginScreen;
