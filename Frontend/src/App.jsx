import { useState } from 'react'
import './App.css'
import Landing from './pages/landing/Landing.jsx'
import Login from "./pages/auth/login/Login.jsx"
import Signup from './pages/auth/signup/SignUp.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>


<BrowserRouter>
<Routes>
<Route path = "/" element={<Landing/>}></Route>
<Route path = "/login" element= {<Login/>}></Route>
<Route path = "/signup" element= {<Signup/>}></Route>
</Routes>
</BrowserRouter>





     </>
     
  )
}

export default App
