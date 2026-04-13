import { createInvitationLink } from "../services/api";
// import { socket } from "../pages/Card";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "@mui/material";
import { socket } from "../pages/Card";
import { useUser } from "../context/userContext"

type roomType = {
    url: string,
    roomId: string
}

const PopUp = ({ message, joinRoom, share, room }: {
    message: string,
    joinRoom: () => void,
    share: (share: boolean) => void,
    room: Dispatch<SetStateAction<string>>;
}) => {
      const {
        roomIdData,
        setRoomId,
        user,
        setUser
    } = useUser();
    const [session, setSession] = useState(false);
    const [roomData, setRoomData] = useState<roomType>()
    useEffect(() => {
        const eventName =
            typeof roomData === "string"
                ? roomData
                : roomData?.roomId;

                console.log("eventt",eventName)
        if (!eventName) return;

        const handler = (data: any) => {
            console.log("all socket data", data);

            if (data.length > 1) {
                setSession(true);
            }
        };

        socket.on(eventName, handler);
        room(eventName);
        console.log("room id", eventName);

        // return () => {
        //     socket.off(eventName, handler);
        // };
    }, [roomData]);

    
    async function shareLink() {
        try {
            const res = await createInvitationLink();
            console.log("the link", res.data)
            setRoomData({
                url: res.data.url,
                roomId: res.data.roomId
            })
            const invitationURL = new URL(res.data.url).search.substring(3);

            console.log("link---->",res.data.roomId)
            console.log("Invitation LINK", invitationURL);
            socket.emit("join_room", res.data.roomId);
            console.log("room Id data",roomIdData);
            room(res.data.roomId);
            localStorage.setItem("roomId",res.data.roomId);
            await navigator.clipboard.writeText(res.data.url);
            console.log("Copied successfully");
            alert("Copied");

        } catch (error) {
            console.log("error", error)
        }
        // joinRoom();
    }

    async function closeSession() {
        socket.emit("close_room", "69c29985868ec46df5f63455");
    }
    return (
        <>
            <div style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                zIndex: "10",
                height: "300px",
                width: "500px",
                backgroundColor: "white",
                // displa
            }}>
                {/* {message} */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    // alignContent:"center",
                    // alignItems:"center",
                    padding: "10px 10px",
                    textAlign: "center"
                }}>

                    <h1>
                        Live collaboration

                    </h1>
                    <p>

                        Invite people to collaborate on your drawing.
                    </p>
                    <p>

                        Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.
                    </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>

                    <button onClick={() => share(false)}>Cancel</button>
                    <button onClick={shareLink}>Share</button>

                    {session && <button onClick={closeSession}>Close session</button>}
                </div>


            </div>
        </>
    )
}

export default PopUp