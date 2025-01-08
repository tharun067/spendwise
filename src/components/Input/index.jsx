import React from 'react'
import "./style.css"
function Input({label,state,setState,placeholder,type}) {
  return (
    <div className='input-wrapper'>
          <p className='input-label'>{label}</p>
          <input className='custom-input' type={type} placeholder={placeholder} value={state} onChange={(e) => setState(e.target.value)}/>
    </div>
  )
}

export default Input
