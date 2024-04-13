export const setAdminLocalStorage = (role: string, token: string) => {
  localStorage.setItem('token', token)
  localStorage.setItem('role', role)
}

export const removeAdminLocalStorage = () => {
  removeAdminLocalStorage()
  localStorage.removeItem('role')
}
