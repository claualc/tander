// sreens
import HomeScreen from '@screens/home';
import ProfileScreen from '@screens/profile';
import ChatScreen from '@screens/chatHome';
import LoginScreen from '@screens/login';
import RegisterScreen from '@screens/register';
import ChatMessagingScreen from '@screens/userChat';

export const HOME_SCREEN = "Home";
export const CHAT_SCREEN = "Chat"; // chat home in tab navigator
export const CHAT_MESSAGING_SCREEN = "ChatMessaging"; // actual chat
export const PROFILE_SCREEN = "Profile";
export const REGISTER_SCREEN = "Register";
export const LOGIN_SCREEN = "Login";

// routes
export const auth_routes = [
    { name: HOME_SCREEN, component: HomeScreen ,icon: "ellipse", showInTab: true },
    { name: CHAT_SCREEN, component: ChatScreen ,icon: "chatbubbles", showInTab: true  },
    { name: PROFILE_SCREEN, component: ProfileScreen ,icon: "person", showInTab: true  },
    { name: CHAT_MESSAGING_SCREEN, component: ChatMessagingScreen ,icon: null, showInTab: false  },
]

export const unauth_routes = [
    { name: REGISTER_SCREEN, component: RegisterScreen },
    { name: LOGIN_SCREEN, component: LoginScreen  },
  ]
