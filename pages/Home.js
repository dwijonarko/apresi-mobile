import React from 'react';
import {StyleSheet, View, Text, FlatList, TouchableOpacity,Dimensions} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '../App';
import Button from '../components/Button';
import Loading from '../components/Loading';
import strings from '../config/strings';
import colors from '../config/colors';
import constants from '../config/constants';
import Moment from 'moment';
export default function Home() {
  const {signOut} = React.useContext(AuthContext);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [data, setData] = React.useState([]);
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
  const getUserCheckin = async userToken => {
    fetch(constants.GET_USER_CHECKIN_URL, {
      headers: {
        Authorization: 'Bearer ' + userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        setData(json);
        setIsLoading(false);
        // console.log(json);
      })
      .catch(error => {
        console.error(error);
      });
  };
  React.useEffect(() => {
    let userToken;
    const bootstrapAsync = async () => {
      try {
        userToken = await AsyncStorage.getItem('userToken');
        getUser(userToken);
        getUserCheckin(userToken);
      } catch (e) {
        console.log(e);
      }
    };
    bootstrapAsync();
  }, [setEmail, setName, setData]);

  const renderItem = item => {
    let date = Moment(item.created_at).format('DD-MM-YYYY HH:mm');
    return (
      <View style={styles.box}>
        <TouchableOpacity>
          <Text>Tanggal-Waktu {date}</Text>
          <Text>
            Lokasi {item.latitude},{item.longitude}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const FlatListItemSeparator = () => {
    return <View style={styles.line} />;
  };

  return isLoading ? (
    <Loading />
  ) : (
    <View style={styles.container}>
      <Text>
        {name} {email}
      </Text>
      <FlatList
        data={data}
        renderItem={({item}) => renderItem(item)}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={FlatListItemSeparator}
      />
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
  },
  line: {
    height: 5,
    marginVertical: 2,
  },
  box: {
    width:Dimensions.get('window').width,
    flex:1,
    borderRadius: 5,
    marginVertical: 1,
    backgroundColor: '#eeeeee',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
