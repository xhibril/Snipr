import Auth from "../../../components/auth/Auth";

export default function Login({notify}) {
    return (
        <Auth mode = {"LOGIN"} notify = {notify}/>
    );
}