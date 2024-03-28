import { DimensionValue,TouchableHighlight } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";

import { Main } from "./style";
import { theme } from "@screens/theme";
import { CustomText } from "@components/index";
import SelectModal from "./SelectModal";
import { convertHexToRGBA } from "../utils";

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


/* the value is they key in the object
   while the valueName is the visual name gave 
   to that key in the modal

   const options = {
      [value]: "<valueName> | <name>"
   }
*/
const CustomSelect: React.FC<Props> = ({
    options, placeholder, width, onSelect, value, title, color }) => {

    const [color_, setColor_] = useState<string>(color || getRandomColor());
    const [showModal, setShowModal] = useState(false);
    const [valueName, setValueName] = useState<string>("");

    useEffect(() => {
        const op = options.find(op => op.value == value);
        setValueName(op ? op.name : "")
    }, [value])

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
            overflow: "hidden",
            marginTop: "3%"
        }}>
            <Main color={color_}>
                {
                    valueName ?
                    <CustomText color={color_}>{valueName}</CustomText>
                    : <CustomText color={convertHexToRGBA(color_, 0.5)}>{ placeholder || ""}</CustomText>
                }
                <Ionicons name="chevron-down-outline" color={color_} size={20}/>
            </Main>
    </TouchableHighlight> 

    </>
}

export default CustomSelect;
