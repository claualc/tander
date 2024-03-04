import { Dimensions, Modal, ScrollView, TouchableHighlight, View } from "react-native";
import styled from "styled-components/native";

import { CustomText } from "@components/index";
import { SelectOption } from ".";
import { useState } from "react";
import { BlurView } from "expo-blur";
import ColorButton from "../colorButton";
import { yellow } from "@mui/material/colors";

// actual shape of select modal 
export const Card = styled.View`
    background-color: white;
    width: 88%;
    min-height: 70px;
    max-height: 80%;
    height: fit-content;
    border-radius: 20px;
    overflow: hidden;
    align-items: center;
    flex-direction: column;
`

export const Item = styled.View`
    width: "100%";
    height: ${`${Dimensions.get('window').height*0.06}px`};
    padding-left: 1%;
    border-bottom-color: ${p => p.theme.secondary_background};
    border-bottom-width: 0.7px;
    justify-content: center;
`

const SelectModal: React.FC<{
    show: boolean;
    onSelect: (v: SelectOption) => void;
    modalTitle?: string;
    options: SelectOption[];
}> = ({show, modalTitle, options, onSelect}) => {

    const [value, setValue] = useState<SelectOption | null>(null);
    const [itemSelected, setItemSelected] = useState<number>(-1);

    return <Modal transparent={true} visible={show} style={{justifyContent: "center", alignItems: "center"}}>
        <BlurView intensity={40} style={{
            flex: 1, 
            alignItems: "center", 
            justifyContent: "center", 
        }}>
            <Card>
                {
                    //modal header
                }
                <View style={{
                    elevation: 4,
                    width: "110%",
                    // background color must be set
                    backgroundColor: 'white',
                    paddingLeft: "10%",
                    paddingTop: "5%",
                    paddingBottom: "5%",
                }}>
                    <CustomText fontFam="DM" size={19}>{modalTitle || ""}</CustomText>
                </View>
                
                <View style={{
                    width: "100%",
                    paddingLeft: "5%",
                    paddingRight: "5%",
                }}>
                    <ScrollView  style={{width: "100%", flexDirection: "column"}}>
                        {
                            options.map((op,i) => <TouchableHighlight
                                key={i}
                                onPress={() => {
                                        setValue(op)
                                        setItemSelected(i)
                                    }}>
                                    <Item>
                                        <CustomText  
                                            fontFam={ itemSelected  == i ? "XB" : "RG"} 
                                            >{op.name}</CustomText>
                                    </Item>
                            </TouchableHighlight>
                            )
                        }
                    </ScrollView>
                </View>
                <View style={{
                    width: "100%",
                    flexDirection: "column",
                    padding: 10,
                    // background color must be set
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <ColorButton
                        disabled={value == null}
                        onPress={() => {
                            if (value != null)
                                onSelect(value)
                        }} 
                        width="50%"
                        title={"Done"} />
                </View>
            </Card>
        </BlurView>
    </Modal>
};

export default SelectModal;
