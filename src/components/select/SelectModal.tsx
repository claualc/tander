import { Image, Modal, ScrollView, TouchableHighlight, View } from "react-native";
import styled from "styled-components/native";

import { CustomText } from "@components/index";
import { SelectOption } from ".";
import { useMemo, useState } from "react";
import { BlurView } from "expo-blur";
import ColorButton from "../colorButton";
import { getRandomColor } from "../utils";
import SearchBar from "@components/searchBar";
import { search } from "./utils";
import { Card, Item, Loading } from "./style";


/*
    The display of the itens of the modal
    can be customize trhouf the children property
    Where it substitues the option list
*/
const SelectModal: React.FC<{
    show: boolean;
    onSelect: (v: SelectOption) => void;
    modalTitle?: string;
    options: SelectOption[];
    color?: string;
    withSearchBar?: boolean;
}> = ({show, modalTitle, options, onSelect, color, withSearchBar}) => {

    const [color_, setColor_] = useState<string>(color || getRandomColor());
    const [value, setValue] = useState<SelectOption | null>(null);
    const [itemSelected, setItemSelected] = useState<string>("");

    const [searchValue, setSearchValue] = useState<string>("");

    const optionList = useMemo<SelectOption[]>(() => {
            return withSearchBar ?
                search(searchValue, options)
                : options
    }, [options, searchValue, withSearchBar])

    return <Modal transparent={true} visible={show} style={{justifyContent: "center", alignItems: "center"}}>
        <BlurView intensity={40} style={{
            flex: 1, 
            alignItems: "center", 
            justifyContent: "center", 
        }}>
           
            <Card style={{minHeight: 140, maxHeight: "80%"}}>
                {
                    //modal header
                }
                <View style={{
                    elevation: 4,
                    width: "110%",
                    //aspectRatio: "5/1",
                    // background color must be set
                    backgroundColor: "white",
                    paddingLeft: "10%",
                    paddingTop: "5%",
                    paddingBottom: "5%",
                    position: "relative",
                    justifyContent: "center",
                }}>
                    <CustomText fontFam="DM" size={19}>{modalTitle || ""}</CustomText>
                    {
                        withSearchBar && <View style={{paddingTop: "2%"}}>
                            <SearchBar
                                value={searchValue}
                                onValueChange={setSearchValue}
                                color={color_}
                                width="90%"  />
                        </View>
                    }
                </View>

                <View style={{
                        width: "100%",
                        paddingLeft: "5%",
                        paddingRight: "5%",
                        maxHeight: "70%"
                    }}>
                        
                    <ScrollView style={{width: "100%", flexDirection: "column"}}>
                        {
                            (optionList.length == 0) ?
                            <Loading/>
                            : optionList.map((op,i) => (
                                <Item
                                    key={i}
                                    op={op}
                                    selected={itemSelected  == op.name}
                                    onPress={() => {
                                        setValue(op)
                                        setItemSelected(op.name)
                                    }} />
                                )
                            )
                        }
                    </ScrollView>
                </View>

                <View style={{
                    width: "100%",
                    aspectRatio: "5/1", // need a fix height
                    flexDirection: "column",
                    padding: 10,
                    // background color must be set
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    bottom: 0
                }}>
                    <ColorButton
                        disabled={options.length > 0 ? value == null : false}
                        onPress={() => {
                            if (value != null) {
                                onSelect(value)
                                // reset all
                                setValue(null)
                                setItemSelected("");
                                setSearchValue("");
                            }
                        }} 
                        width="50%"
                        title={"Done"} />
                </View>
            
            </Card>
        </BlurView>
    </Modal>
};

export default SelectModal;
