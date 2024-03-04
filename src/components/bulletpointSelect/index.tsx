import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Dimensions, ScrollView, TouchableOpacity, View } from "react-native";
import { CustomText } from "@components/index";
import { theme } from "@screens/theme";

export interface BulletpointSelectOption {
    description: string;
    title: string;
    emoji: string;
}

const Item = styled.View`
    width: 100%;
    aspect-ratio: 5/1;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 7%;
`

const Bullet = styled.View<{
    selected?: boolean;
}>`
    aspect-ratio: 1/1;
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
                height: "100%",
                justifyContent: "flex-start"
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
                            <Bullet style={{flex: 1,borderRadius: 25}} selected={i==val}>
                                <CustomText size={30}>{op.emoji}</CustomText>
                            </Bullet>
                            <Description style={{flex: 4}}>
                                <CustomText 
                                    size={16}   
                                    color={i==val ? theme.tertiary :theme.tertiary_dark}>
                                    <CustomText
                                        size={16}           
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