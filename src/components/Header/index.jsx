import React, { useEffect } from 'react'
import "./style.css"
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import userSvg from "../../assets/user.svg"
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);

  function logoutFnc() {
    try {
      signOut(auth)
        .then(() => {
          navigate("/");
          toast.success("Logged out successfully");
        })
        .catch((error) => {
          toast.error(error.message);
        })
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <div className='navbar'>
      <p className='logo'> SpendWise..</p>
      {user && (
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.7rem",cursor:"pointer" }}>
          <img
            src={user.photoURL ? user.photoURL : userSvg}
            style={{borderRadius:"50%",width:"1.7rem",height:"1.7rem"}}
          />
        <p className="logo-link" onClick={logoutFnc}>
            Logout</p>
        </div>
      )}
    </div>
  )
}

export default Header
