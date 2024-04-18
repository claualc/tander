import LoginScreen from '@screens/login';
import { render,waitFor } from "@testing-library/react-native";
import UserContext from "@context/user";
import InitializationScreen from '@screens/initialization';
import ProfileScreen from '@screens/profile';
import HomeScreen from '@screens/home';
import ChatScreen from '@screens/chatHome';
import RegisterScreen from '@screens/register';
import UserChatScreen from "@screens/userChat";
import Main from '@screens/index';
import { MatchContext } from '@context/match';

describe("Render Components Test Suit", () => {

  test('App render ', async () => {
    const component = await render(<Main/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('LoginScreen render ', async () => {
    const component = await render(<LoginScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('InitializationScreen render ', async () => {
    const component = await render(<InitializationScreen/>);

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('EditProfileScreen render ', async () => {
    const component = await render(<ProfileScreen/>);

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('HomeScreen render ', async () => {
    const component = await render( 
      <MatchContext.Provider value={{
        potentialMatches: [],
        setPotentialMatches: () => {},
        loadMoreMatches: () => Promise.resolve(),
      }}><HomeScreen/>
      </MatchContext.Provider>
    , {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('ChatHomeScreen render ', async () => {
    const component = await render( <ChatScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('ChatScreen render ', async () => {
    const component = await render( <UserChatScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('RegisterScreen render ', async () => {
    const component = await render( <RegisterScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

})
