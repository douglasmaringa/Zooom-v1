import React, { useState,useEffect } from 'react'
import { KeyboardAvoidingView, StyleSheet, View, TouchableOpacity,Pressable, Text, TextInput, Keyboard, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { auth,db,storage } from '../services/firebase'
import { styles } from '../styles/RegisterScreenStyles'
import firebase from 'firebase'
import { generateKeyPair } from "../utils/crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  
    Feather,
   
  } from "@expo/vector-icons";
  import * as ImagePicker from "expo-image-picker";


export const PRIVATE_KEY = "PRIVATE_KEY";

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageURL, setImageURL] = useState('')
    const [image, setImage] = useState('')
    const [loading, setLoading] = useState(false)

    const register = () =>  {
        setLoading(false)

        auth
            .createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: name,
                    photoURL: imageURL || 'https://secure.gravatar.com/avatar/d3afc60628a78f856952f6d76a2f37b8?s=150&r=g&d=https://delivery.farmina.com.br/wp-content/plugins/userswp/assets/images/no_profile.png',
                })
                 db.collection('users').add({
                    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                    email:email.toLowerCase(),
                    name:name,
                    image:imageURL || 'https://secure.gravatar.com/avatar/d3afc60628a78f856952f6d76a2f37b8?s=150&r=g&d=https://delivery.farmina.com.br/wp-content/plugins/userswp/assets/images/no_profile.png',
                    userid:authUser.user.uid,
                    chatroom:[],
                    friends:[],
                   
                  }).then((res)=>{
                      console.log("done",res.id)

                      //generate key pair 
                      // generate private/public key
                    const { publicKey, secretKey } = generateKeyPair();
                    console.log(publicKey, secretKey);

                    // save private key to Async storage
                    AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString()).then(()=>{
                    console.log("secret key was saved");

                    // save public key to UserModel in Datastore
                     db.collection('users').doc(res?.id).update({
                     publicKey:publicKey.toString(),
                      })
                    }).catch((error)=>{
                        alert("failed to generate private key")
                    })
                      
                    //Alert.alert("Successfully updated the keypair.");
                  }).catch(error => alert(error.message))
                  })
            .catch(error => alert(error.message))

        Keyboard.dismiss()
        setLoading(true)
    }

    //image permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libraryResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
       

        if (
          libraryResponse.status !== "granted" ||
          photoResponse.status !== "granted"
        ) {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

 
  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  //sending image
  const sendImage = async () => {
   

    if (!image) {
        alert("pick image please")
      return;
    }
    setLoading(true)
    const blob = await getBlob(image);
   

    const uploadTask = storage.ref(`/images/${image}`).put(blob)
    uploadTask.on('state_changed',(snapShot)=>{
        console.log(snapShot)
    },(err)=>{
      console.log(JSON.stringify(err));
      setLoading(false)
    },()=>{
        storage.ref('images').child(image).getDownloadURL().then(firebaseUrl=>{
            
          setImageURL(firebaseUrl)
          alert("Image uploaded")
          setLoading(false)
          
        })
    })

    
  };

  const getBlob = async (uri) => {
    const respone = await fetch(uri);
    const blob = await respone.blob();
    return blob;
  };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.containerTexts}>
                <Text style={styles.welcomeTitle}>
                    Create new account
                </Text>
                <Text style={styles.welcomeText}>
                    Please fill in the forms to continue
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Full name"
                    type="text"
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={styles.input}
                    placeholderTextColor='grey'
                />

                <TextInput
                    placeholder="E-mail"
                    type="email"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    style={styles.input}
                    placeholderTextColor='grey'
                />

                <TextInput
                    placeholder="Password"
                    type="password"
                    value={password}
                    secureTextEntry
                    onChangeText={(text) => setPassword(text)}
                    style={styles.input}
                    placeholderTextColor='grey'
                />
                <View style={{display:'flex',flexDirection:'row'}}>
                <Pressable style={{ alignItems: "center",
          justifyContent: "center",paddingHorizontal:10}} onPress={takePhoto}>
            <Feather
              name="camera"
              size={24}
              color={image?"#d1d420":"#f5f5f5"}
              
            />
          </Pressable>

          <Pressable style={{ alignItems: "center",
          justifyContent: "center",paddingHorizontal:10}} onPress={pickImage}>
            <Feather
              name="image"
              size={24}
              color={image?"#d1d420":"#f5f5f5"}
            />
          </Pressable>
         <Pressable
        onPress={sendImage}
        style={{
          backgroundColor:imageURL?"#0c2608":"grey",
          height: 35,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius:20,
         paddingHorizontal:10,
          color:'white'
        }}
      >
          <Text style={{color:'white'}}>Pick Image then Upload</Text>
           </Pressable>
            </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={register}
            >
                <Text style={styles.buttonText}>
                    SIGN UP
                </Text>
            </TouchableOpacity>

            {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> : null}

            <TouchableOpacity
                style={{ position: 'absolute', bottom: 40 }}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={{ color: '#C7C6CD' }}>
                    Have an account? <Text style={{ color: '#1D51EF', fontWeight: 'bold' }}>Sign In</Text>
                </Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default RegisterScreen
