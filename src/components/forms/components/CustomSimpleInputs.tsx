import styled from "styled-components/native";
import { cellphoneMask } from "@components/utils";

import { gobalFont, responsiveValue, theme } from "@screens/theme";
import { View } from "react-native";
import { CustomText } from "@components/index";

const StyledInputText = styled.TextInput`
    width: 100%;
    border-bottom-width: ${`${gobalFont.size.textInput*0.05}px`};
    border-bottom-color: ${p => p.theme.tertiary_dark};
    margin-top: 12px;
    font-size: ${`${gobalFont.size.textInput}px`};
    max-height: ${`${gobalFont.size.default*20}px`};
`

export const CustomTextInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    maxCharacters?: number;
    hideText?: boolean; // when is a password
}> = ({value, onChange, placeholder, maxCharacters, hideText=false}) => {

    return <View style={{width: "100%", flexWrap: "wrap", overflow: "hidden"}}>
        <StyledInputText
            selectionColor={theme.secondary_background}
            onChangeText={onChange}
            secureTextEntry={hideText}
            value={value?.split("").length == 1 ? value?.replace(/^([\s\r\n])/, ""): value?.replace(/\n/g, "")}
            maxLength={maxCharacters}
            placeholder={placeholder || ""}
            placeholderTextColor={theme.secondary_background}
        />
        {
            maxCharacters && <View style={{width: "100%", aspectRatio: responsiveValue("10/1","20/1"), alignItems: "flex-end"}}>
                <CustomText color={theme.tertiary_dark}>{`${value? value.length : 0}/${maxCharacters}`}</CustomText>
            </View>
        }
        </View>
};

export const CustomCodeInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    isPhoneNumber?: boolean;
    maxLength?: number;
}> = ({value, onChange, placeholder, isPhoneNumber = false, maxLength = 10000}) => {

    return <StyledInputText
        placeholderTextColor={theme.secondary_background}
        selectionColor={theme.tertiary_dark}
        onChangeText={(v: string) => {
            onChange(v.replace(/[^0-9]/g, "").toString()) }}
        value={isPhoneNumber ? cellphoneMask(value) : value}
        placeholder={placeholder || ""}
        maxLength={ isPhoneNumber ? 16 : maxLength}
        keyboardType="numeric" />
};
