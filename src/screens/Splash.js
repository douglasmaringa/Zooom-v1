import React, { useState, useEffect } from 'react'
import { KeyboardAvoidingView, Text, View,   Dimensions, Keyboard, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../services/firebase'
import { styles } from '../styles/LoginScreenStyles'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const Splash = ({ navigation }) => {
    const[loading,setLoading]=useState(false)


    useEffect(() => {
        setLoading(true)
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                 setLoading(false)
                navigation.replace('Home')
            }else{
                 setLoading(false)
                navigation.replace("Login")
            }
        })

        return unsubscribe
    }, [])

   

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar style="light" />

            <View style={styles.containerTexts}>
                
                <View style={{display:'flex',paddingBottom:20}}>
                <Text style={{textAlign:'center',marginTop:40,fontSize:36,fontWeight:'700',color:'white'}}>The Zooom</Text>
                {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> : null}

  
  

</View>
            </View>

           
        </KeyboardAvoidingView>
    )
}

export default Splash

