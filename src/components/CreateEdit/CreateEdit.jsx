import "./CreateEdit.css"
import "../../common.css"
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import React from "react";
import { Remarkable } from "remarkable"
import LoadingAnimation from "../LoadingAnimation/LoadingAnimation.jsx"
import {
  getArticle,
  updateArticle,
  deleteImage,
  putFormData,
  getTempImages,
  postTempImage,
  deleteTempImage
} from "../../api"
import TextareaAutosize from 'react-textarea-autosize';
import randomstring from "randomstring"

const md = new Remarkable();

export default function BlogDisplay() {
  //get our ID if it exists
  const articleID = useParams().id  

  const [article, setArticle] = useState({
    title: "",
    subtitle: "",
    synopsis: "",
    author: "",
    authorImgID: "",
    content: "",
    contentImgID: "",
    images: []
  })
  //TODO markdown rendering
  // const [markdown, setMarkdown] = useState("")

  //these states are necessary to get the actual files outside
  //of the scope of the SingleImage component
  const [authorImgFile, setAuthorImgFile] = useState()
  const [contentImgFile, setContentImgFile] = useState()

  //this is used for keeping it constant while editing images
  //since image edits are destructive/permanent changes whereas
  //non-image edits aren't
  const [baseArticle, setBaseArticle] = useState({...article})

  //if we're creating a new article then we want to update tempImages
  //if we're not, we wanna just update the actual article
  //we don't update the UI here because we're not sure that the images have uploaded yet
  const addImages = async (ids, data) => {

    const requests = []
    const images = [...article.images, ...ids]

    //all at the same time, add the images and depending on whether or not
    //we're creating a new article either update the actual article or just
    //add it to temp images
    requests.push(putFormData(data))
    if (articleID) requests.push(updateArticle(articleID, { ...baseArticle, images }))
    else ids.forEach(id => requests.push(postTempImage(id)))

    //process all stuff
    await Promise.all(requests)

    setArticle({ ...article, images })
  }

  const deleteCallback = async id => {
    console.log(id)
    const requests = []
    const images = article.images.filter(a => a != id)
    
    requests.push(deleteImage(id))
    if (articleID) requests.push(updateArticle(articleID, { ...baseArticle, images }))
    else requests.push(deleteTempImage(id))

    await Promise.all(requests)

    setArticle({ ...article, images })
  }

  useEffect(() => {
    //if we have an ID then we're going to need to instantiate
    //the article with it's current values and set baseArticle
    //to those too
    if (articleID) getArticle(articleID)
      .then(setArticle)
      .then(setBaseArticle({...article}))

    //if we don't have an ID, we have to instantiate our article
    //with our persistant images. We also need to creaate our 
    //image update functions or something?
    else getTempImages()
      .then(images => setArticle({ ...article, images }))
      .then(setBaseArticle({...article}))
  }, [])

  const buildparam = ParamEditFactory(article, setArticle)
  const buildlarger = LargerEditFactory(article, setArticle)

  //validate our input
  function validate() {}
  
  //submit our stuff
  const onSubmit = _ => {
    validate()
    console.log("submitted :)")
  }

  return <>
    <SingleImage id={article.contentImgID} image={contentImgFile} setImage={setContentImgFile}/>
    <SingleImage id={article.authorImgID} image={authorImgFile} setImage={setAuthorImgFile}/>

    <ImageUpload images={article.images} addImages={addImages} deleteImage={deleteCallback}/>
    <form className="createedit" style={{position: "relative"}} onSubmit={onSubmit}>
      { [ "title",
          "author",
          "content",
        ].map(buildparam) }
      { [ "subtitle",
          "synopsis",
          "content"
        ].map(buildlarger) }
      {/* <MarkdownEdit /> */}
    </form>
  </>
}

//single image display with delete capabilities
function SingleImage({ id, image, setImage }) {

  const [imageData, setImageData] = useState("")
  const form = React.createRef()
  
  //when we get raw data, save it
  const onChange = async e => {
    if (!e.target.files && !e.target.files[0]) return
    setImage(e.target.files[0])
  }

  //reset the form and un-display the image
  const onDelete = () => {
    form.current.reset()
    setImageData(undefined)
    setImage(undefined)
  }

  //when we get new raw data, display it
  useEffect(() => { if (image) imageToDataURL(image).then(setImageData) }, [image])

  return <form ref={form}>
      <input id="upload" type="file" accept="image/*" onChange={onChange}/>
      <img src={imageData ? imageData : id ? `/api/images/${id}` : ""} className="imageimage"></img>
      <div onClick={onDelete}>delete</div>
    </form>
}

//displays an image based off its id given by the api
//these are the images to be used in the article
function ImageFromID({ id, deleteCallback }) {

  return <div>
      <img className="imageimage" src={`/api/images/${id}`}></img>
      {/*<label for={param}>{param}</label>*/}
      <div onClick={() => console.log("preview")}>preview</div>
      <div onClick={() => console.log("copy")}>copy</div>
      <div onClick={deleteCallback}>delete</div>
    </div>
}

//shows all the images related to the current blog
//or all the images in tempimages
function ImageUpload({ images, addImages, deleteImage }) {

  const form = React.createRef()

  const onChange = async e => {
    if (!e.target.files && !e.target.files[0]) return

    const data = new FormData()
    const ids = []

    for (const f of e.target.files) {
      const id = randomstring.generate(32)
      data.append("files", f, id)
      ids.push(id)
    }
    
    //reset the form bc we're about to submit
    form.current.reset()
    addImages(ids, data)
  }

  return <form ref={form}>
      <input id="upload" multiple type="file" accept="image/*" onChange={onChange}/>
      { images.map(id => <ImageFromID id={id} deleteCallback={() => deleteImage(id)}/>) }
    </form>
}

function Content({ markdown }) {
  return !markdown ?
      <div className="center-content" style={{height: "100%"}}><LoadingAnimation/></div> :
      <div dangerouslySetInnerHTML={{ __html: markdown }}></div>
}

function ParamEditFactory(article, setArticle) {
  return param => ParamEdit({ param, article, setArticle })
}

function ParamEdit({ param, article, setArticle }) {
  const onChange = e => setArticle({ ...article, [param]: e.target.value })
  
  return <>
      <label for={param}>{param}</label>
      <input id={param} value={article[param]} onChange={onChange}/>
    </>
}

function LargerEditFactory(article, setArticle) {
  return param => LargerEdit({ param, article, setArticle })
}

function LargerEdit({ param, article, setArticle }) {
  const onChange = e => setArticle({ ...article, [param]: e.target.value })
  return <>
      <label for={param}>{param}</label>
      <TextareaAutosize minRows="4" id={param} value={article[param]} onChange={onChange}/>
    </>
}





//function originally from https://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename
const imageToDataURL = file => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result)
  reader.readAsDataURL(file)
})

const imageToBuffer = file => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result)
  reader.readAsArrayBuffer(file)
})




