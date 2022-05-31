import { SafeAreaView,View, Text,StyleSheet,Dimensions,Image,ScrollView,TouchableOpacity } from 'react-native'
import React,{useEffect,useState} from 'react'
import {db} from "../services/firebase"


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const ChatInfo = ({route}) => {
    const[user,setUser]=useState([])

    console.log("chatinfo",route.params)

    useEffect(() => {
        db.collection("users").where("email","==",route.params.name)
        .onSnapshot((querySnapshot) => {
                if(!querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id }))){
                    alert("user not found")
                    return;
                }
                setUser(querySnapshot.docs.map(doc=>({ ...doc.data(), id: doc.id }))[0]);
           
        })    
    }, [])

    const showYes = ()=>{
        
        db.collection('chatroom').doc(route.params.ChatroomID).update({
            show: true
            }).then((res)=>{
                alert("You will now see what your messages look like before we decrypt them for you")
            }).catch((e)=>{
                console.log("failed to access chatroom")
          })
    }

    const showNo = ()=>{
        db.collection('chatroom').doc(route.params.ChatroomID).update({
            show: false
            }).then((res)=>{
                alert("done")
            }).catch((e)=>{
              console.log("failed to access chatroom")
          })
    }
    
console.log(user)
  return (
    <SafeAreaView style={styles.container}>
     <ScrollView>
   

    <View style={{display:'flex',paddingBottom:20,borderBottomColor:'gray',borderBottomWidth:0.5}}>
    {
        user?(<>
         <Image
            source={{uri:user.image}}
            style={styles.image}
            resizeMode="contain"
          />
        </>):(<>
            <Image style={styles.image} source={require("../../assets/icon.png")} />
       </>)
    }
     <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:18,fontWeight:'700'}}>@{route.params.name}</Text>
    <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:14,fontWeight:'400'}}>2022 - Present</Text>
   </View>

   <View style={{paddingBottom:20,borderBottomColor:'white',borderBottomWidth:0.5}}>
   <Text style={{color:'white',marginTop:10,fontWeight:'700',textAlign:'center'}}>Chat Settings</Text>

    </View>
   
    <TouchableOpacity
        onPress={showYes}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius:100
        }}
      >
        <Text>Reveal Encryption</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={showNo}
        style={{
          backgroundColor: "white",
          height: 50,
          margin: 10,
          alignItems: "center",
          justifyContent: "center",
          borderRadius:100
        }}
      >
        <Text>Reveal Encryption Off</Text>
      </TouchableOpacity>
    
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
    flex:1,
      backgroundColor: '#24222F',
      width:width,
      height:height,
      
    },
    image:{
        width:100,
        height:100,
        resizeMode:'contain',
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:10,
        borderColor:'white',
        borderWidth:4
    },
    image2:{
        width:30,
        height:20,
        resizeMode:'contain',
        marginLeft:'auto',
        marginRight:'auto',
        marginTop:10,
       
    },
    sectionContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    alignItems: 'center',
    marginTop:10,
      },
  });

export default ChatInfo