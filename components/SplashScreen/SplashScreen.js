import React, { Component } from 'react'
import { Text, View, StyleSheet, Image, ImageBackground, ActivityIndicator} from 'react-native'

//this component displays the splashcreen for the app until the app is loaded
export class SplashScreen extends Component {

    constructor (props){
        super(props)
        this.state ={
            timer: null,
            counter: 0,
            internetError : "",
            loadVisible: false
        }
    }

    //starts a timer once the app is initialised
    componentDidMount(){
        let timer = setInterval(this.time, 30000)
        this.setState({timer})
        
    }

    //clears the timer after the splashscreen is closed
    componentWillUnmount(){
        clearInterval(this.state.timer)
    }

    //the time method checks if 30 seconds has passed since the splashscreen was displayed (when counter >1)
    //if this is true, it displays an internet connection error message
    time = () =>{
        this.setState({
            counter: this.state.counter + 1
        })
        if(this.state.counter > 0){
            this.setState({internetError: "Please check your internet connection", loadVisible: true})
        }
    }

    

    render() {
        //this defines the UI elements and the image source for the splashscreen
        return (
            <View style = {styles.container}>
                <ImageBackground source={require('./Logo.png')} style={styles.image}>
                   
                    {this.state.loadVisible?
                    <View style = {styles.error} >
                        <View style={styles.row}>                         
                            <ActivityIndicator size="large" color="#6C56EF" visible = {this.state.loadVisible} />
                            <Text style={styles.errorText}>{this.state.internetError}</Text>
                        </View>
                        
                    </View>:
                        <></>

                    }
                </ImageBackground>

                
            </View>
        )
    }
}

//this is the styling for the splashscreen
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    image:{
        flex:1,
        width: null,
        height: null,
        resizeMode:"cover"
    },

    error:{
        marginBottom: 20,
        flex: 1,
        color: "white",
        paddingRight: 5,
        
    },
    errorText:{
        color: "#FFF",
        fontWeight: "bold",
        margin: 10
    },
    row:{
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        
    }
   
})


export default SplashScreen
