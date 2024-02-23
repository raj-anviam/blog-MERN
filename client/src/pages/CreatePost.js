import { useState } from "react";
import 'react-quill/dist/quill.snow.css';
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux'
import { createPost } from "../features/post/postSlice";

export default function CreatePost() {

    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);
    const dispatch = useDispatch();

    async function createNewPost(ev) {
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('file', files[0]);
        
        ev.preventDefault();
        
        const response = await dispatch(createPost(data));
        console.log(response.payload.status);
        
        // const response = await axios.post('http://localhost:4000/post', data);

        if(response.payload.status == 200) {
            setRedirect(true);
        }

    }
    
    if(redirect) {
        return <Navigate to={'/'} />
    }
    
    return (
        <form onSubmit={createNewPost} encType="multipart/form-data" >
            <input type="title" 
                placeholder={"Title"} 
                onChange={ev => setTitle(ev.target.value)} 
            />
            <input type="summary" 
                placeholder={"Summary"} 
                onChange={ev => setSummary(ev.target.value)} 
            />
            <input type="file" 
                onChange={ev => setFiles(ev.target.files)} 
            />

            <Editor value={content} onChange={setContent} />
            <button style={{ marginTop: '5px' }}>Create post</button>
        </form>
    )
}