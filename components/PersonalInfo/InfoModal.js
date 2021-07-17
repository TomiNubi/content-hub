import React from 'react'
import { Text, View ,  StyleSheet, TouchableOpacity, Modal,  ScrollView} from 'react-native'
import {  Chip} from 'react-native-paper';


export default function ModalClass(props) {
    //this component provides the pop-up display used for the selection of interests, music genres or possible other items in a list
    //the 'props' parameter allows one to determine the exact list to be display and modify it

    return(
        <Modal visible={props.modalVisible} onDismiss={() => props.onDismiss}
            animationType="slide"
            transparent={true}>
           
            <View style ={{justifyContent: "center",  flex: 1}}>
                  <View style={styles.modal}>
                 
                         <Text style={styles.modalText}>{props.displayText}</Text>
                         <ScrollView style = {{height: 300, marginVertical: 10}}>
                            <View style={styles.chip}>
                            
                            {/* the map function simply creates multiple chips that display all the interest options */}

                            {props.chips!=null? props.chips.map((item,index) =>
                            
                            <Chip icon={props.chips[index].isSelected? "check": "plus"} 
                            
                                onPress={ ()=>props.onPress(index, props.chips,props.listName)}
                                selected ={props.chips[index].isSelected}                             
                                style={{margin: 10, color: "black"}}
                                key={index}>{item.value}
                                
                            </Chip>
                            ): <Text>No chips</Text>}
                       
                            </View>
                        </ScrollView>

                         <TouchableOpacity onPress = {props.onDismiss} > {/* closes the pop-up view when clicked */}                         
                            <Text style={styles.textStyle}>OK</Text>
                         </TouchableOpacity>

                    </View>
                    </View>
                     
          </Modal>  

    )
}

//this is the styling for the infomodal component
const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        backgroundColor: "#FFF"
    },
    interest:{
        marginEnd: 10,
        padding: 10
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
      chip:{
          flexDirection: "row",
          flexWrap: "wrap"
      }

})
