import React,{useEffect,useState} from "react";
import { View, Text, Pressable, Alert,Dimensions,Image,ActivityIndicator } from "react-native";
import { generateKeyPair } from "../utils/crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase";
import { db,auth,storage } from "../services/firebase";
import { styles } from '../styles/HomeScreenStyles'
import {
  
  Feather,
 
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio, AVPlaybackStatus } from "expo-av";

export const PRIVATE_KEY = "PRIVATE_KEY";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Settings = ({navigation}) => {
 
    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

  return (
    <View style={styles.container}>
      <Pressable
        onPress={()=>{navigation.navigate("ProfileSettings")}}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Profile Settings</Text>
      </Pressable>
      <Pressable
        onPress={()=>{navigation.navigate("PrivacySettings")}}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Privacy Settings</Text>
      </Pressable>
      <Pressable
        onPress={()=>{navigation.navigate("PaymentSettings")}}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Payment Settings</Text>
      </Pressable>
     <Pressable
        onPress={signOutUser}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Settings;