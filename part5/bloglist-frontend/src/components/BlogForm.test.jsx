import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'


test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText(/title:/i)
  const authorInput = screen.getByLabelText(/author:/i)
  const urlInput = screen.getByLabelText(/url:/i)
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'title title ...')
  await user.type(authorInput, 'Amarildo Joao')
  await user.type(urlInput, 'https://amarildo.eu')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('title title ...')
  expect(createBlog.mock.calls[0][0].url).toBe('https://amarildo.eu')
  expect(createBlog.mock.calls[0][0].author).toBe('Amarildo Joao')
})