import React from 'react';
import {Image, StyleSheet, View, Text} from 'react-native';
import colors from '../config/colors';
import strings from '../config/strings';
import imageLogo from '../assets/images/logo.png';
import Button from '../components/Button';
import FormTextInput from '../components/FormTextInput';
import {AuthContext} from '../App';

export default function LoginScreen(props) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = React.useContext(AuthContext);
  return (
    <View style={styles.container}>
      <Image source={imageLogo} style={styles.logo} />
      <Text style={{color: '#ff00ff'}}>{props.status} </Text>
      <View style={styles.form}>
        <FormTextInput
          value={username}
          onChangeText={setUsername}
          placeholder={strings.USERNAME_PLACEHOLDER}
        />
        <FormTextInput
          value={password}
          onChangeText={setPassword}
          placeholder={strings.PASSWORD_PLACEHOLDER}
          secureTextEntry={true}
        />
        <Button
          label={strings.LOGIN}
          onPress={() => signIn({username, password})}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    flex: 1,
    width: '40%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    width: '80%',
  },
});
