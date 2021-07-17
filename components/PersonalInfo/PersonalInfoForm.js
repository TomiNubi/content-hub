import React, { Component } from 'react'
import { Text, View ,  StyleSheet, TouchableOpacity,  ScrollView, ActivityIndicator} from 'react-native'
import {  Picker, Form, Item, } from 'native-base';
import Icon from 'react-native-vector-icons/Fontisto';
import { RadioButton , TextInput, Chip} from 'react-native-paper';
import database from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth"

import ModalClass from "./InfoModal"

//imports a list of countries and the lists of interest and music taste options
import {countries} from "../../Data/countries"
import{genres} from "../../Data/musicGenres"
import{interests as chips} from "../../Data/interests"


export class PersonalInfoForm extends Component {

    constructor(props){
        super(props);
        this.state = {

            //this defines the user's information or creates placeholders for them
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
            musicTaste: [],

            
            //this defines the variables needed for data validation and display of error messages
            nameCorrect: true,
            ageCorrect: true,
            countryCorrect: true,
            genderCorrect: true,
            interestsCorrect: true,
            genreCorrect: true,
            nameErrorVisible: false,
            ageErrorVisible: false,
            countryErrorVisible: false,
            ageError: "",
            countryError: "",
            nameError: "",
            genderError: "",
            loading: false

        }
      
       
    }
    
        //these methods are executed when the component is launched
       componentDidMount(){
            // the name of the newly signed up user is retrieved and saved in the state 
            database().ref('/users/' + this.state.user.uid).once("value").then(snapshot => {

                let name = snapshot.val().name
                this.setState({name})
            }).catch((error) =>{
                console.log(error)
            })
            
            //this gathers the interests (defined as chips) from the imported list and assigns them a boolean 'isSelected'
            var newChips = []
            chips.map((item,index) =>{
                var chip ={}
                chip["value"] = item
                chip["isSelected"] = false
                newChips.push(chip)
            })
            this.setState({chips: newChips})

            //this gathers the genres from the imported list and assigns them a boolean 'isSelected'
            var genre =[]
            genres.map((item,index) =>{
                var chip ={}
                chip["value"] = item
                chip["isSelected"] = false
                genre.push(chip)
            })
            this.setState({genres: genre})
    
    }

    //this method chnages the value of a user's country
    onValueChange (value){
        this.setState({
            country: value,
            countryCorrect: true
        })
    }
    render() {
        //this defines the UI elements including the input fields that are used to collect the user's information and some of their styling
      return (
            
        <View style = {[styles.container, this.state.interestModalVisible || this.state.genreModalVisible?  {backgroundColor: 'rgba(0,0,0,0.5)'}: ""]}>
          
            <ScrollView>
              
             {/* this creates instances of the InfoModal (ModalClass) component and modifies it for the interests and genre pop-ups */}
                 <ModalClass modalVisible={this.state.interestModalVisible} 
                            onDismiss={()=>{
                                this.setState({interestModalVisible : false});
                                this.checkSelected(this.state.chips, "interests");
                                this.props.setModalVisible(false, "interest")
                                this.setState({interestsCorrect: true})
                            }
                                } 
                                chips={this.state.chips} onPress ={this.toggleSelected} displayText="Please Select your Interests" listName="chips"></ModalClass>
                 <ModalClass modalVisible={this.state.genreModalVisible} 
                            onDismiss={()=>{
                                this.setState({genreModalVisible : false});
                                this.checkSelected(this.state.genres, "musicTaste");
                                this.props.setModalVisible(false, "genre")
                                this.setState({genreCorrect: true})
                                }} chips={this.state.genres} onPress ={this.toggleSelected} displayText="Please Select your Favourite Genres" listName="genres"></ModalClass>
                
               
                <TextInput
                    label="Name"
                    value={this.state.name}
                    onChangeText={name => {this.setState({name}); this.setState({nameCorrect: true})}}
                    style = {[styles.input, this.state.interestModalVisible || this.state.genreModalVisible?  {backgroundColor: 'rgba(0,0,0,0.1)'}: "white"]}
                    />

                    {/* this creates one of the placeholders for an error message */}
                   {!this.state.nameCorrect?  
                        <View style={styles.error}>
                             <Text style={styles.errorText}>{this.state.nameError}</Text>
                        </View>
                    : <></>
                    }
                <View style = {styles.row}>
                   
                    <TextInput
                            label="Age"
                            value={this.state.age}
                            onChangeText={age => {this.setState({age}); this.setState({ageCorrect: true})} }
                            keyboardType = "numeric"
                            style= {[styles.input, styles.age,this.state.interestModalVisible || this.state.genreModalVisible?  {backgroundColor: 'rgba(0,0,0,0.1)'}: "white"]}

                    />
                        
                    {/* this is the dropdown menu for the countries */}
                    <View style ={styles.picker}>
                         <Form>
                            <Item picker >
                            
                                <Picker mode="dropdown" 
                                placeholder= "country"
                                placeholderStyle={{color: "#bfc6ea"} }
                                selectedValue = {this.state.country}
                                onValueChange = {this.onValueChange.bind(this)}
                                >
                                     <Picker.Item label = "Country" key = "Select" value = "Select" ></Picker.Item>
                                
                                        {countries.map((item, index) =>
                                        <Picker.Item label = {item} key = {index} value = {item}></Picker.Item>

                                        )}
        
                                    </Picker>
                            </Item>
                        </Form>
                    </View>
                    
                    
                </View>

                    {!this.state.ageCorrect?  
                            <View style={styles.error}>
                                <Text style={styles.errorText}>{this.state.ageError}</Text>
                            </View>
                        : <></>
                        }
                    {!this.state.countryCorrect?  
                            <View style={styles.error}>
                                <Text style={styles.errorText}>{this.state.countryError}</Text>
                            </View>
                        : <></>
                        }
                        
                <View style = {styles.row}>
                        
                    <RadioButton.Group onValueChange ={value => this.setState({gender: value})} value= {this.state.gender}>
                            
                            <View style= {styles.radio}>
                                <Text style= {[styles.textForm, styles.radio]}>Gender:</Text>
                                <RadioButton  value = "male" style={{backgroundColor:"red", margin: 0}} />
                                <Text >Male</Text>
                            </View>

                            <View style= {styles.radio}>
                                
                                <RadioButton value = "female"   />
                                <Text>Female</Text>
                            </View>
                            
                            <View style= {styles.radio}>                                
                                <RadioButton value = "other"   />
                                <Text>Other</Text>
                            </View>  
                                
                    </RadioButton.Group>
                </View>

                {!this.state.genderCorrect?  
                        <View style={styles.error}>
                             <Text style={styles.errorText}>{this.state.genderError}</Text>
                        </View>
                    : <></>
                    }
                <View>
                    
                    <View style={[styles.row, styles.interest]}>
                        <Text style = {styles.textForm}>Interests:</Text>

                        <TouchableOpacity style={styles.modalButton} 
                                        onPress={() => {this.setState({interestModalVisible: true})
                                                        this.props.setModalVisible(true, "interest")}}
                                                        >
                            <View style={styles.row}>
                            
                                <Icon name="nav-icon-grid-a" size={20} color="#FFF" />
                                <Text style={{marginLeft: 10, color: "#FFF"}}>Select</Text>
                            </View>
                        </TouchableOpacity>
                    
                    </View>

                    {/* the following views display the list options for the interests and music genres */}
                            
                    <View style={styles.chip}>
                            {this.state.interests.length > 0?
                                this.state.interests.map((item,index) =>
                            
                            <Chip icon= "check"
                            
                                onPress={ () =>{this.setState({interestModalVisible: true})}}
                                selected ={true}                           
                                style={{margin: 10, color: "black"}}
                                key={index}>
                            
                                {item}
                                
                            </Chip>
                            )
                        : !this.state.interestsCorrect? 
                            <View style={styles.error}>
                                    <Text style={styles.errorText}>Please select at least one interest</Text>
                            </View>
                        
                        : <Text style={styles.interestInfo}>No interests selected</Text>}
                            
                    </View>
                </View>                 
                    
                <View>

                    <Text style={{marginTop: 20, fontSize: 15 }}>Let us also know your music taste:</Text>
                    <View style={[styles.row, styles.interest]}>
                    
                        <Text style={styles.textForm}>Genres:</Text>
                        <TouchableOpacity style={styles.modalButton} onPress={() => {this.setState({genreModalVisible: true}); this.props.setModalVisible(true, "genre")}}>
                            <View style={styles.row}>
                                    <Icon name="nav-icon-grid-a" size={20} color="#FFF" />
                                    <Text style={{marginLeft: 10, color: "#FFF"}}>Select</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>     

                <View style={styles.chip}>
                        {this.state.musicTaste.length > 0?
                        this.state.musicTaste.map((item,index) =>
                        
                        <Chip icon= "check"
                        
                            onPress={ () =>{this.setState({genreModalVisible: true}) }}
                            selected ={true}
                            style={{margin: 10, color: "black"}}
                            key={index}>{item}
                            
                        </Chip>
                        )
                    :   !this.state.genreCorrect? 

                            <View style={styles.error}>
                                    <Text style={styles.errorText}>Please select at least one genre</Text>
                            </View>:
                
                                    <Text style={styles.interestInfo}>No genres selected</Text>}
                                
                </View>

                    {this.props.submit?  
                    
                        <View>
                            <View style = {[styles.buttonView,this.state.interestModalVisible || this.state.genreModalVisible?  {backgroundColor: 'rgba(255, 255, 255, 0.1)'}:"rgba(31, 143, 255, 1)"]}>
                    
                                <TouchableOpacity onPress={()=>this.submit()} style = {styles.button}>
                                    <View style={styles.row}>
                                        {this.state.loading? <ActivityIndicator size="small" color="#FFF"/> : <></>}
                                    <Text style={[styles.buttonText,this.state.interestModalVisible || this.state.genreModalVisible?  {color: 'rgba(255, 255, 255, 0.1)'}:"white"]}> SUBMIT</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>: <Text></Text>
                        
                    }
                
            </ScrollView>
        </View>
                 
        )
    }
    
    //this method checks if the text fields are empty or if invalid data has been entered. It returns false if anything is invalid
    errorCheck=()=>{
        let name= this.state.name
        let age = this.state.age
        let country = this.state.country
        let gender = this.state.gender
        let interests = this.state.interests
        let genre = this.state.musicTaste
        var valid = true

        if(name.length == 0){
            this.setState({nameCorrect: false, nameError: "Please enter your name"})
            valid = false
        }
        if(age.length == 0){
            this.setState({ageCorrect: false, ageError: "Please enter your age"})
            valid = false
        }
        else if(isNaN(age)){
            this.setState({ageCorrect: false, ageError: "Please enter an invalid age"})
            valid = false
        }
        if(country === "Select" ){
            this.setState({countryCorrect: false, countryError: "Please select a country"})
            valid = false
        }
        if(interests.length == 0){
            this.setState({interestsCorrect: false})
            valid = false
        }
        if(genre.length == 0){

            this.setState({genreCorrect: false})
            valid = false
        }
        return valid
    }

    //this method updates the selected property of a list item (whether interest or music genre)
    toggleSelected = (itemIndex, list, listName) =>{
        
           const newList = list.map((item, index) =>{
               if(index === itemIndex){
                   const updatedItem = {
                       ...item, 
                       isSelected: !item.isSelected
                   };
                   return updatedItem
               }
               return item;
           })
          this.setState({[listName] : newList})

    }

    //this method checks for which list items (interest/genre) have been selected after all have been chosen
    checkSelected = (list, resultsName) => {
        //const list = this.state.chips
        const selectedItems = []
        for (var item of list){
            if(item.isSelected){
                selectedItems.push(item.value)
            }
        }
        this.setState({[resultsName] : selectedItems}) 
    }

    //the submit better first verifies from the errorCheck() method that all data is valid and then saves the entered user's data
    // to the DB under the user's ID and preset certain ranking-related variables to a certain value (which can be changed later)
    submit = () => {
        
        const valid = this.errorCheck()

        if(!valid){
            return
        }
       
        this.setState({loading: true})

        database().ref("users/" + this.state.user.uid).update({
            isNewUser: false,
            mood: null,
            name: this.state.name,
            age: this.state.age,
            gender: this.state.gender,
            country: this.state.country,
            interests: this.state.interests,
            musicTaste: this.state.musicTaste,
            results: {
                tracksTimestamp: 0,
                videosTimestamp:0,
                textsTimestamp:0
            },
            preferences: {
                maxResults: 15,
                ranking: {
                    mood: 5,
                    age: 5,
                    country: 5,
                    gender: 5,
                    interests: 5,
                }
            }
        }).then(()=>{
            console.log("Database updated")
        }).catch(()=>{
            console.log("An error has occured")
        })

    }
}

//this is the styling for the PersonalInformationForm component
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: "#FFF"
    },
    buttonView:{
       
        marginTop: 20,
         backgroundColor: "#1f8fff",
         borderRadius: 2,
         alignSelf: 'stretch',
         flexDirection: "column"
         
     },
     buttonText:{
         fontSize: 18,
         color: "#FFF",
         padding:10,
        
     },
     button:{ 
        alignItems: "center" 
     },
     errorText:{
        color: "red"
    },

    textForm:{
        fontSize: 17,
        fontWeight: "bold"
    },
    input:{
        paddingBottom: 3,
        marginBottom: 5,
        backgroundColor : "white",
    },
    row:{
        flexDirection: "row",
        paddingRight: 5,   
    },

    age: {
        flex: 2,
        marginRight: 10
      
    },
    picker:{
        flex : 5,
        paddingBottom: 0,
        marginBottom: 5,
        marginLeft: 15,
        justifyContent: "flex-end"
  
    },
    radio:{
        paddingVertical: 10,
        paddingRight: 5,
        marginEnd: 10,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    interest:{
        marginRight: 20,
        paddingRight: 10,
        marginVertical: 10,
        marginBottom: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        
    },
    modalButton:{
        marginLeft: 10,
        borderWidth: 2,
        borderRadius: 5,
        backgroundColor: "rgba(52, 152, 219, 0.5)",
        borderColor: "rgba(52, 152, 219, 0.5)",
        padding: 5
    },
    chip:{
        flexDirection: "row",
        flexWrap: "wrap"
    },
    interestInfo:{
        alignItems: "center",
        flex: 1,
        fontSize: 13,
        color: "orange"
    }

})


export default PersonalInfoForm
