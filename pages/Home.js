import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '../App';
import Button from '../components/Button';
import Loading from '../components/Loading';
import strings from '../config/strings';
import colors from '../config/colors';
import constants from '../config/constants';

export default function Home() {
  const {signOut} = React.useContext(AuthContext);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

  const getUser = async userToken => {
    fetch(constants.GET_USER_URL, {
      headers: {
        Authorization: 'Bearer ' + userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        setName(json.name);
        setEmail(json.email);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(error);
      });
  };

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        getUser(userToken);
      } catch (e) {
        console.log(e);
      }
    };
    bootstrapAsync();
  }, [setEmail, setName]);

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Text>
        {name} {email}
      </Text>
      <Button label={strings.LOGOUT} onPress={signOut} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
