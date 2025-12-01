import { test, expect } from "@playwright/test"
import { TodoMvcPage } from "./pages/todomvc-page"


test.describe('TodoMVC - Filtering', () => {

    let todoPage: TodoMvcPage

    test.beforeEach( async ({ page }) => {
        todoPage = new TodoMvcPage(page)
        
        // go to starting URL before each test
        await todoPage.goto()
    } )
})