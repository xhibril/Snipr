import { useState } from "react";
import "./App.css";
import Landing from "./pages/landing/Landing.jsx";
import Login from "./pages/auth/login/Login.jsx";
import Signup from "./pages/auth/signup/SignUp.jsx";
import Notification from "./components/ui/Notification.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Default from "./components/layout/Default.jsx";
import { useRef, useEffect } from "react";
import VerifyEmail from "./pages/auth/verify/VerifyEmail.jsx";
import AuthGate from "./components/layout/AuthGate.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import PasswordReset from "./pages/auth/password-reset/PasswordReset.jsx";
import UpdateUsername from "./pages/account-settings/UpdateUsername.jsx";

function App() {
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
      }
    };

    window.addEventListener("keydown", handler);

    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [message, setMessage] = useState(null);
  const [type, setType] = useState(null);
  const [id, setId] = useState(null);

  const [isAuth, setIsAuth] = useState({
    authenticated: false,
    user: null,
  });

  let messageTimeout = useRef(null);

  function notify(message, type) {
    if (messageTimeout.current !== null) {
      clearTimeout(messageTimeout.current);
    }

    setMessage(message);
    setType(type);
    setId(Date.now());

    messageTimeout.current = setTimeout(() => {
      setMessage(null);
      messageTimeout.current = null;
    }, 3000);
  }

  useEffect(() => {
    checkAuth();
    async function checkAuth() {
      try {
        const res = await fetch("http://localhost:8080/api/auth/status", {
          method: "POST",
          credentials: "include",
        });

        const data = await res.json();
        setIsAuth({
          authenticated: data.isAuthenticated,
          user: data.user ?? null,
        });
      } catch (err) {
        setIsAuth({
          authenticated: false,
          user: null,
        });
      }
    }



  }, []);

  return (
    <>
      <Notification message={message} type={type} key={id} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />}></Route>

          <Route element={<Default />}>
            <Route element={<AuthGate isAuth={isAuth.authenticated} />}>
              <Route
                path="/login"
                element={<Login notify={notify} setIsAuth={setIsAuth} />}
              ></Route>
              <Route
                path="/signup"
                element={<Signup notify={notify} />}
              ></Route>
              <Route
                path="/password/reset"
                element={<PasswordReset notify={notify} />}
              />
              <Route
                path="/verify/email"
                element={<VerifyEmail notify={notify} />}
              ></Route>
              <Route
                path="/dashboard"
                element={<Dashboard notify={notify} setIsAuth = {setIsAuth} isAuth = {isAuth}/>}
              ></Route>


              <Route path = "/account/profile"
              element = {<UpdateUsername notify = {notify} isAuth = {isAuth} setIsAuth = {setIsAuth}/>}></Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
