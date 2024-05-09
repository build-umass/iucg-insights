import "./Settings.css";
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
import { ScrollRestoration, useNavigate } from "react-router-dom";

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
  });
  const [authors, setAuthors] = useState([]);
  const [industriesVisible, setIndustriesVisible] = useState(true);
  const [categoriesVisible, setCategoriesVisible] = useState(true);
  const [authorsVisible, setAuthorsVisible] = useState(true);
  const [emailsVisible, setEmailsVisible] = useState(true);

  useEffect(() => {
    getSettings().then(setSettings)
    getAuthors().then(setAuthors)
  }, [])

  async function onClick() {
    await writeSettings(settings)
    console.log("settings saved :D")
  }

  return <>
    <div className="settings-page-outer-wrapper">
    <h1>Settings</h1>

    <h2>
      Industries
      <span className="material-symbols-outlined arrow"
        onClick={() => setIndustriesVisible(!industriesVisible)}>
        {industriesVisible ? "arrow_drop_up" : "arrow_drop_down"}
      </span>
    </h2>
    {industriesVisible ?
      <ListEdit
        getFunc={getIndustries}
        createFunc={createIndustry}
        deleteFunc={deleteIndustry}
        updateFunc={updateIndustry} />
      :
      <></>
    }

    <h2>
      Categories
      <span className="material-symbols-outlined arrow"
        onClick={() => setCategoriesVisible(!categoriesVisible)}>
        {categoriesVisible ? "arrow_drop_up" : "arrow_drop_down"}
      </span>
    </h2>
    {categoriesVisible ?
      <ListEdit
        getFunc={getCategories}
        createFunc={createCategory}
        deleteFunc={deleteCategory}
        updateFunc={updateCategory} />
      :
      <></>
    }

    <h2>
      Authors
      <span className="material-symbols-outlined arrow"
        onClick={() => setAuthorsVisible(!authorsVisible)}>
        {authorsVisible ? "arrow_drop_up" : "arrow_drop_down"}
      </span>
    </h2>
    {authorsVisible ? <>
      {authors.map(author => <div key={author._id} className="settings-page-list-edit-entry">
        {author.name}
        <div className="flex-spacer"></div>
        <MUIButton onClick={() => navigate(`/createauthor/${author._id}`)}>edit</MUIButton>
        <MUIButton onClick={() => { deleteAuthor(author._id); setAuthors(authors.filter(a => a.id != author._id)) }}>delete</MUIButton>
      </div>)}
      <div className="settings-page-list-edit-entry">
        <MUIButton onClick={() => navigate("/createauthor")}>add</MUIButton>
      </div>
    </>
      :
      <></>
    }

    <h2>
      Allowed Emails
      <span className="material-symbols-outlined arrow"
        onClick={() => setEmailsVisible(!emailsVisible)}>
        {emailsVisible ? "arrow_drop_up" : "arrow_drop_down"}
      </span>
    </h2>
    {emailsVisible ?
      <ListEdit
        _tags={settings.allowed_emails.map(a => ({ _id: a, content: a }))}
        _setTags={(emails) => setSettings({ ...settings, allowed_emails: emails.map(a => a.content) })}
        createFunc={async (e) => ({ _id: e, content: e })}
        deleteFunc={() => { }}
        updateFunc={() => { }} />
      :
      <></>
    }


    <h2>Clicks</h2>
    <div>heuristic: {settings.clicks_coef}(clicks^{settings.clicks_exp})+{settings.decay_coef}(decayed clicks^{settings.decay_exp})+{settings.age_coef}^(-age*{settings.age_exp})</div>
    <div>click decay: (previous decay)*({settings.decay_rate}^days since last decay)</div>
    <br/>
    <InputAndLabel propname="clicks_coef" label="coefficient" settings={settings} setSettings={setSettings} />
    <InputAndLabel propname="clicks_exp" label="exponent" settings={settings} setSettings={setSettings} />
    <br/>
    <InputAndLabel propname="decay_coef" label="coefficient" settings={settings} setSettings={setSettings} />
    <InputAndLabel propname="decay_exp" label="exponent" settings={settings} setSettings={setSettings} />
    <InputAndLabel propname="decay_rate" label="rate" settings={settings} setSettings={setSettings} />
    <br/>
    <InputAndLabel propname="age_coef" label="coefficient" settings={settings} setSettings={setSettings} />
    <InputAndLabel propname="age_exp" label="exponent" settings={settings} setSettings={setSettings} />

    <br /><button onClick={onClick}>save settings</button>

  </div>
  <ScrollRestoration/>
  </>
}

function ListEdit({ getFunc, createFunc, deleteFunc, updateFunc, debug, _tags, _setTags }) {

  //do tag init stuff
  let [tags, setTags] = useState([])
  if (_tags && _setTags) [tags, setTags] = [_tags, _setTags]

  useEffect(() => {
    if (!getFunc) return
    getFunc().then(setTags).then(() => { if (debug) console.log("a", tags) })
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
    {tags.map(tag =>
      <Tag
        key={tag._id}
        tag={tag}
        tags={tags}
        setTags={setTags}
        deleteFunc={deleteFunc}
        updateFunc={updateFunc} />
    )}

    {inputState ?
      <div className="settings-page-list-edit-entry">
        <input value={input} onChange={e => setInput(e.target.value)}></input>
        <div className="flex-spacer"></div>
        <MUIButton onClick={handleSubmit}>save</MUIButton>
        <MUIButton onClick={handleCancel}>cancel</MUIButton>
      </div>
      :
      <div className="settings-page-list-edit-entry">
        <MUIButton onClick={handleNew}>add</MUIButton>
      </div>
    }
  </>

}

function InputAndLabel({ label, propname, settings, set }) {
  function onChange(e) {
    set({ ...settings, [propname]: e.target.value })
  }

  return <div className="settings-page-input-entry">
    <label className="settings-page-input-label">{label}</label>
    <input className="settings-page-input" onChange={onChange} value={settings[propname]} />
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
    <div style={{ display: editing ? "none" : "" }} className="settings-page-list-edit-entry">
      {tag.content}
      <div className="flex-spacer"></div>
      <MUIButton onClick={handleEdit}>edit</MUIButton>
      <MUIButton onClick={handleDelete}>delete</MUIButton>
    </div>
    <div style={{ display: editing ? "" : "none" }} className="settings-page-list-edit-entry">
      <input value={edit} onChange={e => setEdit(e.target.value)} />
      <div className="flex-spacer"></div>
      <MUIButton onClick={handleSave}>save</MUIButton>
      <MUIButton onClick={handleCancel}>cancel</MUIButton>
    </div>
  </>
}

/**
 * 
 * @param {{
 * children: string,
 * onClick: React.MouseEventHandler<HTMLButtonElement>
 * }} param0 
 * @returns 
 */
function MUIButton({ children, onClick }) {
  if (typeof children !== "string") {
    throw new Error("MUIButton must be instantiated with only text inside!");
  }
  return <span onClick={onClick} className="material-symbols-outlined settings-page-ctrl-btn">{children}</span>
}


