import Auth from "../../components/auth/Auth";

export default function Signup({notify, setAuth}) {
    return (
        <Auth mode = {"SIGNUP"} notify = {notify} setAuth={setAuth}/>
    );
}