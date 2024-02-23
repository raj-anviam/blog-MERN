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

mongoose.connect('mongodb://localhost:27017/', {
  useNewUrlParser: true, // Recommended for modern Node.js versions
  useUnifiedTopology: true, // Use the new MongoDB driver topology engine
})
  .then(() => {
    console.log('Connected to MongoDB database successfully!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB database:', err);

    // Handle different error scenarios:
    if (err.name === 'MongoNetworkError') {
      console.error('Network error occurred while connecting to MongoDB.');
    } else if (err.name === 'MongoError' && err.code === 18) {
      console.error('Mongo Server not available. Please check if the server is running.');
    } else if (err.name === 'MongooseServerSelectionError') {
      console.error('Error selecting a MongoDB server. Check connection string and server availability.');
    } else {
      console.error('Other connection errors:', err);
    }

    // Gracefully terminate the process or perform alternative actions
    process.exit(1); // Or handle the error differently as needed
  });

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

    if(!token) {
        res.status(401).json({error: 'Unauthenticated'})
    }
    
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

    // res.json(req.file)
    try {


        if (!req.file) {
            // Handle case where no file is uploaded
            return res.status(400).json({ error: 'No file uploaded.' });
        }
        
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
    }
    catch(err) {
        res.status(500).json(err)
    }
    
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
    const {id, title, summary, content} = req.body;

    let newPath = null;

    if(req.file) {   
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        newPath = path + '.' + ext;
        fs.renameSync(path, newPath);
    }

    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
        if(err) throw err;

        const postDoc = await Post.findById(id);

        const isAuthor = JSON.stringify(info.id) === JSON.stringify(postDoc.author);

        if(!isAuthor) {
            return res.status(400).json('You are not the author');
        }

        const filter = { _id: new mongoose.Types.ObjectId(postDoc._id) };

        const update = {
            $set: {
                title,
                summary,
                content,
                cover: newPath ? newPath : postDoc.cover,
            },
        };

        const result = await Post.updateOne(filter, update);

        const updatedPost = await Post.findById(id);
    
        res.json(updatedPost);
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

app.delete('/post/:id', async (req, res) => {

    const {token} = req.cookies;

    if(!token) {
        res.status(401).json({error: 'Unauthenticated'})
    }
    
    const {id} = req.params;
    const post = await Post.findOne({_id: id}).deleteOne();
    res.json({id});
})