
/*

    GLOBAL FUNCTIONS

*/

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

  /*

    Functions used to validate general fields such as
    phone numbers, dates and its masks
*/


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
    return new Date(`${year}-${month}-${day}T01:01:01`)
}

export const validateDate = (v: string) => {
    const nonNull = v.split("").length==8
    const day = Number(v.slice(0,2))
    const month = Number(v.slice(2,4))
    const year = Number(v.slice(4,8))

    if (nonNull) {
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
    return v.toString().split("").length>=13 ? v.slice(4,6).reduce((acc,v) => acc+v, "") : ""
}

export const cellphoneMask = (value?: string) => {
    return value && value?.length ?
    value?.length > 8 ?
    `+${value?.substring(0,2) || ""} ${value?.substring(2,5) || ""} ${value?.substring(5,8) || ""} ${value?.substring(8) || ""}`
        : value?.length > 5 ?
        `+${value?.substring(0,2) || ""} ${value?.substring(2,5) || ""} ${value?.substring(5) || ""}`
            : value?.length > 2 ?
                `+${value?.substring(0,2) || ""} ${value?.substring(2) || ""}`
                : `+${value}` : ""
}
