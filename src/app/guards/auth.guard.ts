import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/services-admin/auth.service'
import { inject } from '@angular/core'
import { AlunoService } from '../services/services-admin/aluno.service'

export const isAuthenticated: CanActivateFn = () => {
  const token = localStorage.getItem('token')
  if (token && !inject(AuthService).isTokenExpired(token)) {
    inject(AuthService).setAuthenticated(true)
    return true
  }
  inject(AuthService).setAuthenticated(false)
  inject(AlunoService).showSnackbar(
    'Sua sessão expirou. refaça o login para continuar a acessar o sistema',
    'error-snackbar'
  )
  inject(AuthService).removeToken()
  inject(Router).navigate(['/admin'])
  return false
}
