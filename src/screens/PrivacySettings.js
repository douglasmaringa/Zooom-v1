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

const PrivacySettings = ({navigation}) => {
  const[user,setUser]=useState([])
  const[userID,setUserID]=useState("")
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(null);

    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }

  const updateKeyPair = async () => {
    // generate private/public key
    const { publicKey, secretKey } = generateKeyPair();
    console.log(publicKey, secretKey);

    // save private key to Async storage
    await AsyncStorage.setItem(PRIVATE_KEY, secretKey.toString());
    console.log("secret key was saved");

    // save public key to UserModel in Datastore
   
   var user = firebase.auth().currentUser;
   //var res = [];
    await db.collection("users").where("email", "==", user?.email)
   .onSnapshot((querySnapshot) => {
      
       const res = (querySnapshot.docs.map(doc => ({id: doc.id})))
       console.log(res[0]?.id)
       if(!res){
        Alert.alert("User not found!");
         return;
       }
       db.collection('users').doc(res[0]?.id).update({
        publicKey:publicKey.toString(),
        })

      })
    
      
  
    Alert.alert("Successfully updated the keypair.");
  };

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

  
  return (
    <View style={styles.container}>
       <View style={{display:'flex',paddingBottom:20,borderBottomColor:'gray',borderBottomWidth:0.5}}>
   
         <Image
            source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhRRkX1e43PisP0iiKWxGGKtULnrOAMxF5fQ&usqp=CAU'}}
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
        
     <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:18,fontWeight:'700'}}>End to End Encryption</Text>
    <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:14,fontWeight:'400',padding:4}}>The Zooom is protected by NACL End To End encryption no one can see your messages not even us.</Text>
    </View>

   <View style={{paddingBottom:20,borderBottomColor:'white',borderBottomWidth:0.5}}>
   <Text style={{color:'white',marginTop:10,fontWeight:'700',textAlign:'center'}}>Encryption Settings</Text>

    </View>

    
   

      <Pressable
        onPress={updateKeyPair}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
          marginTop:20
        }}
      >
        <Text>Update keypair</Text>
      </Pressable>

      
    </View>
  );
};

export default PrivacySettings;