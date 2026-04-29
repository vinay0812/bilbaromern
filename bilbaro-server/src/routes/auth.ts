import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'


const router = express.Router()

// register

router.post('/register', async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 12)

        // create user
        const user = await User.create({
            name, email, password: hashedPassword
        })

        // create jwt
        const token = jwt.sign(
            {userId: user._id , role: user.role},
            process.env.JWT_SECRET!,
            {expiresIn:'7d'}
        )

        res.status(201).json({token, user:{id:user._id , name:user.name , email:user.email}})


    } catch (error) {
        res.status(500).json({message:'Server Error'})
    }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' })
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    )

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } })

  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
})
 

export default router 