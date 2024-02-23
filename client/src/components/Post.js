import {format} from 'date-fns';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux'
import { deletePost } from '../features/post/postSlice';
import { UserContext } from "../UserContext"
import { useContext } from 'react';

export default function Post({_id, title, summary, cover, content, createdAt, author}) {

    const dispatch = useDispatch();
    const {setUserInfo, userInfo} = useContext(UserContext);
    
    return (
        <div className='post'>
            <div className='image'>
                <Link to={`/post/${_id}`} >
                    <img src={'http://127.0.0.1:4000/' + cover}></img>
                </Link>
            </div>
            <div className='texts' >
                <Link to={`/post/${_id}`} >
                    <h2>{title}</h2>
                </Link>
                <p className='info'>
                    <a className='author'>{author && author.username}</a>
                    <time>{createdAt && format(new Date(createdAt), 'MMM d, yyyy, HH:mm')}</time>
                    {userInfo && userInfo.id === author._id &&

                        <button onClick={() => dispatch(deletePost(_id))} className='delete-btn'>Delete</button>
                    }
                </p>
                <p className='summary'>{summary.substring(0, 500)}</p>                
            </div>
        </div>
    )
}