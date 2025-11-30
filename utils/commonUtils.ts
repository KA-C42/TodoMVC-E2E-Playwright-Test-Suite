import { expect } from '@playwright/test'
import { TodoMvcPage } from '../pages/todomvc-page'


export default async function expectEmptyState(todoPage: TodoMvcPage) {
    await expect(todoPage.newTodo).toBeEmpty()
    await expect(todoPage.todoItems).toHaveCount(0)
    await expect(todoPage.toggleAllButton).toHaveCount(0)
    await expect(todoPage.todoFooter).toHaveCount(0)
}