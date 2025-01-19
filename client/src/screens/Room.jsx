import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from 'react-player';
import Peer from "../service/Peer";

const RoomPage = () => {

    const socket = useSocket();
    const [remoteSocketId,setRemoteSocketId] = useState(null);
    const [myStream,setMyStream] = useState();
    const [remoteStream,setRemoteStream] = useState();

    const handleUserJoined = useCallback(({email,id}) =>{
        console.log(`email ${email} joined the room`);
        setRemoteSocketId(id);
    },[]);

    const handleIncomingCall = useCallback(async ({from,offer}) => {
        console.log('incoming call',from,offer);
        setRemoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio:true,
            video:true,
        });
        setMyStream(stream);
        const ans = await Peer.getAnswer(offer);
        socket.emit('call:accepted', {to:from, ans});
    },[socket]);

    const handleCallAccepted = useCallback(({ from,ans }) => {
        Peer.setLocalDescription(ans);
        console.log('call accepeted');
        for (const track of myStream.getTracks()) {
            Peer.peer.addTrack(track, myStream);
        }
    },[myStream]);

    useEffect(() => {
        Peer.peer.addEventListener('track',async ev => {
            const remoteStream = ev.streams;
            setRemoteStream(remoteStream);
        })
    })

    useEffect(() => {
        socket.on('user:joined',handleUserJoined);
        socket.on('incoming:call', handleIncomingCall);
        socket.on("call:accepted", handleCallAccepted);

        return () => {
            socket.off('user:joined',handleUserJoined);
            socket.off('incoming:call', handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
        }
    },[socket,handleUserJoined,handleIncomingCall]);
 
    const handleCallUser = useCallback(async ()=>{
        const stream = await navigator.mediaDevices.getUserMedia({ 
            audio:true,
            video:true,
        });
        const offer = await Peer.getOffer();
        socket.emit("user:call",{ to:remoteSocketId, offer });
        setMyStream(stream);
    },[remoteSocketId,socket]);

    return(
        <>
            <h1>this is our room page</h1>
            <h2>{remoteSocketId ? 'connected':'not connected'}</h2>
            { remoteSocketId && <button onClick={handleCallUser}>call</button> }
            {
                myStream && 
                <>
                <h1>My Stream</h1>
                <ReactPlayer playing muted height="100px" width='200px' url={ myStream  } />
                </>
            }
            <br/>
            {
                remoteStream && 
                <>
                <h1>Remote Stream</h1>
                <ReactPlayer playing muted height="100px" width='200px' url={ remoteStream  } />
                </>
            }
        </>
    )
}

export default RoomPage;