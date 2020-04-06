import {Platform} from 'react-native';

let base_url = 'http://192.168.0.10/siprenta_lite/public/';
const constants = {
  IS_ENV_DEVELOPMENT: __DEV__,
  IS_ANDROID: Platform.OS === 'android',
  IS_IOS: Platform.OS === 'ios',
  IS_DEBUG_MODE_ENABLED: Boolean(window.navigator.userAgent),
  BASE_URL: base_url,
  GET_USER_URL: base_url + 'api/user',
  GET_USER_CHECKIN_URL: base_url + 'api/checkin',
};

export default constants;
