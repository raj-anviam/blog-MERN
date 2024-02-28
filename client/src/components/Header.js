import { useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { logout, profile } from "../features/auth/authSlice";

export default function Header() {

    const userInfo = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(profile());
    }, [])

    function logoutHandler() {
        dispatch(logout());
    }

    const username = userInfo?.username;
    
    return (
        <header>
            <Link to='' className='logo'>MyBlog</Link>
            <nav>
                {username && (
                    <>
                        <Link to='/create'>Create New Article</Link>
                        <a onClick={logoutHandler}>Logout</a>
                    </>
                )}
                {!username && (
                    <>
                        <Link to='/login'>Login</Link>
                        <Link to='/register'>Register</Link>
                    </>  
                )}
            </nav>
      </header>
    )
}