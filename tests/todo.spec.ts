import { test, expect } from '@playwright/test'
import { TodoMvcPage } from '../pages/todomvc-page'

/* Note!

    The following is mostly an early skeleton of planned tests, and is subject to change. 

    First-level indents signify individual tests
    Second-level indents and beyond signify expected, less-implied behaviors during each test

*/


test.describe('TodoMVC App Initialization', () => {

    let todoPage: TodoMvcPage

    test.beforeEach( async ({ page }) => {
        todoPage = new TodoMvcPage(page)
        
        // go to starting URL before each test
        await todoPage.goto()
    } )

    test( 'renders empty state home page', async () => {

        await expect(todoPage.page).toHaveURL(/\/todomvc\/#\//)

        // main UI rendered
        await expect(todoPage.todoHeader).toBeVisible()
        await expect(todoPage.newTodo).toBeEditable()

        // empty state: no todos, no toggle-all checkbox, no footer
       await expect(todoPage.todoItems).toHaveCount(0)
       await expect(todoPage.toggleAllButton).toHaveCount(0)
       await expect(todoPage.todoFooter).toHaveCount(0)
    })

    // data persists on refresh

        // todo continues working after refresh (test add additional todo)

    // tasks ordered by time entered            implementation thing, may include for intentional flakiness

})


test.describe('Single item actions', () => {

    // adds a todo

        // does not add empty tasks 

        // adding a todo clears input

        // task added, unchecked

        // active count accurately updates

        // "toggle all" button visible and unchecked

    // marks a todo as complete 
    
        // active count accurately updates

        // given "completed" class

            // greyed and crossed out

            // move from "active" list to "completed" list

        // "clear completed" button visible

    // marks a todo as incomplete

        // active count accurately updates

        // remove "completed" class

            // remove greyed/crossed effect

            // move from "completed" list to "active" list

        // "clear completed" button invisible if 0 tasks complete

        // "toggle all" button unchecked

    // deletes a todo

        // hover to see delete button

        // removes selected todo

        // active count accurately updates

        // "clear completed" button invisible if 0 tasks complete

        // "toggle all" visible if tasks

    // double click to edit a todo

})


test.describe('Bulk item actions', () => {

    // toggle all complete

        // all given "completed" class

            // all grey/crossed out

            // all moved from "active" list to "completed" list

        // active count to 0

        // "toggle all" button checked

        // "clear completed" button visible

    // toggle all incomplete
    
        // available if all complete

        // none have "completed" class

            // all moved from "completed" list to "active" list

            // none have greyed/crossed effect

        // "toggle all" button unchecked

        // clear completed button invisible


    // clear completed

        // only visibile once >0 tasks completed

        // active tasks stay

        // completed tasks deleted

        // "clear completed" button disappears

})


test.describe('filtering actions', () => {

    // show only active

    // show only completed

    // show all

})

