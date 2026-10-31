import { useState, useEffect } from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { Container, AppBar, Toolbar, Button } from '@mui/material'
import ButtonAppBar from './components/ButtonAppBar'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const blogsSort = (a, b) => b.likes - a.likes

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs => {
      setBlogs(blogs.sort(blogsSort))
    }
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogsUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogsUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      navigate('/')
    } catch {
      setNotification({ text: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('loggedBlogsUser')
    blogService.setToken('')
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const blogResult = await blogService.create(blogObject)

      setNotification({ text: `a new blog ${blogResult.title} by ${blogResult.author} added`, type: 'success' })
      setBlogs(blogs.concat(blogResult))
      navigate('/')

      setTimeout(() => {
        setNotification(null)
      }, 5000)

    } catch {
      setNotification({ text: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLikes = async (blogId, likes) => {
    if (!user) {
      confirm('You should be logged in to perform this action')
      return null
    }

    const blogObject = {
      likes: likes
    }

    try {
      const blogResult = await blogService.update(blogId, blogObject)
      setBlogs(prevBlogs => prevBlogs.map(blog => blog.id === blogResult.id ? blogResult : blog).sort(blogsSort))
    } catch {
      setNotification({ text: 'wrong credentials', type: 'error' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleRemoveBlog = async (blog) => {
    if (confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id)
        navigate('/')
        setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== blog.id))
      } catch {
        setNotification({ text: 'wrong No permission to remove', type: 'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    }
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <Container>
      <ButtonAppBar user={user} handleLogout={handleLogout} />
      <Notification notification={notification} />
      <Routes>
        <Route path='/' element={
          <BlogList blogs={blogs} />
        } />
        <Route path='/login' element={
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        } />
        <Route path='/blogs/:id' element={
          <Blog
            blog={blog}
            onLikeClicked={handleLikes}
            user={user}
            onRemoveClicked={handleRemoveBlog}
          />
        }
        />
        <Route path='/create' element={
          <BlogForm createBlog={addBlog} />
        }
        />
      </Routes>
    </Container>
  )
}

export default App