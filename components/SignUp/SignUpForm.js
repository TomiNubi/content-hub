import React, { Component } from 'react'
import { Text, View, StyleSheet, Button, TextInput, Alert, ActivityIndicator, TouchableOpacity, ScrollView, _ScrollView} from 'react-native'
import auth from "@react-native-firebase/auth"
import database from '@react-native-firebase/database';
//import {fb} from "../../config"





export class SignUpForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            
            //this defines the necessary variables needed for signing up
            emailText : "",
            passwordText : "",
            nameText: "",

            //this defines the variables needed for validation
            emailCorrect: true,
            passCorrect: true,
            nameCorrect: true,
            emailErrorVisible: false,
            passErrorVisible: false,
            nameErrorVisible: false,
            emailError: "",
            passwordError: "",
            nameError: "",
            loading: false
        }

    }
    render() {
        //this returns the UI elements such as textboxes and buttons for signing up
        return (
            
            <View style= {styles.container}>
                <ScrollView>
                    <TextInput style= {[styles.input, !this.state.nameCorrect? {borderColor: "red"}: ""]}
                                placeholder= "Name" value = {this.state.nameText}
                                onChangeText = {(nameText) => {this.setState({nameText}); this.setState({nameErrorVisible: false, nameCorrect: true})}} 
                                autoCorrect= {false} keyboardType= "default" autoCapitalize = "none"
                                placeholderTextColor = "rgba(255, 255, 255, 0.5 )"
                                returnKeyType = "next"
                                ref = {this.nameInput}>

                    </TextInput>

                    {/* this is one of the placeholders for an error message */}
                    <View style={styles.error}>
                        {this.state.nameErrorVisible?<Text style={styles.errorText}>{this.state.nameError}</Text>:
                            <Text></Text>
                        }
                    </View>

                    <TextInput style= {[styles.input, !this.state.emailCorrect? {borderColor: "red"}: ""]}
                                    placeholder= "Email" value = {this.state.emailText}
                                    onChangeText = {(emailText) => {this.setState({emailText}); this.checkEmail(emailText); }} 
                                    onEndEditing={() =>{this.setState({emailErrorVisible: true})}}
                                    autoCorrect= {false} keyboardType= "email-address" autoCapitalize = "none"
                                    placeholderTextColor = "rgba(255, 255, 255, 0.5 )"
                                    returnKeyType = "next"
                                    ref = {this.emailInput}>

                    </TextInput>
                    <View style={styles.error}>
                            {this.state.emailErrorVisible?<Text style={styles.errorText}>{this.state.emailError}</Text>:<Text></Text>
                            }
                    </View>

                    <TextInput style= {[styles.input,!this.state.passCorrect? {borderColor: "red"}: ""]} 
                                placeholder="Password" value = {this.state.passwordText}
                                onChangeText = {(passwordText) => {this.setState({passwordText}); this.checkPassword(passwordText)}}
                                secureTextEntry  
                                placeholderTextColor = "rgba(255, 255, 255, 0.5 )"
                                returnKeyType = "go">
                                
                    </TextInput>
                            
                            
                    <View style={styles.error}>
                    {this.state.passErrorVisible?<Text style={styles.errorText}>{this.state.passwordError}</Text>:<Text></Text>
                        }
                    </View>
               
             
                    <View style={styles.buttonView}>
                        <TouchableOpacity onPress={()=>this.signUp()} style = {styles.button}>
                            <View style={styles.row}>
                                {this.state.loading? <ActivityIndicator size="small" color="#3498db"/> : <></>}
                                <Text style={styles.buttonText}>Sign Up</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        )
    }

    //this makes use of REGEX to validate the email format. It displays an error message if invalid
    //adapted from: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript/48800
    checkEmail = (email)=>{
        var EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const validEmail = EMAIL_REGEX.test(email)
      

        if(!validEmail){
            this.setState({emailCorrect: false, emailError: "Invalid Email"})
        }
        else{
            this.setState({emailCorrect: true, emailError: ""})
        }
       
    }

    //this checks if the password length is greater than 6 and hence valid. It displays an error message if not
    checkPassword = (password)=>{
        if(password.length < 6){
            this.setState({passCorrect: false, passwordError: "Password must be greater than 6 characters"})
           
        }
        else{
            this.setState({passCorrect: true, passwordError: ""})
        }

    }

    
    signUp = () => {
       
        //this checks if valid passwords and email addresses have been entered
        if(!this.state.emailCorrect || !this.state.passCorrect){
            return
        }
        
        //this ensures that the name, email and password fields are not empty and displays an error message if so
        let email = this.state.emailText
        let password = this.state.passwordText
        let name = this.state.nameText
        if(name.length == 0){
            this.setState({nameCorrect: false, 
                            nameErrorVisible: true,
                            nameError: "Please enter your name"})
           
        }
        if(email.length == 0){
            this.setState({emailCorrect: false, 
                        emailErrorVisible: true,
                        emailError: "Please enter your email"})
        }
        if(password.length == 0){
            this.setState({passCorrect: false, 
                            passErrorVisible: true,
                            passwordError: "Please enter your password"})
 
        }

        if(name.length == 0 || email.length == 0 || password.length== 0){
            return
        }

            this.setState({loading: true})

            //if all data is valid, then it executes the createUser method
            this.createUser(email, password, name)
            
        
        }

        //this uses the Firebase createUser method to register a new user.
        createUser = (email, password, name) =>{

            auth().createUserWithEmailAndPassword(email, password)
                .then(() => {
                    //when regsitered, the addtoDb method is launched
                    this.addToDb(name, auth().currentUser.uid )
                    this.setState({loading: false})
                    
                    
            }).catch(error => 
                {
                    //if an error occurs, it displays descriptions for common errors or simply displays the error code
                    if (error.code === 'auth/email-already-in-use') {
                        this.setState({emailCorrect: false, 
                            emailErrorVisible: true,
                            emailError: "This email is already in use"})
                    }
              
                    if (error.code === 'auth/invalid-email') {
                        this.setState({emailCorrect: false, 
                            emailErrorVisible: true,
                            emailError: "This email is invalid"})
                    }
                    else{
                        Alert.alert(error.code)
                    }
                        return
                })
        }

        //this adds the user's name to the DB and sets the 'isNewUser' status to true
        addToDb = (name, userId) =>{
            database().ref("users/" + userId).set({
                name: name,
                isNewUser: true
            }).then(() => console.log("Data set"))
        }
    
}

//this is the styling for the signUpForm component

const styles = StyleSheet.create({
    container:{
        padding: 20,   
    },

    input:{
        height: 50,
        borderColor: "rgba(255, 255, 255, 0.8)",
        color: "#FFF",
        padding: 10,
        borderRadius: 3,
        borderWidth: 1,
    },

    row:{        
        flexDirection: "row",
    },
    
    error:{
        marginBottom:20
    },
    errorText:{
        color: "red"
    },
    buttonView:{
       
       marginTop: 10,
        backgroundColor: "#FFF",
        borderRadius: 5,
        borderColor: "#FFF",
        alignSelf: 'stretch',
        borderWidth: 2,
    },

    buttonText:{
        fontSize: 18,
        color: "#3498db",
        padding:10,
    },

    button:{
       alignItems: "center"
    }
})


export default SignUpForm
