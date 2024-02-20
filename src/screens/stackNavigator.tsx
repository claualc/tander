import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './home';
import MyLikesScreen from './myLikes';
import ProfileScreen from './profile';
import ChatScreen from './chat';
import { CommonActions, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';

const HOME_SCREEN = "Home";
const CHAT_SCREEN = "Chat";
const PROFILE_SCREEN = "Profile";
const MYLIKES_SCREEN = "MyLikes";

export const routes = [
    { name: HOME_SCREEN, component: HomeScreen ,icon: "ellipse" },
    { name: MYLIKES_SCREEN, component: MyLikesScreen ,icon: "star" },
    { name: CHAT_SCREEN, component: ChatScreen ,icon: "chatbubbles" },
    { name: PROFILE_SCREEN, component: ProfileScreen ,icon: "person" },
  ]
  
const Stack = createNativeStackNavigator();
const navigatorRef = createNavigationContainerRef()

export function stackNavigateTo(routeName: string, params?: any) {
    if (navigatorRef.isReady()) {
        navigatorRef.dispatch(CommonActions.navigate(routeName, params));
    }
  }

const MyStack = () => {
    return (
        <NavigationContainer ref={navigatorRef}>
            <Stack.Navigator 
                initialRouteName={HOME_SCREEN} 
                screenOptions={{headerShown: false}}>
                {
                    routes.map((
                        {name, component}) => <Stack.Screen key={name} name={name} component={component} />
                    )
                }
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default MyStack;
  