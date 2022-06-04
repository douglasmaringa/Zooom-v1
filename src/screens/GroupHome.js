import React, { useLayoutEffect, useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import GroupCustomListItem from '../components/GroupCustomListItem'
import { auth, db } from '../services/firebase'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../styles/HomeScreenStyles'
import firebase from 'firebase'

const GroupScreen = ({ navigation}) => {

    //console.log(route.params)

    const [chats, setChats] = useState([])

   

    useEffect(() => {
        var user = firebase.auth().currentUser;

        const unsubscribe = db.collection("Groupchatroom").where("members", "array-contains",user.email).orderBy('lastmessagetime', 'desc')
        .onSnapshot((querySnapshot) => {
           
            setChats(querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data()
            })))
           })

        return unsubscribe
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Groups',
            headerStyle: { backgroundColor: '#1e1d26', elevation: 0 },
            headerTintStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerLeft: () => (<View />),
            headerRight: () => (
                <View style={{ marginLeft: 20 ,display:'flex',flexDirection:'row'}}>
                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{navigation.navigate("Home")}}>
                        <Ionicons
                            name='person-outline'
                            size={25}
                            color='#1D51EF'
                            style={{ marginRight: 15 }}
                        />
                    </TouchableOpacity>
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

    const enterChat = (id, data,other) => {
        console.log(id)
        navigation.navigate('GroupChat', {
            id: id,
            data: data,
            name:other
        })
    }

    console.log("chats",chats)
    return (
        <SafeAreaView>
            <StatusBar style="light" />

            <ScrollView style={styles.container}>
                {chats.map(({ id, data }) => (
                    <GroupCustomListItem
                        id={id}
                        data={data}
                        key={id}
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.buttonAddChat}
                onPress={() => navigation.navigate('GroupContacts')}
            >
                <Ionicons
                    name='add'
                    size={30}
                    color='#fff'
                    style={{ marginLeft: 3 }}
                />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default GroupScreen