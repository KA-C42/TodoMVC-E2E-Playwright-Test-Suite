import { TodoMvcPage } from '../pages/todomvc-page'

export default async function populateVaried(todoPage: TodoMvcPage) {
  await todoPage.addAndCompleteTodo('im literally so done')
  await todoPage.addTodo('finish this.test')
  await todoPage.addTodo('if it broke, fix it')
}
