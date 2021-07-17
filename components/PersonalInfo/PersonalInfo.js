import React, { Component } from 'react'
import { Text, View , StyleSheet} from 'react-native'
import database from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth"

import PersonalInfoForm from "./PersonalInfoForm"


export class PersonalInfo extends Component {

    constructor(props){
        super(props);
        this.state = {
            user : auth().currentUser,
            name:  "",
            age: "",
            country: "Select",
            interests: [],
            gender: "",
            interestModalVisible: false,
            genreModalVisible: false,
            chipIcon: "plus",
            chipSelected: false,
            musicTaste: []
    
        }
      
       
    }
    
    //this retrives the name of the newly signed up user from the DB and saves it in the state
    componentDidMount(){
        database().ref('/users/' + this.state.user.uid).once("value").then(snapshot => {
            let name = snapshot.val().name
            this.setState({name})

        }).catch((error) =>{
            console.log(error)
        })
      
      
    
    }
     

    
    render() {
       
        //this is a method used to set either the interest/musicTaste pop to true/false, depending on the parameters given
        const setModalVisible =(value, type)=>{
            const key = type.concat("ModalVisible")
            this.setState({
                [key]: value
            })
           
            console.log(this.state.interestModalVisible)
        }
      
     
      return (
            
           <View style = {[styles.container, this.state.interestModalVisible || this.state.genreModalVisible?  {backgroundColor: 'rgba(0,0,0,0.5)'}: ""]}>
                    
            
                <Text style = {styles.headerText}>Hello,  {this.state.name}</Text>
                <Text style = {styles.headerText}>Please enter in some of your details:</Text>
               
               {/* this creates an instance of the PersonalInfoForm component where all the input fields are created */}
                <PersonalInfoForm setModalVisible = {setModalVisible} submit={true}/>
              
            </View>
                 
        )
        
    }
}


//this is the styling for the base personal info component
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: "#FFF"
    },

   
    headerText:{
        margin: 5,
        fontSize: 15,
    },

})


export default PersonalInfo
