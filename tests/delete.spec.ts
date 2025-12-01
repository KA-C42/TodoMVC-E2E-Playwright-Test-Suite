import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'
import expectEmptyState from './utils/assertionHelpers'

test.describe('TodoMVC - Deleting todos', () => {
  let todoPage: TodoMvcPage

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page)

    // go to starting URL before each test
    await todoPage.goto()
  })

  // D1
  test('delete only todo, return to empty-list state', async () => {
    // SETUP
    const todo = 'fight me >:D'
    await todoPage.addTodo(todo)
    const toDelete = todoPage.getTodoItem(todo)

    // ASSERTIONS
    await expect(toDelete.deleteButton).not.toBeVisible()
    await toDelete.root.hover()
    await expect(toDelete.deleteButton).toBeVisible()

    await toDelete.deleteButton.click()
    await expectEmptyState(todoPage)
  })
})
