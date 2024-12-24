const {v2 : cloudinary} =require( 'cloudinary')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
})

const Uploadoncloudinary =async (filpath) => {
    try {
        if(!filpath)  return null    
        const res =await cloudinary.uploader.upload(filpath, {
            resource_type:"auto",
        })
        return { profilepic :res.secure_url, profilepublic:res.public_id}
    } catch (error) {
        return null
    }

}

module.exports = Uploadoncloudinary