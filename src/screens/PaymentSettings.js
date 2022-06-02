import React,{useEffect,useState} from "react";
import { View, Text, Pressable, Alert,Dimensions,Image,ActivityIndicator } from "react-native";
import { styles } from '../styles/HomeScreenStyles'


const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PaymentSettings = ({navigation}) => {
 
  return (
    <View style={styles.container}>
       <View style={{display:'flex',paddingBottom:20,borderBottomColor:'gray',borderBottomWidth:0.5}}>
   
         <Image
            source={{uri:"https://thumbs.dreamstime.com/b/apple-pay-google-icons-kiev-ukraine-march-printed-paper-mobile-payment-digital-wallet-service-platform-online-system-145949978.jpg"}}
            style={{
                  width:width,
                  height:130,
                  resizeMode:'contain',
                  marginLeft:'auto',
                  marginRight:'auto',
                  marginTop:10,
                  borderColor:'white',
                  borderWidth:5
              }}
            resizeMode="contain"
          />
        
     
    </View>
    <View style={{paddingBottom:20,borderBottomColor:'white',borderBottomWidth:0.5}}>
   <Text style={{color:'white',marginTop:10,fontWeight:'700',textAlign:'center'}}>Free Trial 3 months left</Text>

    </View>

  

    </View>
  );
};

export default PaymentSettings;