import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity,  Linking,  ActivityIndicator} from 'react-native'
import FeatherIcon from 'react-native-vector-icons/Feather' ;
import AntIcon from 'react-native-vector-icons/AntDesign' ;
import database from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth"
import YouTube from 'react-native-youtube';


import {dictionary as fullDictionary} from "../Dictionary"
import {sort} from "../Shared Methods/sort"
import {thesaurus} from "../../Data/updatedThesearus"
import {deleteFromDb, saveToDb} from "../Shared Methods/dbMethods"
import Home from "./Home"

export class VideoScreen extends Component {
    constructor(props){
        super(props);
        this.state = {
            results: [],
            position: 0,
            fullscreen:false,
            user: auth().currentUser,
            userInfo: "",
            play: false,
            modalVisible: false

        }

    }
    
    componentDidMount(){       
        
        //when the component is started, it checks if the previous results have been deleted by the delete method
        //if yes, then the mood is prompted and the getVideos() method is called
        //if no, the previous results are fetched from the database
        
        deleteFromDb("videos", this.state.user.uid, ()=> {

            database().ref('/users/' + this.state.user.uid).on("value", (snapshot) =>{
    
             this.setState({userInfo: snapshot.val()}, () =>{
                 
                if(this.state.userInfo.results.videos !=null){            
    
                    this.setState({ results: this.state.userInfo.results.videos})     
                }
                else if(this.state.userInfo.mood == null){
                    this.setState({modalVisible: true})

                }
                else{
                    this.getVideos()
                }
             })
    
    
         })
        })
             
    } 

    
    render() {
        //the Home component is defined to provide the template for displaying the fetched videos
        //the needed parameters that affect the display are passed as attributes.

        return (
            <Home 
                modalVisible = {this.state.modalVisible}             
                mood= {this.state.mood}
                setState={(key,value) =>{this.setStateMethod(key, value)}}
                userInfo= {this.state.userInfo}
                user={this.state.user}
                results={this.state.results}
                position={this.state.position}
                contentBox ={(this.state.results[this.state.position]!=null)? 
                    
                    //the Youtube library for displaying videos is defined with the api key and the current video id as attributes
                    <YouTube
                        videoId={this.state.results[this.state.position].id} // The YouTube video ID
                        apiKey="" //insert api key
                        play={this.state.play}
                        onReady={e => this.setState({ isReady: true })}
                        onChangeQuality={e => this.setState({ quality: e.quality })}
                        onError={e => this.setState({ error: e.error })}
                        style={{ alignSelf: 'stretch', flex: 1}}
                        />:
                         
                             <View>
                                 <ActivityIndicator size="large" color="#51ADCF" />
                                <Text style={{margin: 10}}>Fetching ...</Text>
                             
                             </View>  
             
                        }
                infoBox={this.infoBox()} 
                contentType = "videos"
                title ={this.state.results[this.state.position]!= null? this.state.results[this.state.position].snippet.title: ""}
            
            
            
            />
        )
    }
   
  
    setStateMethod=(key, value)=>{
        this.setState({[key]: value})
    }

    //this is the view where the author information, text type and source is displayed
    infoBox=()=>{
            return(
            <View style={styles.info}>
                    <View style={styles.infoBox}> 
                        <FeatherIcon name="user" size={30}/>
                        <Text style = {styles.infoText}>:  </Text>
                                        <Text  style = {styles.infoText} > {this.state.results[this.state.position]  == null? "Creator's Name": this.state.results[this.state.position].snippet.channelTitle}</Text>
                    </View>
                    <View style={styles.infoBox}> 
                        <FeatherIcon name="clock" size={30}/>
                        <Text  style = {styles.infoText}>:  </Text>
                        <Text  style = {styles.infoText}> {this.state.results[this.state.position]  == null? "Video Duration": this.getDuration(this.state.results[this.state.position].contentDetails.duration )}</Text>
                    </View>
                    <View style={styles.infoBox}> 
                        <AntIcon name="export" size={30}/>
                        <Text  style = {styles.infoText}>:  </Text>
                        <TouchableOpacity onPress={() => this.state.results[this.state.position]  == null? "":  Linking.openURL("https://www.youtube.com/watch?v=" + this.state.results[this.state.position].id )}>
                        <Text  style = {styles.infoText}>  Redirect to Youtube</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
    }


    //this converts the time string into a suitable duration format
    getDuration=(isoDuration)=>{
        var stringPattern = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d{1,3})?)S)?$/;
        var stringParts = stringPattern.exec(isoDuration);
        stringParts[1] === undefined ? 0 : stringParts[1] /* Hours */
        stringParts[2] === undefined ? 0 : stringParts[2] = parseInt(stringParts[2]) < 10 ? "0".concat(stringParts[2]) : stringParts[2] /* Minutes */
        stringParts[3] === undefined ? 0 :  stringParts[3] = parseInt(stringParts[3]) < 10 ? "0" +stringParts[3] : stringParts[3] /* Seconds */

        var time = stringParts[2] + ":" + stringParts[3]
 
        return time
    }

    //This is the method that fetches videos from the Youtube API and uses the user's mood and interest as a query
    getVideos = () =>{
        const querystring = require("query-string")
        const interest = this.state.userInfo.interests
        const mood = this.state.userInfo.mood
        
        const searchQuery = interest.join("|") + "|" + mood;

        var queries = {
            part: "snippet",
            type: "video",
            key: "" , //insert api key
            maxResults:50,
            videoDuration: "medium",
            videoEmbeddable: true,
            videoSyndicated: true,
            //forDeveloper: true,
            q:searchQuery, // I need this to contain interests and Mood
        }
        const uri = querystring.stringifyUrl({
            url: "https://www.googleapis.com/youtube/v3/search",
            query: queries
        })
        console.log("Uri: " + uri)
        fetch(uri, {
            headers: {
                "Accept": "application/json",
            },
            method:"GET",

        }).then((response) => response.json()).then((json) =>{
            this.setState({results: json}, () => this.rank())

        }).catch((error) =>{
            console.log(error)
        })
    }

    rank = () =>{
        //the user variables are declared
        const mood = this.state.userInfo.mood
        const country = this.state.userInfo.country
        const age = this.state.userInfo.age
        const birthyear = new Date().getFullYear() - age
        const interests = this.state.userInfo.interests
        
        const dictionary = fullDictionary.videos//section of dictionary for videos
        
        /*the rank weightings for each user variable(mood, country,etc)
        are stored as in object in the variable "ranks"
        */
        const ranks = this.state.userInfo.preferences.ranking
        const querystring = require("query-string")
        
        /*collects the ids of the initially fetched videos and feeds them 
        into another Youtube API endpoint which returns full detailed on each individual video
        */
        const videoIds = this.state.results.items.map((video) => video.id.videoId)

        //parses the query object into a HTTP url using the "query-string" library
        const query = querystring.stringifyUrl({
            url: "https://www.googleapis.com/youtube/v3/videos",
            query:{
                part: ["snippet", "contentDetails", "id", "player", "statistics"],
                id : videoIds,
                key: "AIzaSyAZoAG1hdqjDiDIbQSRCPJCWVNHPvPqWB0"
            }            
        })
        
        //calls the react-js "fetch()" method and passes in the url- "query"
        fetch(query, {
            method: "GET",
            headers:{
            "Accept": "application/json " 
            }
        }).then((response) => response.json()).then((json) =>{
            
            const videos = json.items;

          //loops through each of the returned videos
            for (var i=0; i<videos.length; i++){
                var video = videos[i];

                //assigns a property rank to the video object and initialises it to 0
                video["rank"] = 0
                let rank = video.rank
                
                /*
                    begin to rank the variables based on interest, mood and country
                */

                /*assign the tags, description, title and categoryId 
                  of the videos to their respective variables */
                let tags = []
                let description =[]
                let title = []
                let categoryId =[]

                if(video.snippet.tags!= null ){
                    tags = video.snippet.tags
                }
                if(video.snippet.description!= null ){
                    description = video.snippet.description
                }
                if(video.snippet.title!= null ){
                    title = video.snippet.title
                }
                if(video.snippet.categoryId!= null ){
                    categoryId = video.snippet.categoryId
                }

                /*loop through each of the user's interests and compares and searches for it 
                in the video's tags,description, categoryId or title.                               
                */
                for(var interest of interests){
                    
                    if(tags.includes(interest) || description.includes(interest) 
                        ||categoryId.includes(interest)||title.includes(interest)){
                        rank = rank + ranks.interests
                    } 
                    else{
                        /*If it is not found, a "thesaurus" is used to find words related to the interests
                            and this is again compared to the video's properties.
                        */
                        var count = 0
                        var relatedWords = thesaurus(interest)
                        
                        if(relatedWords.length !=0){
                            for(var relatedWord of relatedWords){
                                if (tags.includes(relatedWord) || description.includes(relatedWord) 
                                    ||categoryId.includes(relatedWord) ||title.includes(relatedWord) ){
                                    count++
                                }
                            }
                            /*Each mathching related word is however not weighted the full weight for an "interest"
                                however the fraction of related interests that match are multiplied 
                                by the full weight to give the incremental value*/

                            const rankValue = (count/relatedWords.length) * ranks.interests
                            rank = rank + rankValue

                        }
                    }

                }


                //the words related to the user's mood are fetched from the dictionary and compared to the video's properties
                for(var relatedMood of dictionary.mood[mood] ){

                    if(title.includes(relatedMood)||description.includes(relatedMood)||tags.includes(relatedMood)){
                        rank = rank+ ranks.mood
                    }
                }

                //video is compared to the user's country
                if(title.includes(country)|| tags.includes(country) || description.includes(country)){
                    rank = rank + ranks.country
                }
                
                let videoDate = parseInt(video.snippet.publishedAt.substr(0, 4))
                
                //video is compared to the user's age
                if(videoDate > birthyear){
                    rank = rank + ranks.age
                }

               //the final rank value is assigned to the video's rank property
               video.rank = rank
               videos[i] = video
            }
            
            //the ranked videos are sorted using the "sort()" method
            var sortedVideos = sort(videos)
            
            const maxresults = this.state.userInfo.preferences.maxResults
            var selectedVideos = sortedVideos.slice(0, maxresults)//cut down results size maxresults value

            //save the sorted videos to the database so that the results won't be constantly fetched from the API 
            this.setState({results: selectedVideos}, ()=> saveToDb("videos", this.state.user.uid, this.state.results))
            }).catch((error) =>{
                console.log(error)
            })
    }
}

//this is the styling for the video component
const styles = StyleSheet.create({
   
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
export default VideoScreen
