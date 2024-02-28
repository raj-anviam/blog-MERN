import { useState } from "react"
import { useDispatch } from "react-redux";
import { register } from "../features/auth/authSlice";

export default function RegisterPage() {

    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');

    const dispatch = useDispatch();
    
    async function submitHandler(ev) {
        ev.preventDefault();

            // const response = await fetch('http://localhost:4000/register', {
            //     method: 'POST',
            //     body: JSON.stringify({username, password}),
            //     headers: {'Content-Type': 'application/json'}
            // });

        const response = await dispatch(register({username, password}))

        if(response.payload.status === 200) {
            alert('Registration success');
        }
        else {
            alert('Registration failed');
        }
    }
    
    return (
        <form className="register" onSubmit={submitHandler}>
            <h1>Register</h1>
            <input type="text" placeholder="username" value={username} onChange={ev => setUsername(ev.target.value)} />
            <input type="password" placeholder="password" value={password} onChange={ev => setPassword(ev.target.value)} />
            <button>Register</button>
        </form>
    )
}