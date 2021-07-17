import React, { Component } from 'react'
import { Text, View ,  StyleSheet, TouchableOpacity,  ScrollView, Alert} from 'react-native'
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import InputSpinner from "react-native-input-spinner";



export class Settings extends Component {
    constructor(props){
        super(props);
        this.state = {
            user : auth().currentUser,
            name:  "",           
            userInfo: {},
            max: 15,
            moodRank: 5,
            ageRank: 5,
            countryRank: 5,
            interestsRank: 5,
            genderRank:5,
            resultsMaxIncrement: 20,
            rankMaxIncrement: 5,
            startColour: "gray",
            endColour: "#51ADCF",
            

        }
    }

    //this retrives the saved rankings and the 'maxresults' preferences from the database when the app is initialised
    componentDidMount(){
      
        database().ref('/users/' + this.state.user.uid).once("value").then(snapshot => {
            console.log("Settings db")
            let userInfo = snapshot.val()
            this.setState({userInfo : userInfo}, ()=>{
                this.setState({max: userInfo.preferences.maxResults})
                this.setState({ageRank: userInfo.preferences.ranking.age})
                this.setState({moodRank: userInfo.preferences.ranking.mood})
                this.setState({genderRank: userInfo.preferences.ranking.gender})
                this.setState({countryRank: userInfo.preferences.ranking.country})
                this.setState({interestsRank: userInfo.preferences.ranking.interests})
            })
        }).catch((error) =>{
            console.log(error)
        })
    }

    render() {

        //this creates input field and buttons that enable the user to increase and decrease the rank and maxresult values to certain range
        return (
            <View style={styles.container}>
                <ScrollView>
                    <View style={styles.buttonView}>
                        <TouchableOpacity onPress = {this.signOut} style={styles.signOutButton}>
                            <View style={styles.row}>
                                <Text style={styles.signOutText}>Sign Out</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <View>
                            <View><Text style={styles.headerText}>Preferences</Text></View>

                            <View style = {[styles.row, styles.results]}>
                                <View style={{flex:1}}>
                                    <Text style={{fontSize: 15}}>Max Results: </Text>
                                </View>
                                
                                <View style={{flex:1}}>
                                    <InputSpinner                    
                                        max={this.state.resultsMaxIncrement}
                                        min={10}
                                        step={1}
                                        colorMax={this.state.startColour}
                                        colorMin={this.state.startColour}
                                        color= {this.state.endColour}
                                        value={this.state.max}
                                        initialValue={this.state.max}
                                        rounded= {false}
                                        selectTextOnFocus ={true}
                                        style={{height: 30,width: 100}}
                                        buttonStyle={{height: 30, width:30}}
                                        inputStyle={{height:30, padding: 5, width: 40}}
                                        onChange={(num) => {
                                            this.setState({max: num});
                                        }}
                                                            
                                    />    
                                </View>                         
                            </View>
                        </View>
                    </View>

                    <View></View>

                    <View>
                        <Text style={styles.headerText}>Ranking</Text>
                    </View>

                    <View>               

                        {/* this creates instances of the RankButton Component created below to allow the user to increase and decrease the rank values */}

                        <RankButton 
                            startColour = {this.state.startColour}
                            endColour ={this.state.endColour}
                            onChange={(num) => this.setState({ageRank: num})}
                            rank = {this.state.ageRank}     
                            rankMaxIncrement={this.state.rankMaxIncrement}                  
                            label = "Age"
                            style={styles.rankButtons}
                        />
                        <RankButton 
                            startColour = {this.state.startColour}
                            endColour ={this.state.endColour}
                            onChange={(num) => this.setState({countryRank: num})}
                            rank = {this.state.countryRank}     
                            rankMaxIncrement={this.state.rankMaxIncrement}                  
                            label = "Country"
                            style={styles.rankButtons}
                        />
                        <RankButton 
                            startColour = {this.state.startColour}
                            endColour ={this.state.endColour}
                            onChange={(num) => this.setState({interestsRank: num})}
                            rank = {this.state.interestsRank}     
                            rankMaxIncrement={this.state.rankMaxIncrement}                  
                            label = "Interests"
                            style={styles.rankButtons}
                        />
                        <RankButton 
                            startColour = {this.state.startColour}
                            endColour ={this.state.endColour}
                            onChange={(num) => this.setState({moodRank: num})}
                            rank = {this.state.moodRank}     
                            rankMaxIncrement={this.state.rankMaxIncrement}                  
                            label = "Mood"
                            style={styles.rankButtons}
                        />
                        <RankButton 
                            startColour = {this.state.startColour}
                            endColour ={this.state.endColour}
                            onChange={(num) => this.setState({genderRank: num})}
                            rank = {this.state.genderRank}     
                            rankMaxIncrement={this.state.rankMaxIncrement}                  
                            label = "Gender"
                            style={styles.rankButtons}
                        />
                    </View>

                    <View></View>
                
                    <View>
                        <TouchableOpacity style={styles.submit} onPress={this.submit}>
                            <Text style = {styles.saveText}>Save</Text>
                        </TouchableOpacity>  
                    </View>
                </ScrollView>
            </View>
        )
    }
   
    //this method updates the changed rankings and result values in the database
    submit =()=>{
        database().ref("users/" + this.state.user.uid ).update({
            preferences: {
                maxResults: this.state.max,
                ranking: {
                    mood: this.state.moodRank,
                    age: this.state.ageRank,
                    country: this.state.countryRank,
                    gender: this.state.genderRank,
                    interests: this.state.interestsRank,
                }
            }
        }).then(()=>{
            Alert.alert("Successful", "Your info has been sucessfully updated")
        

        }).catch((error)=>{
            console.log(error)
        })
    }
    
    //this method use the Firebase signOut method to sign the user out
    signOut = () =>{
        auth()
        .signOut()
        .then(() => console.log('User signed out!'));
            }
}

//this is a component created to define the paramaters for the rank buttons needed to increment the rank (gotten from the react-native-input-spinner library). 
//this just reduces the needed lines of code.
function RankButton(props){
    
    return(
        <View style={styles.row}>
        <View style={{flex:1}}>
                <Text style={styles.rankButtons}>{props.label} </Text>
            </View>
            
            <View style={{flex:1}}>
            <InputSpinner                    
                max={props.rankMaxIncrement}
                min={0}
                step={1}
                colorMax={props.startColour}
                colorMin={props.startColour}
                color= {props.endColour}
                value={props.rank}
                initialValue={props.rank}
                rounded= {false}
                selectTextOnFocus ={true}
                style={[{height: 30,width: 100}, styles.rankButtons]}
                buttonStyle={{height: 30, width:30}}
                inputStyle={{height:30, padding: 5, width: 40}}
                onChange={(num) => {props.onChange(num)}}
                onSubmitEditing ={()=> console.log("submit")}
            />    
            </View>
        </View>
    )
}

//this is the styling for the settings page
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: "#FFF"
    },

    submit :{
        backgroundColor: "#51ADDF" ,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        padding:10,
        borderRadius: 4,
        
    },
    buttonView:{
        alignItems: "flex-end",
        paddingBottom: 10,
        borderBottomWidth: 0.2,
        margin: 5
    },
    results:{
        margin: 10
    },
    headerText:{
        margin: 5,
        fontSize: 20,
        paddingBottom: 10,
        borderBottomWidth: 0.2
    },
 
    signOutText:{
        margin: 5,
        fontSize: 15,
        flexWrap: "wrap",
        color: "#51ADCF",
    },
 
    signOutButton:{
        justifyContent: "flex-end",
        borderWidth: 2, 
        borderColor: "#51ADCF",
        backgroundColor: "#FFF",
        color: "#FFF",
        borderRadius: 5,
        marginRight: 10
    },
    saveText:{
        color: "#FFF",
        fontWeight: "bold"
    },
    row:{
        flexDirection: "row",
        padding: 5,
        
    },
    rankButtons:{
        margin: 10,
        fontSize: 15
    }
    
})

export default Settings
