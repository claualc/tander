import styled from "styled-components/native";
import { convertHexToRGBA, cutText } from "@components/utils";
import { DimensionValue, Image, TouchableHighlight, View } from "react-native";
import { CustomText } from "@components/index";
import { SelectOption } from ".";
import { gobalFont, responsiveValue } from "@screens/globalstyle";

// actual shape of select modal 
export const Card = styled.View`
    background-color: white;
    width: ${responsiveValue("88%", "75%")};
    border-radius: 20px;
    overflow: hidden;
    align-items: center;
    flex-direction: column;
`

/*
    used in all select inputs:
        select, multiselect, asyncselect
*/
export const PADDING_CUSTOM_SELECT =0.3
export const CustomSelectView: React.FC<React.PropsWithChildren<{
    color: string;
    width?: string;
    aspectRatio?: string;
    outlined?: boolean;
    alignCenter?: boolean;
}>> = ({children, color, width, aspectRatio, outlined=false, alignCenter=false}) => {

    return  <View 
                style={{
                    flexDirection: "row",
                    width: width as DimensionValue || "100%",
                    aspectRatio: aspectRatio,
                    borderRadius: 100,
                    backgroundColor: outlined ? "#0000" : convertHexToRGBA(color, 0.2),
                    borderWidth: outlined ? 1 : 0,
                    borderColor: outlined ? color : "",
                    padding: gobalFont.size.default*PADDING_CUSTOM_SELECT,
                    paddingLeft: gobalFont.size.default,
                    alignItems: "center",
                    justifyContent: alignCenter ? "center": "space-between",
                }}>
                    <>{children}</>
            </View> 
}

export const CustomSelectTouchable: React.FC<React.PropsWithChildren<{
    color: string;
    onPress?: () => void;
    width?: string;
    outlined?: boolean;
    alignCenter?: boolean;
}>> = ({children, color, onPress, width, outlined=false, alignCenter=false}) => {

    return  <TouchableHighlight 
                onPress={onPress}
                underlayColor={convertHexToRGBA(color, 0.7)}
                style={{
                    width: width as DimensionValue || "100%",
                    borderRadius: 100,
                    overflow: "hidden",
                    flexDirection: "row"
                }}>
                    <CustomSelectView
                        alignCenter={alignCenter}
                        outlined={outlined}
                        color={color}>
                            {children}</CustomSelectView>
            </TouchableHighlight> 
}

export const ItemView = styled.View<{
    last: boolean;
}>`
    width: "100%";
    padding-left: 1%;
    border-bottom-color: ${p => p.theme.secondary_background};
    border-bottom-width:${p => p.last ? 0 :  "0.7px"};
    justify-content: flex-start;
    flex-direction: row;
    padding: 2%;
`

export const ItemImageWrap = styled.View`
    width: 25%;
    aspect-ratio: 1;
    border-radius: 15px;
    margin-right: 5%;
    overflow: hidden;
`

export const Item: React.FC<React.PropsWithChildren<{
    onPress:() => void;
    op: SelectOption;
    selected: boolean;
    last?: boolean;
}>> = ({onPress, op, selected, last=false}) => {
    return <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#0000"
            onPress={onPress}>
        <ItemView last={last}>
           { op.imageUrl && <ItemImageWrap>
                <Image
                    style={{flex: 1}}
                    source={{uri: op.imageUrl}} />
                </ItemImageWrap>
            }
            <View style={{flex: 1, flexWrap: "wrap", flexDirection: "row"}}>
                <CustomText  
                    style={{marginBottom: 10, marginTop: 15}}
                    fontFam={ selected ? "XB" : "RG"} 
                    >{cutText(op.name, 43)}</CustomText>
            </View>
            
        </ItemView>
    </TouchableHighlight>
}