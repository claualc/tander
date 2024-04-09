import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { CustomText } from "@components/index";
import { DEVICE_WINDOW_TYPE, SCREEN_TYPES, gobalFont, theme } from "@screens/theme";

export interface BulletpointSelectOption {
    description: string;
    title: string;
    emoji: string;
}

const Item = styled.View`
    width: 100%;
    aspect-ratio: ${DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL ? "5/1": "7/1"};
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: ${`${gobalFont.size.default*0.8}px`};
`

const Bullet = styled.View<{
    selected?: boolean;
}>`
    height:100%;
    border-radius: 25px;
    aspect-ratio: 1;
    background-color: ${p => p.selected ? p.theme.tertiary : p.theme.secondary_background};
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const Description = styled.View<{
    selected?: boolean;
}>`
    height:${Dimensions.get("window").height * 0.1+"px"};
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding-left: 3%;
`

const BulletpointSelect: React.FC<{
    value: string | number; // the selected values
    onSelect: (v: string | number) => void;
    options: BulletpointSelectOption[];
}> = ({value, options, onSelect}) => {

    const [val, setVal] = useState(value);
    return <View 
            style={{
                width: "100%",
                height: "88%",
            }}>
                <ScrollView>
                { options.map((op, i) => {
                    return <TouchableOpacity
                            key={i}
                            onPress={() => {
                                setVal(i)
                                onSelect(i)
                            }}>
                        <Item>
                            <Bullet selected={i==val}>
                                <CustomText 
                                    size={ DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL ? 
                                        30 :  DEVICE_WINDOW_TYPE == SCREEN_TYPES.MEDIUM ? 
                                            38 : gobalFont.size.title }>{op.emoji}</CustomText>
                            </Bullet>
                            <Description style={{flex: 4}}>
                                <CustomText 
                                    size={ DEVICE_WINDOW_TYPE == SCREEN_TYPES.SMALL ? 
                                        gobalFont.size.small :gobalFont.size.default 
                                    } 
                                    color={i==val ? theme.tertiary :theme.tertiary_dark}>
                                    <CustomText 
                                        color={i==val ? theme.tertiary :theme.tertiary_dark}
                                        fontFam="BD">
                                            {op.title} 
                                        </CustomText> 
                                    {": " + op.description}
                                </CustomText>
                            </Description>
                        </Item>
                        </TouchableOpacity>
                    })
                }
                </ScrollView>
            </View>
}

export default BulletpointSelect;