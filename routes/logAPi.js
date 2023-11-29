const express = require('express')
const logAPi = express.Router()
const bcrypt = require('bcryptjs')
require('dotenv').config()
const userRegister = require('../schema/userSchema.js')
const JWT = require('jsonwebtoken')

const secretKey = process.env.KEY
logAPi.post('/loginInfo', async(req, res) =>{
    console.log('Node Data Login', req.body)
    const {email, password} = req.body
    try {
          const userExits = await userRegister.findOne({ email : email }).exec()
           
         if(userExits){
            const checkPassword = await bcrypt.compare(password, userExits.password)
             if(checkPassword){
                            //Create a JWT Token
                const jwtToken = JWT.sign({email,password}, secretKey,{expiresIn :'1h'} )            
                res.send({message: 'Login Succesful', token: jwtToken, data:userExits})
             } else{
                res.status(500).send({message: 'Invalid email/password'})  
             }

             } else{
             res.status(500).send({message: 'Invalid email/password'})
         }
    } catch (error) {
     console.warn(error)
     res.status(400).send({message: 'Internal Server Error' })
    }

})

module.exports = logAPi