import React, {Component, SyntheticEvent} from 'react';
import axios from 'axios';
import {Redirect} from 'react-router-dom';
import app from '../firebase';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

class Register extends Component {
    firstName = '';
    lastName = '';
    email = '';
    password = '';
    passwordConfirm = '';
    state = {
        redirect: false
    };


    submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        await axios.post('register', {
            first_name: this.firstName,
            last_name: this.lastName,
            email: this.email,
            password: this.password,
            password_confirm: this.passwordConfirm
        });

        this.setState({
            redirect: true
        });
    }

    registerExternal = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
    
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
    
            if (user) {
                await axios.post('/register/extern', {
                    first_name: user.displayName?.split(' ')[0],
                    last_name: user.displayName?.split(' ')[1],
                    email: user.email,
                    firebase_uid: user.uid,
                });
    
                this.setState({ redirect: true });
            }
        } catch (error) {
            this.setState({ error: 'Error en la autenticación externa. Inténtalo de nuevo.' });
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/login'}/>;
        }

        return (
            <main className="form-signin">
                <form onSubmit={this.submit}>
                    <h1 className="h3 mb-3 fw-normal">Please register</h1>

                    <div className="form-floating">
                        <input className="form-control" placeholder="First Name" required
                               onChange={e => this.firstName = e.target.value}
                        />
                        <label>First Name</label>
                    </div>

                    <div className="form-floating">
                        <input className="form-control" placeholder="Last Name" required
                               onChange={e => this.lastName = e.target.value}
                        />
                        <label>Last Name</label>
                    </div>

                    <div className="form-floating">
                        <input type="email" className="form-control" placeholder="name@example.com" required
                               onChange={e => this.email = e.target.value}
                        />
                        <label>Email address</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" minLength={8} placeholder="Password" required
                               onChange={e => this.password = e.target.value}
                        />
                        <label>Password</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" minLength={8} placeholder="Password Confirm" required
                               onChange={e => this.passwordConfirm = e.target.value}
                        />
                        <label>Password Confirm</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
                    
                    <button 
                        type="button" 
                        className="w-100 btn btn-lg btn-secondary mt-2" 
                        onClick={this.registerExternal}
                    >
                        Register with Google
                    </button>
                </form>
            </main>
        );
    }
}

export default Register;
