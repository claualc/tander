import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { ScrollView, View } from "react-native";

import { gobalFont, responsiveValue, theme } from "@screens/theme";
import CustomDateInput from "@components/forms/components/CustomDateInput";
import CustomPhotoBatchInputs from "@components/forms/components/CustomPhotoBatchInputs";
import { CustomTextInput, CustomCodeInput } from "@components/forms/components/CustomSimpleInputs";
import { BackButtonWrapper, FormsWrapper, Title, Subtitle, Description, CenterWrapping } from "./components";

import BulletpointSelect from "@components/bulletpointSelect";
import ColorButton from "@components/colorButton";
import CustomMultiSelect from "@components/multiSelect";
import CustomSelect from "@components/select";
import { FormsInputs, FormsPage, FormsQuestion, inputTypes } from "./components/formDTOs";
import MusicInterectAsyncSelect from "@components/musicInterectAsyncSelect";
import { CustomText } from "@components/index";
import { CustomError } from "./errors";
import { LoggedUserContext, UserContextType } from "@context/user";
import FormContextProvider from "./components/context";

export const Forms: React.FC<{
    totalPagesCount: number;
    pages:  FormsPage[];
    onSend: (inputs: FormsInputs) => (Promise<void> | void);
    onNextPage?: (nextIndex: number) => void;
    onClose?: () => void;
    defaultAnswers?: any[][];
    defaultInputs?: FormsInputs;
    onSendButtonTitle?: string;
}> = ({totalPagesCount, pages, onSend, onNextPage, onClose, defaultAnswers, onSendButtonTitle="Next", defaultInputs}) => {

    const [inputs, setInputs_] = useState<FormsInputs>(defaultInputs ||  {} as { [key: string]: any});
    const [validAnswer, setValidAnswer] = useState(false);
    const [currentPageId, setCurrentPageId] = useState<number>(0);
    const [sendForms, setSendForms] = useState<boolean>(false);
    const [allFieldsRequired, setAllFieldsRequired] = useState<boolean>(pages[0].allFieldsRequired == undefined ? true : pages[0].allFieldsRequired);
    const [error, setError] = useState<string | null>(null);
    const { setLoading } = useContext(LoggedUserContext) as UserContextType;

    const setInput = useCallback((name: string, value: any) => {
        setInputs_(i => ({...i, [name]: value}))
    }, [inputs])

    useEffect(() => {
        if (defaultInputs) {
            setInputs_(defaultInputs)
        }
    }, [defaultInputs])

    useEffect(() => {
        error && setError(null)
    }, [inputs])

    const currentPage = useMemo<FormsPage>(() => {
        // let page = onChangeQuestions(
        //     inputs.phoneNumber,
        // ).pages[currentPageId]
        let page = pages[currentPageId]
        setAllFieldsRequired(
            page.allFieldsRequired == undefined ? 
            true : page.allFieldsRequired
        )
        return page
    }, [currentPageId]);

    const checkValidAnswer = useCallback((v: any, q: FormsQuestion) => {
        let isValid = q.validate ? 
            q.validate(v) : true //checkFormsInputValid
        setValidAnswer(isValid)
    }, [validAnswer])

    useEffect(() => {
        if (sendForms)
            (async () => {
                try {
                    await onSend(inputs)
                } catch(e) {
                    if (e instanceof CustomError)
                        setError(e.message)
                }
            setSendForms(false)
        })();
    }, [sendForms]);

    const disableButton = useMemo(() => {
        // all the answers of the page need to be different than null
        const fields = currentPage.questions.map(q=> q.name)
        const noNullVal = fields.map(name => inputs[name]).reduce(
        (acc, v) => {
            return acc && ( 
            v!=null && (
                (typeof v == 'string' && v!="") || typeof v != 'string'
            ) && (v.length ? true : (v.length != 0)))
        }, true)

        return !(
            (allFieldsRequired ? noNullVal : true) 
            && validAnswer
        )
    }, [currentPage, validAnswer, allFieldsRequired,inputs])

    const turnFormsPageAhead = useCallback((goAhead: boolean) => {
        const id = currentPageId;
        const nextId = goAhead ? id+1 : id-1; // go to last or next page

        if (nextId<0) {
            onClose && onClose()
        } else if (nextId==totalPagesCount) {
            setSendForms(true)
        } else {
            setCurrentPageId(nextId)
            onNextPage && onNextPage(nextId)
        }
    }, [currentPageId]);

    return <FormContextProvider>
        <ScrollView style={{width: "100%"}}>
                <BackButtonWrapper>
                    <Ionicons 
                        onPress={() => {
                            turnFormsPageAhead(false)
                        }}
                        name={"chevron-back-outline"} 
                        color={theme.main_dark}
                        size={40}
                        style={{margin:0}}
                        />
                </BackButtonWrapper>

                <FormsWrapper>
                    <View style={{marginBottom: responsiveValue("0%", "0%")}} >
                        <Title>{currentPage.title}</Title>
                        {currentPage.subtitle && 
                            <Subtitle>{currentPage.subtitle}</Subtitle>}
                    </View>
                    
                    {
                    // to list all te questions of a page
                    currentPage.questions.map(
                        (q, i) => <View key={i} style={{width: "100%"}}>
                    
                        { q.description && q.descriptionOnTop && 
                            <Description>{ q.description }</Description> }

                        <View style={{
                            justifyContent: "center",
                            alignItems: "center",
                            marginBottom: responsiveValue(gobalFont.size.default,gobalFont.size.default*1.5)}}>
                        { (q.inputType == inputTypes.TEXT) ?
                            <CustomTextInput 
                                onChange={v => {
                                    setInput(q.name, v)
                                    checkValidAnswer(v, q)
                                }}
                                placeholder={q.placeholder} 
                                value={inputs[q.name]}
                                hideText={q.hideText}
                                maxCharacters={q.maxCharacters}/>
                        : (q.inputType == inputTypes.NUMERIC) ?
                            <CustomCodeInput 
                                onChange={(v) => {
                                    setInput(q.name, v)
                                    checkValidAnswer(v, q)
                                }}
                                maxLength={q.maxCodeLength}
                                placeholder={q.placeholder} 
                                value={inputs[q.name]}/> 
                        : (q.inputType == inputTypes.NUMERIC_PHONE) ?
                            <CustomCodeInput 
                                onChange={v => {
                                    setInput(q.name, v)
                                    checkValidAnswer(v, q)
                                }}
                                placeholder={q.placeholder} 
                                isPhoneNumber={true}
                                value={inputs[q.name]}/> 
                        : (q.inputType == inputTypes.DATE) ?
                            <CustomDateInput 
                                onChange={v => {
                                    setInput(q.name, v)
                                    checkValidAnswer(v, q)
                                }}
                                value={inputs[q.name]}/>
                        : (q.inputType == inputTypes.SELECT) ?
                            <CustomSelect 
                                onSelect={v => {
                                    setInput(q.name, v.value)
                                    checkValidAnswer(v, q)
                                }}
                                withSearchBar={q.includeSearchBar}
                                value={inputs[q.name]}
                                placeholder={q.placeholder} 
                                title={q.placeholder}
                                options={q.options || []} />
                        : (q.inputType == inputTypes.MULTISELECT) ?
                            <CustomMultiSelect 
                                onSelect={v => {
                                    let val = [...v]
                                    setInput(q.name, v)
                                    checkValidAnswer(v, q)
                                }}
                                withSearchBar={q.includeSearchBar}
                                maxSelects={q.maxSelects}
                                values={inputs[q.name]}
                                placeholder={q.multiPlaceholder}
                                options={q.options || []} />
                        : (q.inputType == inputTypes.BULLETPOINTS_SELECT) ?
                            <BulletpointSelect 
                                onSelect={v => {
                                    setInput(q.name, v)
                                    checkValidAnswer(v, q)
                                }}
                                value={inputs[q.name]}
                                options={q.bulletPoints || []} />
                        : (q.inputType == inputTypes.PHOTO) ?
                            <CustomPhotoBatchInputs 
                                count={q.photoCount || 0}
                                onChange={v => {
                                    setInput(q.name, v)
                                    checkValidAnswer(v, q)
                                }}
                                values={inputs[q.name]} />
                        : (q.inputType == inputTypes.MUSIC_ASYNC_SELECT) ?
                            <MusicInterectAsyncSelect 
                                onSelect={v => {
                                    setInput(q.name, v.value)
                                    checkValidAnswer(v, q)
                                }}
                                value={inputs[q.name]} />
                        :  <></>
                        }
                        </View>

                        {q.description && !q.descriptionOnTop && 
                            <Description bottomDescription={true}>{q.description}</Description> }
                        </View>)
                    }

                    {error && <CustomText color={"red"} >{error}</CustomText> }
                    
                </FormsWrapper>
                <CenterWrapping>
                    <ColorButton
                        onPress={() => {
                            turnFormsPageAhead(true) 
                        }}
                        title={onSendButtonTitle}
                        disabled={disableButton}/>
                </CenterWrapping>
        </ScrollView>
    </FormContextProvider>
}