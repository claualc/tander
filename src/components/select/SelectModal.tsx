import { Dimensions, FlatList, Modal, ScrollView, View } from "react-native";
import { CustomText } from "@components/index";
import { SelectOption } from ".";
import { useMemo, useState } from "react";
import { BlurView } from "expo-blur";
import ColorButton from "../colorButton";
import { getRandomColor } from "../utils";
import SearchBar from "@components/searchBar";
import { search } from "./utils";
import { Card, Item, Loading } from "./style";
import { DEVICE_WINDOW_TYPE, DEV_DIM, SCREEN_TYPES, theme } from "@screens/theme";


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
                search(searchValue, options).slice(0,6)
                : options
    }, [options, searchValue, withSearchBar])

    const positionCheckButtom = useMemo<string>(() => {
        /**
         * the top cannot be porcentage because the card height
         * changes with the selectoptions lengh
         * Therefore it ust be relative to the size of the device
         */
        let cardOverFlow = false;

        if (DEVICE_WINDOW_TYPE == SCREEN_TYPES.MEDIUM) {
            cardOverFlow = optionList.length >= 6;
            return cardOverFlow ? "-8%" : "0%"
        } else if (DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL) {
            cardOverFlow = optionList.length >= 8;
            return "0%"
        }
        return "0px"
    }, [optionList])

    const optionsMarginBottom = useMemo<string>(() => {
        /**
         * same as positionCheckButtom
         */
        let cardOverFlow = false;

        if (DEVICE_WINDOW_TYPE == SCREEN_TYPES.MEDIUM) {
            cardOverFlow = optionList.length >= 6;
            return cardOverFlow ? "11%" : "0"

        } else if (DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL) {
            return "0%"
        }
        return "0px"
    }, [optionList])

    return <Modal transparent={true} visible={show} style={{justifyContent: "center", alignItems: "center"}}>
        <BlurView intensity={40} style={{
            flex: 1, 
            alignItems: "center", 
            justifyContent: "center", 
        }}>
           
            <Card style={{minHeight: 140, maxHeight: "80%", position: "relative"}}>
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
                        maxHeight: "70%",
                        zIndex:0,
                        position: "relative"
                    }}>
                        
                    {
                    (optionList.length == 0) ?
                    <Loading/> : <FlatList
                        style={{
                            marginBottom: optionsMarginBottom as any}}
                        data={optionList}
                        renderItem={({item, index}) => <Item
                            op={item}
                            selected={itemSelected  == item.name}
                            last={index==optionList.length-1}
                            onPress={() => {
                                setValue(item)
                                setItemSelected(item.name)
                            }} />}
                        keyExtractor={(op) => op.name}
                        />
                    }
                </View>

                <View style={{
                    width: "110%",
                    aspectRatio: DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL ?
                            "4.5/1" : "7/1", // the other is medium
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    top: positionCheckButtom as any, 
                    zIndex: 1,
                    backgroundColor: theme.light_background,
                    borderColor: theme.secondary_background,
                    borderTopWidth: 1,
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
