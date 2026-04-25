import { useNavigate } from "react-router-dom";

export default async function ApiFetch(url, options = {}, notify, nav){

    const res = await fetch(`http://localhost:8080${url}`, {
        credentials: "include",
        ...options
    });


    if(res.status === 401){
        window.location.href = "/login";
        return null;
    }
    
    if(res.status === 403){
        nav("/verify/email")
        return null;
    }

        if (res.status == 429) {
        notify("Too many requests. Please try again later", "ERROR");
        return null;
    }


    return res;





}