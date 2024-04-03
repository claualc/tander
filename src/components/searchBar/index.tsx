import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { theme } from "@screens/theme";
import { CustomSelectView } from "@components/select/style";

interface PropsSearchBar {
    width?: string;
    color: string;
    value: string;
    onValueChange: (v: any) => void;
}

const StyledInputText = styled.TextInput<{
    color: string;
}>`
    font-size: 18px;
    width: 90%;
    color: ${p => p.color};
`
  
const SearchBar: React.FC<PropsSearchBar> = (
    {value, onValueChange, color, width}) => {

    return <CustomSelectView 
                width={width || "90%"}
                color={color} >
                    <StyledInputText
                        selectionColor={theme.tertiary_dark} 
                        value={value}
                        onChangeText={onValueChange}
                        color={color}/>
                <Ionicons name="search-outline" color={color} size={20}/>
           </CustomSelectView>
           
};
  
export default SearchBar;