import { test, expect } from '@playwright/test'
import { TodoMvcPage } from '../pages/todomvc-page'
import expectEmptyState from '../utils/commonUtils'


test.describe('TodoMVC App Initialization', () => {

    let todoPage: TodoMvcPage

    test.beforeEach( async ({ page }) => {
        todoPage = new TodoMvcPage(page)
        
        // go to starting URL before each test
        await todoPage.goto()
    } )

    // S1
    test( 'renders empty state home page', async () => {

        await expect(todoPage.page).toHaveURL(/\/todomvc\/#\//)

        // main UI rendered
        await expect(todoPage.todoHeader).toBeVisible()
        await expect(todoPage.newTodo).toBeEditable()

        // empty state: no todos, no toggle-all checkbox, no footer
        await expectEmptyState(todoPage)
    })
})


test.describe('Single item actions', () => {

    let todoPage: TodoMvcPage

    test.beforeEach( async ({ page }) => {
        todoPage = new TodoMvcPage(page)
        
        // go to starting URL before each test
        await todoPage.goto()
    } )

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

        await expect(todoPage.toggleAllButton).toBeChecked()        // toggle-all button toggles
        await expect(todoPage.todoCount).toHaveText('0 items left') // active count updates
        await expect(todoPage.clearCompletedButton).toBeVisible()   // clear completed visible
    })

    // D1
    test('delete only todo, return to empty-list state', async () => {
        // SETUP
        const todo = 'fight me >:('
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