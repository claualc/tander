import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { theme } from '@screens/theme';
import { ProgressBar } from './components/ProgressBar';
import { BackButtonWrapper, CenterWrapping, FormsWrapper, MainWrapper, NextButton, ProgressBarWrapper, Subtitle, Title } from './style';
import { DATE, NUMERIC, Question, TEXT, questions } from './components/Questions';
import { CustomCodeInput, CustomDateInput, CustomTextInput } from './components/Inputs';


const RegisterScreen = () => {

  const [answers, setAnswers] = useState<any[]>(questions.map(p => null));
  const [value , setValue] = useState<any>(null);

  const [currentQuestionId, setCurrentQuestionId] = useState<number>(0);
  const [currentQuestion, setCurrentQuestion] = useState<Question>(questions[0])

  useEffect(() => {console.log(answers)}, [answers])

  // default go ahead
  // used to swipe between pages of the forms saving the
  // values in the state answers
  const turnFormsPageAhead = useCallback((goAhead: boolean) => {
    const id = currentQuestionId;
    const nextId = goAhead ? id+1 : id-1;
    if (nextId<0) {
      console.log("GO BACK TO LOGIN")
    } else if (nextId==questions.length) {
      console.log("REGISTRATION ENDED", answers)
    } else {
      setCurrentQuestionId(nextId);
      setCurrentQuestion(questions[nextId])
      setValue(answers[nextId])
    }
  }, [currentQuestion, currentQuestionId, value, answers]);


  return <View style={{
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems: 'center', 
    }}>

  <ProgressBarWrapper >
    <ProgressBar percentage={(1-(currentQuestionId+1)/questions.length)*100}></ProgressBar>
  </ProgressBarWrapper>

  <MainWrapper>
    <BackButtonWrapper>
        <Ionicons 
              onPress={() => {
                console.log("Pressed")
                turnFormsPageAhead(false)
              }}
              name={"chevron-back-outline"} 
              color={theme.main_dark}
              size={40}
              />
    </BackButtonWrapper>

    <FormsWrapper>
        <Title>{currentQuestion.title}</Title>
        <Subtitle>{currentQuestion.subtitle}</Subtitle>
        {
          (currentQuestion.inputType == TEXT) ?
            <CustomTextInput 
              onChange={setValue}
              value={value}/>
          : (currentQuestion.inputType == NUMERIC) ?
            <CustomCodeInput 
              onChange={setValue}
              value={value}/> 
          : (currentQuestion.inputType == DATE) ?
            <CustomDateInput 
              onChange={setValue}
              value={value}/>
          : <></>
        }
        
    </FormsWrapper>
    <CenterWrapping>
          <NextButton
            onPress={() =>{
              const ans = answers.map((v, id) => id == currentQuestionId ? value : v)
              setAnswers(ans)
              turnFormsPageAhead(true) 
            }}
            title={"Avanti"}/>
    </CenterWrapping>
  </MainWrapper>
  </View>
}

export default RegisterScreen;
