const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const Blog = require('../models/blog')
const helper = require('./test_helper')

beforeEach(async () => {
  await User.deleteMany({})
})

test('post a new user with proper name and password', async () => {
  const newUser = {
    username: 'jokukäyttäjännimi',
    name: 'jokuomanimi',
    password: 'jokusalasana',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()

  const usernames = usersAtEnd.map(u => u.username)
  expect(usernames).toContain(newUser.username)
})

test('creation fails with proper statuscode and message if username already taken', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser1 = {
    username: 'käyttäjännimi',
    name: 'omanimi',
    password: 'salasana',
  }
  await api
    .post('/api/users')
    .send(newUser1)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const newUser = {
    username: 'käyttäjännimi',
    name: 'omanimi',
    password: 'salasana',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('`username` to be unique')
})

test('trying to post a user with too short username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'xx',
    name: 'nimi',
    password: 'sala',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

test('trying to post a user with no username', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'nimi',
    password: 'sala',
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

test('trying to post a user with no password', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'jokunimi',
    name: 'nimi'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)
  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd.length).toBe(usersAtStart.length)
})

afterAll(() => {
  mongoose.connection.close()
})