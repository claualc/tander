import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootScreenView } from '@components/index';
import BottomTabNavigator from '@components/bottomTabNavigator';
import LoadingComponent from '@components/loading';
import { LoggedUserContext, UserContextType } from '@screens/contexts/user';
import { CommonActions, NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { CHAT_MESSAGING_SCREEN, CHAT_SCREEN, HOME_SCREEN, LOGIN_SCREEN, PROFILE_SCREEN, REGISTER_SCREEN, auth_routes, unauth_routes } from './routes';
import MatchContext from '@screens/contexts/match';

// stack component
const Stack = createNativeStackNavigator();
const navigatorRef = createNavigationContainerRef()

export const routeNames = {
    HOME_SCREEN,
    CHAT_SCREEN,
    PROFILE_SCREEN,
    REGISTER_SCREEN,
    LOGIN_SCREEN,
    CHAT_MESSAGING_SCREEN,
}

export function stackNavigateTo(routeName: string, params?: any,metadata?: any) {
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
                <MatchContext loggedUser={loggedUser}>
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
                </MatchContext>
            </RootScreenView>
        {
            !!loggedUser.id && showBottomNav ?
              <BottomTabNavigator 
                    onSelect={(v) => {stackNavigateTo(v)}} 
                    routes={auth_routes.filter(f => f.showInTab)} />
              : <></>
        }
    </>
}

export default MyStack;
  