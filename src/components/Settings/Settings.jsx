import { useState, useEffect } from "react";
import {
  getSettings,
  writeSettings,
  getAuthors,
  getIndustries,
  createIndustry,
  deleteIndustry,
  updateIndustry,
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  deleteAuthor,
} from "../../api"
import { useNavigate } from "react-router-dom";

export default function Settings() {
  
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
     clicks_coef: 0,
     clicks_exp: 0,
     decay_coef: 0,
     decay_exp: 0,
     decay_rate: 0,
     age_coef: 0,
     age_exp: 0,
     allowed_emails: []
   })
  const [authors, setAuthors] = useState([])

  useEffect(() => {
    getSettings().then(setSettings)
    getAuthors().then(setAuthors)
  }, [])

  async function onClick() {
    await writeSettings(settings)
    console.log("settings saved :D")
  }

  return <>
      <div>heuristic: {settings.clicks_coef}(clicks^{settings.clicks_exp})+{settings.decay_coef}(decayed clicks^{settings.decay_exp})+{settings.age_coef}^(-age*{settings.age_exp})</div>
      <div>click decay: (previous decay)*({settings.decay_rate}^days since last decay)</div>
      <h2>Clicks</h2>
      <InputAndLabel propname="clicks_coef" label="coefficient" settings={settings} setSettings={setSettings}/>
      <InputAndLabel propname="clicks_exp" label="exponent" settings={settings} setSettings={setSettings}/>
      <h2></h2>
      <InputAndLabel propname="decay_coef" label="coefficient" settings={settings} setSettings={setSettings}/>
      <InputAndLabel propname="decay_exp" label="exponent" settings={settings} setSettings={setSettings}/>
      <InputAndLabel propname="decay_rate" label="rate" settings={settings} setSettings={setSettings}/>
      <h2></h2>
      <InputAndLabel propname="age_coef" label="coefficient" settings={settings} setSettings={setSettings}/>
      <InputAndLabel propname="age_exp" label="exponent" settings={settings} setSettings={setSettings}/>
    
      <h2>allowed emails</h2>
      <ListEdit
        _tags={settings.allowed_emails.map(a => ({ _id: a, content: a }))}
        _setTags={(emails)=> setSettings({ ...settings, allowed_emails: emails.map(a => a.content) })}
        createFunc={async (e) => ({ _id: e, content: e })}
        deleteFunc={() => {}}
        updateFunc={() => {}}/>

      <br/><button onClick={onClick}>save settings</button>

      <h1>Industries</h1>
      <ListEdit
        getFunc={getIndustries}
        createFunc={createIndustry}
        deleteFunc={deleteIndustry}
        updateFunc={updateIndustry}/>
      <h1>Categories</h1>
      <ListEdit
        getFunc={getCategories}
        createFunc={createCategory}
        deleteFunc={deleteCategory}
        updateFunc={updateCategory}/>
      <h1>Authors</h1>
      { authors.map(author => <div key={author._id}>
          {author.name}
          <button onClick={() => {deleteAuthor(author._id); setAuthors(authors.filter(a => a.id != author._id))}}>X</button>
          <button onClick={() => navigate("/")}>edit</button>
        </div>)}
      <button onClick={() => navigate("/")}>new</button>
    </>
}

function InputAndLabel({ label, propname, settings, set }) {

  function onChange(e) {
    set({...settings, [propname]: e.target.value})
  }

  return <div>
      <input onChange={onChange} value={settings[propname]}/>
      <label>{label}</label>
    </div>
}


function Tag({ tag, deleteFunc, updateFunc, tags, setTags }) {

  const [edit, setEdit] = useState("")
  const [editing, setEditing] = useState(false)
  
  function handleDelete() {
    //delete in ui
    setTags(tags.filter(a => a._id != tag._id))
    //delete for real
    deleteFunc(tag._id)
  }
  function handleEdit() {
    setEdit(tag.content)
    setEditing(true)
  }
  function handleSave() {

    //if it's not original don't allow saving
    if (!tags.every(({ content }) => content != edit)) return
    
    //actually update
    updateFunc(tag._id, edit)
    setTags(tags.map(a => a._id == tag._id ? { ...a, content: edit } : a))
    setEditing(false)
  }
  function handleCancel() {
    setEditing(false)
  }

  return <>
      <div style={{display: editing ? "none" : ""}}>
        {tag.content}
        <button onClick={handleDelete}>X</button>
        <button onClick={handleEdit}>edit</button>
      </div>
      <div style={{display: editing ? "" : "none"}}>
        <input value={edit} onChange={e=>setEdit(e.target.value)}/>
        <button onClick={handleSave}>save</button>
        <button onClick={handleCancel}>cancel</button>
      </div>
    </>
}

function ListEdit({ getFunc, createFunc, deleteFunc, updateFunc, debug, _tags, _setTags }) {
  
  //do tag init stuff
  let [tags, setTags] = useState([])
  if (_tags && _setTags) [tags, setTags] = [_tags, _setTags]
  
  useEffect(() => {
    if (!getFunc) return
    getFunc().then(setTags).then(() => {if (debug) console.log("a", tags)})
  }, [])

  const [inputState, setInputState] = useState(false)
  const [input, setInput] = useState("")
  function handleNew() {
    setInput("")
    setInputState(true)
  }
  function handleSubmit() {
    createFunc(input)
      .then(tag => setTags([...tags, tag]))

    setInputState(false)
  }
  function handleCancel() {
    setInputState(false)
  }
  
  return <>
      { tags.map(tag =>
        <Tag
          key={tag._id}
          tag={tag}
          tags={tags}
          setTags={setTags}
          deleteFunc={deleteFunc}
          updateFunc={updateFunc}/>
      )}
      <button onClick={handleNew} style={{display: inputState ? "none" : ""}}>new</button>
      <div style={{display: inputState ? "" : "none"}}>
        <input value={input} onChange={e => setInput(e.target.value)}></input>
        <button onClick={handleSubmit}>submit</button>
        <button onClick={handleCancel}>cancel</button>
      </div>
    </>

}





