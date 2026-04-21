import { useState } from 'react'
import './App.css'
import Landing from './pages/landing/Landing'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>


<BrowserRouter>
<Routes>
<Route path = "/" element={<Landing/>}></Route>
</Routes>
</BrowserRouter>





     </>
     
  )
}

export default App
