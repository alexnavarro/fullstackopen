const Blog = ({ blog, onLikeClicked, user, onRemoveClicked }) => {
  if(!blog) {
    return null
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        <h2>{blog.author}: {blog.title}</h2>
        <div><a href={blog.url}>{blog.url}</a></div>
        <div>likes {blog.likes} {user && <button onClick={() => onLikeClicked(blog.id, blog.likes + 1)}>like</button>}
        </div>
        <div>Added by {blog?.user?.name}</div>
        {(user && user.username === blog?.user?.username) && (
          <div><button className="button button2" onClick={() => onRemoveClicked(blog)}>remove</button></div>
        )}
      </div>
    </div>
  )
}

export default Blog