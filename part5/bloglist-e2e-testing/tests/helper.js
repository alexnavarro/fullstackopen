import { expect } from '@playwright/test'

const loginWith = async (page, username, password) => {
  await page.getByRole('link', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async (page, title, author, url) => {
  await page.getByRole('link', { name: 'new blog' }).click()
  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: 'create' }).click()

  await page.getByText(title).last().waitFor()
}

const checkErrorMessage = async (page, errorMessage) => {
  const alert = page.getByRole('alert')

  await expect(alert).toBeVisible()
  await expect(alert).toContainText(errorMessage)
  await expect(alert).toHaveCSS('margin-top', '10px')
  await expect(alert).toHaveCSS('margin-bottom', '10px')

}

const like = async (page, link) => {
  await page.getByRole('link', { name: link }).click()
  await expect(page).toHaveURL(/.*blogs/) 
  await expect(page.getByText('0 likes')).toBeVisible()
  await page.getByRole('button', { name: 'like' }).click()
}

export { loginWith, createBlog, checkErrorMessage, like }