const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, checkErrorMessage } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Alex Silva',
        username: 'alexandre',
        password: 'alexandre123456'
      }
    })
    await request.post('/api/users', {
      data: {
        name: 'Berenice Bona',
        username: 'bona',
        password: 'gata'
      }
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const userNameLocator = page.getByLabel('username')
    await expect(userNameLocator).toBeVisible()
    const passwordLocator = page.getByLabel('password')
    await expect(passwordLocator).toBeVisible()
    const loginButtonLocator = page.getByRole('button', { name: 'login' })
    await expect(loginButtonLocator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'alexandre', 'alexandre123456')
      await expect(page.getByText('Alex Silva logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'axxxx', 'wrong')
      await checkErrorMessage(page, 'wrong username or password')
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'alexandre', 'alexandre123456')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'title example', 'Bonifacio gato', 'http://bonifacio.cat')
      await expect(page.getByText('a new blog title example by Bonifacio gato added')).toBeVisible()
    })

    test('like a created blog', async ({ page }) => {
      await createBlog(page, 'title example', 'Bonifacio gato', 'http://bonifacio.cat')
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await page.getByText('likes 1').waitFor()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('delete a created blog', async ({ page }) => {
      await createBlog(page, 'title example2', 'Bonifacio gato2', 'http://bonifacio.cat')
      await page.getByRole('button', { name: 'show' }).click()

      let dialogMessage = ''
      page.once('dialog', async dialog => {
        dialogMessage = dialog.message()
        console.log('DIALOG:', dialogMessage)
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
      expect(dialogMessage).toContain('title example2')
      await expect(page.getByText('title example2 Bonifacio gato2')).not.toBeVisible()
    })

    test('when user added a blog then should see the remove button', async ({ page }) => {
      await createBlog(page, 'title example2', 'Bonifacio gato2', 'http://bonifacio.cat')
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).toBeVisible()
    })

    test('should not show the remove button for posts of other users', async ({ page }) => {
      await createBlog(page, 'title example2', 'Bonifacio gato2', 'http://bonifacio.cat')
      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'bona', 'gata')
      await page.getByRole('button', { name: 'show' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('should order the list by number of likes first', async ({ page }) => {
      await createBlog(page, 'title example2', 'Bonifacio gato2', 'http://bonifacio.cat')
      await createBlog(page, 'playwright berenice', 'Bere', 'http://bere.cat')
      await createBlog(page, 'sarue sarue', 'sarue', 'http://sarue.cat')


      const blogToLike = page
        .getByText('sarue sarue sarue')
        .locator('..')

      await blogToLike.getByRole('button', { name: 'show' }).click()
      await blogToLike.getByRole('button', { name: 'like' }).click()
      await expect(blogToLike).toContainText('likes 1')

      const allShowButtons = page.getByRole('button', { name: /show|hide/i })
      const firstBlog = allShowButtons.first().locator('../..')
      await expect(firstBlog).toContainText('sarue sarue sarue')
    })
  })
})