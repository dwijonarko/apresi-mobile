import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loading from '../components/Loading';
import constants from '../config/constants';
import Moment from 'moment';
import {Avatar, Card, Button, ListItem} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Home({navigation}) {
  const [user_id, setUserId] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [data, setData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [token, setToken] = React.useState(true);

  const getUser = userToken => {
    fetch(constants.GET_USER_URL, {
      headers: {
        Authorization: 'Bearer ' + userToken,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        setUserId(json.id);
        setName(json.name);
        setEmail(json.email);
        setAvatar(json.avatar);
      })
      .catch(error => {
        console.error(error);
      });
  };
  const getUserCheckin = userToken => {
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
        // console.log(json);
      })
      .catch(error => {
        console.error(error);
      });
  };
  React.useEffect(() => {
    AsyncStorage.getItem('userToken', (error, userToken) => {
      // console.log(userToken);
      setToken(userToken);
      if (userToken) {
        getUser(userToken);
        getUserCheckin(userToken);
        setIsLoading(false);
      }
    });
  }, []);

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
          onPress={() =>
            navigation.navigate('Detail', {
              id: item.id,
              latitude: item.latitude,
              longitude: item.longitude,
              date: date,
              image_front: item.image_front,
              image_back: item.image_back
            })
          }
        />
      </View>
    );
  };

  const FlatListItemSeparator = () => {
    return <View style={styles.line} />;
  };

  const refreshList = () => {
    fetch(constants.GET_USER_CHECKIN_URL, {
      headers: {
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => {
        setData(json);
        // console.log(json);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return isLoading ? (
    <Loading />
  ) : (
    <View style={{flex: 1}}>
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
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                <Button
                  icon={{
                    name: 'edit',
                    size: 15,
                    color: 'white',
                  }}
                  title="Checkin"
                  titleStyle={{fontSize: 12}}
                  buttonStyle={{backgroundColor: '#2196f3',paddingHorizontal:50}}
                  onPress={() =>
                    navigation.navigate('Checkin', {user_id: user_id})
                  }
                />
                
              </View>
            </View>
          </View>
        }
      </Card>
      <SafeAreaView
        style={{
          height: '60%',
          marginTop: 10,
          marginHorizontal: 16,
          backgroundColor: 'white',
        }}>
        <Text
          style={{
            marginTop: 10,
            paddingBottom: 15,
            fontWeight: 'bold',
            fontSize: 20,
            paddingHorizontal: 10,
            borderBottomColor: '#f0f0f0',
            borderBottomWidth: 1,
          }}>
          Data Checkin Terakhir Anda
        </Text>
        <FlatList
          data={data}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={FlatListItemSeparator}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={refreshList} />
          }
        />
      </SafeAreaView>
      <View style={styles.footer}>
        <Text>
          Build with{' '}
          <Icon raised name="heart" type="font-awesome" color="#f50" /> From
          @dwijonarko
        </Text>
      </View>
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
  footer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    justifyContent:"center",
    flexDirection:"row",
    width: '100%',
  },
});
