import React, { useEffect, useState } from 'react'
import "./style.css"
import { auth } from '../../firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import userSvg from "../../assets/user.svg"
function Header() {
  const [user, loading] = useAuthState(auth);
  const [toggleDropdown, setToggleDropDown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
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
      {user &&(
        <div
          style={{ display: "flex", alignItems: "center", gap: "0.7rem", cursor: "pointer" }}>
          <img
            src={user.photoURL ? user.photoURL : userSvg}
            style={{ borderRadius: "50%", width: "1.7rem", height: "1.7rem" }}
            onClick={()=>setIsOpen(!isOpen)}
          />
          {isOpen && (
            <div className='user-panel'>
              <p>Name: {user.displayName|| "Name Not Found"}</p>
              <p>Email: {user.email}</p>
              <p>User Id: {user.uid}</p>
              <button className="logo-link" onClick={logoutFnc}>Logout</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Header
