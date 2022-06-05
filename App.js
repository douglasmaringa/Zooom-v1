import React from 'react';
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import 'react-native-gesture-handler'
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddChatScreen from './src/screens/AddChatScreen';
import ChatScreen from './src/screens/ChatScreen';
import { LogBox } from 'react-native';
import Contacts from './src/screens/Contacts';
import Settings from "./src/screens/Settings"
import ChatInfo from './src/screens/ChatInfo';
import GroupHome from "./src/screens/GroupHome"
import GroupContacts from "./src/screens/GroupContacts"
import GroupChatScreen from "./src/screens/GroupChatScreen"
import GroupChatInfo from "./src/screens/GroupChatInfo"
import ProfileSettings from './src/screens/ProfileSettings';
import PrivacySettings from './src/screens/PrivacySettings';
import PaymentSettings from './src/screens/PaymentSettings';
import { usePreventScreenCapture } from 'expo-screen-capture';
import PaymentSuccess from './src/screens/PaymentSuccess';

LogBox.ignoreAllLogs()

export default function App() {
  usePreventScreenCapture();
  const Stack = createStackNavigator()

  const globalScreenOptions = {
    headerStyle: { backgroundColor: '#1e1d26', elevation: 0 },
    headerTitleStyle: { color: '#C7C6CD' },
    headerTintColor: '#C7C6CD',
    headerTitleAlign: 'left',
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="AddChat"
          component={AddChatScreen}
        />

         <Stack.Screen
          name="Contacts"
          component={Contacts}
        />

        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

        <Stack.Screen
          name="ChatInfo"
          component={ChatInfo}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

        <Stack.Screen
          name="GroupHome"
          component={GroupHome}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

        <Stack.Screen
          name="GroupContacts"
          component={GroupContacts}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

         <Stack.Screen
          name="GroupChat"
          component={GroupChatScreen}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

        <Stack.Screen
          name="GroupChatInfo"
          component={GroupChatInfo}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

<Stack.Screen
          name="ProfileSettings"
          component={ProfileSettings}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

<Stack.Screen
          name="PrivacySettings"
          component={PrivacySettings}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />

<Stack.Screen
          name="PaymentSettings"
          component={PaymentSettings}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />
        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccess}
          options={{
            headerStyle: {
              backgroundColor: '#1e1d26',
              elevation: 0
            }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

