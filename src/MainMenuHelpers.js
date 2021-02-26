// If the man nav does a thing, it happens here

const mainNavFunctions = {
    about: function(passedThis){
        console.log(passedThis)
        passedThis.setState({pausedgame:true})
       return passedThis.setState({
            modalStatus: "modal display-block", 
            modalText: "Modal content is here!"})
    },
    helper2: function(param1){

    },
    helper3: function(param1, param2){

    }
}

export default mainNavFunctions;