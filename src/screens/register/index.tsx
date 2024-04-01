import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@screens/theme';
import ColorButton from '@components/colorButton';

import { ProgressBar } from './components/ProgressBar';
import { BackButtonWrapper, CenterWrapping, Description, FormsWrapper, ScreenView, ProgressBarWrapper, Subtitle, Title } from './style';
import { Page, PageId, Question, inputTypes, setQuestions } from './components/Questions';
import CustomPhotoBatchInputs from "./components/CustomPhotoBatchInputs";
import CustomSelect from '@components/select';
import CustomMultiSelect from '@components/multiSelect';
import BulletpointSelect from '@components/bulletpointSelect';
import CustomDateInput from './components/CustomDateInput';
import { CustomTextInput, CustomCodeInput } from './components/CustomSimpleInputs';

import * as userServices from "@serv/userService";
import { LoggedUserContext, UserContextType } from '@screens/context';
import { CreateUserDTO } from '@serv/userService/DTO';

const totalQuestionCount: number = setQuestions().page.length;

const RegisterScreen = () => {

  const { setLoading, setLoggedUser } = React.useContext(LoggedUserContext) as UserContextType;

  const [answers, setAnswers_] = useState<any[][]>([]);
  const [validAnswer, setValidAnswer] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<number>(0);
  const [confirmationCode, setConfirmationCode] = useState<number>(0);
  const [sendForms, setSendForms] = useState<boolean>(false);
  
  // the values of the answers of the current load page
  // they will be shown in the input
  const [values , setValues] = useState<any[]>(new Array(setQuestions().page[0].questions.length).fill(null));
    
  const setCurrentValues = useCallback((id: number, newVal: any) => {
    // arrays r compared by reference not by value
    let newVals = values.map(v => v) // copy object to new referene
    newVals[id] = newVal

    setValues(newVals)
  }, [values])


  const currentPage = useMemo<Page>(() => {
    let actualValues = answers[currentPageId]

    const phoneNumber = answers[0] ? answers[0][0] : null;
    let page = setQuestions(
      phoneNumber, // phoneNumber
    ).page[currentPageId]

    if (page.id == PageId.PHONE_NUM_CODE_VERIF) {
      // function to get a random number of 4 digits
      let minm = 1000; 
      let maxm = 9999; 
      const code = Math.floor(Math .random() * (maxm - minm + 1)) + minm;
      setConfirmationCode(code)
      // FCMService.schedulePushNotification(
      //   "Tander",
      //   `${code} is your confirmation code!`,
      //   {})
      // console.log(code)
    }

    setValues( !actualValues ?
      new Array(page.questions.length).fill(null) : actualValues)

    return page
  }, [currentPageId]);

  const checkValidAnswer = useCallback((v: any, q: Question) => {
    let isValid = q.validate ? q.validate(v) : v!=null

    // specifics for pages

    // question 1: confirmation of phone number
    // if (q.id == 1) {
    //   isValid = isValid && confirmationCode == v
    // }

    setValidAnswer(isValid)
  }, [validAnswer])

  useEffect(() => {
    if (sendForms) {
      
      (async () => {
        try {
          console.log("..:: RegisterScreen signup: endend")
          setLoading(true)
          const userDTO: CreateUserDTO = {
            username: answers[1][0], // username
            birth :answers[2][0], // birthdate
            phoneNumber: Number(answers[0][0]), // phonenumber
            university :answers[3][0], //university_
            course :answers[3][1], // course
            langToLearn :answers[4][1], // langTolearn
            langKnown :answers[5][0], // langKnown
            photos :answers[7][0], //photos
            team :answers[6][0], //userTeam
            country :answers[4][0] //country,
          }

          const user = await userServices.create(userDTO);
          setLoggedUser(user);
          setLoading(false)
        } catch(e) {
          console.log("..:: RegisterScreen signup ERROR: user data was collected but not registered in API")
          console.log(e)
        }
       
      })();
    }
  }, [sendForms]);


  const disableButton = useMemo(() => {
    // all the answers of the page need to be different than null
    const noNullVal = values.reduce(
      (acc, v) => {
        return acc && ( 
          v!=null && (
            (typeof v == 'string' && v!="") || typeof v != 'string'
          ) && (v.length ? true : (v.length != 0)))
      }, true)

    return !(noNullVal && validAnswer)
  }, [values, validAnswer])


  const turnFormsPageAhead = useCallback((goAhead: boolean) => {
    // default go ahead
    // used to swipe between pages of the forms saving the
    // values in the state answers
    const id = currentPageId;
    const nextId = goAhead ? id+1 : id-1;

    if (nextId<0) {
      console.log("GO BACK TO LOGIN")
    } else if (nextId==totalQuestionCount) {
      setSendForms(true)
    } else {
      setCurrentPageId(nextId)
    }

  }, [currentPageId, answers]);

  const setAnswers = useCallback((v: typeof values) => {
    let ans = [...answers]
    ans[currentPageId] = v
    setAnswers_(ans)
  },[answers, currentPageId]);

  return <View style={{
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems: 'center', 
  }}>

  <ProgressBarWrapper >
    <ProgressBar percentage={(1-(currentPageId+1)/(totalQuestionCount+1))*100}></ProgressBar>
  </ProgressBarWrapper>

  <ScreenView>
    <BackButtonWrapper>
        <Ionicons 
              onPress={() => {
                turnFormsPageAhead(false)
              }}
              name={"chevron-back-outline"} 
              color={theme.main_dark}
              size={40}
              style={{position: "relative", right: "4%"}}
              />
    </BackButtonWrapper>

    <FormsWrapper>
        <Title>{currentPage.title}</Title>
        <Subtitle>{currentPage.subtitle}</Subtitle>
        {
          // to list all te questions of a page
          currentPage.questions.map(
            (q, i) => <View key={i} style={{width: "100%"}}>
          
            { q.description && q.descriptionOnTop && 
                <Description>{ q.description }</Description> }

            <View style={{width: "100%", marginBottom: "7%"}}>
              { (q.inputType == inputTypes.TEXT) ?
                <CustomTextInput 
                  onChange={v => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  placeholder={q.placeholder} 
                  value={values[i]}/>
              : (q.inputType == inputTypes.NUMERIC) ?
                <CustomCodeInput 
                  onChange={(v) => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  maxLength={q.maxCodeLength}
                  placeholder={q.placeholder} 
                  value={values[i]}/> 
              : (q.inputType == inputTypes.NUMERIC_PHONE) ?
                <CustomCodeInput 
                  onChange={v => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  placeholder={q.placeholder} 
                  isPhoneNumber={true}
                  value={values[i]}/> 
              : (q.inputType == inputTypes.DATE) ?
                <CustomDateInput 
                  onChange={v => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  value={values[i]}/>
              : (q.inputType == inputTypes.SELECT) ?
                <CustomSelect 
                  onSelect={v => {
                    setCurrentValues(i,v.value)
                    checkValidAnswer(v, q)
                  }}
                  value={values[i]}
                  placeholder={q.placeholder} 
                  title={q.placeholder}
                  options={q.options || []} />
              : (q.inputType == inputTypes.MULTISELECT) ?
                <CustomMultiSelect 
                  onSelect={v => {
                    setCurrentValues(i, v)
                    checkValidAnswer(v, q)
                  }}
                  maxSelects={q.maxSelects}
                  values={values[i]}
                  placeholder={q.multiPlaceholder}
                  options={q.options || []} />
              : (q.inputType == inputTypes.BULLETPOINTS_SELECT) ?
                <BulletpointSelect 
                  onSelect={v => {
                    setCurrentValues(i, v)
                    checkValidAnswer(v, q)
                  }}
                  value={values[i]}
                  options={q.bulletPoints || []} />
              : (q.inputType == inputTypes.PHOTO) ?
                <CustomPhotoBatchInputs 
                  count={q.photoCount || 0}
                  onChange={v => {
                    setCurrentValues(i, v)
                    checkValidAnswer(v, q)
                  }}
                  values={values[i]} />
              :  <></>
              }
              </View>

              {q.description && !q.descriptionOnTop && 
                <Description>{q.description}</Description> }
            </View>)
          }
        
    </FormsWrapper>
    <CenterWrapping>
      <ColorButton
        onPress={() =>{
          setAnswers(values)
          turnFormsPageAhead(true) 
        }}
        title={"Next"}
        disabled={disableButton}/>
    </CenterWrapping>
  </ScreenView>
  </View>
}

export default RegisterScreen;
