import { Text, TextInput, View } from "react-native";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";

import { theme } from "@screens/theme";
import { get2FirstDigitsYear } from "@components/utils";
import { CustomText } from "@components/index";


const StyledSingleInputText: typeof TextInput = styled.TextInput`
    width: 9%;
    border-bottom-width: 2px;
    border-bottom-color: ${p => p.theme.tertiary_dark};
    margin-top: 12px;
    font-size: 25px;
    text-align: center;
`

const SpecialCaracter = styled(Text)`
    margin-top: 12px;
    font-size: 32px;
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
        justifyContent: "space-evenly",
        alignItems: "flex-end"
    }}>
    {
        values.map((v,i) => {
            return <>
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
                </>
        })
    }
        <View style={{margin:0, justifyContent: "center", alignItems: "center"}}>
        {
            get2FirstDigitsYear(values) == null || get2FirstDigitsYear(values) == 0 ?
                <CustomText size={28}>😐</CustomText>
                : get2FirstDigitsYear(values) == 20 ?
                <CustomText size={28}>👶</CustomText>
                : get2FirstDigitsYear(values) == 19 ?
                <CustomText size={28}>🫣</CustomText>
                : <CustomText size={28}>💀</CustomText>
        }
        </View>
     
    </View> 
};

export default CustomDateInput;


