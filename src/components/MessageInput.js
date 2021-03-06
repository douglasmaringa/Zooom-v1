import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  Image,
  Alert,
  ScrollView
} from "react-native";
import {
  SimpleLineIcons,
  Feather,
  MaterialCommunityIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import firebase from "firebase";
import { db,storage} from "../services/firebase";

import EmojiSelector from "react-native-emoji-selector";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import { Audio, AVPlaybackStatus } from "expo-av";
import AudioPlayer from "./AudioPlayer";
import { Header } from '@react-navigation/stack';
import { box } from "tweetnacl";
import {
  encrypt,
  getMySecretKey,
  stringToUint8Array,
} from "../utils/crypto";



const MessageInput = ({id }) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(null);
  const [soundURI, setSoundURI] = useState(null);
  const[loading,setLoading]= useState(false)
  const [me, setMe] = useState("")
  const [other, setOther] = useState("")

  

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libraryResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
        await Audio.requestPermissionsAsync();

        if (
          libraryResponse.status !== "granted" ||
          photoResponse.status !== "granted"
        ) {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);


  const onPlusClicked = () => {
    console.warn("On plus clicked");
  };

  //checks state and then calls various functions to send data to chatroom
  const onPress = () => {
    if (image) {
      sendImage();
    } else if (soundURI) {
      sendAudio();
    } else if (message) {
      sendMessage();
    } else if (video) {
      sendVideo();
    }
     else {
      onPlusClicked();
    }
  };

  const resetFields = () => {
    setMessage("");
    setIsEmojiPickerOpen(false);
    setImage(null);
    setProgress(0);
    setSoundURI(null);
    setVideo(null);
    
  };

  

  // Image picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
     
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  // Video picker
  const takeVideo = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      videoQuality: 'medium',
      durationLimit: 5,
      thumbnail: true,
      allowsEditing: true,
    });

    if (!result.cancelled) {
      setVideo(result.uri);
    }
  };

  console.log("video",video)

  const progressCallback = (progress) => {
    setProgress(progress.loaded / progress.total);
  };

  const sendVideo = async () => {
    setLoading(true)

    if (!video) {
      return;
    }
    const blob = await getBlob(video);
   

    const uploadTask = storage.ref(`/videos/${video}`).put(blob)
    uploadTask.on('state_changed',(snapShot)=>{
        console.log(snapShot)
    },(err)=>{
      console.log(JSON.stringify(err));
      setLoading(false)
    },()=>{
        storage.ref('videos').child(video).getDownloadURL().then(firebaseUrl=>{
            
          console.log(firebaseUrl)
         
           
          if(firebaseUrl){
            var user = firebase.auth().currentUser;

            db.collection('messages').add({
              timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              "chatroomID":id,
              "message":"",
              "sender":user.email, 
              "image":'',
              "audio":'',
              "video":firebaseUrl,
              "time":Date.now(),
              new:1,
              "status":"",
            }).then((res)=>{
              console.log("message sent here is ID:",res.id)
              db.collection('messages').doc(res.id).update({
                "status":"DELIVERED",
                })
              }).catch((error)=>{
                console.log(error)
              })
  
            setLoading(false)
            resetFields();
          }
        
        })
    })

    
  };
  
  const sendImage = async () => {
    setLoading(true)

    if (!image) {
      return;
    }
    const blob = await getBlob(image);
   

    const uploadTask = storage.ref(`/images/${image}`).put(blob)
    uploadTask.on('state_changed',(snapShot)=>{
        console.log(snapShot)
    },(err)=>{
      console.log(JSON.stringify(err));
      setLoading(false)
    },()=>{
        storage.ref('images').child(image).getDownloadURL().then(firebaseUrl=>{
            
          console.log(firebaseUrl)
         
           
          if(firebaseUrl){
            var user = firebase.auth().currentUser;

            db.collection('messages').add({
              timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              "chatroomID":id,
              "message":"",
              "sender":user.email, 
              "image":firebaseUrl,
              "audio":'',
              "video":'',
              "time":Date.now(),
              new:1,
              "status":"",
            }).then((res)=>{
              console.log("message sent here is ID:",res.id)
              db.collection('messages').doc(res.id).update({
                "status":"DELIVERED",
                })
              }).catch((error)=>{
                console.log(error)
              })
  
            setLoading(false)
            resetFields();
          }
        
        })
    })

    
  };

  const getBlob = async (uri) => {
    const respone = await fetch(uri);
    const blob = await respone.blob();
    return blob;
  };

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    if (!recording) {
      return;
    }

    setRecording(null);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });

    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    if (!uri) {
      return;
    }
    setSoundURI(uri);
  }

  //send audio to backend 
  const sendAudio = async () => {
    if (!soundURI) {
      return;
    }
    setLoading(true)
    const uriParts = soundURI.split(".");
    const extenstion = uriParts[uriParts.length - 1];
    const blob = await getBlob(soundURI);
    
    const uploadTask = storage.ref(`/audio/${soundURI}`).put(blob)
    uploadTask.on('state_changed',(snapShot)=>{
        console.log(snapShot)
    },(err)=>{
      console.log(JSON.stringify(err));
      setLoading(false)
    },()=>{
        storage.ref('audio').child(soundURI).getDownloadURL().then(firebaseUrl=>{
            
          console.log(firebaseUrl)
         
           
          if(firebaseUrl){
            var user = firebase.auth().currentUser;

            db.collection('messages').add({
              timestamp:firebase.firestore.FieldValue.serverTimestamp(),
              "chatroomID":id,
              "message":"",
              "sender":user.email, 
              "image":'',
              "audio":firebaseUrl,
              "video":'',
              "time":Date.now(),
              new:1,
              "status":"",
            }).then((res)=>{
              console.log("message sent here is ID:",res.id)
              db.collection('messages').doc(res.id).update({
                "status":"DELIVERED",
                })
              }).catch((error)=>{
                console.log(error)
              })
            setLoading(false)
            resetFields();
          }
        
        })
    })

   
  };


//know which user is which so we can fetch there user objects to get the public key
useEffect(() => {
  let mounted = true
  db.collection("chatroom").doc(id)
  .onSnapshot((querySnapshot) => {
    if (mounted) {
      console.log(querySnapshot.data().members)
      if(!querySnapshot.data()){
        alert("could not find user line 288")
        return;
      }
      if(querySnapshot.data()){
      var user = firebase.auth().currentUser;
      if(querySnapshot.data().members[0] === user.email){
         setOther(querySnapshot?.data().members[1])
         setMe(querySnapshot?.data().members[0])
       }else {
        setOther(querySnapshot?.data().members[0])
        setMe(querySnapshot?.data().members[1])
        }
      }
    }
  })    
  return function cleanup() {
    mounted = false
    console.log("component unmounted")
}

}, [id])


            //encrypt message and send
         const getPK = async (res) => {
         var user = firebase.auth().currentUser;
          
            // send message
          const ourSecretKey = await getMySecretKey();
          if (!ourSecretKey) {
            alert("Could not get your private key")
             return;
             }

          if (!res[0]?.id.publicKey) {
              Alert.alert(
              "The user haven't set his keypair yet",
               "Until the user generates the keypair, you cannot securely send him messages"
              );
              return;
              }

              //console.log("private key", ourSecretKey);

              const sharedKey = box.before(
              stringToUint8Array(res[0]?.id.publicKey),
               ourSecretKey
                 );
               //console.log("shared key", sharedKey);

               const encryptedMessage = encrypt(sharedKey, { message });
              //console.log("encrypted message", encryptedMessage);

  
                db.collection('messages').add({
                 timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                 "chatroomID":id,
                 "message":encryptedMessage,
                 "sender":user.email, 
                 "image":'',
                 "audio":'',
                 "video":'',
                 "time":Date.now(),
                 new:0,
                "status":"",
                }).then((res)=>{
              console.log("message sent here is ID:",res.id)
             db.collection('messages').doc(res.id).update({
               "status":"DELIVERED",
              })
             db.collection('chatroom').doc(id).update({
              lastmessagetime:firebase.firestore.FieldValue.serverTimestamp(),
              lastmessage:message,
              new:user.email,
              })
            }).catch((error)=>{
            console.log(error)
            })
  
         resetFields();

   
};

//get other users public key then call the above function which will encrypt and send the message
const sendMessage = async ()=>{

  await db.collection("users").where("email", "==", other)
  .onSnapshot((querySnapshot) => {

  const res = (querySnapshot.docs.map(doc => ({id: doc.data()})))
  //other user key res[0]?.id.publicKey)
  if(!res){
    alert("User you are chating to is not available in database")
    return;
  }
  getPK(res)
})
          
}



  return (
    <KeyboardAvoidingView
      style={[styles.root, { height: isEmojiPickerOpen ? "50%" : "auto" }]}
      keyboardVerticalOffset = {Header.HEIGHT + 64} // adjust the value here if you need more padding
      
    >
      <ScrollView>
      {image && (
        <View style={styles.sendImageContainer}>
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignSelf: "flex-end",
            }}
          >
            <View
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: "#3777f0",
                width: `${progress * 100}%`,
              }}
            />
             {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> : null}
          </View>
            
            
          <Pressable onPress={() => setImage(null)}>
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={{ margin: 5 ,color:'#f5f5f5'}}
            />
          </Pressable>

          
         
        </View>
      )}

       {video && (
        <View style={styles.sendImageContainer}>
          <Image
            source={{ uri:'https://1000logos.net/wp-content/uploads/2017/08/Snapchat-logo-1536x864.png'}}
            style={{ width: 100, height: 100, borderRadius: 10 }}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
              alignSelf: "flex-end",
            }}
          >
            <View
              style={{
                height: 5,
                borderRadius: 5,
                backgroundColor: "#3777f0",
                width: `${progress * 100}%`,
              }}
            />
             {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> : null}
          </View>
            
            
          <Pressable onPress={() => setVideo(null)}>
            <AntDesign
              name="close"
              size={24}
              color="black"
              style={{ margin: 5 ,color:'#f5f5f5'}}
            />
          </Pressable>

          
         
        </View>
      )}

      {soundURI && <AudioPlayer soundURI={soundURI} />}
      {
        soundURI?(<>
         {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> : null}
        </>):(<></>)
      }

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Pressable
            onPress={takeVideo}
          >
            <Ionicons
              name="logo-snapchat"
              size={24}
              color="#f5f5f5"
              style={styles.icon}
            />
          </Pressable>

          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder=""
            
          />

          <Pressable onPress={pickImage}>
            <Feather
              name="image"
              size={24}
              color="#f5f5f5"
              style={styles.icon}
            />
          </Pressable>

          <Pressable onPress={takePhoto}>
            <Feather
              name="camera"
              size={24}
              color="#f5f5f5"
              style={styles.icon}
            />
          </Pressable>

          <Pressable onPressIn={startRecording} onPressOut={stopRecording}>
            <MaterialCommunityIcons
              name={recording ? "microphone" : "microphone-outline"}
              size={24}
              color={recording ? "blue" : "#f5f5f5"}
              style={styles.icon}
            />
          </Pressable>
        </View>

        <Pressable onPress={onPress} style={styles.buttonContainer}>
          {message || image || soundURI || video ? (
            <Ionicons name="send" size={18} color="white" />
          ) : (
            <AntDesign name="plus" size={24} color="white" />
          )}
        </Pressable>
      </View>

      {isEmojiPickerOpen && (
        <EmojiSelector
          onEmojiSelected={(emoji) =>
            setMessage((currentMessage) => currentMessage + emoji)
          }
          columns={8}
        />
      )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
    root: {
      padding: 10,
      flex:1
    },
    row: {
      flexDirection: "row",
    },
    inputContainer: {
        borderColor: 'transparent',
        backgroundColor: '#1D1B25',
      flex: 1,
      marginRight: 10,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: "#dedede",
      alignItems: "center",
      flexDirection: "row",
      padding: 5,
    },
    input: {
      flex: 1,
      marginHorizontal: 5,
      color:'white'
    },
    icon: {
      marginHorizontal: 5,
    },
    buttonContainer: {
      width: 40,
      height: 40,
      backgroundColor: "#3777f0",
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 35,
    },
  
    sendImageContainer: {
      flexDirection: "row",
      marginVertical: 10,
      alignSelf: "stretch",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "lightgray",
      borderRadius: 10,
    },
    
  });

export default MessageInput;