import { useState, useEffect } from "react";
import { getSettings, setSettings} from "../../api"

export default function Settings() {
  
  const [settings, set] = useState({})

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
      <InputAndLabel label="clicks_coef" propname="coefficient" settings={settings} set={set}/>
      <InputAndLabel label="clicks_exp" propname="exponent" settings={settings} set={set}/>
      <h2></h2>
      <InputAndLabel label="decay_coef" propname="coefficient" settings={settings} set={set}/>
      <InputAndLabel label="decay_exp" propname="exponent" settings={settings} set={set}/>
      <InputAndLabel label="decay_rate" propname="rate" settings={settings} set={set}/>
      <h2></h2>
      <InputAndLabel label="age_coef" propname="coefficient" settings={settings} set={set}/>
      <InputAndLabel label="age_exp" propname="exponent" settings={settings} set={set}/>
    
      <h2>allowed emails</h2>
      { settings.allowed_emails.map(email => <div>{email}</div>)}

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
      <input onChange={onChange}/>
      <label>{label}</label>
    </div>
}

