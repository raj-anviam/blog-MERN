import React, { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
// import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { editPost } from "../features/post/postSlice";

export default function EditPostPage() {
    const { id } = useParams();
    const post = useSelector(state => state.post.currentPost);

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        if (post) {
            setTitle(post.title || '');
            setSummary(post.summary || '');
            setContent(post.content || '');
        }
    }, [post]);

    async function updatePost(event) {
        event.preventDefault();

        try {
            const data = new FormData();
            data.set('title', title);
            data.set('summary', summary);
            data.set('content', content);
            data.set('id', id);

            if (files?.[0]) {
                data.set('file', files[0]);
            }

            const response = await dispatch(editPost(data));

            if (response.payload.status === 200) {
                setRedirect(true);
            } 
        } catch (error) {
            console.error('Error updating post:', error);
        }
    }

    if (redirect) {
        return <Navigate to={`/post/${id}`} />;
    }

    return (
        <form onSubmit={updatePost}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
            />
            <input
                type="text"
                placeholder="Summary"
                value={summary}
                onChange={(ev) => setSummary(ev.target.value)}
            />
            <input type="file" onChange={(ev) => setFiles(ev.target.files)} />

            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '5px' }}>Update post</button>
        </form>
    );
}