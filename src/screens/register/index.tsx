import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

import { theme } from '@screens/theme';
import { ProgressBar } from './components/ProgressBar';
import { BackButtonWrapper, CenterWrapping, Description, FormsWrapper, MainWrapper, NextButton, ProgressBarWrapper, Subtitle, Title } from './style';
import { DATE, MULTISELECT, NUMERIC, Question, SELECT, TEXT, questions } from './components/Questions';
import { CustomCodeInput, CustomDateInput, CustomTextInput } from './components/Inputs';
import CustomSelect from '@components/select';
import CustomMultiSelect from '@components/multiSelect';


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


  useEffect(() => console.log(currentQuestion.description && !currentQuestion.descriptionOnTop), [])


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

        {currentQuestion.description && currentQuestion.descriptionOnTop && 
          <Description>{currentQuestion.description}</Description>
        }
       
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
          : (currentQuestion.inputType == SELECT) ?
              <CustomSelect 
                onSelect={setValue}
                value={value}
                placeholder={"sdjslkdj"} 
                options={ [{
                  value: 1,
                  name: "d"
                },
                {
                  value: 2,
                  name: "e"
                },
                {
                  value: 3,
                  name: "f"
                }]} />
          : (currentQuestion.inputType == MULTISELECT) ?
              <CustomMultiSelect 
                  values_={value}
                  onSelect={(v) => console.log("aaaaaaa")}
                  selects={[
                    {
                      value: "",
                      placeholder: "placeholder 1",
                      options: [{
                        value: 1,
                        name: "a"
                      },
                      {
                        value: 2,
                        name: "b"
                      },
                      {
                        value: 3,
                        name: "2"
                      }]
                    },
                    {
                      value: "",
                      placeholder: "placeholder 2",
                      options: [{
                        value: 1,
                        name: "d"
                      },
                      {
                        value: 2,
                        name: "e"
                      },
                      {
                        value: 3,
                        name: "f"
                      }]
                    }
                  ]}/>
          :  <></>
        }

        { 
          currentQuestion.description && !currentQuestion.descriptionOnTop && 
          <Description>{currentQuestion.description}</Description>
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
