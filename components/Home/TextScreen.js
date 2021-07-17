import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator} from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather' ;
import AntIcon from 'react-native-vector-icons/AntDesign' ;
import database from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth"


import {dictionary as fullDictionary} from "../Dictionary"
import {sort} from "../Shared Methods/sort"
import {deleteFromDb, saveToDb} from "../Shared Methods/dbMethods"
import Home from "./Home"




export class TextsScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            results: [],
            position: 0,
            user: auth().currentUser,
            userInfo: "",
            modalVisible: false
            

        }
    }

    //this is react method that runs when the screen is initialiased

    componentDidMount(){
        //the deleteFromDb method is imported from the dbMethods file and 
        //the parameters peculiar to this class are passed in
        
        deleteFromDb("texts", this.state.user.uid, ()=> {

            database().ref('/users/' + this.state.user.uid).on("value", (snapshot) =>{
             
                this.setState({userInfo: snapshot.val()}, () =>{
    
                if(this.state.userInfo.results.texts != null){
                    this.setState({results: this.state.userInfo.results.texts})
                 }
                 else if(this.state.userInfo.mood == null){
                    this.setState({modalVisible: true})
                   
                 } 
                 else{
                    this.getTexts()
                    
                 }
             })
         })
        }
    )
    }
    render() {
        //the Home component is defined to provide the template for displaying the fetched texts
        //the needed parameters that affect the display are passed as attributes.

        return(
            <Home
                modalVisible = {this.state.modalVisible}             
                mood= {this.state.mood}
                setState={(key,value) =>{ this.setStateMethod(key, value)}}
                userInfo= {this.state.userInfo}
                user={this.state.user}
                results={this.state.results}
                position={this.state.position}
                contentBox ={this.textBox() }
                infoBox={this.infoBox()} 
                contentType = "quotes"
                title = "Quote"       
            />
        )
    }

    setStateMethod=(key, value)=>{
       this.setState({[key]: value})
    }

    //this is the view where the texts is displayed when fetched
    textBox =()=>{
        return(
            <View style={styles.textBox}>
                 {(this.state.results[this.state.position]!=null)?                            
                <Text style={{fontSize:25, textAlign: "center"}}>{this.state.results[this.state.position].quote}</Text>
                :                    
                <View><ActivityIndicator size="large" color="#51ADCF" /><Text style={{margin: 10}}>Fetching ...</Text></View>
                   
                 }
            </View>
        )
    }

    //this is the view where the author information, text type and source is displayed
    infoBox =()=>{
        return(          
                 <View style={styles.info}>
                    <View style={styles.infoBox}> 
                        <FeatherIcon name="user" size={30}/>
                        <Text style = {styles.infoText}>:  </Text>
                                        <Text  style = {styles.infoText} > {this.state.results[this.state.position]  == null? "Author": this.state.results[this.state.position].author}</Text>
                    </View>
                    <View style={styles.infoBox}> 
                        <FeatherIcon name="type" size={30}/>
                        <Text  style = {styles.infoText}>:  </Text>
                        <Text  style = {styles.infoText}> Quote</Text>
                    </View>
                    <View style={styles.infoBox}> 
                        <AntIcon name="export" size={30}/>
                        <Text  style = {styles.infoText}>:  </Text>
                        <TouchableOpacity onPress={() => this.state.results[this.state.position]  == null? "":  ""}>
                        <Text  style = {styles.infoText}>  Paperback API</Text>
                        </TouchableOpacity>
                    </View>
            </View>
        )
    }

    //getTexts() calls the PaperQuotes API and passes in a query linked to the user's mood and interests
    //the API returns viable results which are then sent to be ranked.

    getTexts =() =>{
        const querystring = require("query-string")
        const interest = this.state.userInfo.interests
        const mood = this.state.userInfo.mood

        var dictionary = fullDictionary.texts
        var tags = interest.concat(dictionary.mood[mood])
        
        const uri = querystring.stringifyUrl({
            url: "https://api.paperquotes.com/apiv1/quotes/",
            query:{
                tags:tags,
                
            }
        },{
            arrayFormat: "comma"
        })

        console.log("Uri" + uri)
        

        fetch(uri, {
            headers:{
                "Content-Type": "application/json",
                "Authorization" : "Token f572b3d3670f1f015264abd44525c4b2ea5e044a",
            },
            method: "GET"
        }).then((response) => response.json()).then((json) =>{
            this.setState({fetchedTexts: json.results}, () => this.rank())

        }).catch((error) =>[
            console.log(error)
        ])
    }

    //the rank method ranks the given results in terms of their similarity to the user's information
    rank =()=>{
      
        const dictionary = fullDictionary.texts
        const ranks = this.state.userInfo.preferences.ranking
        const mood = this.state.userInfo.mood
        const country = this.state.userInfo.country
        const interests = this.state.userInfo.interests
        const fetched = this.state.fetchedTexts


        //loop through all the fetched tracks        
        for(var i =0; i<fetched.length; i++){
            var text = fetched[i]
            text["rank"] = 0
            var rank = text.rank

           //check if the tags of text match the mood, interest, etc and assign each track the rank value specifed by the user
            for(var relatedMood of dictionary.mood[mood]){
                if(text.tags.includes(relatedMood) || text.quote.includes(relatedMood)){
                    rank = rank + ranks.mood
                }
            }
            for (var interest of interests){
                if(text.tags.includes(interest)|| text.quote.includes(interest)){
                    rank = rank + ranks.interests
                }
            }
            if(text.tags.includes(country) )
            {
                rank = rank+ ranks.country
            }
            text.rank = rank
            fetched[i] = text

        }
       
        const sortedText = sort(fetched)        
        const maxresults = this.state.userInfo.preferences.maxResults

        //the results are cut down to the user's max result preference    
        sortedText.slice(0, maxresults)
        this.setState({results: sortedText}, ()=> {saveToDb("texts", this.state.user.uid,this.state.results)})
    }
    
}

//the styling for the component
const styles = StyleSheet.create({
   
    textBox:{
       
        margin: 10,
        padding:10,
        alignSelf:"stretch",
        alignItems:"center",
        textAlign:"center",
        justifyContent:"center"
      
    },
    info:{
        flex:1 
    },
    infoBox:{
        margin:5,
        flexDirection: "row",
        justifyContent:"center"
    },
    infoText:{
        fontSize: 18
    },
    
})
export default TextsScreen
