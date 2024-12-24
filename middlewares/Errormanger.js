

const errormangerhandler = (err, req, res, next) => {
    console.log(err)
    const message = err.message ? err.message : "Internal server error, try again";
   const statusCode = err.statusCode? err.statusCode: 500
   res.status(statusCode).json({
    statusCode,
    message,
    success:false
   }) 
}

module.exports = {errormangerhandler};