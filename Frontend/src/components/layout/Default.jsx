import Notification from "../ui/Notification"
import { Outlet } from "react-router-dom";
export default function Default(){
    return (
        <>
        <Notification/>
          <Outlet /> 
          </>
    )
}









