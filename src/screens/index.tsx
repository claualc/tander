import React, { useEffect, useCallback } from 'react';
import {Button, Text, View} from 'react-native';

import userService from '@serv/userService';
import "@serv/firebase"; // import to initiate the firebase module
import FCMService from '@serv/firebase/notifications';

export type Props = {
  name?: string;
  baseEnthusiasmLevel?: number;
};

const App: React.FC<Props> = () => {

  useEffect(() => {
    (async () => await FCMService.initFCMAsyncService())();
  }, [])

  const testFirestore = useCallback(async () => {
    const users = await userService.listAll();
    console.log("users ################################")
    const not  = await FCMService.schedulePushNotification(
      "Tander","Deu match!!! 😘💕💖😎", { data: 'goes here' }
    )
    console.log(not)
  }, []);

  return (
    <View>
      <Text>
       uaydiuyaeuhrelkjlkjf dlsjfekdjfò j
      </Text>
      <Button
        onPress={testFirestore}
        title="testFirestore"
        color="#841584"
      />
    </View>
  );
};

export default App;