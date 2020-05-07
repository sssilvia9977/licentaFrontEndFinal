import * as React from "react";
import {StyleSheet, Text, View, TouchableOpacity, KeyboardAvoidingView, ScrollView} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from "@expo/vector-icons";
import {Divider, Input} from "react-native-elements";
import {useState} from "react";
import axios from "axios";
import {useEffect} from "react";
import DatePicker from 'react-native-datepicker'
import {Dropdown} from 'react-native-material-dropdown';



export default function ({courseName, sessionFromBack, navigation, hideOverlay, assignments, setAssignments}) {

    /*
    TODO: la setCourseChoise useState , daca vin pe de ecran de curs, pune acel curs ca varianta initiala
     */
    /*
    TODo:vezi ca nu iti arata valoarea aleasa in drop down
     */

    const [datePicker, setDatePicker] = useState(new Date());
    const [courseChoise, setCourseChoise] = useState([{value: "banana"}]);
    const [assigTitle, setAssigTitle] = useState("");
    const [assigDesc, setAssigDesc] = useState("");



    useEffect(() => {
        axios.post("http://192.168.43.239:8080/getCourses", {sessionId: sessionFromBack}).then(response => {
            setCourseChoise(response.data.name);
        })
    }, []);

    function setDatee(date) {
        setDatePicker(date);
        console.log(date);
    }

    async function addAssigAndNavigate(){

        let id = 0;
        const response = (await axios.post("http://192.168.43.239:8080/addAssig",
                {
                    sessionId: sessionFromBack,
                    courseName: courseName,
                    assigTitle: assigTitle,
                    assigDeadline: datePicker,
                    assigDescription: assigDesc
                })).data;
        id = response;
        let assignment = {courseName: courseName, title:assigTitle , dateLine: datePicker, description: assigDesc, id: id};
        setAssignments([...assignments, assignment].sort(function (a, b) {
            return ('' + a.dateLine).localeCompare(b.dateLine);
        }));
        hideOverlay(false);
        //navigation.navigate("MyCourseDetailsTemplate");
    }



    return (
        <View style={styles.container}>

                {
                    courseName == "" &&

                        <View>
                            <Dropdown
                                style={{paddingTop: 50, marginBottom: 20,width: 200}}
                                label='Choose Course'
                                value="ceva"
                                data={courseChoise}/>
                        </View>

                }

                <Input
                    style={{width: 200, paddingTop: 30, paddingBottom: 20}}
                    label="Assignment title"
                    onChangeText={text => setAssigTitle(text)}/>

                <View>
                    <Text style={{fontWeight: 'bold', color:"#698a96", paddingTop:30,  fontSize: 15}}> Choose deadline</Text>
                    <DatePicker
                        style={{width: 200, paddingTop: 9, paddingBottom: 20}}
                        date={datePicker}
                        mode="date"
                        placeholder="select date"
                        format="DD-MM-YYYY"
                        minDate="01-09-2018"
                        maxDate="12-06-2029"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                        }}
                        onDateChange={(date) => setDatee(date)}
                    />
                </View>

                <Input
                    multiline={true}
                    style={{paddingTop: 30, width: 200,}}
                    label="Assignment description"
                   onChangeText={text => setAssigDesc(text)}/>

                <TouchableOpacity
                    style={[commonStyle.commonButton, {marginTop: 50}]}
                    onPress={()=> addAssigAndNavigate()}
                >
                    <Text style={commonStyle.textButtonCommon}>Save assignment</Text>
                </TouchableOpacity>


        </View>
    )

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroudCommon,
        justifyContent: 'space-between',
        padding: 20,

    },
    assigContainer: {
        flex: 0.9,
        padding: 20,
    },
    avatarView: {
        flex: 0.05,
        flexDirection: 'column',
        alignItems: 'center',
    },


});
