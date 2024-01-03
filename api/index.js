const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const User = require('./models/User');
const Post = require('./models/Post');
const multer = require('multer');
const fs = require('fs');

const app = express();
const salt = bcrypt.genSaltSync(10)
const saltRounds = 10;
const secret = 'sdlfhipweur9843reijhfi3q4894yhdkpe9t8y8943q'; 

const uploadMiddleware = multer({dest: 'uploads/'});

app.listen(4000, (err) => {
    if(err) {
        console.log(err);
        return;
    }
    
    console.log('App is running on port 4000');
});

mongoose.connect('mongodb://localhost:27017/')

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

app.get('/test', (req, res) => {
    res.send('test ok');
})

app.post('/register', async (req, res) => {
    let {username, password} = req.body;
    console.log(bcrypt.hashSync(password, saltRounds));

    try {
        const UserDoc = await User.create({
            username, 
            password: bcrypt.hashSync(password, saltRounds)
        });   
        res.send(UserDoc);
    }
    catch(e) {
        res.status(400).json(e);
    }
})

app.post('/login', async (req, res) => {
    let {username, password} = req.body;
    let userDoc = await User.findOne({username});
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if(passOk) {
        // login
        jwt.sign({username, id: userDoc._id}, secret, {}, (err, token) => {
            if(err) throw err;
            res.cookie('token', token).json({
                id: userDoc._id,
                username
            })
        })
    }
    else {
        res.status(400).json('Wrong Credentials')
    }
})

app.get('/profile', (req, res) => {
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, (err, info) => {
        if(err) throw err;
        res.json(info)
    })
})

app.post('/logout', (req, res) => {
    res.cookie('token', '').json('ok')
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
    
    const {title, summary, content} = req.body;

    const {originalname, path} = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;
        
        const postDoc = await Post.create({
            title,
            summary,
            content,
            cover: newPath,
            author: info.id,
        });
    
        res.json(postDoc);
    })
    
})

app.get('/post', async (req, res) => {
    const posts = await Post.find()
                            .populate('author', ['username'])
                            .sort({createdAt: -1})
                            .limit(20);

    return res.json(posts);
})

app.get('/post/:id', async (req, res) => {
    const {id} = req.params;
    const post = await Post.findOne({_id: id}).populate('author', ['username']);
    res.json(post);
})