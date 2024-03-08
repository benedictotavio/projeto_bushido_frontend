import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token')

    if (token) {
      return true // Permite o acesso à rota se o usuário estiver autenticado
    } else {
      this.router.navigate(['/admin']) // Redireciona para a página de login se o usuário não estiver autenticado
      return false;
    }
  }
}
