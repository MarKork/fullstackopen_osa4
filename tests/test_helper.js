const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'jokublogi',
    author: 'jokukirjoittaja',
    url: 'joku.com',
    likes: 5
  },
  {
    title: 'jokutoinenblogi',
    author: 'jokutoinenkirjoittaja',
    url: 'jokutoinen.com',
    likes: 10
  },
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}

module.exports = {
  initialBlogs, nonExistingId, blogsInDb, usersInDb
}