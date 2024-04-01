import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { useCallback, useEffect, useMemo, useState } from "react";
import CustomSelect, { SelectOption } from "@components/select";
import { convertHexToRGBA, getRandomColor } from "../utils";

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
    values?: (string | number)[];
    onSelect: (v: (string | number)[] ) => void;
    placeholder?: string[];
    options: SelectOption[];
    maxSelects?: number;
}> = ({values=[], options, placeholder = [],onSelect, maxSelects=20}) => {

    const [color, setColor] = useState(getRandomColor());
    const [values_, setValues_] = useState<any[]>(values || []);

    useEffect(() => onSelect(values_), [values_])

    useEffect(() => console.log("values",values, "values_", values_),[values,values_])

    const setSpecificValue = useCallback((i: number, newVal: any) => {
        let updated = [...values_]
        updated[i] = newVal
        setValues_(updated)
    }, [values_])

    const deleteValue = useCallback((i: number) => {
        let updated = [...values_]
        updated.splice(i, 1)
        setValues_(updated)
    }, [values_])

    const filterOptions = useMemo(() => {
        // to filter the already selected options
        return values_?.length > 0 ? options.filter(op => !values_?.includes(op.value) ) : options
    }, [values_]);

    return <>
    {
        values_!=null && values_?.map((value, i) => {
            return value != null && <View 
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

        {
            (values_.filter(v=>v!=null).length < maxSelects) &&
                <CustomSelect 
                    onSelect={(v) => {
                        setSpecificValue(values_?.length, v.value)
                    }} 
                    color={color}
                    placeholder={ placeholder.length ? values_?.length ?
                        placeholder[1] : placeholder[0] : ""}
                    title={ placeholder.length ? values_?.length ?
                        placeholder[1] : placeholder[0] : ""}
                    value={undefined} 
                    options={filterOptions} />
        }

        
    </>
}

export default CustomMultiSelect;
