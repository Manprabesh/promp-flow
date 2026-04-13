import { createContext, useContext, useState } from "react";

type UserContextType = {
    roomIdData: string;
    setRoomId: React.Dispatch<React.SetStateAction<string>>;
    user: string;
    setUser: React.Dispatch<React.SetStateAction<string>>;
};

export const UserContext =
    createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [roomIdData, setRoomId] = useState("");
    const [user, setUser] = useState("");
    return (
        <UserContext.Provider
            value={
                {
                    roomIdData,
                    setRoomId,
                    user,
                    setUser,
                }
            }
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error("useUser must be used inside UserProvider");
    }

    return context;
};