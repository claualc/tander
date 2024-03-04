import { theme } from "@screens/theme";
import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";
import styled from "styled-components/native";

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

export const CustomCodeInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void
}> = ({value, onChange, placeholder}) => {

    return <StyledInputText
        selectionColor={theme.tertiary_dark}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder || ""}
        keyboardType="numeric"
        />
};

const StyledSingleInputText: typeof TextInput = styled.TextInput`
    width: 10%;
    border-bottom-width: 2px;
    border-bottom-color: ${p => p.theme.tertiary_dark};
    margin-top: 12px;
    font-size: 25;
    text-align: center;
`

const DateTiltedBar = styled(Text)`
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
                    ? <DateTiltedBar>/</DateTiltedBar>
                    : <></> 
                }
                </>
        })
    }
    </View> 
    
};
