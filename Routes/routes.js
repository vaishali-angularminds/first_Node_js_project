const express = require('express');
const router = express.Router()

const userController = require('../Controller/userController')

router.route('/')    
    // .post(userController.postUser)
    .get(userController.getUsers);

// app.get('/',userController.getUsers)
// app.post('/',userController.postUser) 
    module.exports = router;

