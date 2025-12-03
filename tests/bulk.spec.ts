import { test, expect } from '@playwright/test'
import { TodoMvcPage } from './pages/todomvc-page'
import expectEmptyState from './utils/assertionHelpers'
import {
  populateActive,
  populateCompleted,
  populateVaried,
} from './utils/seederHelpers'

test.describe('TodoMVC - Bulk item actions', () => {
  let todoPage: TodoMvcPage

  test.beforeEach(async ({ page }) => {
    todoPage = new TodoMvcPage(page)

    // go to starting URL before each test
    await todoPage.goto()
  })

  // B1
  test('toggle all complete from populated-active list', async () => {
    // SETUP
    await populateActive(todoPage)

    const startingActive = await todoPage.getActiveCount()
    const startingCompleted = await todoPage.getCompletedCount()
    const startingTotal = await todoPage.todoItems.count()
    expect(startingActive).toBe(startingTotal)
    expect(startingCompleted).toBe(0)

    await expect(todoPage.toggleAllButton).not.toBeChecked()
    await expect(todoPage.clearCompletedButton).not.toBeVisible()

    await todoPage.toggleAllButton.click()

    // ASSERTIONS
    const endingActive = await todoPage.getActiveCount()
    const endingCompleted = await todoPage.getCompletedCount()
    const endingTotal = await todoPage.todoItems.count()
    expect(endingTotal).toBe(startingTotal)
    expect(endingCompleted).toBe(endingTotal)
    expect(endingActive).toBe(0)

    await expect(todoPage.toggleAllButton).toBeChecked()
    await expect(todoPage.clearCompletedButton).toBeVisible()
  })

  // B2
  test('toggle all complete from populated-varied list', async () => {
    // SETUP
    await populateVaried(todoPage)

    const startingActive = await todoPage.getActiveCount()
    const startingCompleted = await todoPage.getCompletedCount()
    const startingTotal = await todoPage.todoItems.count()
    expect(startingActive).toBeGreaterThan(0)
    expect(startingCompleted).toBeGreaterThan(0)
    expect(startingActive + startingCompleted).toBe(startingTotal)

    await expect(todoPage.toggleAllButton).not.toBeChecked()

    await todoPage.toggleAllButton.click()

    // ASSERTIONS
    const endingActive = await todoPage.getActiveCount()
    const endingCompleted = await todoPage.getCompletedCount()
    const endingTotal = await todoPage.todoItems.count()
    expect(endingTotal).toBe(startingTotal)
    expect(endingCompleted).toBe(endingTotal)
    expect(endingActive).toBe(0)

    await expect(todoPage.toggleAllButton).toBeChecked()
  })

  // B3
  test('toggle all incomplete', async () => {
    // SETUP
    await populateCompleted(todoPage)

    const startingActive = await todoPage.getActiveCount()
    const startingCompleted = await todoPage.getCompletedCount()
    const startingTotal = await todoPage.todoItems.count()
    expect(startingCompleted).toBe(startingTotal)
    expect(startingActive).toBe(0)

    await expect(todoPage.toggleAllButton).toBeChecked()
    await expect(todoPage.clearCompletedButton).toBeVisible()

    await todoPage.toggleAllButton.click()

    // ASSERTIONS
    const endingActive = await todoPage.getActiveCount()
    const endingCompleted = await todoPage.getCompletedCount()
    const endingTotal = await todoPage.todoItems.count()
    expect(endingTotal).toBe(startingTotal)
    expect(endingActive).toBe(endingTotal)
    expect(endingCompleted).toBe(0)

    await expect(todoPage.toggleAllButton).not.toBeChecked()
    await expect(todoPage.clearCompletedButton).not.toBeVisible()
  })
})
