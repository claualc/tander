import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { User } from "@domain/User";
import Card from "@components/userCard";
import { ScreenView } from "@components/index";

import { UserDetails } from "@screens/home/style";
import { stackGetParams } from "@screens/stackNavigator/navigateService";

interface ProfileParams {
  user: User;
}
const ProfileScreen: React.FC = () => {
  const [user, setUser] = useState<User>({} as User);
  
  useEffect(() => {
    const params = stackGetParams() as ProfileParams
    setUser(params?.user)
  }, [])

  return <ScreenView>
          <ScrollView
                style={{ height: "100%", width: "100%", zIndex:1 }}
                contentContainerStyle={{flexGrow:1, justifyContent: "flex-end", alignItems: "center", paddingBottom: "10%"}}
                scrollEnabled={true}>
                 <Card
                  zIndex={1}
                  user={user}
                  onScrollUp={() => { } }
                  onScrollDown={() => { } }
                  onSwipeLeft={() => { } }
                  onSwipeRigth={() => { } }
                  isScrolledUp={true}
                  renderController={true} top={""}   /> 

                  <UserDetails user={user} show={true} />
            </ScrollView>
    </ScreenView>
}

export default ProfileScreen;
