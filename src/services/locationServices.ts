import { City, Country } from "@domain/Location";

import cityDic from "@dict/city";
import countryDic from "@dict/country";
import flagDic from "@dict/flag";

const getCityById = async (id: string) => {
    const cityDTO = cityDic[id];
    return new City(
        cityDTO.name,
        getCountryById(cityDTO?.country_id as string),
        id
    );
}

const getCountryById = (id: string) => {
    const countryDTO = countryDic[id]
    return new Country(
        countryDTO.name, 
        flagDic[id],
        countryDTO.nationality,
        id);
}

const listAllCountry = () => {
    return Object.keys(countryDic).map(getCountryById)
}

const locationService = {
    getCityById,
    getCountryById,
    listAllCountry,
}

export default locationService;