//this is the first component that is launched and basically defines how all the other components link with each other 
//and determines how they navigate amongst one another

import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import { NavigationContainer, } from '@react-navigation/native';
import {createStackNavigator} from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import database from '@react-native-firebase/database';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FeatherIcon from 'react-native-vector-icons/Feather' ;
import { useStateWithCallbackLazy } from 'use-state-with-callback';

import {View} from 'react-native';


//this imports all the other components to create links between them
import SplashScreen from "./components/SplashScreen/SplashScreen"
import  Login  from "./components/Login/Login"
import SignUp from './components/SignUp/SignUp/'
import Settings from "./components/Settings/Settings"
import PersonalInfo from "./components/PersonalInfo/PersonalInfo"
import MusicScreen from "./components/Home/MusicScreen"
import VideoScreen from "./components/Home/VideoScreen"
import TextScreen from "./components/Home/TextScreen"
import { TouchableOpacity } from 'react-native-gesture-handler';


//A stack navigator is used to navigate between screens
const Stack = createStackNavigator();




  
  
const App: () => React$Node = () => {
  
 //this defines variables that cause the component to rerender when changed
  const [initializing, setInitializing] = useState(true);
  const[checkingUserState, setCheckUserState] = useState(true)
  const [isLoggedIn, setLoggedIn] = useState(false)
  const[user, setUser] = useState()
  const [isNewUser, setIsNewUser] = useStateWithCallbackLazy(false)

  
  
  function onAuthStateChanged(user) {
   
    //if a user state change is detected:
    //set the user variable to the user object or to null if no user is signed in
  
    setUser(user)

    if (user == null) {
      setLoggedIn(false)
      if (initializing) setInitializing(false);
    } else {
      setLoggedIn(true)
      setUser(user)
      if (initializing) setInitializing(false);
     
    }
  }

    useEffect(() => {
      //this checks for a change in the user state. Whether or not they are logged/signed in
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged)
        return () =>{subscriber;}
  
  }, [])

  useEffect(()=>{
  
    if(isNewUser ==true){
       setCheckUserState(false);
       console.log(checkingUserState)
    }
  }, [isNewUser])

  if(user!= null){
    //checks if the current user is signed up for the first time from the DB
    database().ref("/users/" + user.uid).on("value",  snapshot =>{

      if(snapshot.val() != null){
        if(snapshot.val().isNewUser){
          setIsNewUser(snapshot.val().isNewUser, () =>  { console.log("log")})
        }
        else{
          setIsNewUser(false)
          setCheckUserState(false);console.log(checkingUserState)
        }

      }    
    })
    
    }
 
  //the following determine the navigation between screens
  //If the user is logged in, then check if the user is signing up for the first time, if yes, then open the personal info screen
  //if the user is logged in and is not signing up for the first time, then open the home screen
  //if the user is not logged in then open the login screen
  return (    
    <NavigationContainer>
     <Stack.Navigator>
        {initializing? (<Stack.Screen name = "Splash Screen" component= {SplashScreen} options={{headerShown :false}}   />) :
        isLoggedIn? checkingUserState? <Stack.Screen name = "Splash Screen" component= {SplashScreen} options={{headerShown :false}}   /> : isNewUser? (
         <Stack.Screen name = "Personal Info" component = {PersonalInfo}/>
        ): (
          <>
            <Stack.Screen name="Home" component={HomeScreen}
              options = {({ navigation, route }) =>(
                {
                  headerRight : () => (<TouchableOpacity onPress = {() => navigation.navigate("Settings")} style={{marginHorizontal:10}}>
                            <FeatherIcon name="settings" color="#51ADCF" size={25} />
                    </TouchableOpacity>),
                  
                    
                })
              } />
            <Stack.Screen name = "Settings" component= {Settings}/>
            
          </>
        ) : (
          <>
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
          </>
        )}
      </Stack.Navigator>
    
    
    </NavigationContainer>
  
  );
};


const Tab = createBottomTabNavigator();

//this component defines the Home Screen and sets the navigation between the music, video and text components using a tab navigator

function HomeScreen (){


  const [visible, setVisible] = useState(true)

  return (
    <View style ={[{flex: 1, backgroundColor: "black"}]}>
      
      <Tab.Navigator 
          tabBarOptions={{
            activeTintColor: '#51ADCF',
          }}>
        <Tab.Screen name = "Music" component = {MusicScreen}
           options={{
              tabBarIcon: ({ color, size }) => (
            <FeatherIcon name="music" color={color} size={size} />
          ),
        }}/>
        <Tab.Screen name = "Videos" component = {VideoScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
              <FeatherIcon name="youtube" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen name = "TextScreen" component = {TextScreen}
              options={{
                tabBarIcon: ({ color, size }) => (
              <FontistoIcon name="quote-a-left" color={color} size={size} />
            ),
          }}/>
        
      </Tab.Navigator>
      </View>
  )
}



export default App;
