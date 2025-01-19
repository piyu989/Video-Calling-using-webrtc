import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

const LobbyScreen = () => {

    const [email,setEmail] = useState('');
    const [code,setCode] = useState('');

    const navigate = useNavigate();

    const handleJoinRoom = useCallback((data) => {
        const {email,code} = data;
        navigate(`/room/${code}`)
    },[navigate]);  

    const socket = useSocket();

    useEffect(() => {
        socket.on('room:join',handleJoinRoom);
        return() => {
            socket.off('room:join',handleJoinRoom)
        };
    },[socket,handleJoinRoom]);  

    const hanldeFormSubmit = useCallback((e) => {
        e.preventDefault();
        socket.emit('room:join', { email,code } );
    },[email,code,socket]);

    return(
        <div>
            <h1>Welcome to lobby screen</h1>
            <form onSubmit={hanldeFormSubmit} >
                <label htmlFor="email">enter your email</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                <br/>
                <label htmlFor="code">enter code</label>
                <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
                <br/>
                <button>submit</button>
            </form>
        </div>
    )
};

export default LobbyScreen;