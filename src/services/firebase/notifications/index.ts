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
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    console.log("..:: FCMService ERROR!: permissions not granted")
                    return;
                }


                console.log("PROJECT ID",apiKeys.firebaseConfig.projectId )
                token = (await Notifications.getExpoPushTokenAsync(apiKeys.firebaseConfig)).data
                
                console.log("..:: FCMService initiated")
                console.log("   ",token);

            } else {
                console.log("..:: FCMService ERROR!")
            }

            return token
        },
        schedulePushNotification: async () => {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "You've got mail! 📬",
                body: 'Here is the notification body',
                data: { data: 'goes here' },
              },
              trigger: { seconds: 2 },
            });
        },
      
}

export default FCMService;

