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
  const errorDiv = page.locator('.error')
  await expect(errorDiv).toContainText(errorMessage)
  await expect(errorDiv).toHaveCSS('border-style', 'solid')
  await expect(errorDiv).toHaveCSS('border-radius', '5px')
  await expect(errorDiv).toHaveCSS('font-size', '20px')
  await expect(errorDiv).toHaveCSS('padding', '10px')
  await expect(errorDiv).toHaveCSS('margin-bottom', '10px')
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  await expect(errorDiv).toHaveCSS('background-color', 'rgb(211, 211, 211)')
}

const like = async (page, link) => {
  await page.getByRole('link', { name: link }).click()
  await expect(page.getByText('likes 0')).toBeVisible()
  await page.getByRole('button', { name: 'like' }).click()
}

export { loginWith, createBlog, checkErrorMessage, like }