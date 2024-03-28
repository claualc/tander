import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';


const FCMService = () => {

    let pushNotificationToken: string;

    return {
        initAsyncService: async () => {
            let token;

            // First, set the handler that will cause the notification
            // to show the alert
            Notifications.setNotificationHandler({
                handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
                }),
            });
            
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync(
                    'default', {
                        name: 'default',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#FF231F7C',
                    }
                );
            }

            let finalStatus;
            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                finalStatus = existingStatus;
                
                if (existingStatus !== 'granted') {
                    console.log("  FCM asking for notification permission")
                    try{
                        const { status } = await Notifications.requestPermissionsAsync();
                        finalStatus = status;
                    } catch(error) {
                        console.log(error)
                    }
                }
                if (finalStatus !== 'granted') {
                    console.log("  FCM permissions not granted, status: ", finalStatus)
                    console.log("..:: FCMService ERROR!: permissions not granted")
                    return;
                }

                token = (await Notifications.getExpoPushTokenAsync({
                     projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID  })).data
                
                pushNotificationToken = token;
                
                console.log("..:: FCMService initiated")
                console.log("      status:", existingStatus)

            } else {
                console.log("..:: FCMService ERROR!")
                console.log("      status:", finalStatus)
            }

            return token
        },
        schedulePushNotification: async (
            title: string, 
            body: string, 
            data: Object) => {
            await Notifications.scheduleNotificationAsync({
            
              content: {
                title, body, data
                },
              trigger: { seconds: 2 },
            });
        },
        getDeviceToken: () => {
            
            // Regular expression pattern to match the string inside the square brackets
            const regex = /\[(.*?)\]/;
            
            // Extracting the string inside the square brackets using match function
            const match = pushNotificationToken.match(regex);
            
            return match ? match[1] : "";
        }
    }
};

export default FCMService();

