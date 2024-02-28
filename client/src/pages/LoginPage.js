import { useContext, useState } from "react"
import { Navigate } from "react-router-dom"
// import { UserContext } from "../UserContext";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";
// import axios from "axios";

export default function LoginPage() {
    let [username, setUsername] = useState('');
    let [password, setPassword] = useState('');
    let [redirect, setRedirect] = useState(false);
    // const {setUserInfo} = useContext(UserContext);
    const dispatch = useDispatch();

    async function submitHandler(ev) {
        ev.preventDefault();

        // const response = await axios.post('login', {username, password})
        const response = await dispatch(login({username, password}))

        if(response.payload.status == 200) {
            // dispatch(userInfo)
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
        <form className="login" onSubmit={submitHandler}>
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