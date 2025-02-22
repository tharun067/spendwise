import React from 'react'

function LoginButton({text,onClick,icon}) {
    return (
        <div
            onClick={onClick}
        >
            {icon && <img src={icon} style={{width:"20px", height:"20px", borderRadius:"80%", cursor:"pointer"}} />}
        </div>
    );
}

export default LoginButton
