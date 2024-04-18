import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { RootScreenView, LoadingComponent } from '@components/index';
import BottomTabNavigator from '@screens/stackNavigator/bottomTabNavigator';
import { LoggedUserContext, UserContextType } from '@context/user';
import MatchContext from '@context/match';
import { Stack, navigatorRef, stackNavigateTo } from './navigateService';
import { CHAT_MESSAGING_SCREEN, CHAT_SCREEN, HOME_SCREEN, INITIALIZATION_SCREEN, LOGIN_SCREEN, PROFILE_SCREEN, REGISTER_SCREEN } from './routes';

// sreens
import HomeScreen from '@screens/home';
import ProfileScreen from '@screens/editProfile';
import ChatScreen from '@screens/chatHome';
import initializationScreen from '@screens/initialization';
import RegisterScreen from '@screens/register';
import ChatMessagingScreen from '@screens/userChat';
import LoginScreen from '@screens/login';

import HomeIcon from "@imgs/bottomTab/home.png"; 
import OnFocusHomeIcon from "@imgs/bottomTab/on_focus_home.png"; 
import ProfileIcon from "@imgs/bottomTab/profile.png"; 
import OnFocusProfileIcon from "@imgs/bottomTab/on_focus_profile.png"; 
import ChatIcon from "@imgs/bottomTab/chat.png"; 
import OnFocusChatIcon from "@imgs/bottomTab/on_focus_chat.png"; 


// routes
export const auth_routes = [
    { name: HOME_SCREEN, component: HomeScreen ,icon: HomeIcon, onFocusIcon:OnFocusHomeIcon, showInTab: true },
    { name: CHAT_SCREEN, component: ChatScreen ,icon: ChatIcon, onFocusIcon:OnFocusChatIcon, showInTab: true  },
    { name: PROFILE_SCREEN, component: ProfileScreen ,icon: ProfileIcon, onFocusIcon:OnFocusProfileIcon, showInTab: true  },
    { name: CHAT_MESSAGING_SCREEN, component: ChatMessagingScreen, icon: null, onFocusIcon: null, showInTab: false  },
]

export const unauth_routes = [
    { name: INITIALIZATION_SCREEN, component: initializationScreen  },
    { name: LOGIN_SCREEN, component: LoginScreen  },
    { name: REGISTER_SCREEN, component: RegisterScreen },
  ]


const MyStack = () => {

    const { loggedUser, stateLoading, showBottomNav } = React.useContext(LoggedUserContext) as UserContextType;
    const [currentRouteName, setCurrentRouteName] = useState<string>("");

    return <>
            {
                stateLoading && <LoadingComponent /> 
            }
            <RootScreenView showBottomNavigatior={!!loggedUser.id && showBottomNav}>
                <MatchContext loggedUserId={loggedUser?.id}>
                    <NavigationContainer ref={navigatorRef}>
                            <Stack.Navigator 
                                screenListeners={({route}) => ({
                                    state: (e) => {
                                        setCurrentRouteName(route.name)
                                    },
                                })}
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
                </MatchContext>
            </RootScreenView>
        {
            !!loggedUser.id ?
              <BottomTabNavigator 
                    currentRoute={currentRouteName}
                    onSelect={(v) => {stackNavigateTo(v)}} 
                    routes={auth_routes.filter(f => f.showInTab)} />
              : <></>
        }
    </>
}

export default MyStack;
  