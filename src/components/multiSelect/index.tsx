import { useCallback, useState } from "react";
import { DimensionValue, Modal, TouchableHighlight, View } from "react-native";
import CustomSelect, { SelectProps } from "@components/select";

const CustomMultiSelect: React.FC<{
    selects: SelectProps[];
    values_?: any[]; // the selected values
    onSelect: (v: string) => void;
}> = ({selects, values_}) => {

    const [values, setValues] = useState(values_ || []);

    const setSpecificValue = useCallback((i: number, value: any) => {
        const updated = values.map((v,j) => j == i ? value : v)
        setValues(updated)
    }, [values])


    return <>{
        selects.map((select, i) => <CustomSelect
                key={i}
                options={select.options}
                placeholder={select.value}
                value={values[i]}
                onSelect={(value) => console.log(value, "selected")} />)
    }</>
}

export default CustomMultiSelect;
