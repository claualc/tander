import React, { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import apiKeys from "./../keys";


const FCMService = {
        initFCMAsyncService: async () => {
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
                console.log("setNotificationChannelAsync")
                await Notifications.setNotificationChannelAsync(
                    'default', {
                        name: 'default',
                        importance: Notifications.AndroidImportance.MAX,
                        vibrationPattern: [0, 250, 250, 250],
                        lightColor: '#FF231F7C',
                    }
                );
            }

            if (Device.isDevice) {
                // ask the user for the notification permissions 
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                
                if (existingStatus !== 'granted') {
                    try{
                        const { status } = await Notifications.requestPermissionsAsync();
                        finalStatus = status;
                    } catch(error) {
                        console.log(error)
                    }
                }
                if (finalStatus !== 'granted') {
                    console.log("..:: FCMService ERROR!: permissions not granted")
                    return;
                }

                console.log("EXPO_PROJECT_ID",process.env.EXPO_PUBLIC_EXPO_PROJECT_ID)

                token = (await Notifications.getExpoPushTokenAsync({
                     projectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID  })).data
                
                console.log("..:: FCMService initiated", token)

            } else {
                console.log("..:: FCMService ERROR!")
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
      
}

export default FCMService;

