import Auth from "../../../components/auth/Auth";

export default function Signup({notify}) {
    return (
        <Auth mode = {"SIGNUP"} notify = {notify}/>
    );
}