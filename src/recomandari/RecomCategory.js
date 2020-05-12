import {ScrollView, Text, TouchableOpacity,TouchableWithoutFeedback,TouchableHighlight, View} from "react-native";
import commonStyle from "../../assets/style";
import CardView from "./CardView";
import * as React from "react";
import {useEffect} from "react";
import colors from "../../assets/colors";


export default function ({categArray, navigation}) {


    return (


        <View>
            {
                categArray.length !== 0 ?
                    <View>

                        <TouchableOpacity onPress={()=>navigation.navigate("SeeACategoryOnMaps", {"startPlace": 0, "categArray":categArray})}>
                            <Text style={[commonStyle.actualText, {padding: 10}]}>{categArray[0].category}</Text>
                        </TouchableOpacity>



                        <ScrollView horizontal={true} contentContainerStyle={{height: 230}}>
                            {
                                categArray.map((rec, index) => (
                                    <TouchableHighlight underlayColor='rgba(86, 19, 41, 0.0)' onPress={()=>navigation.navigate("SeeACategoryOnMaps", {"startPlace": index, "categArray":categArray})} key={index}>
                                    <CardView placeName={rec.placeName} address={rec.address}
                                              comment={rec.initialComment} />
                                    </TouchableHighlight>
                                ))
                            }
                        </ScrollView>
                    </View> : <View/>
            }
        </View>
    );

}
