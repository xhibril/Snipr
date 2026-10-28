import Auth from "../../components/auth/Auth";

export default function Login({notify, setAuth}) {
    return (
        <Auth mode = {"LOGIN"} notify = {notify} setAuth={setAuth}/>
    );
}