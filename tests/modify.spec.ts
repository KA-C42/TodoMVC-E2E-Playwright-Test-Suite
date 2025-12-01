import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'

test.describe('TodoMVC - Modifying todos', () => {
  let todoPage: TodoMvcPage

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page)

    // go to starting URL before each test
    await todoPage.goto()
  })

  // M2
  test('marks only todo as complete', async () => {
    // SETUP
    const todoName = 'check this!'
    await todoPage.addTodo(todoName)

    const todoItem = todoPage.getTodoItem(todoName)

    await todoItem.checkbox.click()

    // ASSERTIONS
    // visual behavior covered by 'completed' class, tested separately
    await expect(todoItem.root).toHaveClass(/completed/)
    await expect(todoItem.checkbox).toBeChecked()

    await expect(todoPage.toggleAllButton).toBeChecked() // toggle-all button toggles
    await expect(todoPage.todoCount).toHaveText('0 items left') // active count updates
    await expect(todoPage.clearCompletedButton).toBeVisible() // clear completed visible
  })
})
