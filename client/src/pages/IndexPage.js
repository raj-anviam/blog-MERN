import { useEffect, useState } from "react";
import Post from "../components/Post";
import axios from "axios";

export default function IndexPage() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('post').then(posts => {
            setPosts(posts);
        })
    }, [])
    
    return (
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post} />
            ))}
        </>
    )
}