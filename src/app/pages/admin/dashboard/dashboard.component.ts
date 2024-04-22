import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AuthService } from 'src/app/services/services-admin/auth.service'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(
    private route: ActivatedRoute,
    private readonly authService: AuthService
  ) {}
  private readonly role = localStorage.getItem('role')
  protected readonly email = this.route.snapshot.paramMap.get('email')
  protected showDropDown = false

  isAdmin(): boolean {
    return this.role?.toUpperCase() === 'ADMIN'
  }

  removeToken(): void {
    this.authService.removeToken()
  }

  protected setShowDropDown() {
    this.showDropDown = !this.showDropDown
  }
}
