import React, { useState, useEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { db } from '../services/firebase'
import { styles } from '../styles/CustomListItemStyles'
import firebase from 'firebase'
import { Text } from 'react-native-elements'
import moment from 'moment';

const CustomListItem = ({ id, data, enterChat }) => {

    const [chatMessages, setChatMessages] = useState([])
    const[other,setOther]=useState("")
    console.log(data)

    useEffect(() => {
        var user = firebase.auth().currentUser;
        if(data.members[0] === user.email){
            setOther(data.members[1])
        
        }else {
            setOther(data.members[0])
        }
    }, [])

   //console.log(moment(new Date(data.lastmessagetime.seconds*1000)).fromNow())

    return (
        <ListItem
            key={id}
            onPress={() => enterChat(id, data,other)}
            containerStyle={{backgroundColor: '#24222F'}}
        >
            <Avatar
                size={50}
                rounded
                source={{ uri: chatMessages?.[0]?.photoURL || 'https://secure.gravatar.com/avatar/d3afc60628a78f856952f6d76a2f37b8?s=150&r=g&d=https://delivery.farmina.com.br/wp-content/plugins/userswp/assets/images/no_profile.png' }}
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
                    {data.lastmessage?<>{data.lastmessage}  <Text style={{color:'gray'}}> {data?.lastmessagetime ?<>({moment(new Date(data.lastmessagetime.seconds*1000)).fromNow()})</>:<></>}</Text>
            </>:<></>}
                    
                </ListItem.Subtitle>
               
            </ListItem.Content>
            
            <Text style={{color:'white',padding:10}}> {data.new == other ?<>New</>:<></>}</Text>
           
              </ListItem>
    )
}

export default CustomListItem
