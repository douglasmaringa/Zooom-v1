import React, { useLayoutEffect, useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View ,Text,TextInput} from 'react-native'

import { auth, db } from '../services/firebase'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../styles/HomeScreenStyles'
import GroupContact from '../components/GroupContact'
import firebase from 'firebase'

const GroupContacts = ({ navigation }) => {

    const [users, setUsers] = useState([])
    const [me, setMe] = useState([])
    const [members, setMembers] = useState([])
    const [name, setName] = useState('')

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

    useEffect(() => {
        var user = firebase.auth().currentUser;
        
        if(!user){
            alert("you are not logged in")
            return;
        }
        const unsubscribe = db.collection('users').where("email", "!=", user.email).orderBy('email', 'asc').onSnapshot(snapshot => (
            setUsers(snapshot.docs.map(doc => ({id: doc.id,data: doc.data()})))
        ))

       

        db.collection("users").where("email", "==", user.email)
        .onSnapshot((querySnapshot) => {
           //we now have the id so we can now add the chatroom to that users object
          const id = querySnapshot.docs.map(doc=>({ id: doc.id }))
          if(id.length > 0){
            setMe(id[0]?.id)
          }
          
        })
        

        return unsubscribe
    }, [])
   

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Create a Group',
            headerStyle: { backgroundColor: '#1e1d26', elevation: 0 },
            headerTintStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                   <TouchableOpacity activeOpacity={0.5} onPress={()=>{navigation.navigate("GroupHome")}}>
                        <Ionicons
                            name='home'
                            size={25}
                            color='#1D51EF'
                            style={{ marginRight: 15 }}
                        />
                    </TouchableOpacity>
                    
                </View>
            ),
            headerRight: () => (
                <View style={{ marginLeft: 20 }}>
                   <TouchableOpacity activeOpacity={0.5} onPress={()=>{navigation.navigate("Settings")}}>
                        <Ionicons
                            name='settings'
                            size={25}
                            color='#1D51EF'
                            style={{ marginRight: 15 }}
                        />
                    </TouchableOpacity>
                    
                </View>
            ),
        })
    }, [navigation])

    const enterChat = (data) => {
        if(!name){
            alert("Group Must have name")
            return;
        }

        if(members.length < 3){
            alert("Group Must have 4 or more members")
            return;
        }

       //check if users have exsisting chat
        var user = firebase.auth().currentUser;
        
        db.collection('Groupchatroom').add({
            //timestamp:firebase.firestore.FieldValue.serverTimestamp(),
            creater:user.email,
            name:name,
            members:members,
            lastmessage:"",
            lastmessagetime:firebase.firestore.FieldValue.serverTimestamp(),
            newMessages:0,
            show:false
        }).then(res=>{
          
        console.log(`users has been added to your chats`)
        navigation.navigate('GroupChat', {
            id: res.id,
            name: data.name
        })
        console.log(res.id);
        }).catch((e)=>{
            alert("failed to add users to chatroom")
        })

      
        
    }

    const addToGroup = (id, data) => {

       console.log(data.email)
        setMembers([...members,data.email])
        var user = firebase.auth().currentUser;
        if(!members.includes(user.email)){
            setMembers([...members,user.email])
        }
    }
    console.log("members",members)

    return (
        <SafeAreaView>
            <StatusBar style="light" />
            <View style={{display:'flex',flexDirection:'row',backgroundColor:'#24222F'}}>
               <TextInput
                    placeholder="Group Name"
                    type="text"
                    value={name}
                    onChangeText={(text) => setName(text)}
                    style={{ width: '80%',
                    marginBottom: 10,height: 45,
                    backgroundColor: '#1D1B25',
                    padding: 15,
                    color: 'grey',
                    borderRadius: 6,
                    borderBottomWidth: 0,
                    marginBottom: 10,marginTop:10}}
                    placeholderTextColor='grey'
                />

            <TouchableOpacity
               
                onPress={enterChat}
            >
                <Ionicons
                    name='add-circle-outline'
                    size={30}
                    color='#fff'
                    style={{ marginLeft: 10,marginTop:14 }}
                />
            </TouchableOpacity>
                
            </View>
            <Text style={{paddingLeft:10,paddingVertical:4,color:'white',backgroundColor:'gray'}}>Members {members.length}</Text>
                
            <ScrollView style={styles.container}>
                {users.map(({ id, data }) => (
                    <GroupContact
                        id={id}
                        data={data}
                        key={id}
                        enterChat={enterChat}
                        addToGroup={addToGroup}
                    />
                ))}

                
            </ScrollView>

            
        </SafeAreaView>
    )
}

export default GroupContacts