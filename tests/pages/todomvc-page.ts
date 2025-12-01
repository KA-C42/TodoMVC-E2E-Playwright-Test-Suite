import { type Locator, type Page } from '@playwright/test';


// Page object model for the TodoMVC page
// 
export class TodoMvcPage {
    readonly page: Page
    readonly todoHeader: Locator
    readonly todoApp: Locator
    readonly newTodo: Locator
    readonly todoList: Locator
    readonly todoItems: Locator
    readonly toggleAllButton: Locator
    readonly todoFooter: Locator
    readonly todoCount: Locator
    readonly clearCompletedButton: Locator

    constructor(page: Page) {
        this.page = page
        this.todoHeader = page.getByRole('heading', { name: 'todos' })
        this.todoApp = page.locator('.todoapp')
        this.newTodo = page.getByPlaceholder('What needs to be done?')
        this.todoList = page.locator('.todo-list')
        this.todoItems = this.todoList.getByRole('listitem')
        this.toggleAllButton = page.getByRole('checkbox', { name: 'Mark all as complete'})
        this.todoFooter = this.todoApp.locator('.footer')
        this.todoCount = this.todoFooter.getByTestId('todo-count')
        this.clearCompletedButton = this.todoFooter.getByRole('button', { name: "Clear completed"})
    }

    async goto() {
        await this.page.goto('/todomvc/#/')
    }

    async addTodo(todo: string) {
        await this.newTodo.fill(todo)
        await this.newTodo.press('Enter')
    }

    // basic for now, planning ahead to make edit/delete/other actions easier
    // nth needed in case of repeat todo names
    getTodoItem(todoName: string, nth: number = 0) {
        const todo = this.todoItems.filter({ hasText: todoName }).nth(nth)

        return {
            root: todo,
            checkbox: todo.getByRole('checkbox'),
            deleteButton: todo.getByLabel(/Delete/)
        }
    }
}