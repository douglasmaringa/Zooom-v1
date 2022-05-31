import React, { useState } from 'react'
import { KeyboardAvoidingView, StyleSheet, View, TouchableOpacity, Text, TextInput, Keyboard, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { auth,db } from '../services/firebase'
import { styles } from '../styles/RegisterScreenStyles'
import firebase from 'firebase'
import { generateKeyPair } from "../utils/crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const PRIVATE_KEY = "PRIVATE_KEY";

const RegisterScreen = ({ navigation }) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [imageURL, setImageURL] = useState('')
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
                    email:email,
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

                <TextInput
                    placeholder="Profile Picture URL (optional)"
                    type="text"
                    value={imageURL}
                    onChangeText={(text) => setImageURL(text)}
                    onSubmitEditing={register}
                    style={styles.input}
                    placeholderTextColor='grey'
                />
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
