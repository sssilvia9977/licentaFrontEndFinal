import * as React from "react";

import axios from 'axios';
import commonStyle from "../../assets/style"
import {
    Button,
    StyleSheet,
    ScrollView,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    TouchableWithoutFeedback
} from "react-native";
import {FontAwesome5} from '@expo/vector-icons';
import colors from "../../assets/colors";
import {useState} from "react";
import {Divider, Input, Overlay} from "react-native-elements";
import AddAssignment from "./AddAssignment";
import DatePicker from "react-native-datepicker";

export default function (props) {

    const myColorStatus = props.status;
    const [myColor, setMyColor] = useState(myColorStatus === "Completed" ? true : false);
    const [openMenu, setOpenMenu] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [heightOver, setHeightOver] = useState(100);

    const [datePicker, setDatePicker] = useState(props.deadline);
    const [courseChoise, setCourseChoise] = useState([{value: "banana"}]);
    const [assigTitle, setAssigTitle] = useState(props.courseAbreviere);
    const [assigDesc, setAssigDesc] = useState(props.description);


    function changeAssigStatus() {
        setMyColor(!myColor);
        // console.log(props.assigId);
        axios.post("http://192.168.43.239:8080/setAssigStatus", {
            sessionId: props.sessionFromBack,
            assigId: props.assigId
        })
    }


    function updateAssigAndNavigate() {
        // console.log("Id of assig longed presses: " + props.assigId);

        axios.post("http://192.168.43.239:8080/updateAssig", {
            sessionId: props.sessionFromBack,
            assigId: props.assigId,
            assigTitle: assigTitle,
            assigDeadline: datePicker,
            assigDescription: assigDesc
        });
        //TODO add courseName cand ne trebuie
        let assignment = {title: assigTitle, dateLine: datePicker, description: assigDesc, id: props.assigId};
        props.updateAssignment(assignment);
        props.navigation.navigate("MyCourseDetailsTemplate", {newIsVisible : false});
        setOpenMenu(false);
        setOpenUpdate(false);
        setHeightOver(100);
    }

    function updateAssig() {
        setOpenUpdate(true);
        setHeightOver(370);
    }

    function deleteAssig() {
      //  console.log("Id of assig to DELETE: " + props.assigId);
        setOpenMenu(false);
        props.deleteAssignment(props.assigId);
        axios.post("http://192.168.43.239:8080/deleteAssig", {
            sessionId: props.sessionFromBack,
            assigId: props.assigId
        });
        props.navigation.navigate("MyCourseDetailsTemplate");
    }

    function setDatee(date) {
        setDatePicker(date);
        console.log(date);
    }

    return (
        <View>
            <Overlay isVisible={openMenu}
                     borderRadius={9}
                     height={heightOver}
                     containerStyle={{flex: 1, justifyContent: "space-between"}}
                     windowBackgroundColor="rgba(214, 162, 232, .9)"
                     overlayBackgroundColor={colors.backgroudCommon}
                     onBackdropPress={() => {
                         setOpenMenu(false);
                         setHeightOver(100);
                         setOpenUpdate(false)
                     }}>

                {
                    openUpdate ?
                        <View>
                            <Input
                                style={{width: 200, paddingTop: 30, paddingBottom: 20}}
                                label="Assignment title"
                                defaultValue={props.courseAbreviere}
                                onChangeText={text => setAssigTitle(text === '' ? props.courseAbreviere : text) }/>


                            <View>
                                <Text
                                    style={{fontWeight: 'bold', color: "#698a96", paddingTop: 30, fontSize: 15}}> Choose deadline</Text>
                                <DatePicker
                                    style={{width: 200, paddingTop: 9, paddingBottom: 20}}
                                    date={datePicker}
                                    mode="date" placeholder="select date" format="DD-MM-YYYY" minDate="01-09-2018" maxDate="12-06-2029" confirmBtnText="Confirm" cancelBtnText="Cancel"
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
                                defaultValue={props.description}
                                onChangeText={text => setAssigDesc(text === '' ? props.description : text)}/>

                            <TouchableOpacity
                                style={[commonStyle.commonButton, {marginTop: 50}]}
                                onPress={() => updateAssigAndNavigate()}
                            >
                                <Text style={commonStyle.textButtonCommon}>Update assignment</Text>
                            </TouchableOpacity>

                        </View>


                        :
                        <View>
                            <TouchableOpacity
                                onPress={() => updateAssig()}>
                                <Text style={commonStyle.actualText}>Update</Text>
                            </TouchableOpacity>
                            <Divider style={{backgroundColor: colors.myPink, height: 2, marginTop: 10}}/>
                            <TouchableOpacity
                                onPress={() => deleteAssig()}>
                                <Text style={[commonStyle.actualText, {
                                    paddingTop: 10,
                                    color: colors.myPink
                                }]}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                }
            </Overlay>


            <TouchableWithoutFeedback onLongPress={() => {setOpenMenu(true); }}>

                <View style={styles.container}>
                    <FontAwesome5 style={{width: "13%", paddingLeft: 6, paddingTop: 5}} name="thumbtack" size={20}
                                  color={colors.backgroundCommonDark}/>

                    <View>
                        <Text style={commonStyle.actualText}>{props.courseAbreviere}</Text>
                        <Text style={commonStyle.actualSmallText}>{props.deadline}</Text>
                        {
                            props.taskName == null ?
                                <Text style={commonStyle.actualSmallText}>{props.description}</Text> :
                                <View>
                                    <Text style={commonStyle.actualSmallText}>{props.taskName}</Text>
                                    <Text style={commonStyle.actualSmallText}>{props.description}</Text>
                                </View>
                        }


                    </View>

                    <View style={{flex: 1, flexDirection: "row-reverse"}}>
                        <FontAwesome5 style={{paddingLeft: 10, paddingRight: 9, paddingTop: 5}} name="check-circle"
                                      size={30}
                                      onPress={() => changeAssigStatus()}
                                      color={myColor === false ? colors.gray : colors.green}
                        />
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        flex: 1,
        flexDirection: "row",

    }
});



