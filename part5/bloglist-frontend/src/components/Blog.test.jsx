import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  const blog = { title: 'title', id: '43434', author: 'authorTest', likes: 3, url: 'https://test.com', user: { name: 'user', username: 'userName' } }
  let user = { name: 'user', username: 'userName' }
  const onLikeMockHandler = vi.fn()
  const onRemoveClickedMockHandler = vi.fn()
  beforeEach(() => {
    render(
      <Blog blog={blog} onLikeClicked={onLikeMockHandler} onRemoveClicked={onRemoveClickedMockHandler} user={user} />
    )
  })

  test('renders its children', () => {
    screen.getByText('title authorTest')
  })

  test('at start the title and author is visisble but likes and url are not displayed', () => {
    const titleAuthorElement = screen.getByText('title authorTest')
    expect(titleAuthorElement).toBeVisible()
    const likesElement = screen.getByText('likes 3')
    expect(likesElement).not.toBeVisible()
    const urlElement = screen.getByText('https://test.com')
    expect(urlElement).not.toBeVisible()
  })

  test('after clicking the show button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show')
    await user.click(button)

    const likesElement = screen.getByText('likes 3')
    expect(likesElement).toBeVisible()
    const urlElement = screen.getByText('https://test.com')
    expect(urlElement).toBeVisible()
  })

  test('when user click on like button twice, it should send to callers to the handler', async () => {
    const user = userEvent.setup()
    const showButton = screen.getByText('show')
    await user.click(showButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(onLikeMockHandler.mock.calls).toHaveLength(2)
    expect(onLikeMockHandler.mock.calls[0][1]).toBe(4)
  })
})