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



const MessageInput = ({id }) => {
  const [message, setMessage] = useState("");
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [recording, setRecording] = useState(null);
  const [soundURI, setSoundURI] = useState(null);
  const[loading,setLoading]= useState(false)

  

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
    } else {
      onPlusClicked();
    }
  };

  const resetFields = () => {
    setMessage("");
    setIsEmojiPickerOpen(false);
    setImage(null);
    setProgress(0);
    setSoundURI(null);
    
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

  const progressCallback = (progress) => {
    setProgress(progress.loaded / progress.total);
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

           db.collection('chatroom').doc(id).update({
            messages: firebase.firestore.FieldValue.arrayUnion({"message":message,"sender":user.email, "image":firebaseUrl,"audio":'',"time":Date.now()}),
            lastmessage:message,
            new:0
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

           db.collection('chatroom').doc(id).update({
            messages: firebase.firestore.FieldValue.arrayUnion({"message":message,"sender":user.email, "image":'',"audio":firebaseUrl,"time":Date.now()}),
            lastmessage:message,
            new:0
            })
            setLoading(false)
            resetFields();
          }
        
        })
    })

   
  };


const sendMessage = ()=>{
  var user = firebase.auth().currentUser;

  db.collection('chatroom').doc(id).update({
    messages: firebase.firestore.FieldValue.arrayUnion({"message":message,"sender":user.email, "image":'',"audio":'',"time":Date.now()}),
    lastmessage:message,
    new:0
  }).then((res)=>{
    console.log(res)
    }).catch((error)=>{
      console.log(error)
    })
  
  resetFields();
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

      {soundURI && <AudioPlayer soundURI={soundURI} />}

      <View style={styles.row}>
        <View style={styles.inputContainer}>
          <Pressable
            onPress={() =>
              setIsEmojiPickerOpen((currentValue) => !currentValue)
            }
          >
            <SimpleLineIcons
              name="emotsmile"
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
          {message || image || soundURI ? (
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