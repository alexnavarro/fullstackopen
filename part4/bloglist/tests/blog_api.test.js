const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach (async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialPosts)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blog posts are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialPosts.length)
  })

  test('verify that unique identifier is called id', async () => {
    const response = await api.get('/api/blogs')
    const firstBlog = response.body[0]

    assert(firstBlog.id)
    assert.strictEqual(firstBlog._id, undefined)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: 'Test Title blog',
      author: 'Author test',
      url: 'http://www.test.com.br/test',
      likes: 4000
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialPosts.length + 1)

    const titles = blogsAtEnd.map(n => n.title)

    assert(titles.includes('Test Title blog'))
  })

  test('given a blog post when likes is missing it should add zero to this field', async () => {
    const newBlog = {
      title: 'Test Title blog',
      author: 'Author test',
      url: 'http://www.test.com.br/test'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialPosts.length + 1)

    const likes = blogsAtEnd.map(n => n.likes)

    assert(likes.includes(0))
  })

  test('given a blog post when title and url are missing it should return a bad request', async () => {
    const newBlog = {
      author: 'Author test',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})

after(async () => {
  await mongoose.connection.close()
})