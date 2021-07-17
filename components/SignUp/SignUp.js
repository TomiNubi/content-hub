import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import auth from "@react-native-firebase/auth"
import SignUpForm from "./SignUpForm"

export class SignUp extends Component {
    render() {
        return (
            //this provides the UI elements for the sign up page
            <View style= {styles.container}>
                <View style = {styles.logoContainer}>
                    <Text style= {styles.logo}> S I G N  U P {console.log("Sign Up has been initialised")}</Text>
                </View>
                
                <View style = {styles.formContainer}>

                    {/* this creates an instance of the SignUpForm Component */}
                    <SignUpForm navigation = {this.props.navigation}/>

                    <View  style={styles.LoginText}>
                         {/* this navigates to the Login page */}
                        <Text style={styles.LoginText} accessibilityRole = "button" onPress = {() => this.props.navigation.navigate("Login")}> Already have an account? Login here</Text>
                    </View>
                </View>
                
            </View>
        )
    }

  
}

//this is the styling for the signUp page
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#3498db"

    },
    logoContainer:{
        flex: 1,
        margin: 50,
        fontFamily: "Trebuchet MS, sans-serif",
        fontSize: 50,
        alignItems: "center",
        justifyContent: "flex-end"
    },
    logo:{
        fontSize: 30,
        color: "white",
        opacity: 0.9
    },
    formContainer:{
        flex : 5,
        
    },
    LoginText:{
        flex: 1,
        marginTop: 15,
        alignItems: "center",
        color: "white"

    }

})


export default SignUp
