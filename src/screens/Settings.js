import React from "react";
import { View, Text, Pressable, Alert } from "react-native";
import { generateKeyPair } from "../utils/crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase";
import { db,auth } from "../services/firebase";
import { styles } from '../styles/HomeScreenStyles'

export const PRIVATE_KEY = "PRIVATE_KEY";

const Settings = ({navigation}) => {

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

  const updateKeyPair = async () => {
    // generate private/public key
    const { publicKey, secretKey } = generateKeyPair();
    console.log(publicKey, secretKey);

    // save private key to Async storage
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    console.log("secret key was saved");

    // save public key to UserModel in Datastore
   
   var user = firebase.auth().currentUser;
   //var res = [];
    await db.collection("users").where("email", "==", user.email)
   .onSnapshot((querySnapshot) => {
      
       const res = (querySnapshot.docs.map(doc => ({id: doc.id})))
       console.log(res[0]?.id)
       if(!res){
        Alert.alert("User not found!");
         return;
       }
       db.collection('users').doc(res[0]?.id).update({
        publicKey:publicKey.toString(),
        })

      })
    
      
  
    Alert.alert("Successfully updated the keypair.");
  };

  return (
    <View style={styles.container}>
      <Pressable
        onPress={updateKeyPair}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text>Update keypair</Text>
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