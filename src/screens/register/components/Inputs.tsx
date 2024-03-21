import { Dimensions, Image, ScrollView, Text, TextInput, TouchableHighlight, View } from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";

import { theme } from "@screens/theme";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';

const StyledInputText = styled.TextInput`
    width: 100%;
    border-bottom-width: 1px;
    border-bottom-color: ${p => p.theme.tertiary_dark};
    margin-top: 12px;
    font-size: 18;
`

export const CustomTextInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void
}> = ({value, onChange, placeholder}) => {

    return <StyledInputText
        selectionColor={theme.tertiary_dark}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder || ""}
        />
};

const StyledSingleCodeInput: typeof TextInput = styled.TextInput`
    width: 7%;
    border-bottom-width: 2px;
    border-bottom-color: ${p => p.theme.tertiary_dark};
    margin-top: 12px;
    font-size: 25px;
    text-align: center;
`

const SpecialCodeInputCaracter = styled(Text)`
    margin-top: 12px;
    font-size: 26px;
    text-align: center;
    color: ${p => p.theme.tertiary_dark};
`

export const cellphoneMask = (value?: string) => {
    return value && value?.length ?
    value?.length > 8 ?
    `+${value?.substring(0,2) || ""} ${value?.substring(2,5) || ""} ${value?.substring(5,8) || ""} ${value?.substring(8) || ""}`
        : value?.length > 5 ?
        `+${value?.substring(0,2) || ""} ${value?.substring(2,5) || ""} ${value?.substring(5) || ""}`
            : value?.length > 2 ?
                `+${value?.substring(0,2) || ""} ${value?.substring(2) || ""}`
                : `+${value}` : ""
}

export const CustomCodeInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    isPhoneNumber?: boolean;
    maxLength?: number;
}> = ({value, onChange, placeholder, isPhoneNumber = false, maxLength = 10000}) => {

    return <StyledInputText
        selectionColor={theme.tertiary_dark}
        onChangeText={(v: string) => {
            onChange(v.replace(/[^0-9]/g, "").toString()) }}
        value={isPhoneNumber ? cellphoneMask(value) : value}
        placeholder={placeholder || ""}
        maxLength={ isPhoneNumber ? 16 : maxLength}
        keyboardType="numeric" />
};

const StyledSingleInputText: typeof TextInput = styled.TextInput`
    width: 10%;
    border-bottom-width: 2px;
    border-bottom-color: ${p => p.theme.tertiary_dark};
    margin-top: 12px;
    font-size: 25;
    text-align: center;
`

const SpecialCaracter = styled(Text)`
    margin-top: 12px;
    font-size: 32;
    text-align: center;
    color: ${p => p.theme.tertiary_dark};
`

export const CustomDateInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void
}> = ({value, onChange, placeholder}) => {

    const [values, setValues] = useState<any[]>(new Array(6).fill(null))
    // to detect the last input focus
    const [onLastInput, setOnLastInput] = useState<boolean>(false) 
    const inputsRefs = useRef<any>([]);
    
    useEffect(() => {
        inputsRefs.current = inputsRefs.current.slice(0, 6);
        if (value) {
            setValues(() => value.split("").map(v => v))
        }
    }, []);

    useEffect(() => {
        // to save the final value
        const day = values[0]+values[1]
        const month = values[2]+values[3]
        const year = values[4]+values[5]
        console.log(values)
        if(onLastInput && day > 0 && month>0 && year>0) {
            const finalValue = values.reduce((acc, v) => acc+v, "")
            onChange(finalValue)
        }
    },[values, onLastInput])

    return <View style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "flex-start"
              
    }}>
    {
        values.map((v,i) => {
            return <>
                <StyledSingleInputText
                    key={i}
                    ref={(el: any) => {inputsRefs.current[i] = el}} 
                    selectionColor={theme.tertiary_dark}
                    onChangeText={(newVal: string) => {
                        const arr = values.map((v,j) => j==i ? newVal :v)
                        setValues(arr)
                        // to jumpt ot the next input
                        if (i+1 != 6 && arr[i]!="") {
                            inputsRefs.current[i+1].focus()
                        } 
                        setOnLastInput(i==5)
                    }}
                    value={values[i]}
                    placeholder={placeholder || "0"}
                    keyboardType="numeric"
                    maxLength={1}
                    />
                {
                (i % 2 == 1 && i !==5) 
                    ? <SpecialCaracter>/</SpecialCaracter>
                    : <></> 
                }
                </>
        })
    }
    </View> 
};

const PhotoFrame = styled.TouchableHighlight`
    width: 93%;
    aspect-ratio: 3/4;
    overflow: hidden;
    border-color: ${p => p.theme.tertiary_dark};
    border-width: 2.5px;
    border-style: dashed;
`;

const AddDeletePhotoButton = styled.View<{
    photoSelected?: boolean;
}>`
    width: 22%;
    aspect-ratio: 1/1;
    background-color: ${p => p.theme.light_secondary};
    position: relative;
    bottom: 14%;
    left: 76%;
    justify-content: center;
    align-items: center;
    transform: ${ p => p.photoSelected ? null : "rotate(45deg)" };
`;

export const CustomPhotoBatchInputs: React.FC<{
    values: (string | null)[];
    count: number; // number of inputs to render
    onChange: (v: (string)[]) => void
}> = ({values, onChange, count}) => {

    const [imgs_, setImgs_] = useState<(string | null)[]>(() => {
        let completeArray = values ||  [];
        completeArray.splice( completeArray.length, count- completeArray.length, null)  
        console.log(completeArray)
        return completeArray  
    });

    const setSpecificImg = useCallback((i: number, newVal: string) => {
        let updated = [...imgs_]
        console.log("i", i)
        updated.splice(i, 1, newVal)
        onChange(updated.map(v => (v || "")))
        setImgs_(updated)
    }, [imgs_])

    const pickImage = useCallback(async (i: number) => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
        base64: true
        });


        if (result.assets?.length && result.assets[0].base64) {
            setSpecificImg(i ,result.assets[0].base64);
        }
    }, [imgs_]);

    const deleteImg = useCallback(async (i: number) => {
        // No permissions request is necessary for launching the image library
        let updated = [...imgs_]
        updated.splice(i, 1, null)
        onChange(updated.map(v => (v || "")))
        setImgs_(updated)
    }, [imgs_]);

    return <ScrollView 
            style={{
                width: "100%", 
                height: "75%", 
            }}
            contentContainerStyle={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
            }}>
            {
               [...Array(count).keys()].map(i => {
                return <View 
                        key={i}
                        style={{ 
                            width: "50%", 
                            aspectRatio: "3/4", 
                            position: "relative"}}>
                            <PhotoFrame 
                                underlayColor={"#0000"}
                                onPress={() => (imgs_[i] == null) ? pickImage(i) : deleteImg(i)}
                                style={{
                                    borderRadius: 25,
                                }}>
                                {
                                    imgs_[i] ?
                                    <Image 
                                        resizeMode="contain"
                                        style={{flex:1}} 
                                        source={{uri: `data:image/jpeg;base64,${imgs_[i]}`}}/>
                                    : <></>
                                }
                                
                            </PhotoFrame>
                        <AddDeletePhotoButton
                            style={{
                                borderRadius: 25,
                            }}
                            photoSelected={!!imgs_[i]}>
                            <Ionicons name="close-outline" size={27} color={theme.secondary}/>
                        </AddDeletePhotoButton>
                    </View>
               })
            }
    </ScrollView>
};
