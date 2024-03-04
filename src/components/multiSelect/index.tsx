import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { useCallback, useEffect, useState } from "react";
import CustomSelect, { SelectOption, getRandomColor } from "@components/select";

import { convertHexToRGBA } from "@components/index";


const RoundButton = styled.View<{
    color: string;
}>`
    flex: 1;
    margin: 15%;
    justify-content: center;
    align-items: center;
    background-color: ${p => p.color};
`

// to centralize "-"
const LessSymbol = styled.View<{
    color: string;
}>`
    width: 30%;
    height: 3.2px;
    justify-content: center;
    align-items: center;
    background-color: ${p => p.color};
`

const CustomMultiSelect: React.FC<{
    values?: (string | number)[]; // the selected values
    onSelect: (v: (string | number)[] ) => void;
    placeholder?: string[];
    options: SelectOption[];
}> = ({values, options, placeholder = [],onSelect}) => {

    const [color, setColor] = useState(getRandomColor());
    const [values_, setValues_] = useState(values || []);

    const setSpecificValue = useCallback((i: number, newVal: any) => {
        let updated = [...values_]
        updated.splice(i, 1, newVal)
        onSelect(updated)
        setValues_(updated)
    }, [values_])

    const deleteValue = useCallback((i: number) => {
        let updated = [...values_]
        updated.splice(i, 1)
        setValues_(updated)
        onSelect(updated)
    }, [values_])

    useEffect(() => {console.log("values_",values_)}, [values_])

    return <>
    {
        values_.map((value, i) => {
            return <View 
                    style={{
                        width: "100%", 
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row"
                    }}
                    key={i}>
                <CustomSelect 
                    width="80%"
                    color={color}
                    onSelect={(v) => {
                        setSpecificValue(i, v.value)
                    }} 
                    value={value} 
                    options={options} />
                <TouchableOpacity 
                    style={{width: "20%", aspectRatio: "1/1"}}
                    onPress={() => deleteValue(i)}>
                        <RoundButton 
                            style={{borderRadius: 100}} 
                            color={convertHexToRGBA(color, 0.2)}>
                            <LessSymbol color={color}/>
                        </RoundButton>
                    </TouchableOpacity>
                </View>
            })
        }

        <CustomSelect 
            onSelect={(v) => {
                setSpecificValue(values_.length, v.value)
            }} 
            placeholder={ placeholder.length ? values_?.length ?
                placeholder[1] : placeholder[0] : ""}
            value={undefined} 
            options={options} />
    </>
}

export default CustomMultiSelect;
