import { Dimensions } from "react-native";

export const theme = {
    main: "#FF40DD",
    secondary: "#A63FFE",
    light_secondary: "#EDD9FF",
    tertiary: "#4140FE",
    main_background: "#21262E",
    light_background: "#ffffff",
    secondary_background: "#D9D9D9",
    main_dark: "#21262E",
    secondary_dark: "#697078",
    tertiary_dark: "#7F8893",
    text_dark_priamry: "black",
    text_ligth_primary: "white",

    //gradient
    gradient: ["#4140FE", "#A63FFE","#FF40DD"]
};

/**
 * TO CONTROL RESPONSIVITY
 * aspect ratio  width/height
 * the bigguer the aspect ratio the bigguer the width in relation to height
 * 
 */
export enum SCREEN_TYPES {
    SMALL="SMALL",
    MEDIUM="MEDIUM",
    BIG="BIG",
    LANDSCAPE="LANDSCAPE"
}

export const DEV_DIM = Dimensions.get("window")

const devicesWindowTypes = () => {
    const dim = Dimensions.get("window")
    const aspectRatio = dim.width/dim.height
    console.log("    DEVICE ASCPECT RATIO",aspectRatio)

    switch(true) {
        case aspectRatio < 0.65:
            return SCREEN_TYPES.SMALL
        case  aspectRatio < 0.65:
            return SCREEN_TYPES.MEDIUM
        case aspectRatio > 0.65 && aspectRatio < 1:
            return SCREEN_TYPES.BIG
        case  aspectRatio > 1:
            return SCREEN_TYPES.LANDSCAPE
    }
}

export const responsiveValue: (v1: any, v2: any, v3: any) => any = (v1, v2,v3) => {
    switch(DEVICE_WINDOW_TYPE) {
        case SCREEN_TYPES.SMALL:
            return v1;
        case SCREEN_TYPES.MEDIUM:
            return v2;
        case SCREEN_TYPES.LANDSCAPE:
            return v3;
        default:
            return v1;
    }
}

export const DEVICE_WINDOW_TYPE = devicesWindowTypes()
console.log("    DEVICE_WINDOW_TYPE", DEVICE_WINDOW_TYPE)

// to keep the responsiveness
const textInputSize= responsiveValue(22,22, 32);
export const gobalFont = {
    size: {
        default: responsiveValue(18,18, 25), // equivalent to 16/18 em ,
        title: responsiveValue(30,30, 45),
        small: responsiveValue(16,16, 20),
        textInput: textInputSize,
        dateInput: responsiveValue(textInputSize,textInputSize*1.2, textInputSize*1)
    }
};


 