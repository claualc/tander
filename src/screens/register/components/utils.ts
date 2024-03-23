/*

    Functions used to validate general fields such as
    phone numbers, dates and its masks
*/


export const validatePhoneNumber = (v: string) => v.split("").length == 12;

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
