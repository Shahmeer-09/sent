import { useState } from "react";
import { toast } from "react-toastify";

const Imageprev = ()=>{
    const [imageurl, setimageurl] = useState('')
    const handleimageread = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')  ) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            setimageurl(reader.result);
          };
        }else{
            toast.error('Please select a valid image file.');
        
        }
      };

      return {handleimageread, imageurl, setimageurl}
}
export default Imageprev