import { useState, useCallback, useEffect } from "react";
import { ScrollView, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";

import { DEVICE_WINDOW_TYPE, SCREEN_TYPES, theme } from "@screens/theme";
import { Photo } from "@api/domain/User";
import photoServices from "@serv/photoServices";

const PhotoFrame = styled.TouchableHighlight`
    width: 93%;
    aspect-ratio: 3/4;
    overflow: hidden;
    border-color: ${p => p.theme.tertiary_dark};
    border-width: 2.5px;
    border-style: dashed;
`;

const AddDeletePhotoButton = styled.View<{
    photoSelected?: boolean;
}>`
    width: 22%;
    aspect-ratio: 1/1;
    background-color: ${p => p.theme.light_secondary};
    position: relative;
    bottom: 14%;
    left: 76%;
    justify-content: center;
    align-items: center;
    transform: ${ p => p.photoSelected ? null : "rotate(45deg)" };
`;


const CustomPhotoBatchInputs: React.FC<{
    values: Photo[];
    count: number; // number of inputs to render
    onChange: (v: (Photo | null)[]) => void
}> = ({values, onChange, count}) => {

    const [imgs_, setImgs_] = useState<(Photo | null)[]>([]);

    const updateValues = useCallback((values: (Photo | null)[]) => {
        onChange(values)
    }, [imgs_]);

    useEffect(() => {
        if (values){
            setImgs_(values)  
        }
    }, [values])

    const setSpecificImg = useCallback((i: number, newVal: Photo) => {
        let updated = [...imgs_]
        updated.splice(i, 1, newVal)
        updateValues(updated)
        setImgs_(updated)
    }, [imgs_])

    const pickImage = useCallback(async (i: number) => {
        // No permissions request is necessary for launching the image library
        const photo = await photoServices.pickPhotoFromGallery()
        if (photo) {
            setSpecificImg(i ,photo);
        }
    }, [imgs_]);

    const deleteImg = useCallback(async (i: number) => {
        // No permissions request is necessary for launching the image library
        let updated = [...imgs_]
        updated.splice(i, 1, null)
        updateValues(updated)
        setImgs_(updated)
    }, [imgs_]);

    return <ScrollView 
            contentContainerStyle={{
                justifyContent: "space-between",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
            }}>
            {
               [...Array(count).keys()].map(i => {
                return <View 
                        key={i}
                        style={{ 
                            width: DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL ? 
                                "50%" : "30%", 
                            aspectRatio: "3/4", 
                            position: "relative"}}>
                            <PhotoFrame 
                                underlayColor={theme.secondary_background}
                                onPress={() => (!imgs_[i]?.value) ? pickImage(i) : deleteImg(i)}
                                style={{
                                    borderRadius: 25,
                                }}>
                                {
                                    imgs_[i] ?
                                    <Image 
                                        resizeMode="contain"
                                        style={{flex:1}} 
                                        source={{uri: `data:image/jpeg;base64,${imgs_[i]?.value}`}}/>
                                    : <></>
                                }
                                
                            </PhotoFrame>
                        <AddDeletePhotoButton
                            style={{
                                borderRadius: 25,
                            }}
                            photoSelected={!!imgs_[i]}>
                            <Ionicons name="close-outline" size={27} color={theme.secondary}/>
                        </AddDeletePhotoButton>
                    </View>
               })
            }
    </ScrollView>
};

export default CustomPhotoBatchInputs;