import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootScreenView } from '@components/index';
import BottomTabNavigator from '@components/bottomTabNavigator';

// sreens
import HomeScreen from './home';
import MyLikesScreen from './myLikes';
import ProfileScreen from './profile';
import ChatScreen from './chat';
import { CommonActions, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import LoginScreen from './login';
import RegisterScreen from './register';
import { LoggedUserContext, UserContextType } from './context';

export const HOME_SCREEN = "Home";
export const CHAT_SCREEN = "Chat";
export const PROFILE_SCREEN = "Profile";
export const MYLIKES_SCREEN = "MyLikes";
export const REGISTER_SCREEN = "Register";
export const LOGIN_SCREEN = "Login";


// routes
export const auth_routes = [
    { name: HOME_SCREEN, component: HomeScreen ,icon: "ellipse" },
    { name: PROFILE_SCREEN, component: ProfileScreen ,icon: "person" },
    { name: CHAT_SCREEN, component: ChatScreen ,icon: "chatbubbles" },
    { name: MYLIKES_SCREEN, component: MyLikesScreen ,icon: "star" },
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

const MyStack = () => {

    const { loggedUser, setLoggedUser } = React.useContext(LoggedUserContext) as UserContextType;

    return <>
            <RootScreenView showBottomNavigatior={!!loggedUser}>
                <NavigationContainer ref={navigatorRef}>
                        <Stack.Navigator 
                            screenOptions={{headerShown: false}}>
                                {
                                    loggedUser ? auth_routes.map((
                                        {name,  component}) => <Stack.Screen key={name} name={name} component={component} />
                                    ) : unauth_routes.map((
                                        {name,  component}) => <Stack.Screen key={name} name={name} component={component} />
                                    )
                                }
                        </Stack.Navigator>
                </NavigationContainer>
            </RootScreenView>
        {
            loggedUser ?
              <BottomTabNavigator onSelect={(v) => {stackNavigateTo(v)}} routes={auth_routes} />
              : <></>
        }
    </>
}

export default MyStack;
  