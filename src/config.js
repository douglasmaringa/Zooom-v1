import {Platform} from 'react-native';


// Address to stripe server running on local machine
export const LOCAL_URL = Platform.OS === 'android' ? 'https://zooom-server.herokuapp.com':'https://zooom-server.herokuapp.com' ;

export const API_URL =  LOCAL_URL;