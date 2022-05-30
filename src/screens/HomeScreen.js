import React, { useLayoutEffect, useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, TouchableOpacity, View } from 'react-native'
import CustomListItem from '../components/CustomListItem'
import { auth, db } from '../services/firebase'
import { StatusBar } from 'expo-status-bar'
import { Ionicons } from '@expo/vector-icons'
import { styles } from '../styles/HomeScreenStyles'
import firebase from 'firebase'

const HomeScreen = ({ navigation,route }) => {

    console.log(route.params)

    const [chats, setChats] = useState([])

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

    useEffect(() => {
        var user = firebase.auth().currentUser;

        const unsubscribe = db.collection("chatroom").where("members", "array-contains", user.email)
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
            title: 'Messages',
            headerStyle: { backgroundColor: '#1e1d26', elevation: 0 },
            headerTintStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerLeft: () => (<View />),
            headerRight: () => (
                <View style={{ marginLeft: 20 }}>
                    <TouchableOpacity activeOpacity={0.5} onPress={signOutUser}>
                        <Ionicons
                            name='exit-outline'
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
        navigation.navigate('Chat', {
            id: id,
            data: data,
            name:other
        })
    }

    return (
        <SafeAreaView>
            <StatusBar style="light" />

            <ScrollView style={styles.container}>
                {chats.map(({ id, data }) => (
                    <CustomListItem
                        id={id}
                        data={data}
                        key={id}
                        enterChat={enterChat}
                    />
                ))}
            </ScrollView>

            <TouchableOpacity
                style={styles.buttonAddChat}
                onPress={() => navigation.navigate('Contacts')}
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

export default HomeScreen
