import { TodoMvcPage } from '../pages/todomvc-page'

export async function populateVaried(todoPage: TodoMvcPage) {
  await todoPage.addAndCompleteTodo('im literally so done')
  await todoPage.addTodo('finish this.test')
  await todoPage.addTodo('if it broke, fix it')
}

export async function populateCompleted(todoPage: TodoMvcPage) {
  await todoPage.addAndCompleteTodo('gather wood')
  await todoPage.addAndCompleteTodo('build a crafting table')
  await todoPage.addAndCompleteTodo('craft a pickaxe')
}
