import React, { useState, useEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import CheckBox from "@react-native-community/checkbox"
import { db } from '../services/firebase'
import { styles } from '../styles/CustomListItemStyles'

const GroupContact = ({ id,data, enterChat ,addToGroup}) => {
    const [isSelected, setSelection] = useState(false);


    return (
        <ListItem
            key={id}
            onPress={() => {
                addToGroup(id, data)
            }}
            containerStyle={{backgroundColor: '#24222F'}}
          
        >
            <Avatar
                size={50}
                rounded
                source={{ uri:  'https://secure.gravatar.com/avatar/d3afc60628a78f856952f6d76a2f37b8?s=150&r=g&d=https://delivery.farmina.com.br/wp-content/plugins/userswp/assets/images/no_profile.png' }}
            />

            <ListItem.Content>
                <ListItem.Title style={styles.listItemTitle}>
                    {data.name}
                </ListItem.Title>

                <ListItem.Subtitle
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={styles.listItemSubtitle}
                >
                 
                </ListItem.Subtitle>
            </ListItem.Content>
           
        </ListItem>
    )
}

export default GroupContact
