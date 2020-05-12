import * as React from "react";
import {Button, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView} from "react-native";
import colors from "../../assets/colors";
import commonStyle from "../../assets/style";
import {FontAwesome5} from '@expo/vector-icons';
import {useState} from "react";
import axios from "axios";
import {useEffect} from "react";
import {Overlay} from "react-native-elements";
import Menu from "../Menu";
import CardView from "./CardView";
import RecomCategory from "./RecomCategory";


export default function (props) {

    const sessionFromBack = props.sessionFromBack;

    let EAT_CHEAP = "Eat like a student";
    let COFFEE_STUDY = "Coffee & Study";
    let COFFEE_TOGO = "Coffee to go";
    let RESTAURANT = "Your usual day out";
    let DISCO = "Disco forever";
    let CONCERT = "Best live places";
    let SPLURGE = "Top splurge";

    const [respByCat, setRespByCat] = useState([[]]);



    useEffect(() => {


            (async () => {
                const respEAT_CHEAP = await axios.get('http://192.168.43.239:8080/getRecEAT_CHEAP');
                setRespByCat(respByCat => [...respByCat, respEAT_CHEAP.data]);

                const respCOFFEE_STUDY = await axios.get('http://192.168.43.239:8080/getRecCOFFEE_STUDY');
                setRespByCat(respByCat => [...respByCat, respCOFFEE_STUDY.data]);

                const respCOFFEE_TOGO = await axios.get('http://192.168.43.239:8080/getRecCOFFEE_TOGO');
                setRespByCat(respByCat => [...respByCat, respCOFFEE_TOGO.data]);

                const respRESTAURANT = await axios.get('http://192.168.43.239:8080/getRecRESTAURANT');
                setRespByCat(respByCat => [...respByCat, respRESTAURANT.data]);

                const respDISCO = await axios.get('http://192.168.43.239:8080/getRecDISCO');
                setRespByCat(respByCat => [...respByCat, respDISCO.data]);

                const respCONCERT = await axios.get('http://192.168.43.239:8080/getRecCONCERT');
                setRespByCat(respByCat => [...respByCat, respCONCERT.data]);

                const respSPLURGE = await axios.get('http://192.168.43.239:8080/getRecSPLURGE');
                setRespByCat(respByCat => [...respByCat, respSPLURGE.data]);
            })();


    }, []);

//mai am de pus si imaginea in card view si place name tot din google api ar terbui sa il iau
    return (


        <ScrollView style={{marginBottom: 140}}>

            {
                respByCat.map((cat, index) => (
                    <RecomCategory navigation={props.navigation} categArray={cat} key={index}/>
                ))
            }


        </ScrollView>


    );


}