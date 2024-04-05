import styled from "styled-components/native";
import { convertHexToRGBA, cutText } from "@components/utils";
import { DimensionValue, Image, TouchableHighlight, View } from "react-native";
import SmallLoading from "@assets/loading_small.gif";
import { CustomText } from "@components/index";
import { SelectOption } from ".";

// actual shape of select modal 
export const Card = styled.View`
    background-color: white;
    width: 88%;
    border-radius: 20px;
    overflow: hidden;
    align-items: center;
    flex-direction: column;
`

/*
    used in all select inputs:
        select, multiselect, asyncselect
*/
export const CustomSelectView: React.FC<React.PropsWithChildren<{
    color: string;
    width?: string;
    aspectRatio?: string;
}>> = ({children, color, width, aspectRatio}) => {

    return  <View 
                style={{
                    flexDirection: "row",
                    width: width as DimensionValue || "100%",
                    aspectRatio: aspectRatio,
                    borderRadius: 100,
                    overflow: "hidden",
                    backgroundColor: convertHexToRGBA(color, 0.2),
                    padding: "2%",
                    paddingLeft: "5%",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <>{children}</>
            </View> 
}

export const CustomSelectTouchable: React.FC<React.PropsWithChildren<{
    color: string;
    onPress?: () => void;
    width?: string;
}>> = ({children, color, onPress, width}) => {

    return  <TouchableHighlight 
                onPress={onPress}
                activeOpacity={0.6}
                underlayColor="#0000"
                style={{
                    width: width as DimensionValue || "100%",
                }}>
                    <CustomSelectView color={color}>{children}</CustomSelectView>
            </TouchableHighlight> 
}

const LoadingView = styled.View`
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    margin-top: 5%;
    margin-bottom: 15%;
`

export const Loading = () => <LoadingView>
        <Image source={SmallLoading} style={{ width: 100, height: 100 }} />
    </LoadingView>



export const ItemView = styled.View`
    width: "100%";
    padding-left: 1%;
    border-bottom-color: ${p => p.theme.secondary_background};
    border-bottom-width: 0.7px;
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
}>> = ({onPress, op, selected}) => {
    return <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#0000"
            onPress={onPress}>
        <ItemView>
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