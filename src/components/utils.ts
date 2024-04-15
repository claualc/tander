
/*

    GLOBAL FUNCTIONS

*/

import { theme } from "@screens/globalstyle";

export const convertHexToRGBA = (hexCode: string, opacity = 1) => {  
    let hex = hexCode.replace('#', '');
    
    if (hex.length === 3) {
        hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
    }    
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    /* Backward compatibility for whole number based opacity values. */
    if (opacity > 1 && opacity <= 100) {
        opacity = opacity / 100;   
    }
  
    return `rgba(${r},${g},${b},${opacity})`;
  };

export const cutText = (s: string, max: number) => {
    return s.length > max ? `${s.slice(0, max-3)}...` : s;
}

/*

    Functions used to validate general fields such as
    phone numbers, dates and its masks
*/

export const getRandomColor = () => {
    const colorOptions = [theme.tertiary, theme.secondary, theme.main]
    const randomId = Math.floor(Math.random() * (colorOptions.length-1))
    return colorOptions[randomId]
}

export const validatePhoneNumber = (phone: string) => phone.split("").length == 12;

export const generateRandomString = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result
}

export const getDateFromString = (v: string) => {
    // v of type DMMYYYY
    const day = Number(v.slice(0,2))
    const month = Number(v.slice(2,4))
    const year = Number(v.slice(4,8))
    return new Date(`${year}-${month}-${day}T01:00:00.000Z`)
}

export const getDDMMYYYYFromDate = (v: Date) => {
    let str = v.toISOString().split("T")[0]
    let arr = str.split("-")
    return `${arr[2]}${arr[1]}${arr[0]}`
}

export const getYYYYMMDDFromDate = (v: Date) => {
    return v.toISOString().split("T")[0]
}

export const validateDate = (v: string) => {
    const nonNull = v.split("").length==8
    const day = Number(v.slice(0,2))
    const month = Number(v.slice(2,4))
    const year = Number(v.slice(4,8))

    if (nonNull && year != 0) {
        const todayDate = new Date()
        const inputDate = new Date(`${year}-${month}-${day}T01:01:01`)

        const isValidDatee = (
            inputDate.getDate() == day && 
            inputDate.getMonth()+1 == month 
            && inputDate.getFullYear() == year)
            
        return isValidDatee && (todayDate>inputDate) 
    }

    return false
}

export const get2FirstDigitsYear = (v: string[]) => {
    return v.toString().split("").length>=13 ? Number(v.slice(4,6).reduce((acc,v) => acc+v, "")) : null
}

export const cellphoneMask = (value?: string) => {
    let length = !!value ? value.split("").length : 0
    let val = length > 0 ? length > 8 ?
        `+${value?.substring(0,2) || ""} ${value?.substring(2,5) || ""} ${value?.substring(5,8) || ""} ${value?.substring(8) || ""}`
            : length > 5 ? `+${value?.substring(0,2) || ""} ${value?.substring(2,5) || ""} ${value?.substring(5) || ""}`
                : length > 2 ? `+${value?.substring(0,2) || ""} ${value?.substring(2) || ""}`
                : `+${value}` : ""
    return val
}
