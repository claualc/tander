import axios, { AxiosResponse } from "axios";

console.log("process.env.EXPO_PUBLIC_NOTIFICATIONS_API_URL",process.env.EXPO_PUBLIC_NOTIFICATIONS_API_URL)
const server = axios.create({
    baseURL: process.env.EXPO_PUBLIC_NOTIFICATIONS_API_URL,
});


export const sendPushNotification = async(
    title: string, 
    body: string, 
    data: Object,
    deviceToken: string
) => {

    try {

        const res: AxiosResponse = await server.post(
            "",
            {
                to: deviceToken,
                sound: "default",
                body: body,
                data: { },
                title: title
            },
        );
        console.log(" PushNotSErver.sendPushNotification",res.data)

        return res.data;

    } catch(e: any) {
        console.log("ERROR albumAPI", e)
        throw new Error("..:: PushNotSErver.sendPushNotification: Something went wrong");
    }
       
}