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
  await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)

  if(!blog) {
    return response.status(404).json({ error: 'Blog not found' })
  }

  if (blog.user?.toString() === user.id.toString() ) {
    await blog.deleteOne()
    return response.status(204).end()
  }

  return response.status(401).json({ error: 'User not authorized to perform the action' })
})

blogsRouter.put('/:id', userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

  if(!blog) {
    return response.status(404).end()
  }

  const { likes } = request.body
  blog.likes = likes
  const result = await blog.save()
  await blog.populate('user', { username: 1, name: 1 })
  response.json(result)
})

module.exports = blogsRouter
