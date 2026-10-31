import { useState } from 'react'
import { TextField, Button } from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setTitle] = useState('')
  const [newAuthor, setAuthor] = useState('')
  const [newUrl, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setAuthor('')
    setTitle('')
    setUrl('')
  }

  return (
    <div>
      <h2>Create new</h2>
      <form onSubmit={addBlog}>
        <div style={{ marginBottom: 10 }}>
          <TextField
            size="small"
            id="outlined-basic"
            label="title"
            variant="outlined"
            value={newTitle}
            sx={{ width: 500 }}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <TextField
            size="small"
            id="outlined-basic"
            label="author"
            variant="outlined"
            value={newAuthor}
            sx={{ width: 500 }}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <TextField
            size="small"
            id="outlined-basic"
            label="url"
            variant="outlined"
            value={newUrl}
            sx={{ width: 500 }}
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <div>
          <Button type="submit"variant="contained" style={{ marginTop: 10 }}>create</Button>
        </div>
      </form>
    </div>

  )
}

export default BlogForm