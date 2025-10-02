import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db  from '../db.js';


const router = express.Router();

// In authRoute.js - update your register route:
router.post('/register', (req, res) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);

        // Use .prepare() and .run() instead of .query()
        const insertUser = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
        const result = insertUser.run([req.body.username, hashedPassword]);
        
        // Get the last inserted ID - for DatabaseSync it's result.lastInsertRowid
        const userId = result.lastInsertRowid;

        // Add their todo list
        const defaultTodos = 'Welcome to your todo list!';
        const insertTodo = db.prepare('INSERT INTO todos (user_id, task) VALUES (?, ?)');
        insertTodo.run([userId, defaultTodos]);

        // Create a JWT token
        const token = jwt.sign({ id: userId }, 'secretkey', { expiresIn: 86400 });
        console.log(hashedPassword);
        res.json({ auth: true, token: token });
    } catch(err) {
        console.error(err);
        res.sendStatus(503);
    }   
});


router.post('/login', (req, res) => {
    // get username and password from req.body and
    // check if user exists in db
    // if user exists, compare password with hashed password in db
    // if password matches, create a JWT token and send it to the client
    // if user does not exist or password does not match, send 401 status
    const { username, password } = req.body;
    try {   
        const getUser = db.prepare('SELECT * FROM users WHERE username = ?');
        const user = getUser.get([username]);
        if (!user) {
            return res.status(404).send("user not found");
        }
        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send("invalid password");
        }
        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: 86400 });
        res.json({ auth: true, token: token });
    }catch(err) {
        console.error(err);
        res.sendStatus(503);
    }
});

export default router;