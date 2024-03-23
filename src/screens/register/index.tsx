import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { theme } from '@screens/theme';
import ColorButton from '@components/colorButton';

import { ProgressBar } from './components/ProgressBar';
import { BackButtonWrapper, CenterWrapping, Description, FormsWrapper, MainWrapper, ProgressBarWrapper, Subtitle, Title } from './style';
import { BULLETPOINTS_SELECT, DATE, MULTISELECT, NUMERIC, NUMERIC_PHONE, PHOTO, Page, Question, SELECT, TEXT, setQuestions } from './components/Questions';
import CustomPhotoBatchInputs from "./components/CustomPhotoBatchInputs";
import CustomSelect from '@components/select';
import CustomMultiSelect from '@components/multiSelect';
import BulletpointSelect from '@components/bulletpointSelect';
import CustomDateInput from './components/CustomDateInput';
import { CustomTextInput, CustomCodeInput } from './components/CustomSimpleInputs';

const totalQuestionCount: number = setQuestions().length;

const RegisterScreen = () => {

  const [answers, setAnswers] = useState<any[][]>([]);

  const [validAnswer, setValidAnswer] = useState(false);

  // the values of the answers of the current load page
  // they will be shown in the input
  const [values , setValues] = useState<any[]>(new Array(setQuestions()[0].questions.length).fill(null));
    
  const setCurrentValues = useCallback((id: number, newVal: any) => {
    // arrays r compared by reference not by value
    let newVals = values.map(v => v) // copy object to new referene
    newVals[id] = newVal
    
    console.log( values,"->",newVals)
    console.log("newVal", newVal, "id", id)
    setValues(newVals)
  }, [values])

  const checkValidAnswer = useCallback((v: any, q: Question) => {
    setValidAnswer(
      q.validate ? q.validate(v) : v!=null )
  }, [validAnswer])

  const [currentPageId, setCurrentPageId] = useState<number>(0);

  const currentPage = useMemo<Page>(() => {
    let actualValues = answers[currentPageId]
    let page = setQuestions(
      answers[0] ? answers[0][0] : null
    )[currentPageId]

    setValues( !actualValues ?
      new Array(page.questions.length).fill(null) : actualValues)
    return page
  }, [currentPageId]);


  const disableButton = useMemo(() => {
    // all the answers of the page need to be different than null
    const noNullVal = values.reduce(
      (acc, v) => {
        return acc && ( 
          v!=null && v!="" && (v.length ? true : (v.length != 0)))
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
      console.log("REGISTRATION ENDED", answers)
    } else {
      setCurrentPageId(nextId)
    }
  }, [currentPage, currentPageId, values, answers]);

  const [count, setCount] = useState(0)

  // useEffect(() => console.log("answers", answers), [answers])

  return <View style={{
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems: 'center', 
  }}>

  <ProgressBarWrapper >
    <ProgressBar percentage={(1-(currentPageId+1)/currentPage.questions.length)*100}></ProgressBar>
  </ProgressBarWrapper>

  <MainWrapper>
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
            (q, i) => <>
          
            { q.description && q.descriptionOnTop && 
                <Description>{q.description}</Description> }

            <View style={{width: "100%", marginBottom: "7%"}}>
              { (q.inputType == TEXT) ?
                <CustomTextInput 
                  onChange={v => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  placeholder={q.placeholder} 
                  value={values[i]}/>
              : (q.inputType == NUMERIC) ?
                <CustomCodeInput 
                  onChange={(v) => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  maxLength={q.maxCodeLength}
                  placeholder={q.placeholder} 
                  value={values[i]}/> 
              : (q.inputType == NUMERIC_PHONE) ?
                <CustomCodeInput 
                  onChange={v => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  placeholder={q.placeholder} 
                  isPhoneNumber={true}
                  value={values[i]}/> 
              : (q.inputType == DATE) ?
                <CustomDateInput 
                  onChange={v => {
                    setCurrentValues(i,v)
                    checkValidAnswer(v, q)
                  }}
                  value={values[i]}/>
              : (q.inputType == SELECT) ?
                <CustomSelect 
                  onSelect={v => {
                    setCurrentValues(i,v.value)
                    checkValidAnswer(v, q)
                  }}
                  value={values[i]}
                  placeholder={q.placeholder} 
                  title={q.placeholder}
                  options={q.options || []} />
              : (q.inputType == MULTISELECT) ?
                <CustomMultiSelect 
                  onSelect={v => {
                    console.log("\n\nonChange", v)
                    setCurrentValues(i, v)
                    checkValidAnswer(v, q)
                  }}
                  values={values[i]}
                  placeholder={q.multiPlaceholder}
                  options={q.options || []} />
              : (q.inputType == BULLETPOINTS_SELECT) ?
                <BulletpointSelect 
                  onSelect={v => {
                    setCurrentValues(i, v)
                    checkValidAnswer(v, q)
                  }}
                  value={values[i]}
                  options={q.bulletPoints || []} />
              : (q.inputType == PHOTO) ?
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
            </>)
          }
        
    </FormsWrapper>
    <CenterWrapping>
      <ColorButton
        onPress={() =>{
          let ans = [...answers]
          ans.splice(currentPageId, 1, values)
          setAnswers(ans)
          turnFormsPageAhead(true) 
        }}
        title={"Next"}
        disabled={disableButton}/>
    </CenterWrapping>
  </MainWrapper>
  </View>
}

export default RegisterScreen;
