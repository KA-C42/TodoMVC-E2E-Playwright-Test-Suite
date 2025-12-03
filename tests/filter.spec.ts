import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'
import { populateVaried } from './utils/seederHelpers'

test.describe('TodoMVC - Filtering', () => {
  let todoPage: TodoMvcPage

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page)

    // go to starting URL before each test
    await todoPage.goto()

    await populateVaried(todoPage)
  })

  // F1
  test('filter to show active items only', async () => {
    // SETUP
    const totalTodos = await todoPage.todoItems.count()
    const activeTodos = await todoPage.getActiveCount()
    const completedTodos = totalTodos - activeTodos
    expect(completedTodos).toBeGreaterThan(0) // confirm todos should be filtered out

    await todoPage.activeFilter.click()

    // ASSERTIONS
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\/active/)
    await expect(todoPage.todoItems).toHaveCount(activeTodos)
    for (let i = 0; i < activeTodos; i++)
      await expect(todoPage.todoItems.nth(i)).not.toHaveClass('completed')
  })

  // F2
  test('filter to show completed items only', async () => {
    // SETUP
    const totalTodos = await todoPage.todoItems.count()
    const activeTodos = await todoPage.getActiveCount()
    const completedTodos = totalTodos - activeTodos
    expect(completedTodos).toBeGreaterThan(0) // confirm todos should be filtered out

    await todoPage.completedFilter.click()

    // ASSERTIONS
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\/completed/)
    await expect(todoPage.todoItems).toHaveCount(completedTodos)
    for (let i = 0; i < completedTodos; i++)
      await expect(todoPage.todoItems.nth(i)).toHaveClass('completed')
  })

  // F3
  test('navigate to full list view from filtered view', async () => {
    // SETUP
    const totalTodos = await todoPage.todoItems.count()

    await todoPage.activeFilter.click()
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\/active/)

    await todoPage.allFilter.click()

    // ASSERTIONS
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\//)
    await expect(todoPage.todoItems).toHaveCount(totalTodos)
  })
})
