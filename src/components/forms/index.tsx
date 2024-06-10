import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback, useMemo, useEffect, useContext } from "react";
import { ScrollView, View } from "react-native";

import { DEV_DIM, gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import CustomDateInput from "@components/forms/components/CustomDateInput";
import CustomPhotoBatchInputs from "@components/forms/components/CustomPhotoBatchInputs";
import { CustomTextInput, CustomCodeInput } from "@components/forms/components/CustomSimpleInputs";
import { BackButtonWrapper, FormsWrapper, Title, Subtitle, Description, CenterWrapping } from "./components";

import BulletpointSelect from "@components/selects/bulletpointSelect";
import ColorButton from "@components/colorButton";
import CustomMultiSelect from "@components/selects/multiSelect";
import CustomSelect from "@components/selects/select";
import { FormsInputs, FormsPage, FormsQuestion, inputTypes } from "./components/formDTOs";
import MusicInterectAsyncSelect from "@components/selects/musicInterectAsyncSelect";
import { CustomText, ScrollDownAlarm } from "@components/index";
import { CustomError } from "./errors";

export const Forms: React.FC<{
    totalPagesCount: number;
    pages:  FormsPage[];
    onSend: (inputs: FormsInputs) => (Promise<void> | void);
    onNextPage?: (nextIndex: number) => void;
    onClose?: () => void;
    defaultInputs?: FormsInputs;
    onSendButtonTitle?: string;
}> = ({totalPagesCount, pages, onSend, onNextPage, onClose, onSendButtonTitle="Next", defaultInputs}) => {

    const [inputs, setInputs_] = useState<FormsInputs>(defaultInputs ||  {} as { [key: string]: any});
    const [validAnswer, setValidAnswer] = useState(false);
    const [currentPageId, setCurrentPageId] = useState<number>(0);
    const [sendForms, setSendForms] = useState<boolean>(false);
    const [allFieldsRequired, setAllFieldsRequired] = useState<boolean>(pages[0].allFieldsRequired == undefined ? true : pages[0].allFieldsRequired);
    const [error, setError] = useState<string | null>(null);
  const [ localButtonLoading, setLocalButtonLoading ] = useState<boolean>(false);


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

    const checkValidAnswer = useCallback(async (v: any, q: FormsQuestion) => {
        let isValid = q.validate ? 
            await q.validate(v) : true //checkFormsInputValid
        setValidAnswer(isValid)
    }, [validAnswer])

    useEffect(() => {
        if (sendForms)
            (async () => {
                try {
                    setLocalButtonLoading(true)
                    await onSend(inputs)
                } catch(e) {
                    if (e instanceof CustomError)
                        setError(e.message)
                }
            setLocalButtonLoading(false)
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

    const turnFormsPageAhead = useCallback(async (goAhead: boolean) => {
        setLocalButtonLoading(true)
        const id = currentPageId;
        const nextId = goAhead ? id+1 : id-1; // go to last or next page

        try {
            let validToSend: Promise<any>[] = [];
            if (nextId>=0)
                validToSend = currentPage.questions.map(
                    async ({validateOnSend, name})=> validateOnSend && await validateOnSend(inputs[name])
                )

            if (nextId<0) {
                onClose && onClose()
                setLocalButtonLoading(false)
            } else if (nextId==totalPagesCount) {
                await Promise.all(validToSend)
                setSendForms(true)
            } else {
                await Promise.all(validToSend)
                setLocalButtonLoading(false)
                setCurrentPageId(nextId)
                onNextPage && onNextPage(nextId)
            }
        } catch (e) {
            if (e instanceof CustomError)
                setError(e.message)
                setLocalButtonLoading(false)
        }
    }, [currentPageId,inputs]);

    const [showScrollIndication, setScrollIndication] = useState(false);

    return <>
        <ScrollDownAlarm 
            bottom={responsiveValue("12%","12%","7%")}
            left={responsiveValue("86%","86%","170%")}
            show={showScrollIndication}/>

        <ScrollView 
                indicatorStyle="black"
                showsVerticalScrollIndicator={true}
                style={{width: "100%"}}
                onContentSizeChange={(width, heigth) => {
                    setScrollIndication(heigth/DEV_DIM.height >= 0.99)
                }}>

        
                <BackButtonWrapper>
                    <Ionicons 
                        onPress={() => {
                            turnFormsPageAhead(false)
                        }}
                        name={"chevron-back-outline"} 
                        color={theme.main_dark}
                        size={responsiveValue(40,40,60)}
                        style={{margin:0}}
                        />
                </BackButtonWrapper>
            
                <FormsWrapper>
                    <View style={{marginBottom: responsiveValue("0%", "0%","0%")}} >
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
                            marginBottom: responsiveValue(gobalFont.size.default,gobalFont.size.default*1.5,gobalFont.size.default*1.5)}}>
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
                        loading={localButtonLoading}
                        onPress={() => {
                            turnFormsPageAhead(true) 
                        }}
                        title={onSendButtonTitle}
                        disabled={disableButton}/>
                </CenterWrapping>
            </ScrollView>
        </>
}