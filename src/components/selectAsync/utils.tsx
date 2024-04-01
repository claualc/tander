

export const search = (input: string, array: string[]) => {
    const sanitizedInput = input.toLowerCase().replace(/\s/g, ''); // Convert input to lowercase and remove whitespaces
    const matches: string[] = [];

    array.forEach((item) => {
        const sanitizedItem = item.toLowerCase().replace(/\s/g, ''); // Convert array item to lowercase and remove whitespaces
        if (sanitizedItem.includes(sanitizedInput)) {
            matches.push(item);
        }
    });

    return matches;
}