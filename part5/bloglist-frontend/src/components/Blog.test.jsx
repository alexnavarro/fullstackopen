import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'title',
    id: '43434',
    author: 'authorTest',
    likes: 3,
    url: 'https://test.com',
    user: { name: 'user', username: 'userName' }
  }

  const renderBlog = (customUser = { name: 'user', username: 'userName' }) => {
    const onLikeMockHandler = vi.fn()
    const onRemoveClickedMockHandler = vi.fn()

    render(
      <Blog
        blog={blog}
        onLikeClicked={onLikeMockHandler}
        onRemoveClicked={onRemoveClickedMockHandler}
        user={customUser}
      />
    )

    return { onLikeMockHandler, onRemoveClickedMockHandler }
  }

  test('renders its children', () => {
    renderBlog()
    screen.getByText('by authorTest')
  })

  test('at start the title and author, likes and url are displayed', () => {
    renderBlog()
    const titleElement = screen.getByText('title')
    expect(titleElement).toBeVisible()
    const authorElement = screen.getByText('by authorTest')
    expect(authorElement).toBeVisible()
    const likesElement = screen.getByText('3 likes')
    expect(likesElement).toBeVisible()
    const urlElement = screen.getByText('https://test.com')
    expect(urlElement).toBeVisible()
  })

  test('onwner of the blug should see remove button', () => {
    renderBlog()
    const removeButtonElement = screen.getByText('remove')
    expect(removeButtonElement).toBeVisible()
  })

  test('when user click on like button twice, it should send to callers to the handler', async () => {
    const user = userEvent.setup()
    const { onLikeMockHandler } = renderBlog()

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(onLikeMockHandler.mock.calls).toHaveLength(2)
    expect(onLikeMockHandler.mock.calls[0][1]).toBe(4)
  })

  test('given user is not the creator of the blog then should no see like button', () => {
    renderBlog({ name: 'user', username: 'userNameDifferent' })
    const removeButton = screen.queryByRole('button', { name: 'remove' })
    expect(removeButton).not.toBeInTheDocument()
  })

  test('likes should be visible, but like button should not be visible', () => {
    renderBlog(null)
    const likesElement = screen.getByText('3 likes')
    expect(likesElement).toBeVisible()
    const likeButton = screen.queryByRole('button', { name: 'like' })
    expect(likeButton).not.toBeInTheDocument()
  })


  test('given user is null remove button should no be on screen', () => {
    renderBlog(null)
    const removeButton = screen.queryByRole('button', { name: 'remove' })
    expect(removeButton).not.toBeInTheDocument()
  })
})