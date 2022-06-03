import React, { useState, useEffect,useRef } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../services/firebase'
import { styles } from '../styles/CustomListItemStyles'
import firebase from 'firebase'
import { Text } from 'react-native-elements'
import moment from 'moment';
import * as Notifications from 'expo-notifications';
import storage from "@react-native-async-storage/async-storage";
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

const CustomListItem = ({ id, data, enterChat,route }) => {

    const [chatMessages, setChatMessages] = useState([])
    const[other,setOther]=useState("")
    const[user,setUser] = useState("")
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();
 
    console.log(data)

    useEffect(() => {
     
        var user = firebase.auth().currentUser;
        if(data.members[0] === user.email){
            setOther(data.members[1])
        
        }else {
            setOther(data.members[0])
        }
    }, [])

    useEffect(() => {
      let mounted = true
       db.collection("users").where("email","==",other)
        .onSnapshot((querySnapshot) => {
          if (mounted) {
                if(!querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id }))){
                    alert("cannot get users image in Homescreen")
                    return;
                }
                setUser(querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id }))[0]?.image);
              }
        })   
        return function cleanup() {
          mounted = false
          console.log("component unmounted")
      }
        
    }, [other])

   
    
  
    useEffect(() => {
      const getPermission = async () => {
        if (Constants.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }
            if (finalStatus !== 'granted') {
              alert('Enable push notifications to use the app!');
              await storage.setItem('expopushtoken', "");
              return;
            }
            const token = (await Notifications.getExpoPushTokenAsync()).data;
            await storage.setItem('expopushtoken', token);
        } else {
          alert('Must use physical device for Push Notifications');
        }
  
          if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
              name: 'default',
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: '#FF231F7C',
            });
          }
      }
  
      getPermission();
  
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        setNotification(notification);
      });
  
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});
  
      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
        
      };
    }, []);
  
    const sendNotification = async () => {
        if(!other){return;}
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "New Message",
        },
        trigger: {
          seconds: 1,
         
        }
      });
    }

    return (
        <ListItem
            key={id}
            onPress={() => enterChat(id, data,other)}
            containerStyle={{backgroundColor: '#24222F'}}
        >
            <Avatar
                size={50}
                rounded
                source={{ uri: user || 'https://secure.gravatar.com/avatar/d3afc60628a78f856952f6d76a2f37b8?s=150&r=g&d=https://delivery.farmina.com.br/wp-content/plugins/userswp/assets/images/no_profile.png' }}
            
            />

            <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>
                    {other}
                </ListItem.Title>

                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.listItemSubtitle}
                >
                    {
                        data.new == other?(
                        <>
                        <Text style={{color:'white'}}>
                            {data.lastmessage?<>{data.lastmessage}  <Text style={{color:'white'}}> {data?.lastmessagetime ?<>({moment(new Date(data.lastmessagetime.seconds*1000)).fromNow()})</>:<></>}</Text>
                        </>:<></>}
                        </Text> 
                    
                        </>):
                        (<>
                         {data.lastmessage?<>{data.lastmessage}  <Text style={{color:'gray'}}> {data?.lastmessagetime ?<>({moment(new Date(data.lastmessagetime.seconds*1000)).fromNow()})</>:<></>}</Text>
            </>:<></>}
                    
                        </>)
                    }
                   
                </ListItem.Subtitle>
               
            </ListItem.Content>
            
            <Text style={{color:'white',padding:10}}> {data.new == other ?<>New</>:<></>}</Text>
           
              </ListItem>
    )
}

export default CustomListItem
