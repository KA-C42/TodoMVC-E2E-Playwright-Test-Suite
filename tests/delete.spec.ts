import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'
import expectEmptyState from './utils/assertionHelpers'
import { populateActive } from './utils/seederHelpers'

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

  // D2
  test('delete only completed todo from mixed list', async () => {
    // SETUP
    const toDelete = 'delete me!! DO IT! DO IT NOW!'
    await populateActive(todoPage)
    await todoPage.addAndCompleteTodo(toDelete)
    await expect(todoPage.clearCompletedButton).toBeVisible()

    const item = todoPage.getTodoItem(toDelete)
    await item.root.hover()
    await item.deleteButton.click()

    // ASSERTIONS
    await expect(item.root).toHaveCount(0)
    await expect(todoPage.clearCompletedButton).not.toBeVisible()
  })

  // D3
  test('delete active todo from active list', async () => {
    // SETUP
    const toDelete = 'Someday... You gotta learn when to QUIT'
    await populateActive(todoPage)
    await todoPage.addTodo(toDelete)
    const activeBefore = await todoPage.getActiveCount()

    const item = todoPage.getTodoItem(toDelete)
    await item.root.hover()
    await item.deleteButton.click()

    // ASSERTIONS
    const activeAfter = await todoPage.getActiveCount()
    await expect(item.root).toHaveCount(0)
    expect(activeAfter).toBe(activeBefore - 1)
  })
})
