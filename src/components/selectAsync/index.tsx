

/*
    This input is used when the choices
    of the select component are asyncronous
*/

import CustomSelect, { SelectOption } from "@components/select"
import { SelectComponentProps } from "@components/select";
import React, { useEffect, useState } from "react";
import { convertHexToRGBA, getRandomColor } from "@components/utils";
import { Main } from "./styles";
import { CustomText } from "..";
import { Ionicons } from "@expo/vector-icons";
import SelectModal from "../select/SelectModal";

interface AsyncSelectProps {
    value?: string | number;
    placeholder?: string;
    width?: string;
    onSelect: (v: SelectOption) => void; // v is the valye of the key of the item
    title?: string;
    color?: string;
    searchOptions?: (v: string) => Promise<SelectOption[]>;
}


const CustomAsyncSelect: React.FC<AsyncSelectProps> = ({
        placeholder, width, onSelect, value, title, color , searchOptions
    }) => {

    const [options, setOptions] = useState<SelectOption[]>([]);
    const [color_, setColor_] = useState<string>(color || getRandomColor());
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        (async () => {
            if (searchOptions) {
                let opt = await searchOptions(value as string);
                setOptions(opt);
            }
        })();
    }, [])

    return <>
    { showModal && <SelectModal 
            show={showModal} 
            onSelect={(v) => {
                setShowModal(false);
                onSelect(v);
            }} 
            options={options}        
            modalTitle={title}
            />
    }

    {/* <TouchableHighlight 
        onPress={() => {
            setShowModal(true)
        }}
        activeOpacity={0.6}
        underlayColor="#0000"
        style={{
            flexDirection: "row",
            width: width as DimensionValue,
            borderRadius: 100,
            overflow: "hidden",
            marginTop: "3%"
        }}> */}
            <Main color={color_}>
                {
                    <CustomText color={convertHexToRGBA(color_, 0.5)}>{ placeholder || ""}</CustomText>
                }
                {
                    <Ionicons name="search-outline" color={color_} size={20}/>
                }
            </Main>

    </>
}

export default CustomAsyncSelect;