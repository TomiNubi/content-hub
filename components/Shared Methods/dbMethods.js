

import database from '@react-native-firebase/database';

export const deleteFromDb = (contentType, uid, callback) =>{
    //checks for valid data
    if(contentType == "videos"|| contentType=="tracks" || contentType=="texts"){

        //navigates to the location of the results particular contentType in the database  
        var child = database().ref('/users/' + uid + "/results/" + contentType)
        var mood = database().ref('/users/' + uid + "/mood")

        database().ref('/users/' + uid + "/results").once("value").then( (snapshot)=>{
        var dbQuery = contentType.concat("Timestamp")
        var Timestamp = snapshot.val()[dbQuery]
        
        //checks if the results are older than 2 hours and deletes them, likewise the mood if yes.
        if(Date.now() > (Timestamp + 2*60*60*1000)){
                if(contentType == "tracks"){
                    mood.remove()
                }
                
                child.remove().then(callback()) 
        }
        else{   
            //performs the given callback function when the algorithm is done 
            callback();
        }
        })
    }   

}


export const saveToDb =(contentType, uid, results)=>{
    //saves the current time as a "timestamp" in the db for that particular content 
    var dbQuery = contentType.concat("Timestamp")
    database().ref("/users/" + uid+"/results").update({
        [contentType] : results,
        [dbQuery]: Date.now()
    })
    .catch((error) =>{console.log(error)})//Error Handling
}

