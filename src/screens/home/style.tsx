import { ColorWrapper, CustomText, Wrapper } from "@components/index";
import styled from "styled-components/native";
import { View } from "react-native";
import { Language } from "@domain/Language";
import { User } from "@domain/User";
import { gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import AlbumComponent from "@components/musicAlbum";


export const UserDescWrapper = styled(Wrapper)`
    padding: ${responsiveValue("0% 7% 0% 7%", "0% 12% 0% 12%","0% 12% 0% 12%")};
    width: 100%;
    align-items: flex-start;
    position: relative;
    z-index: 0;
    margin-bottom: 7%;
`
export const UserDecSections = styled.View`
    width: "100%";
    align-items: flex-start;
    flex-direction: row;
    margin-top: 3px;
`

export const Section = styled.View`
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 30px;
`

export const LanguageView: React.FC<{
    lang: Language[];
    emoji: string;
    title: string;
    color: string;
}> = ({ lang, emoji, title, color }) => {

    return <ColorWrapper inColor={color}>
        <View style={{flex:1, alignItems: "center"}}>
            <CustomText size={gobalFont.size.title*responsiveValue(0.6,1,1)}>{emoji}</CustomText>
        </View>
        <View style={{flex:4,justifyContent: "flex-start", alignItems: "flex-start"}}>
        <CustomText size={13}  color={color}>{title}</CustomText>
            <View style={{flex:2, flexWrap: "wrap", flexDirection: "row"}}>
            {
                lang?.length && lang.map((l, i) => {
                return <CustomText 
                    key={i} 
                    size={gobalFont.size.title*0.6}
                    color={color} 
                    fontFam="DM" >{`${l.name}${lang.length-1==i ? "" : ","} `}</CustomText>})
            }
            </View>
        </View>
    </ColorWrapper>
}

export const UserDetails: React.FC<{
    user: User;
    show: boolean;
}> = ({ user, show }) => {

    return <UserDescWrapper>
        { show && <>
            {/* ######### BASIC INFO SECTION */}
            <UserDecSections>
                <CustomText size={gobalFont.size.default*1.8} fontFam="BD">{user?.shortusername || ""}</CustomText>
                <CustomText  size={gobalFont.size.default*1.8}>{" " + user?.yearsOld}</CustomText>
            </UserDecSections>
            <UserDecSections>
                <AntDesign name="book" size={gobalFont.size.default*1.5} color={theme.tertiary_dark} />
                <CustomText color={theme.tertiary_dark}>{" " + user?.courseName}</CustomText>
            </UserDecSections>
            <UserDecSections>
                <Ionicons name="earth-outline" size={gobalFont.size.default*1.5} color={theme.tertiary_dark} />
                <CustomText color={theme.tertiary_dark}>{` ${user?.countryName}`}</CustomText>
            </UserDecSections>
            <UserDecSections>
                <SimpleLineIcons name="graduation" size={gobalFont.size.default*1.5} color={theme.tertiary_dark} />
                <CustomText color={theme.tertiary_dark}>{" " +  user?.universityName}</CustomText>
            </UserDecSections>

            {/* ######### LANGUAGES SECTION */}
            <Section style={{justifyContent: "flex-start",width:"100%"}}>
            <LanguageView 
                lang={user?.langKnown} 
                emoji={"🤓"} 
                color={theme.tertiary}
                title={"Here To Help With"}  />
            
            <LanguageView 
                lang={user?.langToLearn} 
                emoji={"😎"}  
                color={theme.secondary}
                title={"Here To learn"}  />
            </Section>

            {/* ######### BIO  */}
            {user?.bio && <Section>
                <CustomText size={gobalFont.size.default*1.2} fontFam="DM" color={theme.secondary_dark}>Qualcosa di me</CustomText>
                    <CustomText size={gobalFont.size.default}  style={{marginTop: 10}}>
                        {user?.bio}
                    </CustomText>
                </Section>
            }

            {/* ######### ALBUM SECTION  */
                (user?.musicInterest) ? <Section style={{width: "100%"}}>
                    <CustomText size={gobalFont.size.default*1.2} fontFam="DM" color={theme.secondary_dark}>On repeat</CustomText>
                        <AlbumComponent
                            artistName={user?.MIArtistName || ""}
                            albumName={user?.MIAlbumName || ""} 
                            imageUrl={user?.MIImgURL || ""}
                            />
                    </Section>
                : <></>
            }
        </>
    }
    </UserDescWrapper>
}