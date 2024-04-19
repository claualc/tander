import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

import { useCallback, useMemo, useState } from "react";
import CustomSelect, { SelectOption } from "@components/selects/select";
import { convertHexToRGBA, getRandomColor } from "../../utils";
import { gobalFont, responsiveValue } from "@screens/globalstyle";

const RoundButton = styled.View<{
    color: string;
}>`
    justify-content: center;
    align-items: center;
    background-color: ${p => p.color};
    aspect-ratio: 1;
    border-radius: 100px;
    height: ${`${gobalFont.size.default*2.1}px`};
`

// to centralize "-"
const LessSymbol = styled.View<{
    color: string;
}>`
    width: 40%;
    aspect-ratio: 6/1;
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
}> = ({values, options, placeholder = [],onSelect, maxSelects=20, withSearchBar= false}) => {

    const [color, setColor] = useState(getRandomColor());

    const setSpecificValue = useCallback((i: number, newVal: any, values: any[]) => {
        let updated = [...values]
        updated[i] = newVal
        onSelect(updated)
    }, [])

    const deleteValue = useCallback((i: number,  values: any[]) => {
        let updated = [...values]
        updated.splice(i, 1)
        onSelect(updated)
    }, [])

    const filterOptions = useMemo(() => {
        // to filter the already selected options
        if (values)
            return values?.length > 0 ? options.filter(op => !values?.includes(op.value as (string | number)) ) : options
        else 
            return options
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
                        marginBottom: gobalFont.size.default*0.4
                    }}
                    key={i}>
                <View style={{
                    flex: 14,
                    height: "100%"}}>
                <CustomSelect 
                    color={color}
                    onSelect={(v) => {
                        setSpecificValue(i, v.value, values)
                    }} 
                    value={value} 
                    options={options} />
                </View>
                <View style={{
                    flex: responsiveValue(2.4, 1.2, 1.8),
                        height: "100%",alignItems: "flex-end"}}>
                        <TouchableOpacity 
                            style={{justifyContent: "flex-end", flex:1}}
                            onPress={() => deleteValue(i, values)}>
                                <RoundButton 
                                    color={convertHexToRGBA(color, 0.2)}>
                                    <LessSymbol color={color}/>
                                </RoundButton>
                        </TouchableOpacity>
                </View>
                </View>
            })
        }

        {
            (!values || (values && values.filter(v=>v!=null).length < maxSelects)) &&
                <View>
                <CustomSelect 
                    onSelect={(v) => {
                        if (values && values.length)
                            setSpecificValue(values?.length, v.value, values)
                        else 
                            setSpecificValue(0, v.value, [])
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
