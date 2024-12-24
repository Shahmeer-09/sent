class Apiresponse{

    constructor(statuscose, data, message="success"){
        this.statuscose = statuscose;
        this.data = data;
        this.message = message;
    }
}
module.exports = Apiresponse;