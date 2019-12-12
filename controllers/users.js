const bcryptjs = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (req, res) => {
  const users = await User
    .find({}).populate('blogs', {title: 1, author: 1, url: 1, likes: 1})

    res.json(users.map(u => u.toJSON()))
    //User.find({}).then(users => {
    //    res.json(users.map(user => user.toJSON()))        
    //})
})

usersRouter.post('/', async (request, response, next) => {
  const passw = request.body.password
    if (!passw || passw.length < 3) {
        return response.status(400).json({ error: 'password too short' })
    }
  
  try {
    const body = request.body
    console.log("postauksessa")
    const saltRounds = 10
    const passwordHash = await bcryptjs.hash(body.password, saltRounds)
    console.log("kryptauksen jälkeen")
    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })
    console.log("käyttäjänimi bodysta: ",body.username)
    console.log(body.name)
    console.log(body.password)
    console.log(body)
    console.log(user)
    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter