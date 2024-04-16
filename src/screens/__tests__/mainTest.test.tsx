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

/**
 * import {helper as helperOriginal} from "moduleB";
 * const helper = helperOriginal as jest.Mock;
 * or
 * when a fucniton is not rexognixe:. jest.mock("moduleB");
 * (func as jest.Mock).mockReturnValue(true);
 * import it normally
 * altough the call to jest.mock occures later, it will be executed before any imports are made. Therefore, helper is an instance of jest.fn() in our test file.
 */ 

describe("Render Components", () => {

  test('App renders correctly ', async () => {
    const component = await render(<Main/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('LoginScreen renders correctly ', async () => {
    const component = await render(<LoginScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('InitializationScreen renders correctly ', async () => {
    const component = await render(<InitializationScreen/>);

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('EditProfileScreen renders correctly ', async () => {
    const component = await render(<ProfileScreen/>);

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('HomeScreen renders correctly ', async () => {
    const component = await render( <MatchContext.Provider value={{
      potentialMatches: [],
      setPotentialMatches: () => {},
      loadMoreMatches: () => Promise.resolve(),
    }}><HomeScreen/></MatchContext.Provider>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('ChatHomeScreen renders correctly ', async () => {
    const component = await render( <ChatScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('ChatScreen renders correctly ', async () => {
    const component = await render( <UserChatScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

  test('RegisterScreen renders correctly ', async () => {
    const component = await render( <RegisterScreen/>, {wrapper: UserContext});

    await waitFor(() => {
      expect(component).toBeDefined()
    });
  });

})
