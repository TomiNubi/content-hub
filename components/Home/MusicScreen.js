import React, { Component, useCallback, useRef } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal, Alert, Linking, Image, ActivityIndicator} from 'react-native'

import database from '@react-native-firebase/database';
import auth from "@react-native-firebase/auth"
import {Buffer} from "buffer"

import FontistoIcon from 'react-native-vector-icons/Fontisto';
import FeatherIcon from 'react-native-vector-icons/Feather' ;

import {dictionary as fullDictionary} from "../Dictionary"
import {sort} from "../Shared Methods/sort"
import {deleteFromDb, saveToDb} from "../Shared Methods/dbMethods"
import Home from "./Home"


//import SoundPlayer from "react-native-sound-player"
var Sound = require("react-native-sound")


export class MusicScreen extends Component {
    constructor(props){
        super(props);

        //the state defines the variables that reuqire the component to rerender when they are changed.
        // It is also a way of defining global variables
        this.state = {
            modalVisible : false,
            user: auth().currentUser,
            userInfo: "",
            fetchedTracks: [],
            sortedTracks: [],
            results:[],
            position: 0,
            play: false,
            disabled: false,
            isResultsinDb: false,
            error: "",
            arrowDisabled: true
        }
    }

    //this is a method which runs once when the component is initialised
    componentDidMount(){

        //the deleteFromDb method states what type of content is being saved, the id of the user and then a callback method
        //The callback method checks if the tracks and the have been deleted by the deleteFromDb() method. 
        //If yes, it reprompts the mood and refetches new tracks from API and if no, it fetches the tracks in the Db

        deleteFromDb("tracks", this.state.user.uid,   () => {

            database().ref('/users/' + this.state.user.uid).on("value", (snapshot) =>{
                this.setState({userInfo: snapshot.val()}, () => {
                    
                    //checks if there are saved tracks in the DB
                    if(this.state.userInfo.results.tracks !=null){
                        this.setState({results: this.state.userInfo.results.tracks}, () => this.loadTrack()) 
                        this.setState({arrowDisabled: false})
                    }

                    //checks if the user is still in the DB (saved for less than 2 hours)
                    else if(this.state.userInfo.mood == null){
                        this.setState({modalVisible: true})
                
                    }
                    //if both above are false, then it fetches new results from the API
                    else{
                            this.getSpotifyToken()
                        }
                    }

                )
            })
        })
    }
   
    render() {
      
        return (
            
         //the Home component is defined to provide the template for displaying the fetched tracks
         //the needed parameters that affect the display are passed as attributes.
            <Home
                modalVisible = {this.state.modalVisible}             
                mood= {this.state.mood}
                setState={(key,value) =>{this.setStateMethod(key, value)}}
                userInfo= {this.state.userInfo}
                user={this.state.user}
                results={this.state.results!= null? this.state.results: []}
                position={this.state.position}
                moveMethod ={()=>{ if(this.state.song !=null){this.state.song.stop()} 
                                this.setState({play: false})}}
                contentBox ={this.trackBox() }
                playerBox ={this.playerBox()}
                arrowDisabled= {this.state.arrowDisabled}
                infoBox={this.infoBox()}
                contentType = "songs"
                title = {this.state.results[this.state.position]!= null? this.state.results[this.state.position].name: ""}    
            />
        )
    }

    //this is passed into the Home Component, to update certain values to the display. 
    //If the value being changed is a position, it reloads a new track
    setStateMethod =(key,value) =>{
        
        if(key == "position"){
            this.setState({[key]:value}, ()=>{
                this.loadTrack()
            })
        }
       else{
            this.setState({[key]:value})
       }
    }

    //this is the view where the thumbnails of the fetched tracks will be displayed
    trackBox = ()=>{
        return(
            <View>
            {
                this.state.results[this.state.position]  != null?
                    
                    <Image style ={styles.musicImage}source={{uri: this.state.results[this.state.position].album.images[0].url}} />
                        
                    : this.state.error.length==0?
                    <View>
                        <ActivityIndicator size="large" color="#51ADCF" />
                        <Text style={{margin: 10}}>Fetching ...</Text>                        
                    </View>:

                     <Text style={styles.error}>{this.state.error}</Text>
                    }
         </View>

        )
    }

    //this is the view where the controls for the tracks like play, pause, fastforward, etc will be displayed
    playerBox =()=>{
        return(
            <View style={styles.playerView}>
                <View style={styles.musicIcons}>
                        <TouchableOpacity disabled={this.state.disabled}
                        >
                            <FeatherIcon name="skip-back" size ={25} color={this.state.disabled? "grey": "black"}/>
                        </TouchableOpacity>
                    </View>
                    {this.state.play ?

                    <View style={styles.musicIcons}>
                        <TouchableOpacity onPress= {()=> {this.pauseSong(); this.setState({play : !this.state.play})}}
                        disabled={this.state.disabled}>
                            <FeatherIcon name="pause" size ={25} color={this.state.disabled? "grey": "black"}/>
                        </TouchableOpacity>
                    </View> :  
                    <View style={styles.musicIcons}>
                        <TouchableOpacity onPress={() =>{this.playSong(); this.setState({play : !this.state.play})}
                    } 
                    disabled= {this.state.disabled} >
                            <FeatherIcon name="play" size ={25} color={this.state.disabled? "grey": "black"}/>
                        </TouchableOpacity>
                    </View>
                    
                    }
                   
                    <View style={styles.musicIcons}>
                        <TouchableOpacity disabled={this.state.disabled}>
                            <FeatherIcon name="skip-forward" size ={25} color={this.state.disabled? "grey": "black"}/>
                        </TouchableOpacity>
                    </View>
                </View>
        )
        
               
    }

    //this is the view where the information about the artists, the song and the duration will be displayed.

   infoBox=()=>{
    return(
        <View>
            <View style={styles.infoBox}> 
                <FeatherIcon name="user" size={30}/>
                <Text style = {styles.infoText}>:  </Text>
                                <Text  style = {styles.infoText} > {this.state.results[this.state.position]  == null? "Artist Name": this.state.results[this.state.position].artists[0].name }</Text>
            </View>
            <View style={styles.infoBox}> 
                <FeatherIcon name="clock" size={30}/>
                <Text  style = {styles.infoText}>:  </Text>
                <Text  style = {styles.infoText}> {this.state.results[this.state.position]  == null? "Song Duration": this.getDuration() }</Text>
            </View>
            <View style={styles.infoBox}> 
                <FontistoIcon name="spotify" size={30}/>
                <Text  style = {styles.infoText}>:  </Text>
                <TouchableOpacity onPress={() => this.state.results[this.state.position]  == null? "": this.openSpotify()}>
                <Text  style = {styles.infoText}>  Play full track</Text>
                </TouchableOpacity>
            </View>
    </View>
    )
   }

   //this is the method that redirect the user to the spotify app or website to display the song
    openSpotify=()=>{
        Linking.openURL(this.state.results[this.state.position].uri ).catch(()=> 
        Linking.openURL(this.state.results[this.state.position].external_urls.spotify).catch(()=>{
            console.log("No application to open the song")
        })
        )
    }

    //this is the method to play the previous song
    skipBackwards= ()=>{
        const position = this.state.position
        if(position > 0){
            if(this.state.song !=null){this.state.song.stop()} 
            this.setState({position : position-1},  () => 
            {
            this.loadTrack()
            if(this.checkPreviewAvailable){                
                this.setState({play: true})
                this.playSong()
                }
                
            }
            )
        }
        else{
            this.setState({position: this.state.results.length-1},  () => {   
            if(this.state.song !=null){this.state.song.stop()} 
            if(!this.checkPreviewAvailable){
                this.loadTrack()
                this.setState({play: true})
                this.playSong()
                }
        })
        }

        
        
    }
    

    //this checks if the fecthed song has a 30-second preview available to be played. If not the play button is disabled
    checkPreviewAvailable =() =>{
        if(this.state.results[this.state.position].preview_url == null){
            this.setState({disabled: true})
            return false
        }
        else{
            this.setState({disabled: false})
        return true
        }
        
    }

    //this the method that plays the fetched song
    playSong = () =>{
        const song = this.state.song
        song.play((success) => {
            if (success) {
            console.log('successfully finished playing');
            this.setState({play: false})
            } else {
            console.log('playback failed due to audio decoding errors');
            }
        });

    }
    //this methods pauses the current song
    pauseSong = () =>{
        var song = this.state.song
        song.pause()

    }

    //this methods loads the fetched track and makes it ready to be played if it has a preview available
    loadTrack = () =>{
       
                // if(this.state.song == null){
                    if(this.state.results!= null){
                        if(!this.checkPreviewAvailable()){
                            return
                        }
                        this.setState({play: false})
                        const previewUrl = this.state.results[this.state.position].preview_url
                        var song = new Sound(previewUrl +".mp3", "", (error) =>{
                            if(error){
                                console.log('failed to load the sound', error);
                                return;
                            }
                            
                            this.setState({song: song})
                            
                        })
                        
                    }
        }
    
    //this method converts the given duration to a minute:second format
    getDuration = ()=>{
        const duration = this.state.results[this.state.position].duration_ms 
                            var minutes = Math.floor(duration / 60000);
                            var seconds = ((duration % 60000) / 1000).toFixed(0);
                            return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds)
    }

  
    //this method accesses the spotify API which provides an access token that alllows the app to make fetch requests
    getSpotifyToken = () =>{

        const clientId = ""//insert clientId
        const clientSecret = "" //insert clientSecret
        const querystring = require("query-string")
        const auth = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');
        const body = {
        "grant_type" : "client_credentials"
        }
        var accessToken = ""
        fetch("https://accounts.spotify.com/api/token", {
            method: 'POST',
            headers: {
             "Authorization": auth,
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: querystring.stringify(body)
          }
          )
          
          .then((response) => response.json()).then((json) =>{
            
            //this stores the accesstoken for spotify api requests in the state
            accessToken = json.access_token            
            this.setState({accessToken: accessToken})
             
            /*the getFetchQuery() method is called which uses the user's information to create and return 
            a search query that fetches content curated to the user's inforamtion*/
            const uri = this.getFetchQuery() 

            //fetchTracks method calls the API using the generated uri to fetch the curated songs
            this.fetchTracks(uri,accessToken)
                
          })
          .catch((error) => {

              var error2 = error + ""
                
              if(error2.includes("TypeError: Network request failed")){
                    this.setState({error : "Cannot connect to Spotify\n Please check your internet connection"}, ()=>{
                        console.log(this.state.error)
                    })
                    
              }
              else{
                  this.setState({error})
              }
            }
          )
          ;
         

    
    }

    //this method returns the query made specifically for the user that is used to fetch certain tracks from the API endpoint 

    getFetchQuery = () =>{

        //import library "query-string" for parsing JSON objects into HTTP search queries
        const querystring = require("query-string")

        //define the user variables to be used in the seach query
        const mood = this.state.userInfo.mood
        const country = this.state.userInfo.country
        const musicTaste = this.state.userInfo.musicTaste

        //define dictionary variable to store the section of the application's dictionary for "tracks"
        const dictionary = fullDictionary.tracks

        //create a JSON object of queries that would be passed
        var queries = {
            seed_genres: [],
            target_popularity: 50,
            limit: 50,
        }

        //Note: The Spotify API only allows for queries with a max of 5 seed genres
        
        //first include the genre that relates to the user's mood, followed by country and then musicTaste        
        var i = 0      

            while (queries.seed_genres.length < 5){

                if(dictionary.mood.genre[mood][i] != null){
                    queries.seed_genres.push(dictionary.mood.genre[mood][i])
                }

                if(dictionary.country.genre[country][i] != null && dictionary.country.genre[country][i] != "N/A"){
                    queries.seed_genres.push(dictionary.country.genre[country][i])
                }
                
                if(musicTaste[i] != null){
                    queries.seed_genres.push(musicTaste[i])
                }
                 i++

                //break out the loop if no more user characteristics are available
               if(dictionary.mood.genre[mood][i] == null && dictionary.country.genre[country][i] == null&&
                musicTaste[i] == null && dictionary.country.genre[country][i] != "N/A"){
                    break
                }

            }

        //remove possible overflow of seed genres if greater than 5
        queries.seed_genres = queries.seed_genres.slice(0, 5)

        //add the queries "target energy" and "target valence" that match the user's mood
        queries["target_energy"] = dictionary.mood.energy[mood]
        queries["target_valence"] = dictionary.mood.valence[mood]

        if(dictionary.mood.valence[mood]<= 0.8 && dictionary.mood.valence[mood]>= 0.2) {
            queries["min_valence"] = dictionary.mood.valence[mood] -0.2
            queries["max_valence"] = dictionary.mood.valence[mood] + 0.2
        }
        
        //finally construct the url containing all the queries using the "querystring library"
        const uri = querystring.stringifyUrl({
            url : "https://api.spotify.com/v1/recommendations",//Spotify API endpoint
            query: queries
        },{
            arrayFormat: "comma"
        })
        
        console.log(uri)
        return uri
    }



    fetchTracks =(uri, accessToken)=>{
        fetch(uri, {
            method: 'GET',
            headers: {
            Accept: "application/json",
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + accessToken
        }
        
      }
      )
      .then((response)=> response.json()).then((json) => {
        
        //store the API response in the "tracks" variable
        var tracks = json.tracks
        
        //store the tracks variable in the react-native state
        this.setState({fetchedTracks: tracks}, () =>{
           
            this.rank() //once the state has been updated, call the rank method

        })
        
      }).catch((error) =>{
          console.log("Fetch Query method "+ error)
      })
    }
 
    rank = () =>{

        var tracks = this.state.fetchedTracks

        //the track object does not include the track's genre so the comparison
        //will only be done with the year, market, album genre, valence, energy
        const dictionary = fullDictionary.tracks
        const ranks = this.state.userInfo.preferences.ranking
        const mood = this.state.userInfo.mood
        const country = this.state.userInfo.country
        const musicTaste = this.state.userInfo.musicTaste
        const age = this.state.userInfo.age
        const birthyear = new Date().getFullYear() - age
        const querystring = require("query-string")
        
        var trackIds = []
        var trackFeatures = []
        
        for (var track of tracks){
            trackIds.push(track.id)
        }
       

        const uri = querystring.stringifyUrl({
            url : "https://api.spotify.com/v1/audio-features/",
            query: {ids : trackIds}
        },{
            arrayFormat: "comma"
        })
        
        fetch(uri, {
            method: "GET",
            headers:{
            "Authorization": "Bearer " + this.state.accessToken
            }
        }).then((response)=> response.json()).then((json) => {
                trackFeatures = json
                
                for(var i =0; i<tracks.length; i++){
                    //tracks[i]["ranks"] = 0
                    var track = tracks[i]
                    track["rank"] = 0
                    let rank = track.rank
                    let trackFeature = trackFeatures.audio_features[i]
                    let date = parseInt(track.album.release_date.substr(0, 4))
        
                    //fetch the audio features of the tracks from spotify
                    //fetch the album info of the tracks from spotify
                    
                    
                    //does popularity also count?
        
                    //first apply the mood ranks
                    if (trackFeature.valence >=  (dictionary.mood.valence[mood] -0.2) && 
                    trackFeature.valence <=  (dictionary.mood.valence[mood] +0.2)){
                        rank = rank + ranks.mood
                    }
                    if (trackFeature.energy >=  (dictionary.mood.energy[mood] -0.2) && 
                    trackFeature.energy <=  (dictionary.mood.energy[mood] +0.2)){
                        rank = rank + ranks.mood
                    }
                    if((date + 20) >= birthyear &&(date - 10) <= birthyear){
                        rank = rank + ranks.age
                    }

                    //i cant access the genres of the track because Spotify doesnt include
                    //in their end point
                    
                    
                    track["rank"] = rank

                    tracks[i] = track
        
                }
                var trackranks =[]
              
                for (var track of tracks){
                    trackranks.push(track.rank)
                }
                

                const sortedTracks = sort(tracks)
                this.setState({sortedTracks: sortedTracks}, () =>{
                    this.filter()
                })
          }).catch((error) =>{
              console.log("Rank method" + error)
          })
            
    }

    filter = () =>{
        var sortedTracks = this.state.sortedTracks
        const maxresults = this.state.userInfo.preferences.maxResults

    
        var selectedTracks = sortedTracks.slice(0, maxresults)//make sure this works
        this.setState({results: selectedTracks}, () => {
            saveToDb("tracks", this.state.user.uid,this.state.results)
            this.loadTrack()})

        this.setState({arrowDisabled: false})
        
    }
   
}


const styles = StyleSheet.create({
   

    playerView:{
        flexDirection: "row",
        justifyContent:"center",
        alignItems:"center",
        flex: 0.3,
        marginVertical: 5,
        marginHorizontal: 50,
        paddingBottom: 5,
        //borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        alignSelf:"auto"

    },
    musicIcons:{
        margin: 5
    },
    info:{
        flex:1 ,
        marginTop: 5
    },
    infoBox:{
        margin:5,
        flexDirection: "row",
        justifyContent:"center"
    },
    infoText:{
        fontSize: 18
    },
    
    error:{
        color: "red"
    },
    musicImage:{
        flex: 1,
        height: 360, 
        width: 300,
        borderWidth: 2,
        borderRadius: 10,
       // borderColor: "red"
}

})

export default MusicScreen
