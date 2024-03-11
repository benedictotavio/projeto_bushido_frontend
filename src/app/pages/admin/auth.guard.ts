import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from 'src/app/services/services-admin/authservice.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token')

    if (token) {
      this.authService.setAuthenticated(true)
      return true // Permite o acesso à rota se o usuário estiver autenticado
    } else {
      this.authService.setAuthenticated(false)
      this.router.navigate(['/admin']) // Redireciona para a página de login se o usuário não estiver autenticado
      return false
    }
  }
}
