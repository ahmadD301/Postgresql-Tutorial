import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db  from '../db.js';
import { use } from 'react';

const router = express.Router();
router.post('/register', (req, res) => {
    const {username , password} = req.body;
    console.log(username,password);
    res.sendStatus(201);
});

router.post('/login', (req, res) => {


});
export default router;