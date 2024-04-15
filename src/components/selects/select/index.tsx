import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import { CustomText } from "@components/index";
import SelectModal from "./Modal";
import { convertHexToRGBA, getRandomColor } from "@components/utils";
import { CustomSelectTouchable } from "./style";
import { MusicInterestDTO } from "@serv/albumService";
import { View } from "react-native";
import { responsiveValue } from "@screens/global.style";

export interface SelectLogicalProps {
    value?: string | number;
    placeholder?: string;
    options: SelectOption[];
}

export interface SelectOption {
    name: string;
    value: string | number | MusicInterestDTO;
    imageUrl?: string;
    description?: string;
}

export interface SelectComponentProps extends SelectLogicalProps {
    width?: string;
    onSelect: (v: SelectOption) => void; // v is the valye of the key of the item
    title?: string;
    color?: string;
    withSearchBar?: boolean;
}

/* the value is they key in the object
   while the valueName is the visual name gave 
   to that key in the modal

   const options = {
      [value]: "<valueName> | <name>"
   }
*/
const CustomSelect: React.FC<SelectComponentProps> = ({
    options, placeholder, width, onSelect, value, title, color, withSearchBar=false }) => {

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
            withSearchBar={withSearchBar}
            options={options}        
            modalTitle={title}
            color={color_}
            />
    }

    <CustomSelectTouchable
        onPress={() => {
            setShowModal(true)
        }}
        width={width}
        color={color_}>
            <View style={{ flex: responsiveValue(11,20) }}>
            {
                valueName ?
                <CustomText color={color_}>{valueName}</CustomText>
                : <CustomText color={convertHexToRGBA(color_, 0.5)}>{ placeholder || ""}</CustomText>
            }
            </View>
            <View  style={{ flex: 1 }}>
                <Ionicons name="chevron-down-outline" color={color_} size={20}/>
            </View>
    </CustomSelectTouchable>

    </>
}

export default CustomSelect;
