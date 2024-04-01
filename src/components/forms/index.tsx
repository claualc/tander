import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useMemo, useEffect } from "react";
import { View } from "react-native";

import { theme } from "@screens/theme";
import CustomDateInput from "@components/forms/components/CustomDateInput";
import CustomPhotoBatchInputs from "@components/forms/components/CustomPhotoBatchInputs";
import { CustomTextInput, CustomCodeInput } from "@components/forms/components/CustomSimpleInputs";
import { BackButtonWrapper, FormsWrapper, Title, Subtitle, Description, CenterWrapping } from "./components";

import BulletpointSelect from "@components/bulletpointSelect";
import ColorButton from "@components/colorButton";
import CustomMultiSelect from "@components/multiSelect";
import CustomSelect from "@components/select";
import { FormsPage, FormsQuestion, inputTypes } from "./components/formDTOs";
import CustomAsyncSelect from "@components/selectAsync";


export const checkFormsInputValid = (v: any, q: FormsQuestion) => {
    let isValid = q.validate ? q.validate(v) : v!=null
    return isValid;
}

export const Forms: React.FC<{
    totalPagesCount: number;
    pages:  FormsPage[];
    onSend: (inputs: any[][]) => Promise<void>;
    onNextPage?: (nextIndex: number) => void;
    onClose?: () => void;
    defaultAnswers?: any[][];
    //onInitPage?: (p: FormsPage) => {}; // custom behavour that can be added when a certain type of pages inits
}> = ({totalPagesCount, pages, onSend, onNextPage, onClose, defaultAnswers}) => {

    const [answers, setAnswers_] = useState<any[][]>([]);
    const [validAnswer, setValidAnswer] = useState(false);
    const [currentPageId, setCurrentPageId] = useState<number>(0);
    const [sendForms, setSendForms] = useState<boolean>(false);

    // the values of the answers of the current load page
    // they will be shown in the input
    const [values , setValues] = useState<any[]>(new Array(pages[0].questions.length).fill(null));

    useEffect(() => {
        if (defaultAnswers) {
            setAnswers([...defaultAnswers])
            setValues([...defaultAnswers[0]])
        }
    }, [defaultAnswers])


    const setCurrentValues = useCallback((id: number, newVal: any) => {
        // arrays r compared by reference not by value
        let newVals = values.map(v => v) // copy object to new referene
        newVals[id] = newVal

        setValues(newVals)
    }, [values])

    const currentPage = useMemo<FormsPage>(() => {
        let actualValues = answers[currentPageId]

        const phoneNumber = answers[0] ? answers[0][0] : null;
        // let page = onChangeQuestions(
        //     phoneNumber, // phoneNumber
        // ).pages[currentPageId]
        let page = pages[currentPageId]

        // onInitPage
        // if (page.id == PageId.PHONE_NUM_CODE_VERIF) {
        // // function to get a random number of 4 digits
        // let minm = 1000; 
        // let maxm = 9999; 
        // const code = Math.floor(Math .random() * (maxm - minm + 1)) + minm;
        // // setConfirmationCode(code)
        // // FCMService.schedulePushNotification(
        // //   "Tander",
        // //   `${code} is your confirmation code!`,
        // //   {})
        // // console.log(code)
        // }

        setValues( !actualValues ?
            new Array(page.questions.length).fill(null) : actualValues)

        return page
    }, [currentPageId]);

    const checkValidAnswer = useCallback((v: any, q: FormsQuestion) => {
        let isValid = checkFormsInputValid(v,q)
        // specifics for pages
        // question 1: confirmation of phone number
        // if (q.id == 1) {
        //   isValid = isValid && confirmationCode == v
        // }
        setValidAnswer(isValid)
    }, [validAnswer])

    useEffect(() => {
        if (sendForms)
            (async () =>  await onSend(answers))();
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
            onClose && onClose()
        } else if (nextId==totalPagesCount) {
            setSendForms(true)
        } else {
            setCurrentPageId(nextId)
            onNextPage && onNextPage(nextId)
        }
    }, [currentPageId, answers]);

    const setAnswers = useCallback((v: typeof values) => {
        let ans = [...answers]
        ans[currentPageId] = v
        setAnswers_(ans)
    },[answers, currentPageId]);

    return <>
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
                            value={values[i]}
                            maxCharacters={q.maxCharacters}/>
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
                    : (q.inputType == inputTypes.ASYNC_SELECT) ?
                        <CustomAsyncSelect 
                            onSelect={v => {
                                setCurrentValues(i,v.value)
                                checkValidAnswer(v, q)
                            }}
                            value={values[i]}
                            placeholder={q.placeholder} 
                            title={q.placeholder}
                            searchOptions={q.searchOptions}/>
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
    </>
}