import styled from "styled-components/native";
import { cellphoneMask } from "@components/utils";

import { theme } from "@screens/theme";

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
    onChange: (v: string) => void
}> = ({value, onChange, placeholder}) => {

    return <StyledInputText
        selectionColor={theme.tertiary_dark}
        onChangeText={onChange}
        value={value}
        placeholder={placeholder || ""}
        />
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
