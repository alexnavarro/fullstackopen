const Blog = require('../models/blog')
const User = require('../models/user')

const initialPosts = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 20,
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ content: 'willremovethissoon' })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const blogDifferentUserInDb = async () => {
  const savedBlog = await Blog.insertOne(initialPosts[0])
  return savedBlog.toJSON()
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const login = async (api, username = 'root', password = 'sekret') => {
  const response = await api
    .post('/api/login')
    .send({ username, password })

  return response.body.token
}

module.exports = {
  initialPosts,
  nonExistingId,
  blogsInDb,
  usersInDb,
  login,
  blogDifferentUserInDb
}