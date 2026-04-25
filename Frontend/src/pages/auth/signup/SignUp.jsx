import Auth from "../../../components/auth/Auth";

export default function Signup({notify, setIsAuth}) {
    return (
        <Auth mode = {"SIGNUP"} notify = {notify} setIsAuth={setIsAuth}/>
    );
}