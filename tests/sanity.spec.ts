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

  // S2
  test('state and data persist on refresh', async () => {
    const toSaves = ['tod0', 'tod1', 'tod2']

    // mix the order of active/complete todos
    for (const [index, todo] of toSaves.entries()) {
      if (index % 2 === 0) {
        await todoPage.addTodo(todo)
      } else {
        await todoPage.addAndCompleteTodo(todo)
      }
    }
    const startingTotal = await todoPage.todoItems.count()
    expect(startingTotal).toBe(toSaves.length)

    await todoPage.activeFilter.click()
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\/active/)

    await todoPage.page.reload()

    // ASSERTIONS
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#\/active/)
    await todoPage.allFilter.click()
    await expect(todoPage.page).toHaveURL(/\/todomvc\/#/)

    // check the order of active/complete persisted
    for (const [index, todo] of toSaves.entries()) {
      // ensure index has correct name
      await expect(todoPage.todoItems.nth(index)).toHaveText(todo)

      // ensure name has correct completion
      if (index % 2 === 0) {
        await expect(todoPage.getTodoItem(todo).root).not.toHaveClass(
          'completed',
        )
      } else {
        await expect(todoPage.getTodoItem(todo).root).toHaveClass('completed')
      }
    }

    const endingTotal = await todoPage.todoItems.count()
    expect(endingTotal).toBe(startingTotal)
  })
})
