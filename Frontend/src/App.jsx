import { useState } from 'react'
import './App.css'
import Landing from './pages/landing/Landing.jsx'
import Login from "./pages/auth/login/Login.jsx"
import Signup from './pages/auth/signup/SignUp.jsx'
import Notification from './components/ui/Notification.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Default from './components/layout/Default.jsx'
import { useRef, useEffect } from 'react'
import VerifyEmail from './pages/auth/verify/VerifyEmail.jsx'
import AuthGate from "./components/layout/AuthGate.jsx"
import Dashboard from './pages/dashboard/Dashboard.jsx'

function App() {

  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)
  const [id, setId] = useState(null)
  const [isAuth, setIsAuth] = useState(null)

  let messageTimeout = useRef(null);

  function notify(message, type) {

    if (messageTimeout.current !== null) {
      clearTimeout(messageTimeout.current);
    }

    setMessage(message);
    setType(type);
    setId(Date.now())

    messageTimeout.current = setTimeout(() => {
      setMessage(null);
      messageTimeout.current = null;
    }, 3000)
  }

  
    useEffect(() => {
        checkAuth();
        async function checkAuth() {
            try {
                const res = await fetch("http://localhost:8080/api/auth/status", {
                    method: "POST",
                    credentials: "include"
                })

                const data = await res.json();
                console.log("DATA: " + data)

                setIsAuth(data);
            } catch (err) {
                setIsAuth(false);
            }
        }

    }, [])

  return (
    <>

      <Notification message={message} type={type} key={id} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>


          <Route element={<Default />}>
            <Route element={<AuthGate isAuth={isAuth} />}>

              <Route path="/login" element={<Login notify={notify} setIsAuth = {setIsAuth} />}></Route>
              <Route path="/signup" element={<Signup notify={notify} />}></Route>
              <Route path="/verify/email" element={<VerifyEmail notify={notify} />}></Route>
              <Route path = "/dashboard" element={<Dashboard notify = {notify}/>}></Route>

            </Route>
          </Route>

        </Routes>
      </BrowserRouter>





    </>

  )
}

export default App
