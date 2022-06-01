import { SafeAreaView,View, Text,StyleSheet,Dimensions,Image,ScrollView,TouchableOpacity } from 'react-native'
import React,{useEffect,useState} from 'react'
import {db} from "../services/firebase"


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;


const GroupChatInfo = ({route}) => {
    const[chat,setChat]=useState([])

    //console.log("chatinfo",route.params)

    useEffect(() => {
        db.collection("Groupchatroom").doc(route.params.ChatroomID)
        .onSnapshot((querySnapshot) => {
            
            console.log(querySnapshot.data().members)
            setChat(querySnapshot.data())
             if(!querySnapshot.data()){
                 alert("could not find chatroom")
                 return;
             }
           
           
        })    
    }, [])
    
    

  return (
    <SafeAreaView style={styles.container}>
     <ScrollView>
   

    <View style={{display:'flex',paddingBottom:20,borderBottomColor:'gray',borderBottomWidth:0.5}}>
    {
       chat?(<>
         <Image
            source={{uri:'https://cdn.vectorstock.com/i/1000x1000/27/54/people-group-logo-design-vector-14542754.webp'}}
            style={styles.image}
            resizeMode="contain"
          />
        </>):(<>
            <Image style={styles.image} source={require("../../assets/icon.png")} />
       </>)
    }
     <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:18,fontWeight:'700'}}>Group chat info</Text>
    
     <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:18,fontWeight:'700'}}>@{route.params.name}</Text>
    <Text style={{color:'white',marginLeft:'auto',marginRight:'auto',marginTop:5,fontSize:14,fontWeight:'400'}}>2022 - Present</Text>
   </View>

   <View style={{paddingBottom:20,borderBottomColor:'white',borderBottomWidth:0.5}}>
   <Text style={{color:'white',marginTop:10,fontWeight:'700',textAlign:'center'}}>Group Members</Text>
     {
         chat?.members?.map((e)=>(
             <>
             <Text style={{color:'white',marginTop:10,fontWeight:'700',textAlign:'center'}}>{e}</Text>
   
             </>
         ))
     }
    </View>
   
   
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

export default GroupChatInfo