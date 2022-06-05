import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  Button,
} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import  {
  CardFieldInput,
  PaymentMethodCreateParams,
} from '@stripe/stripe-react-native';

import {API_URL} from '../config';

export default function Card({navigation}) {
  const [name, setName] = useState('');
  const {confirmPayment, loading} = useConfirmPayment();

  const fetchPaymentIntentClientSecret = async () => {
      console.log("fetching client secret")
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentMethodType: 'card',
        currency: 'usd',
      }),
    });
    const {clientSecret} = await response.json();
     console.log("client secret",clientSecret)
    return clientSecret;
  };

  const handlePayPress = async () => {
    // 1. fetch Intent Client Secret from backend
    const clientSecret = await fetchPaymentIntentClientSecret();

    // 2. Gather customer billing information (ex. email)
    const billingDetails: PaymentMethodCreateParams.BillingDetails = {
        name,
      };

    const {error, paymentIntent} = await confirmPayment(clientSecret, {
      type: 'Card',
      billingDetails,
    });

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log('Payment confirmation error', error.message);
    } else if (paymentIntent) {
      Alert.alert(
        'Success',
        `The payment was confirmed successfully! currency: ${paymentIntent.currency}`
      );
      console.log('Success from promise', paymentIntent);
    navigation.navigate("PaymentSuccess")
    }
  };

  return (
    <ScrollView style={styles.container}>
     
      <TextInput
        autoCapitalize="none"
        placeholder="Name"
        keyboardType="name-phone-pad"
        onChange={(value) => setName(value.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        onCardChange={(cardDetails) => {
          console.log('cardDetails', cardDetails);
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
        cardStyle={inputStyles}
        style={styles.cardField}
      />
      <Button onPress={handlePayPress} style={{marginBottom:20}} title="Pay" disabled={loading} />
     
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom:30
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
  },
  input: {
    height: 44,
    borderBottomColor: 'gray',
    borderBottomWidth: 1.5,
  },
});

const inputStyles = {
  borderWidth: 1,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderRadius: 8,
  fontSize: 14,
  placeholderColor: '#999999',
};