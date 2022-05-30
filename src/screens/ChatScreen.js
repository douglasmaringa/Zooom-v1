import React, { useLayoutEffect,useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { db, auth } from '../services/firebase'
import * as firebase from 'firebase'
import { styles } from '../styles/ChatScreenStyles'
import MessageInput from '../components/MessageInput'
import Message from '../components/Message'
import { Header } from '@react-navigation/stack';


const ChatScreen = ({ navigation, route }) => {

    console.log(route.params.id)

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [me, setMe] = useState("")
    const [other, setOther] = useState("")

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerTitle: () => (
                <Text style={styles.headerTitle}>
                    {route.params.name}
                </Text>
            ),
            headerLeft: () => (
                <TouchableOpacity
                    style={{ marginLeft: 15 }}
                    onPress={navigation.goBack}
                >
                    <Ionicons
                        name="chevron-back"
                        size={30}
                        color="#1D51EF"
                    />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <TouchableOpacity>
                    <Ionicons
                        name="ellipsis-vertical"
                        size={20}
                        color="#1D51EF"
                        style={{ marginRight: 15 }}
                    />
                </TouchableOpacity>
            )
        })
    }, [navigation, messages])

    const sendMessage = () => {
        Keyboard.dismiss()

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: new Date(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput('')
    }

    useEffect(() => {
        
            db.collection("chatroom").doc(route.params.id)
            .onSnapshot((querySnapshot) => {
                setMessages(querySnapshot.data().messages)
                console.log(querySnapshot.data().members)

                if(querySnapshot.data()){
                var user = firebase.auth().currentUser;
                if(querySnapshot.data().members[0] === user.email){
                   setOther(querySnapshot.data().members[1])
                   setMe(querySnapshot.data().members[0])
                 }else {
                  setOther(querySnapshot.data().members[0])
                  setMe(querySnapshot.data().members[1])
                  }
                }
               
            })    
        
    }, [route])

    console.log("me",me)
    console.log("other",other)

    return (
        <>
            <StatusBar style="light" />

            
      <KeyboardAvoidingView
      style={styles.container}
      keyboardVerticalOffset = {64} // adjust the value here if you need more padding
      behavior= {(Platform.OS === 'ios')? "padding" : null}
    >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <>
                    <FlatList
                       
                       renderItem={({ item }) => <Message me={me} other={other}  message={item}/> }
                       inverted
                       data={[...messages].reverse()}
                         />
                        {/*<ScrollView contentContainerStyle={{ paddingTop: 15, }}>
                            {messages.map((e) => (
                               <>
                               <Message me={me} other={other}  message={e}/>
                               </>
                            ))}
                           
                            </ScrollView>*/}

                        <View style={styles.footer}>
                           {/* <TextInput
                                placeholder='Message'
                                style={styles.textInput}
                                value={input}
                                onChangeText={(text) => setInput(text)}
                                placeholderTextColor="gray"
                            />

                            <TouchableOpacity
                                style={styles.buttonSendMessage}
                                activeOpacity={0.5}
                                onPress={sendMessage}
                            >
                                <Ionicons
                                    name='send'
                                    size={20}
                                    color='#1D51EF'
                                />
                            </TouchableOpacity>*/}
                            <MessageInput id={route.params.id}/>
                        </View>
                    </>
                </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </>
    )
}

export default ChatScreen
