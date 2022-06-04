import React, { useLayoutEffect, useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View,TextInput,Text } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { auth, db } from '../services/firebase'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../styles/HomeScreenStyles'
import Contact from '../components/Contact'
import firebase from 'firebase'

const Contacts = ({ navigation }) => {

    const [users, setUsers] = useState([])
    const [me, setMe] = useState([])
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
            title: 'Contacts',
            headerStyle: { backgroundColor: '#1e1d26', elevation: 0 },
            headerTintStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                   <TouchableOpacity activeOpacity={0.5} onPress={()=>{navigation.navigate("Home")}}>
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

    const enterChat = (id, data) => {
        const chatID = "";
       //check if users have exsisting chat
        var user = firebase.auth().currentUser;
        console.log(user.email)
        db.collection("users").where("email", "==", user?.email)
        .onSnapshot((querySnapshot) => {
          
          const res = querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id }))
          if(querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id })).length>0){
               if(res[0].chatroom.includes(data.email)){
    
                
               return navigation.navigate('Home', {
                name: data.name
            })

               }else{
                //connect users //user.email and data.email
                console.log("not connected")
                
                
              //putting chat room id in current user user's object.
                 db.collection('users').doc(id).update({
                  chatroom: firebase.firestore.FieldValue.arrayUnion(user?.email)
                  }).then((res)=>{
                      console.log("added you to your friends users object")
                  }).catch((e)=>{
                    console.log("failed line 91")
                })

                //putting chat room id in your user user's object.
                db.collection('users').doc(me).update({
                    chatroom: firebase.firestore.FieldValue.arrayUnion(data?.email)
                    }).then((res)=>{
                        console.log("added your friend to your user object")
                    }).catch((e)=>{
                      console.log("failed line 91")
                  })

                  db.collection('chatroom').add({
                    //timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                    members:[data.email,user.email],
                    lastmessage:"",
                    lastmessagetime:firebase.firestore.FieldValue.serverTimestamp(),
                    newMessages:0,
                    show:false
                }).then(res=>{
                  
                console.log(`${data?.email} has been added to your chats`)
                navigation.navigate('Chat', {
                    id: res.id,
                    name: data?.name
                })
                console.log(res.id);
                }).catch((e)=>{
                    alert("failed to add user to chatroom")
                })


               }
               

          }
         
          return null;
       })
        /*navigation.navigate('Chat', {
            id: id,
            chatName: chatName
        })*/
    }

    const getUsersAgain = ()=>{
        //alert("get users again")
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
    }
    const search = ()=>{
        //alert("clicked")
        if(name){
        const filteredData = users.filter(({data}) => {
            return Object.values(data.name).join('').toLowerCase().includes(name.toLowerCase())
        })
       
        setUsers(filteredData)
    }else{
            getUsersAgain()
    }
        
    }

    return (
        <SafeAreaView>
            <StatusBar style="light" />
            <View style={{display:'flex',flexDirection:'row',backgroundColor:'#24222F'}}>
               <TextInput
                    placeholder="Enter Name"
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
               
                onPress={search}
            >
                <Ionicons
                    name='search'
                    size={30}
                    color='#fff'
                    style={{ marginLeft: 10,marginTop:14 }}
                />
            </TouchableOpacity>
                
            </View>
            <Text style={{paddingLeft:10,paddingVertical:4,color:'white',backgroundColor:'gray'}}>Results {users.length}</Text>
              
            <ScrollView style={styles.container}>
                {users?.map(({ id, data }) => (
                    <Contact
                        id={id}
                        data={data}
                        key={id}
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.buttonAddChat}
                onPress={() => navigation.navigate('Home')}
            >
                <Ionicons
                    name='arrow-undo'
                    size={30}
                    color='#fff'
                    style={{ marginLeft: 3 }}
                />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default Contacts