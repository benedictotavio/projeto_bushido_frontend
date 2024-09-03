import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { environment } from 'src/environments/environment'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { Turma } from 'src/app/pages/admin/turma.interface'
import { EnderecoViaCepResponse } from 'src/app/pages/admin/types'
import { AlunoResponse } from 'src/app/pages/admin/aluno.interface'

@Injectable({
  providedIn: 'root'
})
export class AlunoService {
  private readonly token = localStorage.getItem('token')
  private readonly ApiBushido = `${environment.urlApi}aluno`
  private readonly ApiBushidoComImagem = `${environment.urlApi}aluno/comImagem`

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  listarTurmas() {
    return this.http.get<Turma[]>(`${environment.urlApi}turma`, {
      headers: { Authorization: 'Bearer ' + this.token }
    })
  }

  registrarAluno(url: string, alunoFormData: FormData) {
    return this.http.post<{ id: string; message: string }>(url, alunoFormData, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  }

  buscarEnderecoPeloCep(cep: string) {
    return this.http.get<EnderecoViaCepResponse>(`https://viacep.com.br/ws/${this.removeSpecialCharacters(cep)}/json/`)
  }

  buscarAlunoPorMatricula(matricula: string) {
    return this.http.get<AlunoResponse[]>(`${this.ApiBushido}?matricula=${matricula}`, {
      headers: { Authorization: 'Bearer ' + this.token }
    })
  }

  editarAlunoPorMatricula(url: string, matricula: string, aluno: FormData) {
    return this.http.put<{ id: string; message: string }>(`${url}/${matricula}`, aluno, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  }
  adicionarDeficiencia(matricula: string, deficiencia: any) {
    return this.http.post<{ message: string }>(
      `${this.ApiBushido}/deficiencia/${matricula}?deficiencia=${deficiencia}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      }
    )
  }
  adicionarAcompanhamentoSaude(matricula: string, acompanhamento: any) {
    return this.http.post<{ message: string }>(
      `${this.ApiBushido}/acompanhamentoSaude/${matricula}?acompanhamento=${acompanhamento}`,
      {},
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.token}`
        }
      }
    )
  }

  adicionarFalta(matricula: string, data: string, novaFalta: { motivo: string; observacao: string }) {
    return this.http.post<{ message: string }>(`${this.ApiBushido}/falta/${matricula}/${data}`, novaFalta, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      }
    })
  }

  removerFalta(matricula: string, faltaId: string) {
    return this.http.delete<{ message: string }>(`${this.ApiBushido}/falta/${matricula}/${faltaId}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  }

  removerAcompanhamentoSaude(matricula: string, acompanhamentoId: string) {
    return this.http.delete<{ message: string }>(
      `${this.ApiBushido}/acompanhamentoSaude/${matricula}?acompanhamento=${acompanhamentoId}`,
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    )
  }

  removerDeficiencia(matricula: string, deficienciaId: string) {
    return this.http.delete<{ message: string }>(
      `${this.ApiBushido}/deficiencia/${matricula}?deficiencia=${deficienciaId}`,
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    )
  }

  removerResponsavel(matricula: string, responsavelId: string) {
    return this.http.delete<{ message: string }>(`${this.ApiBushido}/responsavel/${matricula}?cpf=${responsavelId}`, {
      headers: { Authorization: `Bearer ${this.token}` }
    })
  }

  aprovacao(matricula: string, nota: number) {
    return this.http.post<{ message: string }>(
      `${this.ApiBushido}/graduacao/${matricula}/aprovar/${nota}`,
      {},
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    )
  }

  reprovacao(matricula: string, nota: number) {
    return this.http.post<{ message: string }>(
      `${this.ApiBushido}/graduacao/${matricula}/reprovar/${nota}`,
      {},
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    )
  }

  editarStatusAluno(matricula: string, status: boolean) {
    return this.http.put<{ message: string }>(
      `${this.ApiBushido}/graduacao/${matricula}/mudarStatus/${status}`,
      {},
      {
        headers: { Authorization: `Bearer ${this.token}` }
      }
    )
  }

  isAdmin(role: string | null): boolean {
    return role?.toUpperCase() === 'ADMIN'
  }

  private removeSpecialCharacters(inputString: string): string {
    return inputString.replace(/[-.]/g, '')
  }

  handleError(error: any, action?: string): void {
    let message = 'Erro desconhecido. Entre em contato com o suporte.'

    switch (error.status) {
      case 401:
        message = 'Sessão expirada. Por favor, faça login novamente.'
        this.authService.removeToken()
        this.router.navigate(['/admin'])
        break
      case 404:
        message = action
          ? `Erro: ${action} não encontrado(a). Verifique se os dados estão corretos.`
          : 'Recurso não encontrado. Verifique os dados.'
        break
      case 400:
        message = 'Requisição inválida. Verifique os dados fornecidos.'
        break
      case 403:
        message = 'Você não tem permissão para realizar esta ação.'
        break
      case 409:
        message = 'Conflito de dados. Verifique se já existe um registro com essas informações.'
        break
      case 411:
        message = 'O comprimento do conteúdo não foi especificado. Verifique os dados enviados.'
        break
      case 500:
        message = 'Erro interno do servidor. Tente novamente mais tarde.'
        break
      default:
        break
    }

    this.showSnackbar(message, 'error-snackbar')
  }

  showSnackbar(message: string, panelClass: string) {
    this.snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: [panelClass]
    })
  }
}
