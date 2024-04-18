import { CommonActions, StackActions, createNavigationContainerRef } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// stack component
export const Stack = createNativeStackNavigator();
export const navigatorRef = createNavigationContainerRef()

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

export function stackReplaceTo(routeName: string, params: any) {
    if (navigatorRef.isReady()) {
        const resetAction = StackActions.replace(routeName,params);

        navigatorRef.dispatch(resetAction); 
    }
}




