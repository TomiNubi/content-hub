import {countryObject as countries} from "../Data/countries"; //imports an object of countries and their continent and country codes


//this method looks for available spotify music genres that may be linked to certain countries 
//and returns an object of countries which their matching genres

const getCountryGenre = () =>{
    var genre = {}
    for(var country of countries){
        
        if(country.continent == "AF"){
            genre[country.name] = ["afrobeats"]
        }
        else if(country.name == "Brazil"){
            genre[country.name] = ["brazil", "bossanova", "sertanejo"]
        }
        else if(country.name == "Germany"){
            genre[country.name] = ["german"]
        }
        else if(country.name == "United Kingdom"){
            genre[country.name] = ["british"]
        }
        else if(country.name == "China"){
            genre[country.name] = ["cantopop"]
        }
        else if(country.name == "Jamaica"){
            genre[country.name] = ["dancehall"]
        }
        else if(country.name == "France"){
            genre[country.name] = ["french"]
        }
        else if(country.name == "India"){
            genre[country.name] = ["indian"]
        }
        else if(country.name == "Japan"){
            genre[country.name] = ["j-pop", "j-dance", "j-rock", "j-idol"]
        }
        else if(country.name == "Korea, Republic of"){
            genre[country.name] = ["k-pop"]
        }
        else if(country.name == "Philippines"){
            genre[country.name] = ["philippines-opm"]
        }
        else if(country.name == "Spain"){
            genre[country.name] = ["spanish"]
        }
        else if(country.name == "Sweden"){
            genre[country.name] = ["swedish"]
        }
        else if(country.name == "Turkey"){
            genre[country.name] = ["turkish"]
        }
        else{
            genre[country.name] = ["N/A"]
        }
        if(country.continent == "SA"){
            if(genre[country.name]!= null){
                genre[country.name].push("latin")
            }
            else{
                genre[country.name] = ["latin"]
            }
        }

    }
    
    return genre

}

//this is the main dictionary object which defines acceptable values for the API that relate specifically to the user's mood and country
export var dictionary = {
    tracks:{
        mood: {
            genre: {
                happy: ["happy", "groove"],
                sad: ["sad", "sleep"],
                angry: ["hardcore"],
                calm: ["ambient","chill"],
                romantic: ["romance"]
            },
            valence:{
                happy: 1,
                sad:0.3,
                angry: 0.4,
                calm: 0.7,
                romantic: 1
            },
            energy:{
                happy: 0.8,
                sad:0.4,
                angry: 0.6,
                calm: 0.5,
                romantic: 0.6
            },
            
        },

        country:{
            genre: getCountryGenre() //gets an object of countries which spotify genres related to them
        },
    },

    videos:{
        mood:{
            happy : ["happy", "laugh", "funny", "smile"],
            sad: ["sad", "cry", "emotional", "hurt", "motivational"],
            calm: ["calm", "satisfying", "relaxing", "relax"],
            angry: ["angry", "mad", "relief", "calm"],
            romantic: ["romantic", "love", "couple", "relationship"]
        }
    },
    
    texts:{
        mood:{
            happy : ["happy", "laugh", "funny", "smile"],
            sad: ["sad", "cry", "emotional", "hurt", "motivational"],
            calm: ["calm", "satisfying", "relaxing", "relax"],
            angry: ["angry", "mad", "relief", "calm"],
            romantic: ["romantic", "love", "couple", "relationship"]
        }
    }
    
}



