import { useEffect, useState } from "react";
import Post from "../components/Post";
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from "../features/post/postSlice";
import Loader from "../components/Loader";
// import axios from "axios";

export default function IndexPage() {

    // const [posts, setPosts] = useState([]);
    const posts = useSelector(state => state.post.posts);
    const loading = useSelector(state => state.loading);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchPosts())
        // axios.get('post').then(posts => {
        //     setPosts(posts.data);
        // })

        // setPosts(posts.data);
        
    }, [dispatch])
    
    return (
        <>
            {false && <Loader />}

            {posts?.length > 0 && posts.map(post => (
                <Post {...post} key={post._id} />
            ))}
        </>
    )
}