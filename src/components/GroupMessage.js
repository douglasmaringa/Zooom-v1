import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator,Image } from "react-native";
import { useWindowDimensions } from "react-native";
import AudioPlayer from "./AudioPlayer";

import { db } from "../services/firebase";

import moment from 'moment';
import firebase from "firebase";

const blue = "#3777f0";
const grey = "lightgrey";

const GroupMessage = ({message,route }) => {

  const [isMe, setIsMe] = useState(false);
  const [show, setShow] = useState(false);
  const [soundURI, setSoundURI] = useState(null);
 
 

  const { width } = useWindowDimensions();
  
  useEffect(() => {
    var user = firebase.auth().currentUser;
    setIsMe(message.sender === user.email);
  
  }, [message,route]);

  if (!message) {
    return <ActivityIndicator />;
  }
  //console.log("is me",isMe)

  /*useEffect(()=>{
    let mounted = true
    if (mounted) {
    var user = firebase.auth().currentUser;
       if(message.sender !== user.email){
         if(message.status != "READ"){
          
            db.collection('chatroom').doc(message.chatroomID).update({
              "new":'',
              })
           }
         }
        }
         return function cleanup() {
          mounted = false
          console.log("component unmounted")
      }
  },[message,route])*/

  

  

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? "75%" : "auto" },
      ]}
    >
      {message.image? (
        <View style={{ marginBottom: message.content ? 10 : 0 }}>
          {
            show?(<>
            <Image
            source={{uri:'https://play-lh.googleusercontent.com/19GU_MtEUEYBvY-TUH6IF96d8AyGYYZoeob1eDQymFXaQb9qtZADzAIFKWoYPFtDci4=w480-h960-rw'}}
            style={{ width: width * 0.7, aspectRatio: 4 / 3 }}
            resizeMode="contain"
          />
        
            </>):(<>
              <Image
            source={{uri:`${message.image}`}}
            style={{ width: width * 0.7, aspectRatio: 4 / 3 }}
            resizeMode="contain"
          />
        
            </>)
          }
          
        </View>
      ):(<></>)}
       
           
        <Text style={{ color: isMe ? "black" : "white" ,marginRight:'auto'}}>
          {
            isMe?
            (
            <View style={{display:'flex'}}>
                 <Text style={{color:'gray'}}>{message?.sender}</Text> 
                <Text style={{color:'black'}}>{message?.message}</Text> 
                {
                  message?.timestamp?(<>
                   <Text style={{fontSize:12,color:'gray',fontWeight:'400'}}>{moment(new Date(message?.timestamp?.seconds*1000)).format('LT')}</Text>
                  </>):(<></>)
                }
                </View>
            ):
            (
            <View style={{display:'flex'}}>
                <Text style={{color:'#f5f5f5'}}>{message?.sender}</Text> 
                <Text style={{color:'white'}}>{message?.message}</Text> 
                {
                  message?.timestamp?(<>
                  <Text style={{fontSize:12,color:'#f5f5f5',fontWeight:'400'}}>{moment(new Date(message?.timestamp?.seconds*1000)).format('LT')}</Text>
              </>):(<></>)
                }
                </View>
             )
          }
        
        </Text>
    

          
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  messageReply: {
    backgroundColor: "gray",
    padding: 5,
    borderRadius: 5,
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: "auto",
    marginRight: 10,
    alignItems: "flex-end",
  },
});


export default GroupMessage;