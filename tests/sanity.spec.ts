import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'
import expectEmptyState from './utils/assertionHelpers'

test.describe('TodoMVC - Sanity checks', () => {
  let todoPage: TodoMvcPage

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page)

    // go to starting URL before each test
    await todoPage.goto()
  })

  // S1
  test('renders empty state home page', async () => {
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\//)

    // main UI rendered
    await expect(todoPage.todoHeader).toBeVisible()
    await expect(todoPage.newTodo).toBeEditable()

    // empty state: no todos, no toggle-all checkbox, no footer
    await expectEmptyState(todoPage)
  })
})
