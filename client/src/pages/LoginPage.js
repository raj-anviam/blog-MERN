import { useContext, useState } from "react"
import { Navigate } from "react-router-dom"
import { UserContext } from "../UserContext";
import axios from "axios";

export default function LoginPage() {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [redirect, setRedirect] = useState(false);
    const {setUserInfo} = useContext(UserContext);

    async function login(ev) {
        ev.preventDefault();

        const response = await axios.post('login', {username, password})

        if(response.status == 200) {
            setUserInfo(response.data)
            setRedirect(true);
        }
        else {
            alert('wrong credentials');
        }
    }

    if(redirect) {
        return <Navigate to={'/'} />
    }
    
    return (
        <form className="login" onSubmit={login}>
            <h1>Login</h1>
            <input type="text" 
                placeholder="username"
                value={username}
                onChange={ev => setUsername(ev.target.value)}
             />
            <input type="password" 
                placeholder="password"
                value={password}
                onChange={ev => setPassword(ev.target.value)}
            />
            <button>Login</button>
        </form>
    )
}