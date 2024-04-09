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
    BIG="BIG"
}

export const DEV_DIM = Dimensions.get("window")

const devicesWindowTypes = () => {
    const dim = Dimensions.get("window")
    const aspectRatio = dim.width/dim.height
    console.log("   DEVICE ASCPECT RATIO",aspectRatio)

    switch(true) {
        case aspectRatio < 0.3:
            return SCREEN_TYPES.SMALL
        case aspectRatio < 0.7:
            return SCREEN_TYPES.SMALL
        case aspectRatio > 0.7 && aspectRatio < 1.2:
            return SCREEN_TYPES.MEDIUM
        case  aspectRatio > 1.2:
            return SCREEN_TYPES.BIG
    }
}

export const DEVICE_WINDOW_TYPE = devicesWindowTypes()
console.log("    DEVICE_WINDOW_TYPE", DEVICE_WINDOW_TYPE)

// to keep the responsiveness
const textInputSize= 22;
const dimX = Dimensions.get("window").width
export const gobalFont = {
    size: {
        default: 18, // equivalent to 16/18 em ,
        title: 30,
        textInput: textInputSize,
        dateInput: DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL ? 
            textInputSize: textInputSize*1.2
    }
};


 