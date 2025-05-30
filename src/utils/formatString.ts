export const formatUnderScoreString = (str: string) => {
    var array = str.split("_");
    var finalString = "";
    let subStr: string = "";
    for (subStr of array) {
        finalString += subStr.charAt(0).toUpperCase() + subStr.slice(1,subStr.length)+" ";
    }
    return finalString;
}

export const formatArrayAsString = (arr: string[] , divider: string) => {
    let finalString: string = "";

    arr.forEach((ele,index)=>{
        if ( index !== arr.length-1 )
            finalString += ele+divider;
        else 
            finalString += ele;
    })

    return finalString;
}