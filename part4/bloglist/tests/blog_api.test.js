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

  describe('addition of a new blog', () => {
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

    test('given a creation of blog post when likes is missing it should add zero to this field', async () => {
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

    test('given a creation of blog post when title and url are missing it should return a bad request', async () => {
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

  describe('deletion of a blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialPosts.length - 1)
    })
  })

  describe('update of a blog post', () => {
    test('succeeds with status code 204 for a valid update', async () => {
      const updatedLikes = {
        likes: 666
      }
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedLikes)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      const likes = blogsAtEnd.map(n => n.likes)
      assert(!likes.includes(blogToUpdate.likes))
      assert(likes.includes(666))
    })

    test('error with status code 404 for an invalid id', async () => {
      const updatedLikes = {
        likes: 666
      }
      const invalidId = '5a422aa71b54a676234d17f7'

      await api
        .put(`/api/blogs/${invalidId}`)
        .send(updatedLikes)
        .expect(404)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})