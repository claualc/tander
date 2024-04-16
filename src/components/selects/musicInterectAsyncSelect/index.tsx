

/*
    This input is used when the choices
    of the select component are asyncronous
*/

import { SelectOption } from "@components/selects/select"
import React, { useContext, useEffect, useState } from "react";
import { convertHexToRGBA, getRandomColor } from "@components/utils";
import { CustomText } from "@components/index";
import { Ionicons } from "@expo/vector-icons";
import SelectModal from "@components/selects/select/Modal";
import { CustomSelectTouchable } from "@components/selects/select/style";

import albumservice, { MusicInterestDTO } from "@serv/albumService";
import { View } from "react-native";
import AlbumComponent from "../../musicAlbum";
import { LoggedUserContext, UserContextType } from "@context/user";

interface AsyncSelectProps {
    value?: MusicInterestDTO;
    onSelect: (v: SelectOption) => void; // v is the valye of the key of the item
    color?: string;
}

const artistTitle = "Search an artist";
const albumTitle = "Choose the best album!";

const MusicInterectAsyncSelect: React.FC<AsyncSelectProps> = ({
        onSelect, value, color
    }) => {

    const { artistOptionList } = useContext(LoggedUserContext) as UserContextType; 

    useEffect(() => {
        if (value)
            setTrackInfo(value)
    }, [value])


    const [options, setOptions] = useState<SelectOption[]>([]);
    const [color_, setColor_] = useState<string>(color || getRandomColor());
    const [showModal, setShowModal] = useState(false);

    const [trackInfo, setTrackInfo] = useState<MusicInterestDTO>(value || {} as MusicInterestDTO);
    
    useEffect(() => {
        (async () => {
            let options: SelectOption[];
            let {artistName, albumName} = trackInfo

            if (!artistName && !albumName) {
                options = artistOptionList.map(a => ({
                    name: a, value: a
                }));
            } else if (artistName && !albumName) {
                let topTracks = await albumservice.getArtistTopTracks(artistName)
                options = topTracks.map((a,i) => ({
                    name: a.name, value: i, description: a.artistName, imageUrl: a.imageUrl
                }));
            } else {
                options = [] as any
            }   
            setOptions(options);
        })();
    }, [trackInfo])  

    return <>
    { showModal && !trackInfo.artistName ?
        <SelectModal 
                withSearchBar={true}
                show={showModal} 
                onSelect={(v) => {
                    setTrackInfo({
                        ...trackInfo,
                        artistName: v.name
                    })
                }} 
                options={options}        
                modalTitle={artistTitle}
                />
        :  <SelectModal 
                withSearchBar={true}
                show={showModal} 
                onSelect={(v) => {
                    setShowModal(false);
                    setTrackInfo({
                        ...trackInfo,
                        albumName: v.name,
                        imageUrl: v.imageUrl
                    })

                    onSelect({
                        name: v.name,
                        value: {
                            albumName: v.name,
                            artistName: trackInfo.artistName,
                            imageUrl: v.imageUrl
                        } as MusicInterestDTO
                    } as SelectOption)
                }} 
                options={options}        
                modalTitle={albumTitle} />
    }
    <View style={{marginTop: "4%"}}>
        <CustomSelectTouchable 
            onPress={() => {
                setShowModal(true)
                // reset values
                setTrackInfo({} as MusicInterestDTO);
            }}
            color={color_}> 
                <CustomText color={convertHexToRGBA(color_, 0.5)}>{trackInfo.albumName && trackInfo.artistName ? "Change track" : artistTitle}</CustomText>
                <Ionicons name="search-outline" color={color_} size={20}/>
        </CustomSelectTouchable>
        {  
            trackInfo.albumName && trackInfo.artistName &&
            <View style={{width: "100%", marginTop: "3%"}}>
                <AlbumComponent 
                    albumName={trackInfo.albumName}
                    artistName={trackInfo.artistName}
                    imageUrl={trackInfo.imageUrl}/>
            </View>
        }
    </View>
    </>
}

export default MusicInterectAsyncSelect;