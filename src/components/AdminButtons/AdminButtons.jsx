import "./AdminButtons.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { deleteArticle } from "../../api"

export default function AdminButtons({ id, editing, editCallback, saveCallback, cancelCallback }) {
  const [deleteStage, setDeleteStage] = useState(0)
  const navigate = useNavigate()
  let dog = false

  function handleDelete() {
    //TODO: figure out why dog doesn't work
    //TODO: probably swap with useState or something
    if (dog) return

    if (deleteStage != 2) {
      setDeleteStage(deleteStage + 1)
      dog = true; setTimeout(() => { dog = false }, 3000)
      return
    }
    
    //we use .then because it deletes slower than it navigates
    deleteArticle(id).then(()=>{navigate("/")})
  }

  return <div className="adminbuttons">
      {editing ? <div style={{display: "flex", marginBottom: "10px"}}>
        <CircleButton color="red" callback={cancelCallback}/>
        <div className={"buttonstatecontainer center-content"}>
          <div className="buttontext">Cancel</div>
        </div>
      </div> : null}
      <div style={{display: "flex", marginBottom: "10px"}}>
        <CircleButton color={editing ? "red" : "green"}
          callback={ editing ? saveCallback : editCallback}/>
        <div className={"buttonstatecontainer center-content"}>
          <div className="buttontext" style={{ opacity: !editing|0 }}>Edit</div>
          <div className="buttontext" style={{ opacity: editing|0 }}>Save</div>
        </div>
      </div>
      <div style={{display: "flex"}}>
        <CircleButton color={(["red", "green", "blue"])[deleteStage]} callback={handleDelete}/>
        <div className={"buttonstatecontainer center-content"}>
          <div className="buttontext" style={{ opacity: (deleteStage == 0)|0 }}>Delete</div>
          <div className="buttontext" style={{ opacity: (deleteStage == 1)|0 }}>Are you sure?</div>
          <div className="buttontext" style={{ opacity: (deleteStage == 2)|0 }}>You're really really sure??</div>
        </div>
      </div>
    </div>
}

function CircleButton({ icon, callback, color }) {
  return <div className="circlebutton" onClick={callback} style={{background: color}}>
      <img src={icon}/>
    </div>
}