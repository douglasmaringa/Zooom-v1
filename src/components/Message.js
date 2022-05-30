import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator,Image } from "react-native";
import { useWindowDimensions } from "react-native";
import AudioPlayer from "./AudioPlayer";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../services/firebase";
const blue = "#3777f0";
const grey = "lightgrey";

const Message = ({me,other, message,route }) => {
  const [user, setUser] = useState();
  const [isMe, setIsMe] = useState(false);
  const [soundURI, setSoundURI] = useState(null);
 

  const { width } = useWindowDimensions();
  
  useEffect(() => {
    
    setIsMe(message.sender === me);
  
  }, [message,route,me]);

  if (!message) {
    return <ActivityIndicator />;
  }
  console.log("is me",isMe)

  useEffect(()=>{
    
       if(message.sender === other){
         if(message.status != "READ"){
          db.collection('messages').doc(message.id).update({
            "status":"READ",
            })
            db.collection('chatroom').doc(message.chatroomID).update({
              "new":'',
              })
           }
         }
      
  },[message,route,me])

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
          <Image
            source={{uri:`${message.image}`}}
            style={{ width: width * 0.7, aspectRatio: 4 / 3 }}
            resizeMode="contain"
          />
        </View>
      ):(<></>)}
      {message.audio ? (<><AudioPlayer soundURI={message?.audio} /></>):(<></>)}

      {!!message && (
        <Text style={{ color: isMe ? "black" : "white" }}>
          {message.message}
        </Text>
      )}

          {isMe && !!message.status && message.status !== "SENT" && (
          <Ionicons
            name={
              message.status === "DELIVERED" ? "checkmark" : "checkmark-done"
            }
            size={16}
            color="gray"
            style={{ marginHorizontal: 5 }}
          />
        )}
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


export default Message;