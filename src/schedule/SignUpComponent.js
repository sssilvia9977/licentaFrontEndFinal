import {KeyboardAvoidingView, Text, TextInput, View} from "react-native";
import * as React from "react";
import commonStyle from "../../assets/style";
import {useState} from "react";

/*
TODO: OOKK
 */

export default function ({label, send, error}) {


    const [isPassword, setIsPassword] = useState(label === "Password");

    return(
        <View style={{margin:10}}>

          <Text style={{fontFamily:"montserrat", paddingLeft:8, fontSize:20}}>{label}</Text>

          <TextInput
              autoCapitalize = {isPassword ? 'none' : 'words'}
              secureTextEntry={isPassword}
              style={[commonStyle.inputFocus]}
              onChangeText={text => send(text)}
          />
            <Text style={{fontFamily:"montserrat", paddingLeft:8,color:"red", fontSize:13}}>{error}</Text>


      </View>
    );
}