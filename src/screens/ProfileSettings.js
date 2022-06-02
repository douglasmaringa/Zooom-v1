import React,{useEffect,useState} from "react";
import { View, Text, Pressable, Alert,Dimensions,Image,ActivityIndicator } from "react-native";
import { generateKeyPair } from "../utils/crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firebase from "firebase";
import { db,auth,storage } from "../services/firebase";
import { styles } from '../styles/HomeScreenStyles'
import {
  
  Feather,
 
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Audio, AVPlaybackStatus } from "expo-av";

export const PRIVATE_KEY = "PRIVATE_KEY";
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const ProfileSettings = ({navigation}) => {
  const[user,setUser]=useState([])
  const[userID,setUserID]=useState("")
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(null);

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

 

  useEffect(() => {
    var user = firebase.auth().currentUser;
    db.collection("users").where("email", "==", user?.email)
    .onSnapshot((querySnapshot) => {
       
        const res = (querySnapshot.docs.map(doc => ({ id: doc.id,
          data: doc.data()})))
        console.log(res)
        if(!res){
         Alert.alert("User not found!");
          return;
        }
        setUser(res[0]?.data)
        setUserID(res[0]?.id)
       //console.log("res is",res[0].data)
       })
  }, [])

  //image permissions
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const libraryResponse =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        const photoResponse = await ImagePicker.requestCameraPermissionsAsync();
       

        if (
          libraryResponse.status !== "granted" ||
          photoResponse.status !== "granted"
        ) {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

 
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
  //sending image
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
           if(!userID){
             alert("could not find user object")
             setLoading(false)
             return;
           }
            db.collection('users').doc(userID).update({
             image:firebaseUrl
              }).then((res)=>{
               console.log("image changed")
              }).catch((error)=>{
                console.log(error)
              })
  
            setLoading(false)
            
          }
        
        })
    })

    
  };

  const getBlob = async (uri) => {
    const respone = await fetch(uri);
    const blob = await respone.blob();
    return blob;
  };
  console.log("user",user)
  return (
    <View style={styles.container}>
       <View style={{display:'flex',paddingBottom:20,borderBottomColor:'gray',borderBottomWidth:0.5}}>
    {
        user?(<>
         <Image
            source={{uri:user?.image}}
            style={{
                  width:100,
                  height:100,
                  resizeMode:'contain',
                  marginLeft:'auto',
                  marginRight:'auto',
                  marginTop:10,
                  borderColor:'white',
                  borderWidth:5
              }}
            resizeMode="contain"
          />
        </>):(<>
            <Image style={{ width:100,
                  height:100,
                  resizeMode:'contain',
                  marginLeft:'auto',
                  marginRight:'auto',
                  marginTop:10,
                 }} source={require("../../assets/icon.png")} />
       </>)
    }
     <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:18,fontWeight:'700'}}>@{user?.name}</Text>
    <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:14,fontWeight:'400'}}>2022 - Present</Text>
   </View>

   <View style={{paddingBottom:20,borderBottomColor:'white',borderBottomWidth:0.5}}>
   <Text style={{color:'white',marginTop:10,fontWeight:'700',textAlign:'center'}}>Change Image</Text>

    </View>

    <View style={{display:'flex',flexDirection:'row',marginHorizontal:width/3.9,borderBottomColor:'white',borderBottomWidth:2}}>
       
         <Pressable style={{ alignItems: "center",
          justifyContent: "center",paddingHorizontal:10}} onPress={takePhoto}>
            <Feather
              name="camera"
              size={24}
              color={image?"#d1d420":"#f5f5f5"}
              
            />
          </Pressable>

          <Pressable style={{ alignItems: "center",
          justifyContent: "center",paddingHorizontal:10}} onPress={pickImage}>
            <Feather
              name="image"
              size={24}
              color={image?"#d1d420":"#f5f5f5"}
            />
          </Pressable>
         <Pressable
        onPress={sendImage}
        style={{
          backgroundColor:image?"#0c2608":"#f5f5f5",
          height: 35,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius:20,
          width:80,
          
        }}
      >
       
        {loading ? <ActivityIndicator size="large" color="#C7C6CD" /> :  <Text style={{color:image?"white":"black"}}>Upload</Text>}
          
      </Pressable>
    </View>
   

      
    </View>
  );
};

export default ProfileSettings;