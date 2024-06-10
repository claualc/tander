import { Dimensions, Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";

import { theme, gobalFont } from "@screens/globalstyle";
import { getYear } from "@components/utils";
import { CustomText } from "@components/index";


const fontSize = gobalFont.size.dateInput
const StyledSingleInputText: typeof TextInput = styled.TextInput`
    width: ${`${fontSize*1.09}px`};
    border-bottom-width: ${`${fontSize*0.07}px`};
    border-color: ${p => p.theme.tertiary_dark};
    margin:  ${`${fontSize*0.2}px`};
    font-size:  ${`${fontSize}px`};
    text-align: center;
`

const SpecialCaracter = styled(Text)`
    margin-top: 12px;
    font-size: ${`${fontSize}px`} ;
    text-align: center;
    color: ${p => p.theme.tertiary_dark};
`

const inputDateLength = 8;
const CustomDateInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void
}> = ({value, onChange, placeholder}) => {

    const [values, setValues] = useState<any[]>(new Array(inputDateLength).fill(null))
    const inputsRefs = useRef<any>([]);
    
    useEffect(() => {
        inputsRefs.current = inputsRefs.current.slice(0, inputDateLength);
        if (value) {
            setValues(() => value.split("").map(v => v))
        }
    }, []);

    return <View style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }}>
    {
        values.map((v,i) => {
            return <View 
                    key={i}
                    style={{ flexDirection: "row" }}>
                <StyledSingleInputText
                    onKeyPress={e => {
                        const deletePressed = e.nativeEvent.key == "Backspace"
                        const currentValueEmtpy = values[i] == "" || 
                            values[i] == undefined || values[i] == null

                            if (deletePressed && currentValueEmtpy && i > 0)
                                inputsRefs.current[i-1].focus()
                    }}
                    key={i}
                    ref={(el: any) => {inputsRefs.current[i] = el}} 
                    selectionColor={theme.tertiary_dark}
                    onChangeText={(newVal: string) => {
                        const arr = values.map((v,j) => j==i ? newVal :v)
                        setValues(arr)
                        // to jumpt ot the next input
                        if (i+1 != inputDateLength && arr[i]!="") {
                            inputsRefs.current[i+1].focus()
                        } 
                        onChange(arr.reduce((acc, v) => acc+v,""))
                    }} 
                    value={values[i]}
                    placeholder={placeholder || "0"}
                    keyboardType="numeric"
                    maxLength={1}
                    />
                {
                (i % 2 == 1 && i <5) &&
                    <SpecialCaracter key={i+1000000}>/</SpecialCaracter>
                }
                </View>
        })
    }
        {
            ( getYear(values) == 0) ?
                <CustomText size={fontSize}>😐</CustomText>
                : values != null && getYear(values) >= (new Date()).getFullYear()?
                    <CustomText size={fontSize}>⁉️</CustomText>
                : values != null && getYear(values) >= (new Date()).getFullYear()-18 ?
                    <CustomText size={fontSize}>🔞</CustomText>
                    : getYear(values) >= 2000 ?
                        <CustomText size={fontSize}>👶</CustomText>
                        : getYear(values) <= 1924 ?
                            <CustomText size={fontSize}>💀</CustomText>
                           : <CustomText size={fontSize}>🫣</CustomText>
        }
     
    </View> 
};

export default CustomDateInput;


