import React, { useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootScreenView } from '@components/index';
import BottomTabNavigator from '@components/bottomTabNavigator';
import LoadingComponent from '@components/loading';
import { LoggedUserContext, UserContextType } from './context';

// sreens
import HomeScreen from './home';
import MyLikesScreen from './myLikes';
import ProfileScreen from './profile';
import ChatScreen from './chatHome';
import { CommonActions, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import LoginScreen from './login';
import RegisterScreen from './register';
import ChatMessagingScreen from './userChat';

const HOME_SCREEN = "Home";
const CHAT_SCREEN = "Chat"; // chat home in tab navigator
const CHAT_MESSAGING_SCREEN = "ChatMessaging"; // actual chat
const PROFILE_SCREEN = "Profile";
const MYLIKES_SCREEN = "MyLikes";
const REGISTER_SCREEN = "Register";
const LOGIN_SCREEN = "Login";

export const routeNames = {
    HOME_SCREEN,
    CHAT_SCREEN,
    PROFILE_SCREEN,
    MYLIKES_SCREEN,
    REGISTER_SCREEN,
    LOGIN_SCREEN,
    CHAT_MESSAGING_SCREEN,
}

// routes
export const auth_routes = [
    { name: HOME_SCREEN, component: HomeScreen ,icon: "ellipse", showInTab: true },
    { name: CHAT_SCREEN, component: ChatScreen ,icon: "chatbubbles", showInTab: true  },
    { name: MYLIKES_SCREEN, component: MyLikesScreen ,icon: "star", showInTab: true  },
    { name: PROFILE_SCREEN, component: ProfileScreen ,icon: "person", showInTab: true  },
    { name: CHAT_MESSAGING_SCREEN, component: ChatMessagingScreen ,icon: null, showInTab: false  },
]

export const unauth_routes = [
    { name: REGISTER_SCREEN, component: RegisterScreen },
    { name: LOGIN_SCREEN, component: LoginScreen  },
  ]

// stack component
const Stack = createNativeStackNavigator();
const navigatorRef = createNavigationContainerRef()

export function stackNavigateTo(routeName: string, params?: any) {
    if (navigatorRef.isReady()) {
        navigatorRef.dispatch(CommonActions.navigate(routeName, params));
    }
}


export function stackGetParams() {
    if (navigatorRef.isReady()) {
        return navigatorRef.getCurrentRoute()?.params
    }
    return null
}

const MyStack = () => {

    const { loggedUser, stateLoading, showBottomNav } = React.useContext(LoggedUserContext) as UserContextType;

    return <>
            {
                stateLoading && <LoadingComponent /> 
            }
            <RootScreenView showBottomNavigatior={!!loggedUser.id && showBottomNav}>
                <NavigationContainer ref={navigatorRef}>
                        <Stack.Navigator 
                            screenOptions={{headerShown: false}}>
                                {
                                    !!loggedUser.id ? auth_routes.map((
                                        {name,  component}) => <Stack.Screen key={name} name={name} component={component} />
                                    ) : unauth_routes.map((
                                        {name,  component}) => <Stack.Screen key={name} name={name} component={component} />
                                    )
                                }
                        </Stack.Navigator>
                </NavigationContainer>
            </RootScreenView>
        {
            !!loggedUser.id && showBottomNav ?
              <BottomTabNavigator onSelect={(v) => {stackNavigateTo(v)}} routes={auth_routes.filter(f => f.showInTab)} />
              : <></>
        }
    </>
}

export default MyStack;
  