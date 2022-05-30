import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator,Image } from "react-native";
import { useWindowDimensions } from "react-native";
import AudioPlayer from "./AudioPlayer";

const blue = "#3777f0";
const grey = "lightgrey";

const Message = ({me,other, message,route }) => {
  const [user, setUser] = useState();
  const [isMe, setIsMe] = useState(false);
  const [soundURI, setSoundURI] = useState(null);
 

  const { width } = useWindowDimensions();
  
  useEffect(() => {
    
    setIsMe(message.sender === me);
  
  }, [message,route,me]);

  if (!message) {
    return <ActivityIndicator />;
  }
  console.log("is me",isMe)

  return (
    <View
      style={[
        styles.container,
        isMe ? styles.rightContainer : styles.leftContainer,
        { width: soundURI ? "75%" : "auto" },
      ]}
    >
      {message.image? (
        <View style={{ marginBottom: message.content ? 10 : 0 }}>
          <Image
            source={{uri:`${message.image}`}}
            style={{ width: width * 0.7, aspectRatio: 4 / 3 }}
            resizeMode="contain"
          />
        </View>
      ):(<></>)}
      {message.audio ? (<><AudioPlayer soundURI={message?.audio} /></>):(<></>)}

      {!!message && (
        <Text style={{ color: isMe ? "black" : "white" }}>
          {message.message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    margin: 10,
    borderRadius: 10,
    maxWidth: "75%",
  },
  leftContainer: {
    backgroundColor: blue,
    marginLeft: 10,
    marginRight: "auto",
  },
  rightContainer: {
    backgroundColor: grey,
    marginLeft: "auto",
    marginRight: 10,
  },
});

export default Message;