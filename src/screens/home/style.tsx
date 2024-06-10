import { View, ScrollView } from "react-native";
import styled from "styled-components/native";
import { AntDesign, Ionicons, SimpleLineIcons } from "@expo/vector-icons";

import { ColorWrapper, CustomText, Wrapper } from "@components/index";
import { Language } from "@domain/Language";
import { User } from "@domain/User";
import { gobalFont, responsiveValue, theme } from "@screens/globalstyle";
import AlbumComponent from "@components/musicAlbum";


export const UserDescWrapper = styled(Wrapper)`
    padding: ${responsiveValue("1% 7% 0% 7%", "0% 12% 0% 12%","0% 0% 0% 0%")};
    width: ${responsiveValue("100%","100%","54%")};
    align-items: flex-start;
    position: relative;
    margin-top: ${responsiveValue("0%","0%","4%")};
    z-index: 0;
    margin-bottom: ${responsiveValue("7%","100%","5%")};
`
export const UserDecSections = styled.View`
    width: 100%;
    align-items: flex-start;
    flex-direction: row;
    margin-top: 3px;
`

export const Section = styled.View`
    width: 100%;
    align-items: flex-start;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 10px;
`

export const LanguageView: React.FC<{
    lang: Language[];
    emoji: string;
    title: string;
    color: string;
}> = ({ lang, emoji, title, color }) => {

    return <View style={{
        flex:1, width: responsiveValue("100%","100%","50%"),margin: responsiveValue(0,0,"1%")}}>
    <ColorWrapper inColor={color}>
        <View style={{flex:responsiveValue(1,1,2.5), alignItems: "center"}}>
            <CustomText size={gobalFont.size.title*responsiveValue(0.6,1,1)}>{emoji}</CustomText>
        </View>
        <View style={{flex:4,justifyContent: "flex-start", alignItems: "flex-start"}}>
        <CustomText size={gobalFont.size.default}  color={color}>{title}</CustomText>
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
    </View>
}

export const UserDetails: React.FC<{
    user: User;
    show: boolean;
}> = ({ user, show }) => {

    return <UserDescWrapper>
        { show && <>
            {/* ######### BASIC INFO SECTION */}
            <UserDecSections>
                <CustomText size={gobalFont.size.default*responsiveValue(1.5,0.8,1.8)} fontFam="BD">{user?.shortusername || ""}</CustomText>
                <CustomText  size={gobalFont.size.default*responsiveValue(1.4,0.8,1.8)}>{" " + user?.yearsOld}</CustomText>
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
            <Section style={{
                flexDirection: responsiveValue("column","column","row"),
                justifyContent: "flex-start",
                width:responsiveValue("100%","100%","100%")}}>
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
            <View style={{
                width: "100%",
                flexDirection: responsiveValue("column", "column", "row")
                }}>
                {/* ######### BIO  */}
                {user?.bio && <Section style={{
                    width: responsiveValue("100%", "100%", "50%")}}>
                    <CustomText size={gobalFont.size.default*1.2} fontFam="DM" color={theme.secondary_dark}>Qualcosa di me</CustomText>
                        <CustomText size={gobalFont.size.default}  style={{marginTop: 10}}>
                            {user?.bio}
                        </CustomText>
                    </Section>
                }

                {/* ######### ALBUM SECTION  */
                    (user?.musicInterest) ? <Section 
                        style={{
                            width: responsiveValue("100%", "100%", "50%")}}>
                            <CustomText size={gobalFont.size.default*1.2} fontFam="DM" color={theme.secondary_dark}>On repeat</CustomText>
                                <AlbumComponent
                                    artistName={user?.MIArtistName || ""}
                                    albumName={user?.MIAlbumName || ""} 
                                    imageUrl={user?.MIImgURL || ""}
                                    />
                        </Section>
                    : <></>
                }
            </View>
            </>
    }
    </UserDescWrapper>
}