import { useState } from 'react'

const Blog = ({ blog, onLikeClicked, user, onRemoveClicked }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'show'}</button>
      </div>
      <div style={showWhenVisible}>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>likes {blog.likes} <button onClick={() => onLikeClicked(blog.id, blog.likes + 1)}>like</button></div>
        <div>{blog?.user?.name}</div>
        {(user.username === blog?.user?.username) && (
          <div><button className="button button2" onClick={() => onRemoveClicked(blog)}>remove</button></div>
        )}
      </div>
    </div>
  )
}

export default Blog