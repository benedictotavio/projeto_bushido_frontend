import { AlunoEditado } from 'src/app/pages/admin/aluno.interface'
import { Component } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { environment } from '../../../../environments/environment'
import { ActivatedRoute, Router } from '@angular/router'
import { SignUp } from '../auth.interface'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { validarEmail } from '../validator'
import { NgForm } from '@angular/forms'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AlunoService } from 'src/app/services/services-admin/aluno.service'

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  private readonly ApiBushido = environment.urlApi + 'admin/signup'
  user: SignUp = {
    nome: '',
    email: '',
    cargo: '',
    senha: '',
    role: ''
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private alunoService: AlunoService
  ) {}

  registrarNovoAdmin(form: NgForm) {
    if (form.invalid) {
      this.markAllFieldsAsTouched(form)
      this.snackBar.open('Preencha os campos obrigatórios e submeta o formulário', '', {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      })
      return
    }
    this.http
      .post<{ id: string; nome: string; message: string }>(this.ApiBushido, this.user, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .subscribe({
        next: (response) => {
          this.alunoService.showSnackbar(response['message'], 'success-snackbar')
          this.router.navigate([`/admin/${this.route.snapshot.paramMap.get('email')}`])
        },
        error: (error) => this.alunoService.handleError(error, 'Administrador/Tutor')
      })
  }

  isEmailValid(email: string): boolean {
    return validarEmail(email)
  }

  private markAllFieldsAsTouched(form: NgForm) {
    Object.keys(form.controls).forEach((field) => {
      const control = form.controls[field]
      control.markAsTouched({ onlySelf: true })
    })
  }
}
