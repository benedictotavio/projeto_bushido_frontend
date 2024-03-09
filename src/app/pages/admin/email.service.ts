import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private email = ''

  setEmail(email: string): void {
    this.email = email
  }

  getEmail(): string {
    return this.email
  }
}
