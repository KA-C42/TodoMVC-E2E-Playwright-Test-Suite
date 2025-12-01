import { test, expect } from "@playwright/test"
import { TodoMvcPage } from "./pages/todomvc-page"


test.describe('TodoMVC - Adding todos', () => {

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
})