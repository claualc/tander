import { Component, useCallback, useEffect, useState } from "react";
import CustomSelect, { SelectOption, SelectProps } from "@components/select";
import { Button, View } from "react-native";


const CustomMultiSelect: React.FC<{
    values?: SelectOption[]; // the selected values
    onSelect: (v: string) => void;
    placeholder?: string[];
    options: SelectOption[];
}> = ({values, options, placeholder = []}) => {

    const [values_, setValues_] = useState(values || []);
    const setSpecificValue = useCallback((i: number, newVal: any) => {
        let updated = values_.length == i ? 
                [...values_, newVal] : values_.map((v, j) =>
                j == i ? v : newVal)
        console.log("updated", updated)
        setValues_(updated)
    }, [values_])

    useEffect(() => {console.log("values_",values_)}, [values_])

    return <>
    {
        values_.map((op, i) => {
            return <View 
                    style={{
                        width: "100%", 
                        backgroundColor: "yellow"
                    }}
                    key={i}>
                <CustomSelect 
                onSelect={(v) => {
                    console.log("onSelect", v, i)
                    setSpecificValue(i, v.value)
                }} 
                value={op} 
                options={options} />
                <Button 
                    title="-"
                    onPress={() => console.log("aa")}/>
                </View>
            })

        }

        <CustomSelect 
            onSelect={(v) => {
                setSpecificValue(values_.length, v.value)
            }} 
            placeholder={ placeholder.length ? values_?.length ?
                placeholder[1] : placeholder[0] : ""}
            value={null} 
            options={options} />
    </>
}

export default CustomMultiSelect;
