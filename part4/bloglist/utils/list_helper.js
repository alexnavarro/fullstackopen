const dummy = () => {
  return 1
}

const totalLikes = (blogs) => blogs.reduce((sum, item) => sum + item.likes, 0)

const favoriteBlog = (blogs) => blogs.reduce((max, item) => max.likes < item.likes ? item : max)

const mostBlogs = (blogs) => {
  const authors = blogs.reduce((result, blog) => {
    if (result[blog.author]) {
      result[blog.author]++
    } else {
      result[blog.author] = 1
    }

    return result

  }, {})

  return Object.entries(authors).reduce((max, [author, count]) => {
    if (count > max.blogs) {
      return {
        author: author,
        blogs: count
      }
    }

    return max
  }, {
    author: '',
    blogs: 0
  })
}

const mostLikes = (blogs) => {
  const authors = blogs.reduce((result, blog) => {
    if (result[blog.author]) {
      result[blog.author]+= blog.likes
    } else {
      result[blog.author] = blog.likes
    }

    return result

  }, {})

  return Object.entries(authors).reduce((max, [author, likes]) => {
    if (likes > max.likes) {
      return {
        author: author,
        likes: likes
      }
    }

    return max
  }, {
    author: '',
    likes: 0
  })
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}