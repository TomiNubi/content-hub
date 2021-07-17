import React, { Component } from 'react'
import { Text, View, StyleSheet, TextInput, Button, Alert, ActivityIndicator} from 'react-native'
import auth from "@react-native-firebase/auth"
import { TouchableOpacity } from 'react-native-gesture-handler';


export default class LoginForm extends Component {
    constructor(props){
        super(props);

        //this defines the necessary variables needed for logging in
        this.state = {
            emailText : "",
            passwordText : "",
            emailCorrect: true,
            passCorrect: true,
            emailErrorVisible: false,
            passErrorVisible: false,
            emailError: "",
            passwordError: "",
            loading: false


        }

    }
    render() {

        //this returns the UI elements such as textboxes and buttons for logging in
        return (
            <View style= {styles.container}>
               <TextInput style= {[styles.input, !this.state.emailCorrect? {borderColor: "red"}: ""]}
                            placeholder= "Email" value = {this.state.emailText}
                            onChangeText = {(emailText) => {this.setState({emailText}); this.checkEmail(emailText); }} 
                            onEndEditing={() =>{this.setState({emailErrorVisible: true})}}

                            autoCorrect= {false} keyboardType= "email-address" autoCapitalize = "none"
                            placeholderTextColor = "rgba(0, 0, 0, 0.5 )"
                            returnKeyType = "next"
                            ref ={this.emailInput}>

               </TextInput>
                 {/* this is one of the placeholders for an error message */}
               <View style={styles.error}>
                    {this.state.emailErrorVisible?<Text style={styles.errorText}>{this.state.emailError}</Text>:<Text></Text>
                    }
               </View>
               <TextInput style= {[styles.input,!this.state.passCorrect? {borderColor: "red"}: ""]} 
                            placeholder="Password" value = {this.state.passwordText}
                            onChangeText = {(passwordText) => {this.setState({passwordText}); this.setState({passErrorVisible: false, passCorrect: true})}}
                            secureTextEntry  
                            placeholderTextColor = "rgba(0, 0, 0, 0.5 )"
                            returnKeyType = "go">
                            
                </TextInput>

                
                <View style={styles.error}>
                {this.state.passErrorVisible?<Text style={styles.errorText}>{this.state.passwordError}</Text>:<Text></Text>
                    }
                </View>


                <View style={styles.buttonView}>
                    <TouchableOpacity onPress={()=>this.signIn()} style = {styles.button}>
                        <View style={styles.row}>
                            {this.state.loading? <ActivityIndicator size="small" color="#FFF"/> : <></>}
                            <Text style={styles.buttonText}>Login</Text>
                        </View>
                    </TouchableOpacity>
               </View>
              
            
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


   //this is the method that checks the inputted data and logs the user in if valid
    signIn = () =>{

        //check if email and password are empty/invalid and shows error messages if true
        if(!this.state.emailCorrect){
            return
        }

        let email = this.state.emailText 
        let password = this.state.passwordText

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
        if(email.length == 0 || password.length== 0){
            return
        }
        
        //if data is valid, it calls the firebase signIn method and passes in the email and password

        this.setState({loading: true})

        auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            this.setState({loading: false})
            console.log("Successful sign In")
            
        }).catch((error) => {

            //if an error occurs, it displays descriptions for common errors or simply displays the error code
            console.log("failed sign In")
            this.setState({loading: false})
            if (error.code === "auth/user-not-found"){

                this.setState({emailCorrect: false, 
                                emailErrorVisible: true,
                                emailError: "This user account does not exist"})
            }
            else if(error.code === "auth/wrong-password"){
                this.setState({passCorrect: false, 
                    passErrorVisible: true,
                    passwordError: "Incorrect password"})
            }
            else{
                Alert.alert(error.code);
            }
        })
    }
}



//the styling for the loginform component
const styles = StyleSheet.create({
    container:{
        padding: 20,
    },

    row:{        
        flexDirection: "row",
    },

    input:{
        
        height: 50,
        color: "black",
        padding: 10,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "#3498db"
        
    },
    error:{
        marginBottom:20
    },
    errorText:{
        color: "red"
    },
    buttonView:{
       
       marginTop: 10,
        backgroundColor: "#3498db",
        borderRadius: 5,
        borderColor: "#3498db",
        alignSelf: 'stretch',
        borderWidth: 2, 
    },

    buttonText:{
        fontSize: 18,
        color: "#FFF",
        padding:10,
    },

    button:{
       alignItems: "center"

    }
    
})
