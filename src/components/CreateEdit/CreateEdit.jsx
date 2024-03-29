import "./CreateEdit.css"
import "../../common.css"
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { Remarkable } from "remarkable"
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
  createIndustry,
  deleteIndustry,
  getCategories,
  createCategory,
  deleteCategory,
  getAuthors,
  deleteAuthor,
  createAuthor,
  updateAuthor,
} from "../../api"
import TextareaAutosize from 'react-textarea-autosize';
import randomstring from "randomstring"
import copy from "copy-text-to-clipboard"

const md = new Remarkable();

export default function CreateEdit() {
  //get our ID if it exists
  const articleID = useParams().id  
  const navigate = useNavigate()

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
      .then(a => { setArticle(a); return a })
      .then(a => { setBaseArticle(a) })

    //if we don't have an ID, we have to instantiate our article
    //with our persistant images. We also need to creaate our 
    //image update functions or something?
    else getTempImages()
      .then(images => setArticle({ ...article, images }))
      .then(setBaseArticle({...article}))
  }, [])

  //submit our stuff
  const [submitLock, setSubmitLock] = useState(false)
  const onSubmit = async () => {

    //disallow clicking a bunch of times
    if (submitLock) return
    setSubmitLock(true)

    //ensure we have nonempty properties
    for (const prop of ["title", "subtitle", "synopsis", "author", "content", "authorID"])
      if (!article[prop]) return alert(`${prop} must be nonemptyy`)

    //ensure we have images
    if (!contentImgFile && !article.contentImgID) return alert("must upload a content image")

    //list of functions that return promises bc I want to run them all
    //at the same time so I just map them to f => f()
    const requests = []

    //finalArticle because state mutations are too slow so we
    //will act on a single new dictionary instead of using setArticle anymore
    const finalArticle = { ...article }

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

  return <>
    <h1>Content Image</h1>
    <SingleImage id={article.contentImgID} image={contentImgFile} setImage={setContentImgFile}/>
    <h1>Author</h1>
    <Author article={article} setArticle={setArticle}/>
    <ImageUpload images={article.images} addImages={addImages} deleteImage={deleteCallback}/>

    <h2>Title</h2>
    <ParamEdit param={"title"} article={article} setArticle={setArticle}/>
    <h2>Subtitle</h2>
    <LargerEdit param={"subtitle"} article={article} setArticle={setArticle}/>
    <h2>Synposis</h2>
    <LargerEdit param={"synopsis"} article={article} setArticle={setArticle}/>
    <h2>Content</h2>
    <MarkdownEdit article={article} setArticle={setArticle}/>

    <h2>Industries</h2>
    <TagSelect article={article} setArticle={setArticle} prop={"industries"} getFunc={getIndustries} createFunc={createIndustry} deleteFunc={deleteIndustry} />
    <h2>Categories</h2>
    <TagSelect article={article} setArticle={setArticle} prop={"categories"} getFunc={getCategories} createFunc={createCategory} deleteFunc={deleteCategory} />

    <button onClick={onSubmit}>Submit</button>
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
      <img src={imageData ? imageData : id ? BASE_URL + `/api/images/${id}` : ""} className="imageimage"></img>
      <button onClick={onDelete}>delete</button>
    </form>
}

//displays an image based off its id given by the api
//these are the images to be used in the article
function ImageFromID({ id, deleteCallback }) {

  return <div>
      <img className="imageimage" src={BASE_URL + `/api/images/${id}`}></img>
      <button onClick={() => console.log("preview")}>preview</button>
      <button onClick={() => copy(`![](${BASE_URL}/api/images/${id})`)}>copy</button>
      <button onClick={deleteCallback}>delete</button>
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

  return <form ref={form}>
      <input id="upload" multiple type="file" accept="image/*" onChange={onChange}/>
      { images.map(id => <ImageFromID key={id} id={id} deleteCallback={() => deleteImage(id)}/>) }
    </form>
}

function MarkdownEdit({ article, setArticle }) {
  
  const onChange = e => setArticle({ ...article, content: e.target.value })

  return <div>
      <div dangerouslySetInnerHTML={{ __html: md.render(article.content) }}></div>
      <TextareaAutosize minRows="4" id="content" value={article.content} onChange={onChange}/>
    </div>
}

function ParamEdit({ param, article, setArticle }) {
  const onChange = e => setArticle({ ...article, [param]: e.target.value })
  
  return <>
      <input id={param} value={article[param]} onChange={onChange}/>
    </>
}

function LargerEdit({ param, article, setArticle }) {
  const onChange = e => setArticle({ ...article, [param]: e.target.value })
  return <>
      <TextareaAutosize minRows="4" id={param} value={article[param]} onChange={onChange}/>
    </>
}

function Checkbox({ tag, article, setArticle, prop, deleteFunc, tags, setTags }) {
  
  function handleChange() { 
    if (article[prop].includes(tag.content)) setArticle({ ...article, [prop]: article[prop].filter(a => a != tag.content)})
    else setArticle({ ...article, [prop]: [...article[prop], tag.content] })
  }
  function handleDelete() {
    setTags(tags.filter(a => a._id != tag._id))
    deleteFunc(tag._id)
  }

  return <>
      <label>
        <input type="checkbox"
          checked={article[prop].includes(tag.content)}
          onChange={handleChange}/>
        {tag.content}
      </label>
      <button onClick={handleDelete}>X</button>
    </>
}

function TagSelect({ article, setArticle, prop, getFunc, createFunc, deleteFunc }) {
  
  const [tags, setTags] = useState([])
  
  useEffect(() => { getFunc().then(setTags) }, [])

  const [inputState, setInputState] = useState(false)
  const [input, setInput] = useState("")
  function handleNew() {
    setInputState(true)
  }
  function handleSubmit() {
    createFunc(input)
      .then(tag => setTags([...tags, tag]))

    setInputState(false)
    setInput("")
  }
  function handleCancel() {
    setInputState(false)
    setInput("")
  }
  
  return <>
      { tags.map(tag =>
        <Checkbox
          key={tag._id}
          tag={tag}
          article={article}
          setArticle={setArticle}
          prop={prop}
          deleteFunc={deleteFunc}/>
      )}
      <button onClick={handleNew} style={{display: inputState ? "none" : ""}}>new</button>
      <div style={{display: inputState ? "" : "none"}}>
        <input value={input} onChange={e => setInput(e.target.value)}></input>
        <button onClick={handleSubmit}>submit</button>
        <button onClick={handleCancel}>cancel</button>
      </div>
    </>

}

function Author({ article, setArticle }) {
  
  const [edit, setEdit] = useState("")
  const [editing, setEditing] = useState(false)
  const [authors, setAuthors] = useState([])
  const [authorImgID, setAuthorImageID] = useState("")
  const [image, setImage] = useState()
  const select = React.createRef()
  const [selected, setSelected] = useState("none")

  useEffect(() => { getAuthors().then(setAuthors) }, [])
  function emptyAuthor() { setArticle({
    ...article,
    author: "",
    authorImgID: "",
    authorID: ""
  })}

  function onOptionSelect(e) {
    console.log(authors)
    const id = e.target.options[e.target.selectedIndex].getAttribute("value")
    console.log(id)
    if (id == "none") {
      emptyAuthor()
      setSelected(id)
      return
    }
    
    //update article stuff
    const author = authors.find(a => a._id == id)
    setArticle({
      ...article,
      author: author.name,
      authorImgID: author.imageID,
      authorID: author._id
    })
    setAuthorImageID(author.imageID)
    setSelected(id)
  }

  function newOnClick() {
    emptyAuthor()
    setEditing(true)
  }
  function editOnClick() {
    setArticle({ ...article, author: "" })
    setEditing(true)
  }
  function deleteOnClick() {
    //should never not have an id but just in case
    if (!article.authorID) return
    deleteAuthor(article.authorID)
    select.current.selectedIndex = "0"
    setAuthors(authors.filter(a => a._id != article.authorID))
    emptyAuthor()
  }
  async function saveOnClick() {
    //if we don't have a name
    if (!edit) return

    const requests = []

    let imgID = article.authorImgID
    if (image) {
      const [[id], data] = makeForm([image])
      requests.push(() => putFormData(data))
      imgID = id
    }
    //if I still dont ave an image don't let me save
    if (!imgID) return
    
    let id = article.authorID
    requests.push(() => {
      if (id) updateAuthor(id, edit, imgID)
      else createAuthor(edit, imgID)
        .then(a => { id = a._id })
    })
    
    //before our requests finish, don't let them submit
    setArticle({ ...article, authorID: "" })

    await Promise.all(requests.map(a => a()))

    setArticle({
      ...article,
      author: edit,
      authorImgID: imgID,
      authorID: id
    })
    console.log(authors)
    setAuthors([...authors, {
      name: edit,
      imageID: imgID,
      _id: id
    }])
    setSelected(id)
    setEditing(false)
  }
  function cancelOnClick() {

    if (!article.authorID) {
      emptyAuthor()
      setEditing(false)
      return
    }

    setImage(undefined)
    setEditing(false)
  }
  
  return <>
      <SingleImage id={authorImgID} image={image} setImage={setImage}/>
      <span>{article.author || "no author selected"}</span>
      <div style={{display: editing ? "none" : ""}}>
        <button onClick={newOnClick}>new</button>
        <button onClick={editOnClick} style={{display: article.authorID ? "" : "none"}}>edit</button>
        <button onClick={deleteOnClick} style={{display: article.authorID ? "" : "none"}}>delete</button>
      </div>
      <div style={{display: editing ? "" : "none"}}>
        <input value={edit} onChange={e => setEdit(e.target.value)}/>
        <button onClick={saveOnClick}>save</button>
        <button onClick={cancelOnClick}>cancel</button>
      </div>
      <select ref={select} onChange={onOptionSelect} value={selected}>
        <option value={"none"}>no author selected</option>
        { authors.map(author =>  <option value={author._id} key={author._id}>{author.name}</option> )}
      </select>
    </>
}



//function originally from https://stackoverflow.com/questions/12368910/html-display-image-after-selecting-filename
const imageToDataURL = file => new Promise(resolve => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result)
  reader.readAsDataURL(file)
})

function makeForm(files) {
  const data = new FormData()
  const ids = []

  for (const f of files) {
    const id = randomstring.generate(32)
    data.append("files", f, id)
    ids.push(id)
  }

  return [ids, data]
}
