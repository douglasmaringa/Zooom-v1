import React, { useLayoutEffect, useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView, ScrollView, Dimensions,TouchableOpacity, View ,Text,TextInput,Image} from 'react-native'
import { styles } from '../styles/HomeScreenStyles'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PaymentSuccess = ({navigation}) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Thank You!!',
            headerStyle: { backgroundColor: '#1e1d26', elevation: 0 },
            headerTintStyle: { color: '#fff' },
            headerTintColor: '#fff',
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                   <TouchableOpacity activeOpacity={0.5} onPress={()=>{navigation.navigate("Home")}}>
                        <Ionicons
                            name='home'
                            size={25}
                            color='#1D51EF'
                            style={{ marginRight: 15 }}
                        />
                    </TouchableOpacity>
                    
                </View>
            ),
        })
    }, [navigation])
  return (
    <View style={[styles.container,{}]}>
         <View style={{display:'flex',paddingBottom:20,borderBottomColor:'gray',borderBottomWidth:0.5}}>
   
   <Image
      source={{uri:"https://creativehandles.com/uploads/images/create-a-thank-you-page_1639381445.jpg"}}
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
      <Text style={{textAlign:'center',marginTop:40,fontSize:36,fontWeight:'700',color:'white'}}>Your Payment Was a Success</Text>
    </View>
  )
}

export default PaymentSuccess