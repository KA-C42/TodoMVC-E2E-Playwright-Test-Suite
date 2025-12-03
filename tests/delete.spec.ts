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
    await todoPage.deleteTodo(toDelete)

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
    await todoPage.deleteTodo(toDelete)

    // ASSERTIONS
    const activeAfter = await todoPage.getActiveCount()
    await expect(item.root).toHaveCount(0)
    expect(activeAfter).toBe(activeBefore - 1)
  })

  // D4
  test('delete chosen duplicate', async () => {
    // Specify chosen duplicate in case of feature expansion attaching meta data to todo
    // Order-sensitive setup instead of a seeder for clarity and visibility
    // SETUP
    const toKeepDoing = 'floop the pig'
    await todoPage.addTodo(toKeepDoing)
    await todoPage.addTodo(toKeepDoing)
    await todoPage.addAndCompleteTodo(toKeepDoing)
    await todoPage.addTodo(toKeepDoing)

    // delete the second item, active duplicate
    await todoPage.deleteTodo(toKeepDoing, 1)

    // ASSERTIONS
    const duplicateCount = await todoPage.todoItems
      .filter({ hasText: toKeepDoing })
      .count()
    expect(duplicateCount).toBe(3) // confirm 3 todos exist with same name

    const activeCount = await todoPage.getActiveCount()
    expect(activeCount).toBe(2) // confirm 2 of the duplicates still marked incomplete

    await expect(todoPage.getTodoItem(toKeepDoing, 1).root).toHaveClass(
      'completed',
    ) // confirm middle todo is the one still "complete"
  })

  // D5
  test('delete only todo from filtered view', async () => {
    // SETUP
    const toDelete = 'now you see me'
    await todoPage.addAndCompleteTodo(toDelete)

    await todoPage.completedFilter.click()
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\/completed/)
    await expect(todoPage.todoItems).toHaveCount(1)

    await todoPage.deleteTodo(toDelete)

    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\/completed/)
    await expectEmptyState(todoPage)
  })
})
