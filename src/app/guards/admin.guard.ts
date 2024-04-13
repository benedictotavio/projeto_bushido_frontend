import { inject } from '@angular/core'
import { CanActivateFn, Router } from '@angular/router'
import { AuthService } from '../services/services-admin/auth.service'

export const isAdmin: CanActivateFn = (route) => {
  const role = localStorage.getItem('role')
  const email = route.paramMap.get('email')
  if (role?.toUpperCase() === 'ADMIN') {
    inject(AuthService).setAuthenticated(true)
    return true
  }
  inject(AuthService).setAuthenticated(false)
  inject(Router).navigate(['/admin', email])
  return false
}
