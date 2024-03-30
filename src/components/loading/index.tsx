import { Image, View } from "react-native";
import Loading from "@assets/loading.gif";


const LoadingComponent = () => {
    return <View
        style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            right: 0,
            backgroundColor: "blue",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 100
        }}>
            <Image source={Loading} style={{ width: "30%", height: "30%" }} />
    </View>
}

export default LoadingComponent;