import React, { useState,useCallback } from 'react';

const LobbyScreen = () => {
    const [email,setEmail] = useState('')
    const [code,setCode] = useState('')

    const handleSubmitForm = useCallback((e) => {
        e.preventDefault();
        console.log({email,code});
    },[email,code]);

    return (
        <div>
            <h1>Lobby Screen</h1>
            <form onSubmit={handleSubmitForm}>
                <label htmlFor='email'>Email</label>
                <input type='text' id='email' value={email} onChange={e => setEmail(e.target.value)} />
                <br/>
                <label htmlFor='code'>Room Code</label>
                <input type='text' id='code' value={code} onChange={e => setCode(e.target.value)}/>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default LobbyScreen;