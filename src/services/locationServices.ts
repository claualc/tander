import { City, Country } from "@api/domain/Location";

import cityDic from "@dict/city";
import countryDic from "@dict/country";
import flagDic from "@dict/flag";

export const getCityById = async (id: string) => {
    const cityDTO = cityDic[id];
    return new City(
        cityDTO.name,
        getCountryById(cityDTO?.country_id as string),
        id
    );
}

export const getCountryById = (id: string) => {
    const countryDTO = countryDic[id]
    return new Country(
        countryDTO.name, 
        flagDic[id],
        countryDTO.nationality,
        id);
}
