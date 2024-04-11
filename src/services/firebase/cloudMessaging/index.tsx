// import messaging from '@react-native-firebase/messaging';
// import { Alert } from 'react-native';
// import {PermissionsAndroid} from 'react-native';

// async function requestUserPermission() {
//     const authStatus = await messaging().requestPermission();
//     const enabled =
//       authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//       authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
//     if (enabled) {
//       console.log('Authorization status:', authStatus);
//     }
//   }

  
//   const FCMService = () => {
  
//       let pushNotificationToken: string;
  
//       return {
//           initAsyncService: async () => {
//             let token;
//             // requets permissions
            
//             try {
//                 PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
//             } catch(e) {
//                 console.log("e", e)
//             }

//             const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
//                 Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
//             });

//             messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
//                 console.log('Message handled in the background!', remoteMessage);
//             });

//             // Handle background messages using setBackgroundMessageHandler
//             messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
//                 console.log('Message handled in the background!', remoteMessage);
//             });
  
          
//             return unsubscribe;
        
//           },
//           schedulePushNotification: async (
//               title: string, 
//               body: string, 
//               data: Object,
//               authToken: string,
//               deviceToken: string
//             ) => {

//           },
//           getDeviceToken: async () => {
              
//             await messaging().registerDeviceForRemoteMessages();
//             const token = await messaging().getToken();
//             return token
//           }
//       }
//   };
  
//   export default FCMService();
  
  