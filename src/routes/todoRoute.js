import express from 'express';
import db from '../db.js';


const router = express.Router();

// get all todos for logged user
router.get('/todos', async (req, res) => {

});

// create a new todo for logged user
router.post('/', async (req, res) => {

});

router.put('/:id', async (req, res) => {

});

router.delete('/:id', async (req, res) => {

});

export default router;