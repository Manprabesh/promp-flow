import { Outlet } from "react-router-dom"
import Layout from "./layout"
import { useEffect, useState } from "react"
import Signup from "../../pages/signup"
import { checkAuth } from "../../services/api"
import { useUser } from "../../context/userContext"
const ProtectedLayout = () => {
    const [logged, setLogged] = useState(false)
    const {
        roomIdData,
        setRoomId,
        user,
        setUser
    } = useUser();
    useEffect(() => {
        //backendAPI(get token)
        (async () => {
            const res = await checkAuth();
            console.log("checking loggin", res);
            if (res.success) {
                setUser(res.data);
                setLogged(true)
            }
        }
        )()
        console.log("user is logged in")
    }, [])
    return (
        <div>
            {
                logged ? <Outlet /> : <Signup />
            }
        </div>
    )
}

export default ProtectedLayout;