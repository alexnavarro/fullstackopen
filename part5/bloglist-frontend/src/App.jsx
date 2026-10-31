import { useState, useEffect } from 'react'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useMatch
} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
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

      setErrorMessage(`a new blog ${blogResult.title} by ${blogResult.author} added`)
      setBlogs(blogs.concat(blogResult))
      navigate('/')

      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLikes = async (blogId, likes) => {
    if(!user) {
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
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
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
        setErrorMessage('No permission to remove')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const padding = {
    padding: 5
  }

  const match = useMatch('/blogs/:id')

  const blog = match
    ? blogs.find(blog => blog.id === match.params.id)
    : null

  return (
    <div>
      <div>
        <Link style={padding} to='/'>blogs</Link>
        {
          user ?
            (
              <>
                <Link style={padding} to='/create'>new blog</Link>
                <button onClick={handleLogout}>logout</button>
              </>
            )
            :
            <Link style={padding} to='/login'>login</Link>
        }

      </div>
      <Notification message={errorMessage} />
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
        <Route  path='/create' element={
          <BlogForm createBlog={addBlog} />
        }
        />
      </Routes>
    </div>
  )
}

export default App