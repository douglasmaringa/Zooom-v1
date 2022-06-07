import React, {useEffect, useState, useCallback} from 'react';
import 'react-native-gesture-handler';
import { View, Text, Pressable, Alert,Dimensions,Image,ActivityIndicator,StatusBar,ScrollView, StyleSheet } from "react-native";
import { styles } from '../styles/HomeScreenStyles'

import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import * as Linking from 'expo-linking';
import {fetchPublishableKey} from '../helpers';
import Card from './Card';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const PaymentSettings = ({navigation}) => {
  const {handleURLCallback} = useStripe();
  const [publishableKey, setPublishableKey] = useState('');

  useEffect(() => {
    async function initialize() {
      const publishableKey = await fetchPublishableKey();
      if (publishableKey) {
        setPublishableKey(publishableKey);
      }
    }
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeepLink = useCallback(
    async (url) => {
      if (url && url.includes('safepay')) {
        await handleURLCallback(url);
      }
    },
    [handleURLCallback]
  );

  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };

    const urlCallback = (event) => {
      handleDeepLink(event.url);
    };

    getUrlAsync();

    Linking.addEventListener('url', urlCallback);

    return () => Linking.removeEventListener('url', urlCallback);
  }, [handleDeepLink]);

 console.log(publishableKey)
  return (
    <StripeProvider
    publishableKey={publishableKey}
    merchantIdentifier="merchant.com.stripe.react.native"
    urlScheme={Linking.createURL('') + '/--/'}
    setUrlSchemeOnAndroid={true}
  >
    <ScrollView style={[styles.container,{backgroundColor:'white'}]}>
       <View style={{display:'flex',paddingBottom:20,borderBottomColor:'gray',borderBottomWidth:0.5}}>
   
         <Image
            source={{uri:"https://support.mywifinetworks.com/hc/article_attachments/360055906133/5e1cce2c96d1d.png"}}
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
    <View style={{paddingBottom:20,borderBottomColor:'black',borderBottomWidth:0.5}}>
   <Text style={{color:'black',marginTop:10,fontWeight:'700',textAlign:'center'}}>Free Trial 6 months left</Text>

    </View>
<Card navigation={navigation}/>
  

    </ScrollView>
    </StripeProvider>
  );
};

export default PaymentSettings;