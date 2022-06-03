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


const MESSAGE_LIMIT = 15;
const ChatScreen = ({ navigation, route }) => {
    

    console.log(route?.params)

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    const [me, setMe] = useState("")
    const [other, setOther] = useState("")
    const[show,setShow]=useState(false)

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerTitle: () => (
                <Text style={styles.headerTitle} onPress={chatinfo}>
                    {route?.params?.name}
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

        db.collection('chats').doc(route?.params?.id).collection('messages').add({
            timestamp: new Date(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput('')
    }

/*
    useEffect(() => {
        let mounted = true
            db.collection("chatroom").doc(route?.params?.id)
            .onSnapshot((querySnapshot) => {
                
                console.log(querySnapshot.data().members)
                 if(!querySnapshot.data()){
                     alert("could not find chatroom")
                     return;
                 }
                if(querySnapshot.data()){
                var user = firebase.auth().currentUser;
                setShow(querySnapshot.data().show)
                if(querySnapshot.data().members[0] === user.email){
                   setOther(querySnapshot.data().members[1])
                   setMe(querySnapshot.data().members[0])
                 }else {
                  setOther(querySnapshot.data().members[0])
                  setMe(querySnapshot.data().members[1])
                  }
                }
               
            })    

            db.collection("messages").where("chatroomID","==",route?.params?.id).orderBy('timestamp', 'desc')
            .onSnapshot((querySnapshot) => {
                if (mounted) {
                    setMessages(querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id })));
                  
                }
            })    
            return function cleanup() {
                mounted = false
                console.log("component unmounted")
            }
            }, [route])

   const load = ()=>{
       console.log("load more")
   }

*/

    //console.log("me",me)
    //console.log("other",other)
 //console.log(messages)
    const chatinfo = ()=>{
        navigation.navigate('ChatInfo', {
            ChatroomID: route.params.id,
            name:other
        })
    }
    //store last item in pagination
    const[last,setLast]=useState([])
   

    //fetches chat room data in paginated manner
    useEffect(() => {
        db.collection("chatroom").doc(route?.params?.id)
            .onSnapshot((querySnapshot) => {
                
                console.log(querySnapshot.data().members)
                 if(!querySnapshot.data()){
                     alert("could not find chatroom")
                     return;
                 }
                if(querySnapshot.data()){
                var user = firebase.auth().currentUser;
                setShow(querySnapshot.data().show)
                if(querySnapshot.data().members[0] === user.email){
                   setOther(querySnapshot.data().members[1])
                   setMe(querySnapshot.data().members[0])
                 }else {
                  setOther(querySnapshot.data().members[0])
                  setMe(querySnapshot.data().members[1])
                  }
                }
               
            })    

            //pagination
        const fetchData = async () => {
           await db.collection("messages").where("chatroomID","==",route?.params?.id).orderBy('timestamp', 'desc')
            .limit(10)
            .onSnapshot((querySnapshot) => {
          setMessages(querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          setLast(querySnapshot.docs[querySnapshot.docs.length-1])
            })
        }
        fetchData();
      }, []);
    
      const showNext = () => {
          if(!last){return;}

        const fetchNextData = async () => {
            const array = [];
          const data = await db.collection("messages").where("chatroomID","==",route?.params?.id).orderBy('timestamp', 'desc')
          .startAfter(last)  
          .limit(10)
            .get();
            array.push(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            //setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            if(messages.length < 0){
                setMessages(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            }else{
                setMessages([...messages,...data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))]);
            }
            
            setLast(data.docs[data.docs.length-1])
        };
       
        fetchNextData();
      };
    
      console.log("last",messages)
    
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
                   
                    <TouchableOpacity style={{textAlign:'center',padding:5,margin:'auto'}} onPress={showNext}>
                        <Text style={{textAlign:'center',color:'gray',fontWeight:'700'}}>Load more</Text>
                    </TouchableOpacity>
                   
                    <FlatList
                       
                       renderItem={({ item }) => <Message show={show} me={me} other={other}  message={item}/> }
                       inverted
                       data={[...messages]}
                       //data={[...messages]}
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
                            <MessageInput id={route?.params?.id}/>
                        </View>
                       
                    </>
                   
                </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </>
    )
}

export default ChatScreen
