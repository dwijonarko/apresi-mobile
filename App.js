import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';
import LoginScreen from './pages/Login';
import HomeScreen from './pages/Home';
import CheckinScreen from './pages/Checkin';
import LoadingScreen from './components/Loading';
import Header from './components/Header';
import LogoTitle from './components/LogoTitle';
import constants from './config/constants';
const Stack = createStackNavigator();
export const AuthContext = React.createContext();

export default function App({navigation}) {
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
            status: action.status,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        default:
          return state;
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      status: '',
      username: '',
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        console.log(e);
      }
      dispatch({type: 'RESTORE_TOKEN', token: userToken});
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        dispatch({type: 'SIGN_IN', isLoading: true});
        if (data.username === '' || data.password === '') {
          dispatch({
            type: 'SIGN_IN',
            status: 'Username / Password tidak boleh kosong',
            isLoading: false,
          });
          return;
        }
        fetch(constants.POST_LOGIN_URL, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: data.username,
            password: data.password,
            token: 'siprenta',
          }),
        })
          .then(response => response.json())
          .then(json => {
            if (json.errors === false) {
              dispatch({type: 'SIGN_IN', token: json.token});
              try {
                AsyncStorage.setItem('userToken', json.token);
              } catch (e) {
                console.log(e);
              }
            } else {
              // console.log(json);
              dispatch({type: 'SIGN_IN', status: json.errors});
            }
          })
          .catch(error => {
            console.error(error);
          });
      },
      signOut: async () => {
        dispatch({type: 'SIGN_OUT'});
        try {
          await AsyncStorage.removeItem('userToken');
        } catch (e) {
          console.log(e);
        }
      },
    }),
    [],
  );

  if (state.isLoading) {
    return <LoadingScreen />;
  }
  return (
    <NavigationContainer>
      <AuthContext.Provider value={authContext}>
        {state.userToken == null ? (
          <Stack.Navigator>
            <Stack.Screen name="Login" options={{headerShown: false}}>
              {props => <LoginScreen {...props} status={state.status} />}
            </Stack.Screen>
          </Stack.Navigator>
        ) : (
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerTitle: props => <LogoTitle {...props} />,
                headerRight: () => <Header />,
              }}
            />
            <Stack.Screen
              name="Checkin"
              component={CheckinScreen}
              options={{
                headerRight: () => <Header />,
              }}
            />
          </Stack.Navigator>
        )}
      </AuthContext.Provider>
    </NavigationContainer>
  );
}
