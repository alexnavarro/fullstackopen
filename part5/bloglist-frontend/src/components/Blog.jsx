import { CardContent, Typography, Link, Button, Box, Stack } from '@mui/material'
import Card from '@mui/material/Card'

const Blog = ({ blog, onLikeClicked, user, onRemoveClicked }) => {
  if (!blog) {
    return null
  }

  const isOwner = user && user.username === blog?.user?.username

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 600,
        mt: 3,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
      }}>
      <CardContent>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600, mb: 1 }}>
          {blog.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
          by {blog.author}
        </Typography>
        <Box sx={{ mb: 1 }}>
          <Link
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            underline="always"
            sx={{ fontSize: '1rem' }}
          >
            {blog.url}
          </Link>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Added by {blog?.user?.name}
        </Typography>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 500, mr: 0.5 }}>
            {blog.likes} {blog.likes === 1 ? 'like' : 'likes'}
          </Typography>
          {user &&
            <Button
              variant="outlined"
              size="small"
              onClick={() => onLikeClicked(blog.id, blog.likes + 1)}
            >
              like
            </Button>
          }
          {isOwner && (
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => onRemoveClicked(blog)}
            >
              remove
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog