
import {Platform} from "react-native";

const constants={
    IS_ENV_DEVELOPMENT:__DEV__,
    IS_ANDROID: Platform.OS ==="android",
    IS_IOS: Platform.OS==="ios",
    IS_DEBUG_MODE_ENABLED: Boolean(window.navigator.userAgent),
    GET_USER_URL:'http://192.168.0.10/siprenta_lite/public/api/user',
    GET_USER_CHECKIN_URL:'http://192.168.0.10/siprenta_lite/public/api/checkin',
};

export default constants;