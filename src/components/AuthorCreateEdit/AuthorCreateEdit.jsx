import "./AuthorCreateEdit.css"
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';
import { deleteImage, putFormData, getAuthor, createAuthor, updateAuthor, BASE_URL } from "../../api"
import randomstring from "randomstring"
import React from "react"
import SingleImage from "../SingleImage/SingleImage"
import Titlebar from "../Titlebar/Titlebar"

import { MarkdownEdit } from "../CreateEdit/CreateEdit"

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
  const [preview, setPreview] = useState(false)

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
    <Titlebar nosearch={true}/>
    <div className="authorcreateedit">
      <TextareaAutosize placeholder="Author Name" className="authorinput"
        minRows="1"
        value={author.name}
        onChange={e => setAuthor({ ...author, name: e.target.value })}/>
      <SingleImage id={author.imageID} image={image} setImage={setImage}/>
      <MarkdownEdit raw={author.content} setMarkdown={content => setAuthor({ ...author, content })} preview={preview}/>

      <div className="buttonrow">
        <span className="btnpreview" onClick={()=>{setPreview(!preview)}}>{preview ? "Edit" : "Preview"}</span>
        <span onClick={submit}>Submit</span>
      </div>
    </div>
  </>
}


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
