import { useState, useCallback, useEffect } from "react";
import { ScrollView, View, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import * as ImagePicker from 'expo-image-picker';

import { theme } from "@screens/theme";

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
    values: (string | null)[];
    count: number; // number of inputs to render
    onChange: (v: (string)[]) => void
}> = ({values, onChange, count}) => {

    const [imgs_, setImgs_] = useState<(string | null)[]>(() => {
        let completeArray = values ||  [];
        completeArray.splice( completeArray.length, count- completeArray.length, null)  
        return completeArray  
    });

    const setSpecificImg = useCallback((i: number, newVal: string) => {
        let updated = [...imgs_]
        updated.splice(i, 1, newVal)
        onChange(updated.map(v => (v || "")))
        setImgs_(updated)
    }, [imgs_])

    const pickImage = useCallback(async (i: number) => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.7,
        base64: true
        });


        if (result.assets?.length && result.assets[0].base64) {
            setSpecificImg(i ,result.assets[0].base64);
        }
    }, [imgs_]);

    const deleteImg = useCallback(async (i: number) => {
        // No permissions request is necessary for launching the image library
        let updated = [...imgs_]
        updated.splice(i, 1, null)
        onChange(updated.map(v => (v || "")))
        setImgs_(updated)
    }, [imgs_]);

    return <ScrollView 
            style={{
                width: "100%", 
                height: "90%", 
            }}
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
                            width: "50%", 
                            aspectRatio: "3/4", 
                            position: "relative"}}>
                            <PhotoFrame 
                                underlayColor={"#0000"}
                                onPress={() => (imgs_[i] == null) ? pickImage(i) : deleteImg(i)}
                                style={{
                                    borderRadius: 25,
                                }}>
                                {
                                    imgs_[i] ?
                                    <Image 
                                        resizeMode="contain"
                                        style={{flex:1}} 
                                        source={{uri: `data:image/jpeg;base64,${imgs_[i]}`}}/>
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