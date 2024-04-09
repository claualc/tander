import { TouchableHighlight, View, ImageBackground, DimensionValue } from "react-native";

import { theme, gobalFont} from "@screens/theme";
import { CustomText } from "@components/index";
import Gradient from "@assets/linear_gradient_background.png";

export const ColorButton: React.FC<{
    onPress: () => void;
    title: string;
    disabled?: boolean;
    width?: string;
}> = ({onPress, title, disabled, width}) => {
    return <TouchableHighlight 
            style={{
                borderRadius: gobalFont.size.textInput*1.5,
                width: width as DimensionValue || "100%",
                height: gobalFont.size.textInput*2.2,
                overflow: 'hidden',
            }}
            activeOpacity={0.6}
            disabled={disabled == undefined ? false : disabled}
            onPress={onPress}>
                {
                    disabled ?
                    <View 
                    style={{ 
                        justifyContent: "center",
                        alignItems: "center", 
                        backgroundColor: theme.secondary_background,
                        flex: 1
                    }}>
                        <CustomText fontFam="DM" color={theme.secondary_dark}>
                            {title}
                        </CustomText>
                    </View> 
                    : <ImageBackground 
                    resizeMode='cover' 
                    style={{ 
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center"
                    }} source={Gradient}>

                    <CustomText fontFam="DM" color={theme.text_ligth_primary}>
                        {title}
                    </CustomText>
                </ImageBackground>
                }
            </TouchableHighlight >
}

export default ColorButton;