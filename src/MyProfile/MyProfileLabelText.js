import * as React from "react";
import {StyleSheet, Text, View} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';


export default function (props) {

    return(

          <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{width: '90%'}}>
                  <Text style={styles.labelText}>{props.label}</Text>
                  <Text style={styles.actualText}>{props.value}</Text>
              </View>

              <View>
                  <FontAwesome5 style={{paddingTop: 10}} name="edit" size={24} color={colors.backgroundCommonDark}/>
              </View>
          </View>

    );
}

const styles =  StyleSheet.create({
   container:{
       flex: 1,

   },
    labelText: {
        color: colors.backgroundCommonDark,
        fontWeight: 'bold',
        fontSize: 19,
    },
    actualText: {
        color: colors.backgroundCommonDark,
        fontSize: 18,
    },
});