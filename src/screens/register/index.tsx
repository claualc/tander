import React, { useCallback, useState } from 'react';

import { LoggedUserContext, UserContextType } from '@context/user';
import { CreateUserDTO } from '@serv/userService/DTO';
import { Forms } from '@components/forms';
import { registerQuestions } from './components/RegisterForms';
import { View } from 'react-native';
import { ProgressBar, ProgressBarWrapper } from './components/ProgressBar';
import FCMService from "@firebaseServ/notifications";
import CreateUserService from '@serv/userService/create';
import { routeNames } from '@screens/stackNavigator/routes';
import { stackNavigateTo } from '@screens/stackNavigator/navigateService';
import { FormsInputs } from '@components/forms/components/formDTOs';


const initQuest = registerQuestions()
const pages = Object.keys(initQuest.pages).map((p )=> initQuest.pages[Number(p)])

const RegisterScreen = () => {

  const { setLoading, logIn } = React.useContext(LoggedUserContext) as UserContextType;
  const [ progress, setProgress ] = useState<number>(0);

  const onSend = useCallback(async (inputs: FormsInputs) => {
      console.log("..:: RegisterScreen signup: endend")
      const userDTO = {
        ...inputs as any,
        bio: "",
        musicInterest: null,
        FCMPushNotificationsToken: FCMService.getDeviceToken() || "",
      } as CreateUserDTO
  
      const user = await CreateUserService.execute(userDTO,inputs.password);
      setLoading(true)
      if (user) {
        logIn(user.id);
      }
  }, [])

  return <View style={{
          flex: 1,
          flexDirection: 'column', 
          justifyContent: 'flex-start',
          alignItems: 'center', 
        }}>

        <ProgressBarWrapper >
            <ProgressBar percentage={(1-(progress+1)/(pages.length+1))*100}></ProgressBar>
        </ProgressBarWrapper>

        <View style={{
          flex: 23,
          width: "100%",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          flexDirection: "column",
          paddingLeft: "8%",
          paddingRight:"8%",
          position: "relative",
          zIndex: 0,
        }}>
          <Forms 
              totalPagesCount={pages.length}
              onSend={onSend}
              pages={pages}
              onNextPage={(n) => setProgress(n)}
              onClose={() => stackNavigateTo(routeNames.INITIALIZATION_SCREEN)}
            />
        </View>
    </View>
}

export default RegisterScreen;
