import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { sendPushNotification } from '@serv/axios/pushNotifications';


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
            token: string) => {
            // await Notifications.scheduleNotificationAsync({
            //   content: {
            //     title, body, data: {}
            //     },
            //   identifier: token,
            //   trigger: { seconds: 2 }
            // });
            sendPushNotification(
                title,
                body,
                {},
                token
            );

        },
        getDeviceToken: () => {
            return pushNotificationToken;
        }
    }
};

export default FCMService();

