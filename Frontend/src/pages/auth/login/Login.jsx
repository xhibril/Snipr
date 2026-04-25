import Auth from "../../../components/auth/Auth";

export default function Login({notify, setIsAuth}) {
    return (
        <Auth mode = {"LOGIN"} notify = {notify} setIsAuth={setIsAuth}/>
    );
}