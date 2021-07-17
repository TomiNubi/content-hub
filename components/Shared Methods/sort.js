/*
    Selection Sort Method
*/

//takes in an array of results(music, videos or text) as an argument
export const sort = (results) =>{

    for (var i =0; i< results.length -1; i++){

        //stores the first index as the maximum number
        var max = i
        for (var j = i+1; j < results.length; j++){

            //compares the rank of the current results to that of the max
            if (results[j].rank > results[max].rank){
                //stores the index of the higher value as the max
                    max = j
            }
        }
        //swaps the  of the new max with the old one
        var temp = results[i]
        results[i] = results[max]
        results[max] = temp
    }
    return results
}

