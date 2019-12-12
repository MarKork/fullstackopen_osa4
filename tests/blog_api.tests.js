const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(helper.initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(helper.initialBlogs[1])
  await blogObject.save()
})

test('there are two blogs', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(2)
})

test('blog idenfication', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('post a new blog', async () => {
  const newBlog = {
    title: 'jokuuusiblogi',
    author: 'jokuuusikirjoittaja',
    url: 'jokuuusi.com',
    likes: 1
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(helper.initialBlogs.length+1)
})

test('a blog can be deleted', async () => {
  const blogAtStart = await helper.blogsInDb()
  const blogToDelete = blogAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(
    helper.initialBlogs.length -1
  )
})

afterAll(() => {
  mongoose.connection.close()
})