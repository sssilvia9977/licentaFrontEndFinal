import base64 from 'react-native-base64';

export const BASE_URL = "http://192.168.43.239:8080";
//const BASE_URL = "http://192.168.1.3:19000";

export function headers(username, password){
    const authorization = "Basic " + base64.encode(`${username}:${password}`);
    return  {
        'Authorization' : authorization
    };
}


