import React, {SyntheticEvent, useState} from 'react';
import '../Login.css';
import axios from 'axios';
import {Redirect} from "react-router-dom";
import app from '../firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        await axios.post('/login', {
            email,
            password
        });

        setRedirect(true);
    }

    const loginExternal = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);

        try {
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user?.getIdToken();
            
            // Enviar el idToken al backend para autenticarlo
            await axios.post('/loginExternal', {
                idToken: idToken
            });
    
            setRedirect(true);
        } catch (error) {
            console.error('Error logging in with Google:', error);
        }
    };

    if (redirect) {
        return <Redirect to={'/'}/>;
    }
    

    return (
        <main className="form-signin">
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                           onChange={e => setEmail(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                           onChange={e => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
                <button className="w-100 btn btn-lg btn-secondary mt-3" type="button" onClick={loginExternal}>
                    Sign in with Google
                </button>
            </form>
        </main>
    );
};

export default Login;
