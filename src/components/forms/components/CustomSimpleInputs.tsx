import styled from "styled-components/native";
import { cellphoneMask } from "@components/utils";

import { theme } from "@screens/theme";
import { View } from "react-native";
import { CustomText } from "@components/index";

const StyledInputText = styled.TextInput`
    width: 100%;
    border-bottom-width: 1px;
    border-bottom-color: ${p => p.theme.tertiary_dark};
    margin-top: 12px;
    font-size: 22px;
`

export const CustomTextInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    maxCharacters?: number;
}> = ({value, onChange, placeholder, maxCharacters}) => {

    return <>
        <StyledInputText
        selectionColor={theme.tertiary_dark}
        onChangeText={onChange}
        value={value}
        maxLength={maxCharacters}
        placeholder={placeholder || ""}
        />
        {
            maxCharacters && <View style={{width: "100%", aspectRatio: "10/1", alignItems: "flex-end"}}>
                <CustomText color={theme.tertiary_dark}>{`${value? value.length : 0}/${maxCharacters}`}</CustomText>
            </View>
        }
        </>
};

export const CustomCodeInput: React.FC<{
    value: string;
    placeholder?: string;
    onChange: (v: string) => void;
    isPhoneNumber?: boolean;
    maxLength?: number;
}> = ({value, onChange, placeholder, isPhoneNumber = false, maxLength = 10000}) => {

    return <StyledInputText
        selectionColor={theme.tertiary_dark}
        onChangeText={(v: string) => {
            onChange(v.replace(/[^0-9]/g, "").toString()) }}
        value={isPhoneNumber ? cellphoneMask(value) : value}
        placeholder={placeholder || ""}
        maxLength={ isPhoneNumber ? 16 : maxLength}
        keyboardType="numeric" />
};
