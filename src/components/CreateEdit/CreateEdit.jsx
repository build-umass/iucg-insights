import "./CreateEdit.css"
import "../../common.css"
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import {
  BASE_URL,
  getArticle,
  updateArticle,
  createArticle,
  deleteImage,
  putFormData,
  getTempImages,
  postTempImage,
  deleteTempImage,
  getIndustries,
  getCategories,
  getAuthors,
} from "../../api"
import TextareaAutosize from 'react-textarea-autosize'
import Select from 'react-select'
import Titlebar from "../Titlebar/Titlebar"
import randomstring from "randomstring"
import copy from "copy-text-to-clipboard"
import { marked } from "marked"
import { pdfrender } from "../../pdf-marked"
import { useCookies } from "react-cookie"

marked.use({ extensions: [pdfrender] })

export default function CreateEdit() {
  const [cookies] = useCookies(['loginToken', 'isAdmin']);
  //get our ID if it exists
  const articleID = useParams().id  
  const navigate = useNavigate()

  const [feedback, setFeedback] = useState("")
  const [preview, setPreview] = useState(false)
  const [article, setArticle] = useState({
    title: "",
    subtitle: "",
    synopsis: "",
    author: "",
    authorImgID: "",
    authorID: "",
    content: "",
    contentImgID: "",
    images: [],
    industries: [],
    categories: []
  })

  //these states are necessary to get the actual files outside
  //of the scope of the SingleImage component
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
    const requests = []
    const images = article.images.filter(a => a !== id)
    
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
      .then(a => { setArticle(a); return a })
      .then(a => { setBaseArticle(a) })

    //if we don't have an ID, we have to instantiate our article
    //with our persistant images. We also need to creaate our 
    //image update functions or something?
    else getTempImages()
      .then(images => setArticle({ ...article, images }))
      .then(setBaseArticle({...article}))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //submit our stuff
  const [submitLock, setSubmitLock] = useState(false)
  const onSubmit = async (published) => {

    //disallow clicking a bunch of times
    if (submitLock) return
    setSubmitLock(true)

    //ensure we have nonempty properties
    for (const prop of ["title", "subtitle", "synopsis", "author", "content", "authorID"])
      if (!article[prop]) {
        setSubmitLock(false)
        setFeedback(`${new Date().toLocaleTimeString()}: ${prop} must be nonempty`)
        return
      }

    //ensure we have images
    if (!contentImgFile && !article.contentImgID) {
      setSubmitLock(false)
      setFeedback(`${new Date().toLocaleTimeString()}: content image must not be empty`)
      return 
    }

    //list of functions that return promises bc I want to run them all
    //at the same time so I just map them to f => f()
    const requests = []

    //finalArticle because state mutations are too slow so we
    //will act on a single new dictionary instead of using setArticle anymore
    const finalArticle = { ...article, published }

    //we wanna upload the new images, delete the old images and upload the article
    //all asynchronously so we have the highest chance of not having issues

    //first we make our new form datas and ids
    for (const [file, prop] of [[contentImgFile, "contentImgID"]]) {
      if (!file) continue

      const [[id], data] = makeForm([file])
      finalArticle[prop] = id

      requests.push(() => putFormData(data))
      if (baseArticle[prop]) requests.push(() => deleteImage(baseArticle[prop]))
    }

    //then we actually upload/create the article
    requests.push(() => articleID ? updateArticle(articleID, finalArticle) : createArticle(finalArticle))

    //send every request at once this is a great idea
    const reses = await Promise.all(requests.map(f => f()))

    const id = reses[reses.length-1]._id
    navigate(`/articles/${id}`)
  }

  if(cookies.isAdmin === "false"){
    return <div>
      You must be admin in order to create articles
    </div>
  }
  return <>
    <Titlebar nosearch={true}/>
    
    <div id="createedit">
      <input placeholder="Title" class="titleinput"
        value={article.title}
        onChange={e => setArticle({ ...article, title: e.target.value })}/>

      <TextareaAutosize placeholder="Subtitle"
        minRows="1"
        value={article.subtitle}
        onChange={e => setArticle({ ...article, subtitle: e.target.value })}/>
      <TextareaAutosize placeholder="Synopsis"
        minRows="1"
        value={article.synopsis}
        onChange={e => setArticle({ ...article, synopsis: e.target.value })}/>

      <br/><span className="smalltext">Header Image Upload</span>
      <SingleImage id={article.contentImgID} image={contentImgFile} setImage={setContentImgFile}/>

      <br/><span className="smalltext">Image Upload</span>
      <ImageUpload images={article.images} addImages={addImages} deleteImage={deleteCallback}/>

      <br/><span className="smalltext">Author Select</span>
      <Author article={article} setArticle={setArticle}/>

      <br/><span className="smalltext">Industry Select</span>
      <TagSelect
        prop={"industries"}
        article={article}
        setArticle={setArticle}
        getFunc={getIndustries}/>

      <br/><span className="smalltext">Category Select</span>
      <TagSelect
        prop={"categories"}
        article={article}
        setArticle={setArticle}
        getFunc={getCategories}/>
    
      <br/>
      <span className="smalltext">
        Article Content<br/>
        Documents are markdown. For usage examples see <a href="https://www.markdownguide.org/basic-syntax/">this link</a>.
        To use the images you've uploaded please click the copy button and then paste the image into the document. To preview 
        the document as it would look to your clients, click preview.
      </span>
      <MarkdownEdit article={article} setArticle={setArticle} preview={preview}/>

      <br/>
      <div className="buttonrow">
        <span className="btnpreview" onClick={()=>{setPreview(!preview)}}>{preview ? "Edit" : "Preview"}</span>
        <span className="btndraft" onClick={()=>{onSubmit(false)}}>Save to Drafts</span>
        <span className="btnpublish" onClick={()=>{onSubmit(true)}}>Publish</span>
      </div>
      <span class="feedback">{feedback}</span>
    </div>
  </>
}

//single image display with delete capabilities
function SingleImage({ id, image, setImage }) {

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
            <span onClick={onDelete} class="material-symbols-outlined resetbutton">reset_image</span>
          </> :
          <div>
            <span className="material-symbols-outlined uploadicon">cloud_upload</span><br/>
            <span className="smalltext">Click to Upload Image</span>
          </div>
        }
      </label>
    </form>
}

//displays an image based off its id given by the api
//these are the images to be used in the article
function ImageFromID({ id, deleteCallback }) {

  function onPreview(e) {
    e.preventDefault()
    window.open(`${BASE_URL}/api/images/${id}`, "_blank").focus()
  }
  function onCopy(e) {
    e.preventDefault()
    copy(`![describe the image](${BASE_URL}/api/images/${id})`)
  }
  function onDelete(e) {
    e.preventDefault()
    deleteCallback(id)
  }

  return <div className="image">
      <img alt="what you uploaded" className="imageimage" src={`${BASE_URL}/api/images/${id}`}></img>
      <div className="buttons">
        <span className="material-symbols-outlined" onClick={onPreview}>preview</span>
        <span className="material-symbols-outlined" onClick={onCopy}>content_copy</span>
        <span className="material-symbols-outlined" onClick={onDelete}>delete</span>
      </div>
    </div>
}

//shows all the images related to the current blog
//or all the images in tempimages
function ImageUpload({ images, addImages, deleteImage }) {

  const form = React.createRef()

  const onChange = async e => {
    if (!e.target.files && !e.target.files[0]) return

    //convert files into a form
    const [ids, data] = makeForm(e.target.files)
    
    //reset the form bc we're about to submit
    form.current.reset()
    addImages(ids, data)
  }

  return <form ref={form} id="multiimageupload">
      <input id="multiupload" multiple type="file" accept="image/*,application/pdf" onChange={onChange} hidden/>
      <label htmlFor="multiupload">
        <div>
          <span className="material-symbols-outlined uploadicon">cloud_upload</span><br/>
          <span className="smalltext">Click to Upload Image</span>
        </div>
      </label>
      <div class="imagegrid">
      { images.map(id => <ImageFromID key={id} id={id} deleteCallback={deleteImage}/>) }
      </div>
    </form>
}

function MarkdownEdit({ article, setArticle, preview }) {
  
  const onChange = e => setArticle({ ...article, content: e.target.value })
  return preview ? <div id="preview" dangerouslySetInnerHTML={{ __html: marked.parse(article.content) }}></div> :
    <TextareaAutosize
      id="markdownedit"
      placeholder="Markdown goes here..."
      minRows="4"
      value={article.content}
      onChange={onChange}/>
}

function TagSelect({ article, setArticle, prop, getFunc }) {
  
  const [tags, setTags] = useState([])
  useEffect(() => {
    getFunc().then(setTags)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function onSelect(options) {
    setArticle({ ...article, [prop]: options.map(a => a.label)})
  }

  return <Select isMulti options={tags.map(a => ({ value: a._id, label: a.content }))} onChange={onSelect}/>
}

function Author({ article, setArticle }) {

  const [authors, setAuthors] = useState([])
  useEffect(() => { getAuthors().then(setAuthors) }, [])

  function onChange(option) {
    const author = authors.find(a => a._id === option.value)
    setArticle({
      ...article,
      author: author.name,
      authorImgID: author.imageID,
      authorID: author._id
    })
  }

  return <Select options={authors.map(a => ({ value: a._id, label: a.name }))} onChange={onChange}/>
}


//function originally from https://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename
const imageToDataURL = file => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result)
  reader.readAsDataURL(file)
})

function makeForm(files) {
  console.log([...files])
  const data = new FormData()
  const ids = []

  for (const f of files) {
    const id = randomstring.generate(32) + "." + f.type.match(/(?<=\/).*$/)
    data.append("files", f, id)
    ids.push(id)
  }

  return [ids, data]
}
