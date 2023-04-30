import BlogDisplay from "../BlogDisplay/BlogDisplay"
import BlogEditor from "../BlogEditor/BlogEditor"
import AdminButtons from "../AdminButtons/AdminButtons"
import { useParams } from "react-router-dom";
import { useState } from "react"

export default function BlogWrapper() {
  const { id } = useParams()
  const [editing, setEditing] = useState(false)
  return <>
    <AdminButtons id={id} editCallback={()=>setEditing(true)}/>
    <div style={{display: editing ? "none" : null}}><BlogDisplay id={id}/></div>
    <div style={{display: editing ? null : "none"}}><BlogEditor id={id}/></div>
</>
}
