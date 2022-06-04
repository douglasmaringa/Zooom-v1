import React, { useLayoutEffect,useEffect, useState } from 'react'
import { Text, View, TouchableOpacity, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback, FlatList } from 'react-native'
import { Avatar } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons'
import { StatusBar } from 'expo-status-bar'
import { db, auth } from '../services/firebase'
import * as firebase from 'firebase'
import { styles } from '../styles/ChatScreenStyles'
import GroupMessageInput from '../components/GroupMessageInput'
import GroupMessage from '../components/GroupMessage'
import { Header } from '@react-navigation/stack';


const GroupChatScreen = ({ navigation, route }) => {

    //console.log(route?.params)

    const [input, setInput] = useState('')
    const [messages, setMessages] = useState([])
    

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleAlign: 'center',
            headerTitle: () => (
                <Text style={styles.headerTitle} onPress={chatinfo}>
                   Group {route?.params?.data?.name} 
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

    /*const sendMessage = () => {
        Keyboard.dismiss()

        db.collection('chats').doc(route?.params?.id).collection('messages').add({
            timestamp: new Date(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL
        })

        setInput('')
    }*/

/*
    useEffect(() => {
        let mounted = true
            db.collection("Groupchatroom").doc(route?.params?.id)
            .onSnapshot((querySnapshot) => {
                if (mounted) {
                
                 if(!querySnapshot.data()){
                     alert("could not find chatroom")
                     return;
                 }
                 console.log(querySnapshot.data().members)
                }
            })    

            db.collection("Groupmessages").where("chatroomID","==",route.params.id).orderBy('timestamp', 'asc')
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
*/

    const[last,setLast]=useState([])
   //fetches chat room data in paginated manner
   useEffect(() => {
    let mounted = true
    db.collection("Groupchatroom").doc(route?.params?.id)
            .onSnapshot((querySnapshot) => {
                if (mounted) {
                
                 if(!querySnapshot.data()){
                     alert("could not find chatroom")
                     return;
                 }
                 console.log(querySnapshot.data().members)
                }
            })    
        //pagination
    const fetchData = async () => {
       await db.collection("Groupmessages").where("chatroomID","==",route?.params?.id).orderBy('timestamp', 'desc')
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
      const data = await db.collection("Groupmessages").where("chatroomID","==",route?.params?.id).orderBy('timestamp', 'desc')
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

    const chatinfo = ()=>{
        navigation.navigate('GroupChatInfo', {
            ChatroomID: route?.params?.id,
            name:route?.params?.data?.name
        })
    }

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
                       
                       renderItem={({ item }) => <GroupMessage message={item}/> }
                       inverted
                       data={[...messages]}
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
                            <GroupMessageInput id={route?.params?.id}/>
                        </View>
                    </>
                </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
        </>
    )
}

export default GroupChatScreen
