import 'react-native-gesture-handler';

import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View, Dimensions} from 'react-native';
import Schedule from "./src/schedule/Schedule";
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import colors from './assets/colors'
import {createDrawerNavigator} from "react-navigation-drawer";
import MyCourses from "./src/MyProfile/MyCourses";
import AddAssignment from "./src/schedule/AddAssignment";
import Menu from "./src/Menu";
import GoToCourse from "./myMaps/GoToCourse";
import Recommendations from "./src/recomandari/Recommendations";
import AddRecMaps from "./myMaps/AddRecMaps";
import AddRecFinalStep from "./src/recomandari/AddRecFinalStep";
import SeeACategoryOnMaps from "./myMaps/SeeACategoryOnMaps";
import MyAddedRecommendations from "./src/recomandari/MyAddedRecommendations";
import MyCoursesDetailsDESIGN from "./src/MyProfile/MyCoursesDetailsDESIGN";
import {useEffect} from "react";
import * as Font from 'expo-font';
import commonStyle from "./assets/style";
import MyProfileDESIGN from "./src/MyProfile/MyProfileDESIGN";
import SignUp from "./src/SignUp";
import LoginDESIGN from "./src/LoginDESIGN";
import {AppLoading} from "expo";


export default function App() {

    const [render, setRender] = useState(false);

    useEffect(() => {
        (async () => {
            await Font.loadAsync({'montserrat': require('./assets/montserrat.ttf')});
            setRender(true);
            console.log('worked');

        })();

    }, []);



    if (!render) {
        return (
            <View>
                <View style={commonStyle.statusBar}/>
                <AppLoading/>
            </View>
        )
    }
    return (
        <AppContainer/>
    );

}

const AppNavigator = createStackNavigator({

    LoginDESIGN: {
        screen: LoginDESIGN,
        navigationOptions: {
            header: null
        }
    },
    Menu: {
        screen: Menu,
        navigationOptions: {
            header: null
        }
    },
    MyCourseDetailsTemplate: {
        //screen: MyCourseDetailsTemplate,
        screen: MyCoursesDetailsDESIGN,
        navigationOptions: {
            header: null
        }
    },
    AddAssignment: {
        screen: AddAssignment,
        navigationOptions: {
            header: null
        }
    },

    MyCourses: {
        screen: MyCourses,
        navigationOptions: {
            header: null
        }
    },
    MyProfile: {
        screen: MyProfileDESIGN,
        navigationOptions: {
            header: null
        }
    },
    SignUp: {
        screen: SignUp,
        navigationOptions: {
            header: null
        }
    },
    Schedule: {
        screen: Schedule,
        navigationOptions: {
            header: null
        }
    },
    GoToCourse: {
        screen: GoToCourse,
        navigationOptions: {
            header: null
        }
    },
    Recommendations: {
        screen: Recommendations,
        navigationOptions: {
            header: null
        }
    },
    AddRecMaps: {
        screen: AddRecMaps,
        navigationOptions: {
            header: null
        }
    },
    AddRecFinalStep: {
        screen: AddRecFinalStep,
        navigationOptions: {
            header: null
        }
    },
    SeeACategoryOnMaps: {
        screen: SeeACategoryOnMaps,
        navigationOptions: {
            header: null
        }
    },
    MyAddedRecommendations: {
        screen: MyAddedRecommendations,
        navigationOptions: {
            header: null
        }
    }


}, {
    headerMode: 'screen'
});

const AppContainer = createAppContainer(AppNavigator);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerStyle: {
        backgroundColor: colors.backgroudCommon,
        height: 40,
    }

});
