import React, { Component } from 'react'
import { Text, View, StyleSheet} from 'react-native'
import LoginForm from "./LoginForm"


export class Login extends Component{
    
    render(){

        //this provides the UI elements for the login page
        return (
            
            <View style= {styles.container}>
                <View style = {styles.logoContainer}>
                <Text style= {styles.logo}> L O G I N </Text>
                </View>
                <View style = {styles.formContainer}>

                    {/* this creates an instance of the loginForm Component */}
                    <LoginForm navigation = {this.props.navigation}/>
                    <View  style={styles.signUpText}>

                        {/* this navigates to the signUp page */}
                        <Text style={styles.signUpText} accessibilityRole = "button" onPress = {() => this.props.navigation.navigate("SignUp")}> Dont have an account? Sign up here</Text>
                        
                    </View>
                </View>
                
            </View>
        );
        }
}

//this is the styling for the login page

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: "#FFF",
        justifyContent: "center",
        alignContent: "center"

    },
    logoContainer:{
        flex: 1,
        margin: 50,
        fontFamily: "OpenSans-Regular",
        fontSize: 50,
        alignItems: "center",
        justifyContent: "flex-end"
        

    },
    logo:{
        fontSize: 30,
        color:"#3498db",
        opacity: 0.9
    },
    formContainer:{
        flex : 5,  
    },

    signUpText:{
        flex: 1,
        marginTop: 15,
        alignItems: "center",
        color: "black"

    }

})


export default Login
