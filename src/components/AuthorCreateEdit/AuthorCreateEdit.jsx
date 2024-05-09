
import { useState, useEffect } from "react";
import { useParams, useNavigate, ScrollRestoration } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { deleteImage, putFormData, getAuthor, createAuthor, updateAuthor, BASE_URL } from "../../api"
import randomstring from "randomstring"
import React from "react"

import { marked } from "marked"
import { pdfrender } from "../../pdf-marked"

marked.use({ extensions: [pdfrender] })


export default function AuthorCreateEdit() {

  const navigate = useNavigate()
  const { id } = useParams()

  const [author, setAuthor] = useState({
    name: "",
    imageID: "",
    content: ""
  })
  const [image, setImage] = useState(undefined)

  useEffect(() => {
    if (id) getAuthor(id).then(setAuthor)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function submit() {
    
    if (!author.name) return alert("name must be nonempty")
    if (!author.imageID && !image) return alert("author must have some image")

    //create new non-state author to submit
    const finalauthor = { ...author }
    console.log(finalauthor)
    const requests = []
    
    //fill out id if it's not there already
    if (image) {
      //if there's an old image, delete it
      if (author.imageID) requests.push(() => deleteImage(author.imageID))

      //write the new image
      const [[id], data] = makeForm([image])
      finalauthor.imageID = id
      requests.push(() => putFormData(data))

    }
    
    requests.push(() => id ? updateAuthor(id, finalauthor) : createAuthor(finalauthor))
    await Promise.all(requests.map(f => f()))
    navigate("/settings")
  }

  return <>
      <div><input value={author.name} onChange={e=>setAuthor({ ...author, name: e.target.value})}/>name</div>
      <SingleImage id={author.imageID} image={image} setImage={setImage}/>
      <MarkdownEdit value={author.content} setValue={content => setAuthor({ ...author, content })}/>
      <button onClick={submit}>submit</button>
      <ScrollRestoration/>
    </>
  
  
}

function MarkdownEdit({ value, setValue}) {
  
  return <div>
      <div dangerouslySetInnerHTML={{ __html: marked.parse(value) }}></div>
      <TextareaAutosize minRows="4" id="content" value={value} onChange={e => setValue(e.target.value)}/>
    </div>
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
  return <form ref={form}>
      <input id="upload" type="file" accept="image/*" onChange={onChange}/>
      <img alt="what you uploaded" src={imageData ? imageData : id ? BASE_URL + `/api/images/${id}` : ""} className="imageimage"></img>
      <button onClick={onDelete}>delete</button>
    </form>
}


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
    const id = randomstring.generate(32) + "." + f.type.match(/(?<=\/).*/)
    data.append("files", f, id)
    ids.push(id)
  }

  return [ids, data]
}
