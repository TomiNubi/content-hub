import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Alert, } from 'react-native'
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import database from '@react-native-firebase/database';
import MoodPopup from "./MoodPopUp"



/*
    The Home Component is the skeleton for the Music, Video and Text Components.
    It has the templates that the components use to display their contents
*/


export default function Home(props) {
    
    //moveLeftArrow navigates to the previous content in the component. If the first content was being shown then it navigates to the last
    const moveLeftArrow =() =>{
       
        const setState = props.setState
        const position = props.position

        if(position > 0){
            setState("position", (position-1))
        }
    
        else{
            setState("position",props.results.length-1)
        }

        //this is an extra method provided by components that need to perform an action after the content changes (e.g Music component)
        if(props.moveMethod!=null){
            props.moveMethod()
        }
    }


    //moveReftArrow navigates to the next content in the component. If the last content was being shown then it navigates to the first
    
    const moveRightArrow = () =>{

        const position = props.position

        if(position< props.results.length-1){
            props.setState("position", position+1)
        }
        else{
            props.setState("position", 0)
        }
        if(props.moveMethod!=null){
            props.moveMethod()
        }
    }

    //onCloseModal is called when the modal that prompts the user for their mood is closed
    //it saves the mood to the database or reprompts the user for their mood if none is selected

    const onCloseModal=()=>{
        if(props.mood == "" || props.mood == null) {
            console.log(props.mood)
            Alert.alert("Please select a mood")
            return
        }
        else{
            props.setState("modalVisible", false)
            database().ref('users/' + props.user.uid).update({
                mood: props.mood
            })
        }
    }

     /*this returns the display for the component
        it often gets the information to be displayed from a parameter called 'props' 
        which the child components pass into this Home component.
    */

        return (
            <View style = {[styles.container, props.modalVisible?  {backgroundColor: 'rgba(0,0,0,0.5)'}: {backgroundColor: "white"}]}>
                
            {/* displays the mood popup when it is made visible */}

               <MoodPopup   modalVisible={props.modalVisible} 
                            onPress={(mood)=>props.setState("mood",mood)} 
                            onButtonPress={()=>onCloseModal()} 
                            mood = {props.mood} > 
                            
                </MoodPopup>               
               
            {/* Adds the title placeholder,  the 'content box' where the content will be played and the arrows */}
                <View style ={{alignItems: "center", margin: 10, padding: 10}}>
                    <Text style = {styles.title}>
                         {props.results[props.position]  == null? "Title": props.title}
                    </Text>
                </View>
            
                <View style= {styles.contentView}>         
                    <View>
                        <TouchableOpacity style= {styles.arrows} onPress={ () => moveLeftArrow()} disabled = {props.arrowDisabled}>
                            <FontistoIcon name="arrow-left" size={15}/>
                        </TouchableOpacity>
                    </View>
                    <View style={props.contentType == "songs"&& props.results[props.position]  != null? styles.contentBoxsong:styles.contentBox}>
                                {props.contentBox}
                                
                    </View>
                    <View>
                        <TouchableOpacity style= {styles.arrows} onPress={()=>moveRightArrow()} disabled = {props.arrowDisabled}>
                            <FontistoIcon name="arrow-right" size={15}/>
                        </TouchableOpacity>
                    </View>
                </View>                
                        {props.playerBox}
                
                <View style={styles.info}>
                        {props.infoBox}
                </View>
            </View>
        )
}



//this defines the styling for the component

const styles = StyleSheet.create({
    container:{
        padding: 10,
        flex: 1
    },
    title:{
        fontSize: 25,
        fontWeight: "bold",
        fontFamily: "OpenSans-Light"
    },
    contentView:{
        flexDirection: "row",
        justifyContent:"center",
        alignItems:"center",
        flex: 2,
    },
    arrows:{
        flex: 1, 
        justifyContent:"center",
        marginHorizontal: 10
    },
    contentBox:{
        borderWidth: 2,
        borderRadius: 10,
        flex:5,
        margin: 10,
        alignSelf:"stretch",
        alignItems:"center",
        justifyContent:"center"
        
    },
    contentBoxsong:{
       
        flex:5,
        margin: 10,       
        alignSelf:"stretch",
        alignItems:"center",
        justifyContent:"center"
      
    },
    info:{
        flex:1 ,
        marginTop: 5
    },
})


