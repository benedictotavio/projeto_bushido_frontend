import { Component } from '@angular/core'
import { AuthService } from './services/services-admin/auth.service'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'projeto-bushido_font-end'
  isAuthenticated?: Observable<boolean>

  constructor(private authService: AuthService) {
    // Atribui o resultado do Observable diretamente à variável isAuthenticated
    this.isAuthenticated = this.authService.getAuthenticated()
  }
}
