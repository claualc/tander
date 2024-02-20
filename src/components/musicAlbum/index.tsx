
import * as albumAPI from '@serv/albumService';
import React, { useEffect, useState } from 'react';
import { AlbumCInfoWrapper, AlbumCoverWrapper, ErrorCard, LoadingCard, MainCard } from './style';
import { Album } from '@api/domain/Album';
import { Image } from 'react-native';
import { CustomText } from '@components/index';
import { theme } from '@screens/theme';

interface Props {
  artistName: string;
  albumName: string;
}

const AlbumComponent = ({albumName, artistName}: Props) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Album | null>(null);

  useEffect(() => {
    (async () => {
      const res = await albumAPI.getAlbum(albumName,artistName);
      setData(res)
      setLoading(false)
    })();
  }, [])


  return (
    loading ?
      <LoadingCard></LoadingCard>
      : data ?
      <MainCard>
        <AlbumCoverWrapper>
          <Image
            style={{flex: 1}}
            source={{uri: data.image_url}}
          />
        </AlbumCoverWrapper>
        <AlbumCInfoWrapper>
          <CustomText fontFam='BD' color={theme.secondary_dark}>{data.name}</CustomText>
          <CustomText fontFam='RG' color={theme.tertiary_dark}>{data.artist.name}</CustomText>
        </AlbumCInfoWrapper>
      </MainCard>
      :<ErrorCard></ErrorCard>
    );
}

export default AlbumComponent;
