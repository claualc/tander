import { useEffect, useMemo, useState } from "react";
import { DisplayOptionsCard, Item, Main } from "./style";
import { theme } from "@screens/theme";
import { CustomText } from "@components/index";
import { Ionicons } from "@expo/vector-icons";
import { DimensionValue, Modal, ScrollView, TouchableHighlight, View } from "react-native";

export const getRandomColor = () => {
    const colorOptions = [theme.tertiary, theme.secondary, theme.main]
    const randomId = Math.floor(Math.random() * (colorOptions.length-1))
    return colorOptions[randomId]
}

export interface SelectProps {
    value?: string;
    placeholder?: string;
    options: SelectOption[];
}

export interface SelectOption {
    name: string;
    value: string | number;
}

interface Props extends SelectProps {
    width?: string;
    onSelect: (v: any) => void; // v is the valye of the key of the item
    value: any; // the input value of a select is the id of the item selected
}

const CustomSelect: React.FC<Props> = ({options, placeholder, width, onSelect, value}) => {

    const [color, setColor] = useState<string>(getRandomColor());
    const [showModal, setShowModal] = useState(false);
    const [valueName, setValueName] = useMemo<string>(() => {
        const op = options.find(op => op.value == value);
        return op ? op.name : ""
    }, [value]);


    return <>
    {showModal && <Modal transparent={true} visible={showModal} style={{justifyContent: "center", alignItems: "center"}}>
            <DisplayOptionsCard color={color}>
                <ScrollView  style={{width: "100%", flexDirection: "column"}}>
                            {
                                options.map((op,i) => <TouchableHighlight
                                    key={i}
                                    onPress={() => {
                                        onSelect(op.value)
                                        console.log("selected", op.value)
                                        setShowModal(false)
                                        }}>
                                        <Item>
                                            <CustomText>{op.name}</CustomText>
                                        </Item>
                                </TouchableHighlight>
                                )
                            }
                </ScrollView>
            </DisplayOptionsCard>
    </Modal>
        }
    <TouchableHighlight 
        onPress={() => {
            setShowModal(true)
            console.log("pressed")}}
        style={{
            flexDirection: "row",
            width: width as DimensionValue,
            borderRadius: 100,
            overflow: "hidden"}}>
        <Main color={color}>
            <CustomText color={color}>{ valueName || placeholder || ""}</CustomText>
            <Ionicons name="chevron-down-outline" color={color}/>
        </Main>
    </TouchableHighlight> 

    </>
}

export default CustomSelect;
