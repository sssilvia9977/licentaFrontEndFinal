import 'react-native-gesture-handler';

import React from 'react';
import { StyleSheet, Text, View , Dimensions} from 'react-native';
import LoginScreen from "./src/LoginScreen";
import Schedule from "./src/schedule/Schedule";
import MyProfile from "./src/MyProfile/MyProfile";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import colors from './assets/colors'
import {createDrawerNavigator} from "react-navigation-drawer";
import MyCourses from "./src/MyProfile/MyCourses";
import MyCourseDetailsTemplate from "./src/MyProfile/MyCourseDetailsTemplate";
import AddAssignment from "./src/schedule/AddAssignment";
import Menu from "./src/Menu";
import GoToCourse from "./myMaps/GoToCourse";
import Recommendations from "./src/recomandari/Recommendations";
import AddRecMaps from "./myMaps/AddRecMaps";
import AddRecFinalStep from "./src/recomandari/AddRecFinalStep";
import SeeACategoryOnMaps from "./myMaps/SeeACategoryOnMaps";
import MyAddedRecommendations from "./src/recomandari/MyAddedRecommendations";



export default function App() {

  return (
      <AppContainer/>
  );

}

const AppNavigator = createStackNavigator({

  Login: {
    screen: LoginScreen,
    navigationOptions:{
      header: null
    }
  },
  Menu:{
    screen: Menu,
    navigationOptions:{
      header: null
    }
  },
  AddAssignment:{
    screen: AddAssignment ,
    navigationOptions:{
      header: null
    }
  },
  MyCourseDetailsTemplate: {
    screen: MyCourseDetailsTemplate,
    navigationOptions:{
      header: null
    }
  },
  MyCourses: {
    screen: MyCourses,
    navigationOptions:{
      header: null
    }
  },
  MyProfile:{
    screen: MyProfile,
    navigationOptions:{
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
    navigationOptions:{
      header: null
    }
  },
  Recommendations: {
    screen: Recommendations,
    navigationOptions:{
      header: null
    }
  },
  AddRecMaps:{
    screen:AddRecMaps,
    navigationOptions:{
      header:null
    }
  },
  AddRecFinalStep:{
    screen:AddRecFinalStep,
    navigationOptions:{
      header:null
    }
  },
  SeeACategoryOnMaps:{
    screen: SeeACategoryOnMaps,
    navigationOptions:{
      header:null
    }
  },
  MyAddedRecommendations:{
    screen: MyAddedRecommendations,
    navigationOptions:{
      header:null
    }
  }


},{
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
  headerStyle:{
    backgroundColor: colors.backgroudCommon,
    height:40,
  }

});
