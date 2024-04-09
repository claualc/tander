import { ColorWrapper, CustomText, Wrapper } from "@components/index";
import styled from "styled-components/native";
import { View } from "react-native";
import { Language } from "@api/domain/Language";


export const UserDescWrapper = styled(Wrapper)`
    margin-top: 145%; 
    padding: 10% 7% 0% 7%; 
    width: 100%;
    justify-content: flex-start;
    align-items: flex-start;
    
`
export const UserDecSections = styled.View`
    width: "100%";
    align-items: flex-start;
    flex-direction: row;
    margin-top: 3px;
`

export const Section = styled.View`
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
`

export const LanguageView: React.FC<{
    lang: Language[];
    emoji: string;
    title: string;
    color: string;
}> = ({ lang, emoji, title, color }) => {

    return <ColorWrapper inColor={color}>
        <View style={{flex:1, alignItems: "center"}}>
            <CustomText size={30}>{emoji}</CustomText>
        </View>
        <View style={{flex:4,justifyContent: "flex-start", alignItems: "flex-start"}}>
        <CustomText size={13}  color={color}>{title}</CustomText>
            <View style={{flex:2, flexWrap: "wrap", flexDirection: "row"}}>
            {
                lang.map((l, i) => {
                return <CustomText 
                    key={i} 
                    size={20} 
                    color={color} 
                    fontFam="DM" >{`${l.name}${lang.length-1==i ? "" : ","} `}</CustomText>})
            }
            </View>
        </View>
    </ColorWrapper>
}