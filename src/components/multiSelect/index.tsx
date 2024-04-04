import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { useCallback, useEffect, useMemo, useState } from "react";
import CustomSelect, { SelectOption } from "@components/select";
import { convertHexToRGBA, getRandomColor } from "../utils";

const RoundButton = styled.View<{
    color: string;
    width: string;
}>`
    justify-content: center;
    align-items: center;
    background-color: ${p => p.color};
    width: ${p => p.width};
    aspect-ratio: 1;
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
    withSearchBar?: boolean;
}> = ({values=[], options, placeholder = [],onSelect, maxSelects=20, withSearchBar= false}) => {

    const [color, setColor] = useState(getRandomColor());

    const setSpecificValue = useCallback((i: number, newVal: any) => {
        let updated = values ? [...values] : []
        updated.splice(i, 1,newVal)
        onSelect(updated)
    }, [values])

    const deleteValue = useCallback((i: number) => {
        let updated = values ? [...values] : []
        updated.splice(i, 1)
        onSelect(updated)
    }, [values])

    const filterOptions = useMemo(() => {
        // to filter the already selected options
        return values?.length > 0 ? options.filter(op => !values?.includes(op.value as (string | number)) ) : options
    }, [values]);

    return <>
    {
        values!=null && values?.map((value, i) => {
            return value != null && <View 
                    style={{
                        width: "100%", 
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                    }}
                    key={i}>
                <CustomSelect 
                    width="85%"
                    color={color}
                    onSelect={(v) => {
                        setSpecificValue(i, v.value)
                    }} 
                    value={value} 
                    options={options} />
                <TouchableOpacity 
                    style={{flexDirection: "row",alignItems: "center", justifyContent: "flex-end",width: "15%", aspectRatio: "1/1"}}
                    onPress={() => deleteValue(i)}>
                        <RoundButton 
                            style={{borderRadius: 100}} 
                            width="90%"
                            color={convertHexToRGBA(color, 0.2)}>
                            <LessSymbol color={color}/>
                        </RoundButton>
                    </TouchableOpacity>
                </View>
            })
        }

        {
            (!values || (values && values.filter(v=>v!=null).length < maxSelects)) &&
                <View style={{marginTop: "2%"}}>
                <CustomSelect 
                    onSelect={(v) => {
                        setSpecificValue(values?.length, v.value)
                    }} 
                    withSearchBar={withSearchBar}
                    color={color}
                    placeholder={ placeholder.length ? values?.length ?
                        placeholder[1] : placeholder[0] : ""}
                    title={ placeholder.length ? values?.length ?
                        placeholder[1] : placeholder[0] : ""}
                    value={undefined} 
                    options={filterOptions} />
                </View>
        }

        
    </>
}

export default CustomMultiSelect;
