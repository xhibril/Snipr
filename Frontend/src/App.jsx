import { useState } from 'react'
import './App.css'
import Landing from './pages/landing/Landing.jsx'
import Login from "./pages/auth/login/Login.jsx"
import Signup from './pages/auth/signup/SignUp.jsx'
import Notification from './components/ui/Notification.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Default from './components/layout/Default.jsx'
import { useRef } from 'react'
import VerifyEmail from './pages/auth/verify/VerifyEmail.jsx'

function App() {

  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)
  const [id, setId] = useState(null)
  let messageTimeout = useRef(null);

  function notify(message, type) {

    if (messageTimeout.current !== null) {
      clearTimeout(messageTimeout);
    }

    setMessage(message);
    setType(type);
    setId(Date.now())


    messageTimeout.current = setTimeout(()=> {
      setMessage(null);
      messageTimeout.current = null;
    }, 3000)


  }

  return (
    <>

<Notification message={message} type={type} key = {id}/>

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>


          <Route element={<Default />}>
            <Route path="/login" element={<Login notify={notify}/>}></Route>
            <Route path="/signup" element={<Signup notify={notify}/>}></Route>
            <Route path="/verify/email" element={<VerifyEmail notify={notify}/>}></Route>

          </Route>
        </Routes>
      </BrowserRouter>





    </>

  )
}

export default App
