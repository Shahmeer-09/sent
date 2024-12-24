const statuscose  =require("http-status-codes")


class NotfoundError extends Error{
   constructor(message){
    super(message)
    this.statusCode=statuscose.NOT_FOUND
    this.message=message
    this.name = "notfoundError"
   
   }
}

class badReqError extends Error{
   constructor(message){
    super(message)
    this.statusCode=statuscose.BAD_REQUEST
    this.message=message
    this.name = "badreqError"
   
   }
}
class UnauthrizedError extends Error{
   constructor(message){
    super(message)
    this.statusCode=statuscose.FORBIDDEN
    this.message=message
     this.name = "unauthorizedError"
   }
}
class UnauthenticatedError extends Error{
   constructor(message){
    super(message)
    this.statusCode=statuscose.UNAUTHORIZED
    this.message=message
    this.name = "unauthenticatedError"
   }
}


module.exports={
    NotfoundError,
    UnauthrizedError,
    UnauthenticatedError,
    badReqError
}