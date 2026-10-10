const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await  blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if(!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  console.log(`abacate blog.user?.toString() ${blog.user?.toString()} user.id.toString(): ${user.id.toString()}`)

  if (blog.user?.toString() === user.id.toString() ) {
    await blog.deleteOne()
    return response.status(204).end()
  }

  return response.status(401).json({ error: 'User not authorized to perform the action' })
})

blogsRouter.put('/:id', async (request, response) => {
  const { likes } = request.body
  const blog = await Blog.findById(request.params.id)

  if(!blog) {
    return response.status(404).end()
  }

  blog.likes = likes
  const result = await blog.save()
  response.json(result)
})

module.exports = blogsRouter
