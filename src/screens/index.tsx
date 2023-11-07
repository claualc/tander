import "@serv/firebase";


import React, { useEffect, useCallback } from 'react';
import {Button, Text, View} from 'react-native';
import userService from '@api/userService';


export type Props = {
  name?: string;
  baseEnthusiasmLevel?: number;
};

const App: React.FC<Props> = () => {

  const testFirestore = useCallback(async () => {
    const users = await userService.listAll();
    console.log("USEEERSS")
    console.log(users)
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