import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from '../App';
// import Button from '../components/Button';
import Loading from '../components/Loading';
import strings from '../config/strings';
import constants from '../config/constants';
import Moment from 'moment';
import {
  Avatar,
  Card,
  Divider,
  Button,
  ListItem,
  Header,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
export default function Home() {
  const {signOut} = React.useContext(AuthContext);
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
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
        setAvatar(json.avatar);
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
    let date = Moment(item.created_at).format('DD-MMMM-YYYY HH:mm');
    return (
      <View style={styles.box}>
        <ListItem
          title={<Text style={{fontWeight: 'bold'}}>{date}</Text>}
          subtitle={
            <Text>
              {' '}
              Location :{item.latitude} {item.longitude}
            </Text>
          }
          bottomDivider
          chevron={{color: 'black'}}
        />
      </View>
    );
  };

  const FlatListItemSeparator = () => {
    return <View style={styles.line} />;
  };

  return isLoading ? (
    <Loading />
  ) : (
    <View style={{marginTop: Platform.OS === 'ios' ? 0 : -20}}>
      <Header
        backgroundColor="#f5f5f5"
        leftComponent={{icon: 'menu', color: '#3b3b3b'}}
        centerComponent={{
          text: 'Home',
          style: {color: '#3b3b3b', fontSize: 16, fontWeight: 'bold'},
        }}
        rightComponent={{icon: 'settings', color: '#3b3b3b'}}
      />
      <Card>
        {
          <View style={styles.user}>
            <Avatar
              size="xlarge"
              rounded
              activeOpacity={0.7}
              source={{
                uri: constants.BASE_URL + avatar,
              }}
            />
            <View style={styles.title}>
              <Text style={styles.titleText}>{name}</Text>
              <Text style={styles.titleText}>{email}</Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Button
                  icon={{
                    name: 'edit',
                    size: 10,
                    color: 'white',
                  }}
                  title="Checkin"
                  buttonStyle={{backgroundColor: '#2196f3'}}
                />
                <Button
                  icon={{
                    name: 'exit-to-app',
                    size: 10,
                    color: 'white',
                  }}
                  title="Logout"
                  buttonStyle={{backgroundColor: '#e57373'}}
                  onPress={signOut}
                />
              </View>
            </View>
          </View>
        }
      </Card>
      <Card>
        <Text style={{marginTop: 25, marginBottom: 10, fontWeight: 'bold'}}>
          Data Checkin Terakhir Anda
        </Text>
        <FlatList
          data={data}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={FlatListItemSeparator}
        />
      </Card>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  line: {
    height: 5,
    marginVertical: 2,
  },
  box: {
    backgroundColor: '#b3e5fc',
  },
  title: {
    width: Dimensions.get('window').width / 2,
    paddingHorizontal: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#f0f0f0',
    marginLeft: 10,
    justifyContent: 'space-around',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: 16,
    flexWrap: 'wrap',
  },
  user: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  userAvatar: {},
});
