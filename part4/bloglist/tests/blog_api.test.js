const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const api = supertest(app)

describe('when there is initially some blogs saved', () => {
  beforeEach (async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    const postsWithUser = helper.initialPosts.map(post => ({
      ...post,
      user: user._id
    }))

    const savedBlogs = await Blog.insertMany(postsWithUser)
    user.blogs = user.blogs.concat(savedBlogs.map(savedBlog => savedBlog._id))
    await user.save()
  })

  test('blogs are returned as json', async () => {
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
    let token

    beforeEach (async () => {
      token = await helper.login(api)
    })

    test('a valid blog can be added', async () => {
      const usersAtStart = await helper.usersInDb()
      const newBlog = {
        title: 'Test Title blog',
        author: 'Author test',
        url: 'http://www.test.com.br/test',
        likes: 4000,
        userId: usersAtStart[0].id
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialPosts.length + 1)

      const titles = blogsAtEnd.map(n => n.title)

      assert(titles.includes('Test Title blog'))
    })

    test('given a creation of blog post when likes is missing it should add zero to this field', async () => {
      const usersAtStart = await helper.usersInDb()
      const newBlog = {
        title: 'Test Title blog',
        author: 'Author test',
        url: 'http://www.test.com.br/test',
        userId: usersAtStart[0].id
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
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
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })

    test('user without token should not add blogs', async () => {
      const usersAtStart = await helper.usersInDb()
      const newBlog = {
        title: 'Test Title blog',
        author: 'Author test',
        url: 'http://www.test.com.br/test',
        likes: 4000,
        userId: usersAtStart[0].id
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
    })
  })

  describe('deletion of a blog post', () => {
    let token

    beforeEach (async () => {
      token = await helper.login(api)
    })

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      const ids = blogsAtEnd.map(n => n.id)
      assert(!ids.includes(blogToDelete.id))

      assert.strictEqual(blogsAtEnd.length, helper.initialPosts.length - 1)
    })

    test('user should not delete a blog that they does not own', async () => {
      const blogToDelete = await helper.blogDifferentUserInDb()

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialPosts.length + 1)
    })

    test('user without token should not delete blogs', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
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

  describe('when there is initially one user in db', () => {
    // beforeEach (async () => {
    //   await User.deleteMany({})

    //   const passwordHash = await bcrypt.hash('sekret', 10)
    //   const user = new User({ username: 'root', passwordHash })
    //   await user.save()
    // })

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(u => u.username)
      assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await helper.usersInDb()
      assert(result.body.error.includes('expected `username` to be unique'))

      assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with a password lenght less than 3 characters', async () => {
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'ss',
      }

      await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })
  })

})

after(async () => {
  await mongoose.connection.close()
})