export const createTask = (title, task) => {
  return {
    title,
    task: () => task,
  }
}
