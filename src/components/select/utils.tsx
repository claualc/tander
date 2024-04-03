import { SelectOption } from ".";


export const search = (input: string, optionArr: SelectOption[]) => {
    const sanitizedInput = input.toLowerCase().replace(/\s/g, ''); // Convert input to lowercase and remove whitespaces
    if (input) {
        const matches: SelectOption[] = [];

        optionArr.forEach((item) => {
            const sanitizedItem = item.name.toLowerCase().replace(/\s/g, ''); // Convert optionArr item to lowercase and remove whitespaces
            if (sanitizedItem.includes(sanitizedInput)) {
                // Check if the item is already present in matches
                const alreadyExists = matches.some(match => match.name.toLowerCase().replace(/\s/g, '') === sanitizedItem);
                if (!alreadyExists) {
                    matches.push(item);
                }
            }
        });
        return matches;
    }
    let uniqueArr: SelectOption[] = [];

    optionArr.forEach((item) => {
        const sanitizedItem = item.name.toLowerCase().replace(/\s/g, ''); // Convert optionArr item to lowercase and remove whitespaces
        const alreadyExists = uniqueArr.some(match => match.name.toLowerCase().replace(/\s/g, '') === sanitizedItem);
        if (!alreadyExists) {
            uniqueArr.push(item);
        }
    });
    return optionArr.slice(0,40) // return only top results;
};

export const removeDuplicates = (array: SelectOption[])  =>{
    let unique: { [key: (string | number)] : any } = {};
    array.forEach(function(item) {
        unique[item.name] = true;
    });
    return Object.keys(unique);
}