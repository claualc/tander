
import albumService, * as albumAPI from '@serv/albumService';
import React, { useEffect, useState } from 'react';
import { AlbumCInfoWrapper, AlbumCoverWrapper, LoadingCard, MainCard } from './style';
import { Album } from '@domain/Album';
import { Image } from 'react-native';
import { CustomText } from '@components/index';
import { theme } from '@screens/globalstyle';
import { cutText } from '../utils';

interface Props {
  albumName: string;
  artistName: string;
  imageUrl?: string;
}

const AlbumComponent = ({albumName, artistName, imageUrl}: Props) => {

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Album | null>(null);

  useEffect(() => {
        (async () => {
          if (albumName && artistName && imageUrl) {
            setData(new Album(albumName, imageUrl, artistName))
            setLoading(false)
          }
      })();
      }, [])


  return (
    loading ?
      <LoadingCard />
      : data ?
      <MainCard>
        <AlbumCoverWrapper>
          <Image
            style={{flex: 1}}
            source={{uri: data.imageUrl}}
          />
        </AlbumCoverWrapper>
        <AlbumCInfoWrapper>
          <CustomText fontFam='BD' color={theme.secondary_dark}>{cutText(data.name, 40)}</CustomText>
          <CustomText fontFam='RG' color={theme.tertiary_dark}>{data.artist.name}</CustomText>
        </AlbumCInfoWrapper>
      </MainCard>
      :<LoadingCard></LoadingCard>
    );
}

export default AlbumComponent;
