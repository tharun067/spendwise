import { doc, getDoc, setDoc } from '@firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,signInWithPopup,GithubAuthProvider,FacebookAuthProvider } from "firebase/auth";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { auth, db, provider, providerFacebook,providerGithub } from '../../firebase';
import Button from '../Button';
import Input from '../Input';
import "./style.css";
import LoginButton from '../LoginButton';

function SignupSignin() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    const regex = new RegExp("/^(?=.*[A-Za-z])(?=.*\d).{8,}$/");
    //Authenticate the user or signup
    if (name != "" && email != "" && password != "" && confirmPassword != "") {
      if (!regex.test(password)) {
        if (password == confirmPassword) {
          createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
              const user = userCredential.user;
              toast.success("User Created!")
              setLoading(false);
              setName("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              createUserDoc(user)
              navigate("/dashboard");
              //create a doc with user id as the following id
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              toast.error(errorMessage)
              setLoading(false);
            })
        } else {
          toast.error("password and confirm password don't match!");
          setLoading(false);
        }
      } else {
        toast.error("Password Should Contain a uppercase,lowercase,symbols & digits")
        setLoading(false);
      }
    } else {
      toast.error("All Fields are mandatory!");
      setLoading(false);
    }
  }
  function loginWithEmail() {
    setLoading(true)
    if (email != "" && password != "") {
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      // Signed in
        const user = userCredential.user;
        toast.success("User Logged In");
        navigate("/dashboard");
        setLoading(false);
        // ...
      })
      .catch((error) => {
      const errorCode = error.code;
        const errorMessage = error.message;
        toast.error(errorMessage);
        setLoading(false);
      });
    } else {
      toast.error("All fields must be filled!")
    }
  }
  async function signInWithGoogle() {
    //login using google
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserDoc(user);
      toast.success("User Authenticated Successfully!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
      console.error("Error signing in with Google: ", error.message);
    }
  }
  async function signInWithFacebook() {
    setLoading(true);
    try {
      const resultFacebook = await signInWithPopup(auth, providerFacebook);
      const credential = FacebookAuthProvider.credentialFromResult(resultFacebook);
      const accessToken = credential.accessToken;
      const userFacebook = resultFacebook.userFacebook;
      await createUserDoc(userFacebook);
      toast.success("User Authenticated Successfully!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }
  async function signInWithGithub() {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, providerGithub);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      await createUserDoc(user);
      toast.success("User Authenticated Successfully!");
      setLoading(false);
      navigate("/dashboard");
    } catch (error) {
      setLoading(false);
      toast.error(error.message);
    }
  }
  async function createUserDoc(user) {
    setLoading(true);
    //create document
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = new Date();

      try {
        await setDoc(userRef, {
          name: displayName ? displayName : name,
          email,
          photoURL: photoURL ? photoURL : "",
          createdAt,
        });
        toast.success("Doc Created!");
        setLoading(false);
      } catch (error) {
        toast.error(error.message);
        console.error("Error creating user document: ", error);
        setLoading(false);
      }
    }
  }
  return (
    <>
      {loginForm ? (<div className='signup-wrapper'>
        <h2 className='title'>Log IN <span style={{ color: "var(--theme)" }}>SpendWise..</span></h2>
        <form>
          <Input
            type="email"
            label={"Email"}
            state={email}
            setState={setEmail}
            placeholder={"John@email.com"}
          />
          <Input
            type="password"
            label={"Password"}
            state={password}
            setState={setPassword}
            placeholder={"Example@123456"}
          />
          <Button
            disabled={loading}
            text={loading ? "loading.." : "Login"}
            onClick={loginWithEmail}
          />
          <p className='p-login'>or</p>
          <div className='signin-Popups'>
              <LoginButton onClick={signInWithGoogle} icon ="/google.svg"/>
              <LoginButton onClick={signInWithFacebook} icon='/facebook.svg' />
              <LoginButton onClick={signInWithGithub} icon='/github.svg'/>
            </div>
          <p className='p-login' onClick={() => setLoginForm(!loginForm)}>Don't have an account? Click here</p>
        </form>
      </div>)
        : (<div className='signup-wrapper'>
          <h2 className='title'>Sign up on <span style={{ color: "var(--theme)" }}>SpendWise..</span></h2>
          <form>
            <Input
              label={"Full Name"}
              state={name}
              setState={setName}
              placeholder={"John"}
            />
            <Input
              type="email"
              label={"Email"}
              state={email}
              setState={setEmail}
              placeholder={"John@email.com"}
            />
            <Input
              type="password"
              label={"Password"}
              state={password}
              setState={setPassword}
              placeholder={"Example@123456"}
            />
            <Input
              type="password"
              label={"Confirm Password"}
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder={"Example@123456"}
            />
            <Button
              disabled={loading}
              text={loading ? "loading.." : "Signup"}
              onClick={signupWithEmail} />
            <p className='p-login'>or</p>
            <div className='signin-Popups'>
              <LoginButton onClick={signInWithGoogle} icon ="/google.svg"/>
              <LoginButton onClick={signInWithFacebook} icon='/facebook.svg' />
              <LoginButton onClick={signInWithGithub} icon='/github.svg'/>
            </div>
            <p className='p-login' onClick={() => setLoginForm(!loginForm)}>Already have an account? Click here</p>
          </form>
        </div>)}
    </>
  );
}
export default SignupSignin;
