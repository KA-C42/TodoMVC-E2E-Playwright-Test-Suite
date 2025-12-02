import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'
import { populateVaried, populateCompleted } from './utils/seederHelpers'
import expectEmptyState from './utils/assertionHelpers'

test.describe('TodoMVC - Adding todos', () => {
  let todoPage: TodoMvcPage

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page)

    // go to starting URL before each test
    await todoPage.goto()
  })

  // A1
  test('adds todo from empty state', async () => {
    // SETUP
    const todo = 'write a test'
    await todoPage.addTodo(todo)

    // ASSERTIONS
    // adding todo clears input
    await expect(todoPage.newTodo).toHaveValue('')

    // expect 1 todo item with correct name and not "completed"
    await expect(todoPage.todoItems).toHaveCount(1)
    await expect(todoPage.todoItems.nth(0)).toHaveText(todo)
    await expect(todoPage.todoItems.nth(0)).not.toHaveClass(/completed/)

    // state change renders new elements
    await expect(todoPage.toggleAllButton).toBeVisible()
    await expect(todoPage.todoFooter).toBeVisible()
    await expect(todoPage.todoCount).toHaveText('1 item left')
  })

  // A2
  test('adds todo to a populated list with varied completion', async () => {
    // SETUP
    await populateVaried(todoPage)
    await expect(todoPage.toggleAllButton).not.toBeChecked()
    const activeBefore = await todoPage.getActiveCount()

    const todoNameA2 = 'test A2: add todo from populated varied list'
    await todoPage.addTodo(todoNameA2)
    const activeAfter = await todoPage.getActiveCount()
    expect(activeAfter).toBeGreaterThan(0)

    // ASSERTIONS
    await expect(todoPage.toggleAllButton).not.toBeChecked() // checking for comparison with test A3
    expect(activeAfter).toBe(activeBefore + 1)
    await expect(todoPage.getTodoItem(todoNameA2).root).toBeVisible()
  })

  // A3
  test('adds todo to a fully completed list', async () => {
    // SETUP
    await populateCompleted(todoPage)
    await expect(todoPage.toggleAllButton).toBeChecked()
    const activeBefore = await todoPage.getActiveCount()
    expect(activeBefore).toBe(0)

    const todoNameA3 = 'test A3: add todo from populated completed list'
    await todoPage.addTodo(todoNameA3)
    const activeAfter = await todoPage.getActiveCount()

    // ASSERTIONS
    await expect(todoPage.toggleAllButton).not.toBeChecked()
    expect(activeAfter).toBe(activeBefore + 1)
    await expect(todoPage.getTodoItem(todoNameA3).root).toBeVisible()
  })

  // A4
  test('allow duplicate todos and maintain correct completion per item', async () => {
    // SETUP
    const toDupe = 'cast eldritch blast'
    await todoPage.addTodo(toDupe)
    await todoPage.addAndCompleteTodo(toDupe) // comparing both active and completed for edge cases
    await todoPage.addTodo(toDupe)
    const activeCount = await todoPage.getActiveCount()

    const duplicateCount = await todoPage.todoItems
      .filter({ hasText: toDupe })
      .count()
    expect(duplicateCount).toBe(3) // confirm 3 todos exist with same name
    expect(activeCount).toBe(2) // confirm 2 of the duplicates still marked incomplete
    await expect(todoPage.getTodoItem(toDupe, 1).checkbox).toBeChecked() // confirm middle todo is the one still "complete"
  })

  // A6
  test('do not add an empty or whitespace todo', async () => {
    // SETUP
    await expectEmptyState(todoPage)
    await todoPage.addTodo('')
    await todoPage.addTodo('    ')

    // ASSERTIONS
    await expect(todoPage.todoItems).toHaveCount(0)
    await expect(todoPage.toggleAllButton).toHaveCount(0)
    await expect(todoPage.todoFooter).toHaveCount(0)
  })

  // A7
  test('trim surrounding whitespace before adding todo', async () => {
    // SETUP
    await expectEmptyState(todoPage)
    const toSee = '-. . .-. -..' // additionally verifies internal whitespace left intact
    const fullEntry = '     ' + toSee + '     '
    await todoPage.addTodo(fullEntry)

    // ASSERTIONS
    await expect(todoPage.todoItems.nth(0)).toHaveText(RegExp(toSee))
  })
})
