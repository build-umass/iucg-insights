import "./SingleImage.css"
import { useState, useEffect } from "react"
import React from "react"
import { BASE_URL } from "../../api"

//single image display with delete capabilities
export default function SingleImage({ id, image, setImage }) {

  const [imageData, setImageData] = useState("")
  const form = React.createRef()
  
  //when we get raw data, save it
  async function onChange(e) {
    if (!e.target.files && !e.target.files[0]) return
    setImage(e.target.files[0])
  }

  //reset the form and un-display the image
  function onDelete(e) {
    e.preventDefault()
    form.current.reset()
    setImageData(undefined)
    setImage(undefined)
  }

  //when we get new raw data, display it
  useEffect(() => { if (image) imageToDataURL(image).then(setImageData) }, [image])

  //TODO: have better pdf preview
  return <form ref={form} className="singleimage">
      <input id="upload" type="file" accept="image/*" onChange={onChange} hidden/>
      <label htmlFor="upload">
        { imageData || id ? 
          <>
            <img alt="what you uploaded" src={imageData ? imageData : BASE_URL + `/api/images/${id}`} className="imageimage"></img>
            <span onClick={onDelete} className="material-symbols-outlined resetbutton">reset_image</span>
          </> :
          <div>
            <span className="material-symbols-outlined uploadicon">cloud_upload</span><br/>
            <span className="smalltext">Click to Upload Image</span>
          </div>
        }
      </label>
    </form>
}


//function originally from https://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename
const imageToDataURL = file => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result)
  reader.readAsDataURL(file)
})
