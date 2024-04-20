import { useState, useEffect } from "react";
import { getSettings, setSettings} from "../../api"

export default function Settings() {
  
  const [settings, set] = useState({
     clicks_coef: 0,
     clicks_exp: 0,
     decay_coef: 0,
     decay_exp: 0,
     decay_rate: 0,
     age_coef: 0,
     age_exp: 0,
     allowed_emails: []
   })

  useEffect(() => {
    getSettings().then(set)
  }, [])

  async function onClick() {
    await setSettings(settings)
    console.log("settings saved :D")
  }


  return <>
      <div>heuristic: {settings.clicks_coef}(clicks^{settings.clicks_exp})+{settings.decay_coef}(decayed clicks^{settings.decay_exp})+{settings.age_coef}^(-age*{settings.age_exp})</div>
      <div>click decay: (previous decay)*({settings.decay_rate}^days since last decay)</div>
      <h2>Clicks</h2>
      <InputAndLabel propname="clicks_coef" label="coefficient" settings={settings} set={set}/>
      <InputAndLabel propname="clicks_exp" label="exponent" settings={settings} set={set}/>
      <h2></h2>
      <InputAndLabel propname="decay_coef" label="coefficient" settings={settings} set={set}/>
      <InputAndLabel propname="decay_exp" label="exponent" settings={settings} set={set}/>
      <InputAndLabel propname="decay_rate" label="rate" settings={settings} set={set}/>
      <h2></h2>
      <InputAndLabel propname="age_coef" label="coefficient" settings={settings} set={set}/>
      <InputAndLabel propname="age_exp" label="exponent" settings={settings} set={set}/>
    
      <h2>allowed emails</h2>
      { settings.allowed_emails.map((email, i) => <div key={i}>{email}</div>) }

      <br/><button onClick={onClick}>save settings</button>

      <h1>Industries</h1>
      <h1>Categories</h1>
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

