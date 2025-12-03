import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'
import { throwDeprecation } from 'process'

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

  // M3
  test('marks only todo as incomplete', async () => {
    // SETUP
    const todoName = 'toggle me'
    await todoPage.addAndCompleteTodo(todoName)
    await expect(todoPage.todoItems).toHaveCount(1)

    const todo = todoPage.getTodoItem(todoName)
    await expect(todo.root).toBeVisible()

    await expect(todo.root).toHaveClass('completed')
    await expect(todoPage.toggleAllButton).toBeChecked()
    await expect(todoPage.clearCompletedButton).toBeVisible()
    const oldActiveCount = await todoPage.getActiveCount()
    expect(oldActiveCount).toBe(0)

    await todo.checkbox.click()

    // ASSERTIONS
    await expect(todo.root).not.toHaveClass('completed')
    await expect(todoPage.toggleAllButton).not.toBeChecked()
    await expect(todoPage.clearCompletedButton).not.toBeVisible()
    const newActiveCount = await todoPage.getActiveCount()
    expect(newActiveCount).toBe(1)
  })

  // M4
  test('complete last active todo from populated state', async () => {
    // SETUP
    const completeFiller = 'all done!'
    await todoPage.addAndCompleteTodo(completeFiller)
    await todoPage.addAndCompleteTodo(completeFiller)
    const todoText = 'almost done!'
    await todoPage.addTodo(todoText)

    await expect(todoPage.todoItems).toHaveCount(3)
    await expect(todoPage.toggleAllButton).not.toBeChecked()

    const todo = todoPage.getTodoItem(todoText)
    await expect(todo.root).not.toHaveClass('completed')
    await todo.checkbox.click()

    // ASSERTIONS
    await expect(todo.root).toHaveClass('completed')
    await expect(todoPage.toggleAllButton).toBeChecked()
  })

  // M5
  test('mark only complete todo as active from populated state', async () => {
    // SETUP
    const activeFiller = 'procrastinate'
    await todoPage.addTodo(activeFiller)
    await todoPage.addTodo(activeFiller)
    const toUndoText = 'do it again'
    await todoPage.addAndCompleteTodo(toUndoText)

    await expect(todoPage.todoItems).toHaveCount(3)
    await expect(todoPage.clearCompletedButton).toBeVisible()

    const toUndo = todoPage.getTodoItem(toUndoText)
    await expect(toUndo.root).toHaveClass('completed')
    await toUndo.checkbox.click()

    // ASSERTIONS
    await expect(toUndo.root).not.toHaveClass('completed')
    await expect(todoPage.clearCompletedButton).not.toBeVisible()
  })

  // M6
  test('trim surrounding whitespace from edited todo', async () => {
    // SETUP
    const oldText = 'schwoopsie'
    const newText = 'clear whitespace'
    const editText = '     ' + newText + '     '
    await todoPage.addTodo(oldText)
    const toEdit = todoPage.getTodoItem(oldText)

    await toEdit.edit(editText)
    const raw = await todoPage.getTodoItem(newText).root.textContent()

    // ASSERTIONS
    expect(raw).toBe(newText)
    expect(raw).not.toBe(editText)
    await expect(todoPage.todoItems.filter({ hasText: oldText })).toHaveCount(0)
  })
})
