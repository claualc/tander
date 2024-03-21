import { DimensionValue,TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";

import { Main } from "./style";
import { theme } from "@screens/theme";
import { CustomText, convertHexToRGBA } from "@components/index";
import SelectModal from "./SelectModal";

export const getRandomColor = () => {
    const colorOptions = [theme.tertiary, theme.secondary, theme.main]
    const randomId = Math.floor(Math.random() * (colorOptions.length-1))
    return colorOptions[randomId]
}

export interface SelectProps {
    value?: string | number;
    placeholder?: string;
    options: SelectOption[];
}

export interface SelectOption {
    name: string;
    value: string | number;
}

interface Props extends SelectProps {
    width?: string;
    onSelect: (v: SelectOption) => void; // v is the valye of the key of the item
    title?: string;
    color?: string;
}

const CustomSelect: React.FC<Props> = ({
    options, placeholder, width, onSelect, value, title, color}) => {

    const [color_, setColor_] = useState<string>(color || getRandomColor());
    const [showModal, setShowModal] = useState(false);
   
    const [valueName, setValueName] = useMemo<string>(() => {
        const op = options.find(op => op.value == value);
        return op ? op.name : ""
    }, [value]);

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

    <TouchableHighlight 
        onPress={() => {
            setShowModal(true)
        }}
        activeOpacity={0.6}
        underlayColor="#0000"
        style={{
            flexDirection: "row",
            width: width as DimensionValue,
            borderRadius: 100,
            overflow: "hidden"
        }}>
            <Main color={color_}>
                {
                    valueName ?
                    <CustomText color={color}>{valueName}</CustomText>
                    : <CustomText color={convertHexToRGBA(color_, 0.5)}>{ placeholder || ""}</CustomText>
                }
                <Ionicons name="chevron-down-outline" color={color} size={20}/>
            </Main>
    </TouchableHighlight> 

    </>
}

export default CustomSelect;
