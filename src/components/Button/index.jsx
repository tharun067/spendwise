import React from 'react'
import "./style.css"
function Button({ text, onClick ,blue,disabled}) {
  return (
    <div className={blue ? "button button-blue" : "button"}
      onClick={onClick}
      disabled={disabled}>
      {text}
    </div>
  )
}

export default Button
