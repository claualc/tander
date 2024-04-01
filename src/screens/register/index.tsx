import React, { useCallback, useState } from 'react';


import * as userServices from "@serv/userService";
import { LoggedUserContext, UserContextType } from '@screens/context';
import { CreateUserDTO } from '@serv/userService/DTO';
import { Forms } from '@components/forms';
import { registerQuestions } from './components/RegisterForms';
import { View } from 'react-native';
import { ProgressBar, ProgressBarWrapper } from './components/ProgressBar';
import { ScreenView } from '@components/index';


const initQuest = registerQuestions()

const RegisterScreen = () => {

  const { setLoading, setLoggedUser } = React.useContext(LoggedUserContext) as UserContextType;
  const [ progress, setProgress ] = useState<number>(0);

  const onSend = useCallback(async (inputs: any[][]) => {
    try {
      console.log("..:: RegisterScreen signup: endend")
      setLoading(true)
      const userDTO: CreateUserDTO = {
        username: inputs[1][0], // username
        birth :inputs[2][0], // birthdate
        phoneNumber: Number(inputs[0][0]), // phonenumber
        university :inputs[3][0], //university_
        course :inputs[3][1], // course
        langToLearn :inputs[4][1], // langTolearn
        langKnown :inputs[5][0], // langKnown
        photos :inputs[7][0], //photos
        team :inputs[6][0], //userTeam
        country :inputs[4][0] //country,
      }

      const user = await userServices.create(userDTO);
      setLoggedUser(user);
      setLoading(false)
    } catch(e) {
      console.log("..:: RegisterScreen signup ERROR: user data was collected but not registered in API")
      console.log(e)
    }
   
  }, [])

  return <View style={{
          flex: 1,
          flexDirection: 'column', 
          justifyContent: 'flex-start',
          alignItems: 'center', 
        }}>

        <ProgressBarWrapper >
            <ProgressBar percentage={(1-(progress+1)/(initQuest.page.length+1))*100}></ProgressBar>
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
              totalPagesCount={initQuest.page.length}
              initPage={initQuest.page[0]}
              onSend={onSend}
              onChangeQuestions={registerQuestions}
              onNextPage={(n) => setProgress(n)}
              onClose={() => console.log("go back tologin")}
            />
        </View>

  </View>
}

export default RegisterScreen;
