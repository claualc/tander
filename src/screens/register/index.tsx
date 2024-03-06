import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { theme } from '@screens/theme';
import ColorButton from '@components/colorButton';

import { ProgressBar } from './components/ProgressBar';
import { BackButtonWrapper, CenterWrapping, Description, FormsWrapper, MainWrapper, ProgressBarWrapper, Subtitle, Title } from './style';
import { BULLETPOINTS_SELECT, DATE, MULTISELECT, NUMERIC, PHOTO, Page, SELECT, TEXT, questions } from './components/Questions';
import { CustomCodeInput, CustomDateInput, CustomPhotoBatchInputs, CustomTextInput } from './components/Inputs';
import CustomSelect from '@components/select';
import CustomMultiSelect from '@components/multiSelect';
import BulletpointSelect from '@components/bulletpointSelect';

const RegisterScreen = () => {

  const [answers, setAnswers] = useState<any[][]>([]);

  // the values of the answers of the current load page
  // they will be shown in the input
  const [values , setValues] = useState<any[]>(new Array(questions[0].questions.length).fill(null));
  const setCurrentValues = useCallback((id: number, newVal: any) => {
    // arrays r compared by reference not by value
    const newVals = values.map((v, j) => id == j ? newVal : v) 
    setValues(newVals)
  }, [values])

  const [currentPageId, setCurrentPageId] = useState<number>(0);

  const currentPage = useMemo<Page>(() => {
    return questions[currentPageId]
  }, [currentPageId]);

  const disableButton = useMemo(() => {
    return values.reduce(
    (acc, v) => {
      console.log(v!=undefined, acc, "v", v)
      return acc && (
        v == undefined || v==null || v==""
      )}, true)
  }, [values])

  const turnFormsPageAhead = useCallback((goAhead: boolean) => {
    // default go ahead
    // used to swipe between pages of the forms saving the
    // values in the state answers
    const id = currentPageId;
    const nextId = goAhead ? id+1 : id-1;

    if (nextId<0) {
      console.log("GO BACK TO LOGIN")
    } else if (nextId==questions.length) {
      console.log("REGISTRATION ENDED", answers)
    } else {
      setCurrentPageId(nextId)

      let nextVals = answers[nextId]
      setValues( !nextVals ?
        new Array(questions[nextId].questions.length).fill(null) : nextVals)
    }
  }, [currentPageId, values, answers]);

  useEffect(() => console.log("values", values), [values])
  useEffect(() => console.log("answers", answers), [answers])

  return <View style={{
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems: 'center', 
  }}>

  <ProgressBarWrapper >
    <ProgressBar percentage={(1-(currentPageId+1)/questions.length)*100}></ProgressBar>
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
                  onChange={v => setCurrentValues(i,v)}
                  placeholder={q.placeholder} 
                  value={values[i]}/>
              : (q.inputType == NUMERIC) ?
                <CustomCodeInput 
                  onChange={v => setCurrentValues(i,v)}
                  placeholder={q.placeholder} 
                  value={values[i]}/> 
              : (q.inputType == DATE) ?
                <CustomDateInput 
                  onChange={v => setCurrentValues(i,v)}
                  value={values[i]}/>
              : (q.inputType == SELECT) ?
                <CustomSelect 
                  onSelect={v => setCurrentValues(i,v.value)}
                  value={values[i]}
                  placeholder={q.placeholder} 
                  title={q.placeholder}
                  options={q.options || []} />
              : (q.inputType == MULTISELECT) ?
                <CustomMultiSelect 
                  onSelect={v => setCurrentValues(i, v)}
                  values={values[i]}
                  placeholder={q.multiPlaceholder}
                  options={q.options || []} />
              : (q.inputType == BULLETPOINTS_SELECT) ?
                <BulletpointSelect 
                  onSelect={v => setCurrentValues(i, v)}
                  value={values[i]}
                  options={q.bulletPoints || []} />
              : (q.inputType == PHOTO) ?
                <CustomPhotoBatchInputs 
                  count={q.photoCount || 0}
                  onChange={v => setCurrentValues(i, v)}
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
