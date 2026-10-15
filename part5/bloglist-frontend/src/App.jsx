import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogsSort = (a,b) => b.likes-a.likes

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
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const blogResult = await blogService.create(blogObject)

      setErrorMessage(`a new blog ${blogResult.title} by ${blogResult.author} added`)
      setBlogs(blogs.concat(blogResult))

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
        setBlogs(prevBlogs => prevBlogs.filter(b => b.id !== blog.id))
      } catch {
        setErrorMessage('No permission to remove')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }

  const loginForm = () => (
    <LoginForm
      username={username}
      password={password}
      handleUsernameChange={({ target }) => setUsername(target.value)}
      handlePasswordChange={({ target }) => setPassword(target.value)}
      handleSubmit={handleLogin}
    />
  )

  const blogFormRef = useRef()
  const blogForm = () => (
    <Togglable buttonLabel="create new blog" ref={blogFormRef} >
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      {user ? (
        <h2>blogs</h2>
      ) : (
        <h2>log in to application</h2>
      )}
      <Notification message={errorMessage} />

      {!user && loginForm()}
      {user && (
        <div>
          <p>
            {user.name} logged in <button onClick={handleLogout}>logout</button>
          </p>
          {blogForm()}
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} onLikeClicked={handleLikes} user={user} onRemoveClicked={handleRemoveBlog} />
          )}
        </div>
      )}
    </div>
  )
}

export default App