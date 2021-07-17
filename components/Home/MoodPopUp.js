import React from 'react'
import { Text, View, StyleSheet, TouchableOpacity, Modal} from 'react-native'
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { Button } from 'react-native-paper';



export default function MoodPopup(props){
    return(
        //this gets the necessary variables and methods from the parent class using the paramter "props"

        <Modal visible= {props.modalVisible} transparent={true}>
                    <View style = {{justifyContent: "center",  flex: 1}}>
                        <View style = {styles.modal}>
                        <Text>How are you feeling today</Text>

                        {/* this provides the different options for the user to select their mood.  */}
                        <View style = {styles.moods}>
                            <TouchableOpacity  style={styles.icon} onPress={()=>props.onPress("happy")}>
                                 <FontistoIcon name = "smiley" size={25} color={props.mood === "happy" ? "blue": "black"}  />
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.icon} onPress={()=>props.onPress("calm")}>
                                 <FontistoIcon name = "neutral" size={25} color={props.mood === "calm" ? "blue": "black"} />
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.icon} onPress={()=>props.onPress("sad")}>
                                 <FontistoIcon name = "frowning" size={25} color={props.mood=== "sad" ? "blue": "black"} />
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.icon} onPress={()=>props.onPress("angry")}>
                                 <FontistoIcon name = "mad" size={25} color={props.mood === "angry" ? "blue": "black"}/>
                            </TouchableOpacity>
                            <TouchableOpacity  style={styles.icon} onPress={()=>props.onPress("romantic")}>
                                 <FontistoIcon name = "heart-eyes" size={25} color={props.mood === "romantic" ? "blue": "black"}/>
                            </TouchableOpacity>
                            
                        </View>
                        {/* the onPress method for the button provided by the parent class is excecute when the ok button is clicked */}
                        <View>
                            <Button  style = {styles.button} onPress={props.onButtonPress}> OK </Button>
                        </View>
                        </View>
                        
                    </View>
                </Modal>

                
    )
}

//this defines the styling for the component

const styles = StyleSheet.create({
    container:{
        padding: 10,
        flex: 1
    },
    button:{
        color: "blue"
    },
    modal: {
        margin: 20,
        backgroundColor: "white",
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 0,
        justifyContent: "center",
      },
      moods:{
          flexDirection: "row",
          marginHorizontal: 10,
          justifyContent: "space-between",
          marginVertical: 10
          
      },
      icon:{
          marginHorizontal: 10
      }
})