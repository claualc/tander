import axios, { AxiosError, AxiosResponse } from "axios";

const server = axios.create({
    baseURL: `http://${process.env.EXPO_PUBLIC_NOTIFICATIONS_API_URL}`,
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

    } catch(e) {
        if (e instanceof AxiosError)
            console.log("ERROR sendPushNotification", e.isAxiosError, e.toJSON(), e.code, e.message, e.message)
        throw new Error("..:: PushNotSErver.sendPushNotification: Something went wrong");
    }
       
}