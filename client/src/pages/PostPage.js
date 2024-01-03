import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

export default function PostPage() {

    const {id} = useParams();
    const [post, setPost] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/post/${id}`)
            .then(response => response.json()
                .then(post => {
                    setPost(post)
                })
            )
    }, [])
    
    if(!post) return '';
    
    return (    
        <div className="post-page">
            <h1>{post.title}</h1>
            <time>{format(new Date(post.createdAt), 'MMM d, yyyy HH:mm')}</time>
            <div className="author">By @{post.author.username}</div>
            <div className="image">
                <img src={`http://localhost:4000/${post.cover}`} />
            </div>
            <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
    )
}