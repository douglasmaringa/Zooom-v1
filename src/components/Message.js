import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator,Image } from "react-native";
import { useWindowDimensions } from "react-native";
import AudioPlayer from "./AudioPlayer";
import { Ionicons } from "@expo/vector-icons";
import { db } from "../services/firebase";
import { box } from "tweetnacl";
import {
  decrypt,
  getMySecretKey,
  stringToUint8Array,
} from "../utils/crypto";
import moment from 'moment';

const blue = "#3777f0";
const grey = "lightgrey";

const Message = ({me,other, message,route }) => {
  const [user, setUser] = useState();
  const [isMe, setIsMe] = useState(false);
  const [soundURI, setSoundURI] = useState(null);
  const [decryptedContent, setDecryptedContent] = useState("");
  const[show,setShow]=useState(false)

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

  useEffect(() => {

    db.collection("users").where("email", "==", other)
  .onSnapshot((querySnapshot) => {

  const res = (querySnapshot.docs.map(doc => ({id: doc.data()})))
  if (!message?.message || !res[0]?.id.publicKey) {
    return;
  }
  //other user key res[0]?.id.publicKey)
  decryptMessage(res);
})

   

    

   
  }, [message,other]);

  const decryptMessage = async (res) => {
    const myKey = await getMySecretKey();
    if (!myKey) {
      return;
    }
    // decrypt message.content
    const sharedKey = box.before(stringToUint8Array(res[0]?.id.publicKey), myKey);
    console.log("sharedKey", sharedKey);
    const decrypted = decrypt(sharedKey, message.message);
    console.log("decrypted", decrypted);
    setDecryptedContent(decrypted.message);
  };

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
      {message.audio ? (<><AudioPlayer soundURI={message?.audio} /></>):(<></>)}
       {
         show?
         (<>
         {!!message.message && (
        <Text style={{ color: isMe ? "black" : "white",marginRight:'auto' }}>
          {message.message}
        </Text>
      )}
         </>):
         (<>
         {!!decryptedContent && (
        <Text style={{ color: isMe ? "black" : "white" ,marginRight:'auto'}}>
          {decryptedContent} 
        </Text>
      )}
         </>)
       }

          {isMe && !!message.status && message.status !== "SENT" && (
            <View style={{display:'flex',flexDirection:'row'}}>
            <Text style={{fontSize:12,color:'gray'}}>{moment(new Date(message.timestamp.seconds*1000)).format('LT')}</Text>
            <Ionicons
            name={
              message.status === "DELIVERED" ? "checkmark" : "checkmark-done"
            }
            size={16}
            color="gray"
            style={{ marginHorizontal: 5 }}
          />
            </View>
          
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