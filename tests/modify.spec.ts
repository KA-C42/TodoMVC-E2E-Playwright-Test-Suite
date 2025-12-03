import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'

test.describe('TodoMVC - Modifying todos', () => {
  let todoPage: TodoMvcPage

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page)

    // go to starting URL before each test
    await todoPage.goto()
  })

  // M1
  test('edit todo with no effect on completion and other todos', async () => {
    // SETUP
    const oopsyDoText = 'fix me'
    const newTodoText = 'all better, tysm <3'
    const activeText = "it ain't over"
    const completeText = "till it's over"
    await todoPage.addAndCompleteTodo(oopsyDoText)
    await todoPage.addTodo(activeText)
    await todoPage.addAndCompleteTodo(completeText)

    // find item, open edit box
    const toRedo = todoPage.getTodoItem(oopsyDoText)
    await toRedo.root.dblclick()

    // assert edit visibility and submit new text
    const editBox = toRedo.root.getByRole('textbox', { name: 'Edit' })
    await expect(editBox).toBeVisible()
    await editBox.fill(newTodoText)
    await editBox.press('Enter')

    // ASSERTIONS
    // name change is official
    const newTodo = todoPage.getTodoItem(newTodoText)
    await expect(
      todoPage.todoItems.filter({ hasText: oopsyDoText }),
    ).toHaveCount(0)
    // completion status the same
    await expect(newTodo.root).toHaveClass('completed')

    // rest of list untouched
    await expect(todoPage.getTodoItem(activeText).root).not.toHaveClass(
      'completed',
    )
    await expect(todoPage.getTodoItem(completeText).root).toHaveClass(
      'completed',
    )
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
