import global from "../../css/Global.module.css";
import ApiFetch from "../../components/utils/Api";

import { useState } from "react";
import {
  BrandHeader,
  UsernameField,
  PasswordField,
} from "../../components/ui/SmallComponents";
import { useNavigate } from "react-router-dom";

export default function UpdateUsername({notify, isAuth, setIsAuth}) {

    const [username, setUsername] = useState("")
    const [isCompleted, setIsCompleted] = useState(false)
    const [password, setPassword] = useState("")
    const nav = useNavigate();


    async function updateUsername(){

        if(username === isAuth?.user.username){
            notify("Username cannot be same as old", "ERROR");
            return;
        }

        const res = await ApiFetch("/account/profile", {
            method: "PATCH",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({username: username, password: password})
        }, notify, nav)


        const data = await res.json();

        if(!res?.ok){
            notify(data.message || "Something went wrong, please try again", "ERROR");
            return;
        }





setIsAuth((prev) => ({
    ...prev,
    user : {
        ...prev.user,
        username: username
    }
}));


        setIsCompleted(true);








    }




  return (
    <div className={global.mainContainer}>
      <form onSubmit={(e) => {
        updateUsername();
        e.preventDefault();
      }}
        className={`${global.inputContainer} ${global.glassyBackground}`}>


        <BrandHeader title = "Update username"/>

        <UsernameField title = "Username" username={username} setUsername={setUsername}/>

        <PasswordField title = "Password" password={password} setPassword={setPassword}/>


        {isCompleted ? (

            <button className={global.submit}
            
            
            onSubmit={(e) => nav("/dashboard", {replace:true})}> Back

            </button>



        ) : (

            
            <button className={global.submit}
            type ="submit"> Continue

            </button>




        )}

        

      </form>
    </div>
  );
}

