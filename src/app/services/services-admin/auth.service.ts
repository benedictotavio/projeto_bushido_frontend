import { Injectable } from '@angular/core'
import { JwtHelperService } from '@auth0/angular-jwt'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false)
  public isAuthenticated = this.isAuthenticatedSubject.asObservable()
  private readonly role = localStorage.getItem('role')

  constructor(private readonly jwtService: JwtHelperService) {}

  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticatedSubject.next(isAuthenticated)
  }

  getAuthenticated() {
    return this.isAuthenticated
  }

  public isTokenExpired(token: string): boolean {
    return this.jwtService.isTokenExpired(token)
  }

  public removeToken() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    localStorage.removeItem('turmas')
  }

  public setAdminLocalStorage(role: string, token: string, turmas: { endereco: string; nome: string }[]) {
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('turmas', JSON.stringify(turmas))
  }

  public isAdmin(): boolean {
    if (!this.role) return false
    return localStorage.getItem(this.role.toUpperCase()) === 'ADMIN'
  }
}
