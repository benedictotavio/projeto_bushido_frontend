import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AlunoService } from './aluno.service'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { environment } from 'src/environments/environment'

describe('AlunoService', () => {
  let service: AlunoService
  let httpMock: HttpTestingController
  let mockRouter: Router
  let mockSnackbar: MatSnackBar
  let mockAuthService: AuthService

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AlunoService,
        {
          provide: Router,
          useValue: { navigate: jest.fn() }
        },
        {
          provide: MatSnackBar,
          useValue: {
            open: jest.fn()
          }
        },
        {
          provide: AuthService,
          useValue: {
            removeToken: jest.fn()
          }
        }
      ]
    })

    service = TestBed.inject(AlunoService)
    httpMock = TestBed.inject(HttpTestingController)
    mockRouter = TestBed.inject(Router)
    mockSnackbar = TestBed.inject(MatSnackBar)
    mockAuthService = TestBed.inject(AuthService)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('deveria listar turmas', () => {
    service.listarTurmas().subscribe((turmas) => {
      expect(turmas).toBeTruthy()
    })

    const req = httpMock.expectOne(`${environment.urlApi}turma`)
    expect(req.request.method).toBe('GET')
    req.flush([])
  })

  it('deveria registrar um aluno', () => {
    const formData = new FormData()
    const url = `${environment.urlApi}aluno`

    service.registrarAluno(url, formData).subscribe((response) => {
      expect(response).toBeTruthy()
    })

    const req = httpMock.expectOne(url)
    expect(req.request.method).toBe('POST')
    req.flush({ id: '1', message: 'Aluno registrado com sucesso' })
  })

  it('deve buscar um aluno por matrícula', () => {
    const matricula = '12345'
    service.buscarAlunoPorMatricula(matricula).subscribe((aluno) => {
      expect(aluno).toBeTruthy()
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno?matricula=${matricula}`)
    expect(req.request.method).toBe('GET')
    req.flush([])
  })

  it('deve buscar endereço pelo CEP e retornar a resposta correta', () => {
    const cep = '01001-000'
    const mockResponse = {
      cep: '01001-000',
      logradouro: 'Praça da Sé',
      complemento: '',
      bairro: 'Sé',
      localidade: 'São Paulo',
      uf: 'SP',
      ibge: '3550308',
      gia: '1004',
      ddd: '11',
      siafi: '7087'
    }

    service.buscarEnderecoPeloCep(cep).subscribe((response) => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`https://viacep.com.br/ws/${service['removeSpecialCharacters'](cep)}/json/`)
    expect(req.request.method).toBe('GET')
    req.flush(mockResponse)
  })

  it('deve editar aluno por matrícula e retornar a resposta correta', () => {
    const url = 'http://api.exemplo.com/alunos'
    const matricula = '123456'
    const aluno = new FormData()
    aluno.append('nome', 'João Silva')
    aluno.append('idade', '20')

    const mockResponse = { id: '123456', message: 'Aluno atualizado com sucesso' }

    service.editarAlunoPorMatricula(url, matricula, aluno).subscribe((response) => {
      expect(response).toEqual(mockResponse)
    })

    const req = httpMock.expectOne(`${url}/${matricula}`)
    expect(req.request.method).toBe('PUT')
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${service['token']}`)
    req.flush(mockResponse)
  })

  it('deve editar o status do aluno', () => {
    const matricula = '123'
    service.editarStatusAluno(matricula, true).subscribe((response) => {
      expect(response).toBeTruthy()
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/graduacao/${matricula}/mudarStatus/true`)
    expect(req.request.method).toBe('PUT')
    req.flush({ message: 'Status alterado com sucesso' })
  })

  it('deveria adicionar deficiência', () => {
    const matricula = '123'
    const deficiencia = 'deficienciaExemplo'

    service.adicionarDeficiencia(matricula, deficiencia).subscribe((response) => {
      expect(response.message).toBe('Deficiência adicionada com sucesso')
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/deficiencia/${matricula}?deficiencia=${deficiencia}`)
    expect(req.request.method).toBe('POST')
    req.flush({ message: 'Deficiência adicionada com sucesso' })
  })

  it('deveria adicionar acompanhamento de saúde', () => {
    const matricula = '123'
    const acompanhamento = 'acompanhamentoExemplo'

    service.adicionarAcompanhamentoSaude(matricula, acompanhamento).subscribe((response) => {
      expect(response.message).toBe('Acompanhamento de saúde adicionado com sucesso')
    })

    const req = httpMock.expectOne(
      `${environment.urlApi}aluno/acompanhamentoSaude/${matricula}?acompanhamento=${acompanhamento}`
    )
    expect(req.request.method).toBe('POST')
    req.flush({ message: 'Acompanhamento de saúde adicionado com sucesso' })
  })

  it('deveria adicionar falta', () => {
    const matricula = '123'
    const data = '2023-01-01'
    const novaFalta = { motivo: 'Motivo da falta', observacao: 'Observação da falta' }

    service.adicionarFalta(matricula, data, novaFalta).subscribe((response) => {
      expect(response.message).toBe('Falta adicionada com sucesso')
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/falta/${matricula}/${data}`)
    expect(req.request.method).toBe('POST')
    req.flush({ message: 'Falta adicionada com sucesso' })
  })

  it('deveria remover falta', () => {
    const matricula = '123'
    const faltaId = '456'

    service.removerFalta(matricula, faltaId).subscribe((response) => {
      expect(response.message).toBe('Falta removida com sucesso')
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/falta/${matricula}/${faltaId}`)
    expect(req.request.method).toBe('DELETE')
    req.flush({ message: 'Falta removida com sucesso' })
  })

  it('deveria remover acompanhamento de saúde', () => {
    const matricula = '123'
    const acompanhamentoId = '456'

    service.removerAcompanhamentoSaude(matricula, acompanhamentoId).subscribe((response) => {
      expect(response.message).toBe('Acompanhamento de saúde removido com sucesso')
    })

    const req = httpMock.expectOne(
      `${environment.urlApi}aluno/acompanhamentoSaude/${matricula}?acompanhamento=${acompanhamentoId}`
    )
    expect(req.request.method).toBe('DELETE')
    req.flush({ message: 'Acompanhamento de saúde removido com sucesso' })
  })

  it('deveria remover deficiência', () => {
    const matricula = '123'
    const deficienciaId = '456'

    service.removerDeficiencia(matricula, deficienciaId).subscribe((response) => {
      expect(response.message).toBe('Deficiência removida com sucesso')
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/deficiencia/${matricula}?deficiencia=${deficienciaId}`)
    expect(req.request.method).toBe('DELETE')
    req.flush({ message: 'Deficiência removida com sucesso' })
  })

  it('deveria remover responsável', () => {
    const matricula = '123'
    const responsavelId = '456'

    service.removerResponsavel(matricula, responsavelId).subscribe((response) => {
      expect(response.message).toBe('Responsável removido com sucesso')
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/responsavel/${matricula}?cpf=${responsavelId}`)
    expect(req.request.method).toBe('DELETE')
    req.flush({ message: 'Responsável removido com sucesso' })
  })

  it('deveria aprovar aluno', () => {
    const matricula = '123'
    const nota = 10

    service.aprovacao(matricula, nota).subscribe((response) => {
      expect(response.message).toBe('Aluno aprovado com sucesso')
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/graduacao/${matricula}/aprovar/${nota}`)
    expect(req.request.method).toBe('POST')
    req.flush({ message: 'Aluno aprovado com sucesso' })
  })

  it('deveria reprovar aluno', () => {
    const matricula = '123'
    const nota = 5

    service.reprovacao(matricula, nota).subscribe((response) => {
      expect(response.message).toBe('Aluno reprovado com sucesso')
    })

    const req = httpMock.expectOne(`${environment.urlApi}aluno/graduacao/${matricula}/reprovar/${nota}`)
    expect(req.request.method).toBe('POST')
    req.flush({ message: 'Aluno reprovado com sucesso' })
  })

  it('deve tratar o erro 401 e chamar o snackbar com a mensagem adequada', () => {
    const errorResponse = { status: 401, message: 'Unauthorized' }

    service.handleError(errorResponse)

    expect(mockSnackbar.open).toHaveBeenCalledWith('Sessão expirada. Por favor, faça login novamente.', '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    })

    expect(mockAuthService.removeToken).toHaveBeenCalled()
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin'])
  })

  it('deve tratar o erro 404 com a mensagem adequada', () => {
    const errorResponse = { status: 404 }

    service.handleError(errorResponse, 'Falta')
    expect(mockSnackbar.open).toHaveBeenCalledWith(
      'Erro: Falta não encontrado(a). Verifique se os dados estão corretos.',
      '',
      { duration: 5000, verticalPosition: 'top', panelClass: ['error-snackbar'] }
    )
  })

  it('deve tratar o erro 400 com a mensagem adequada', () => {
    const errorResponse = { status: 400 }

    service.handleError(errorResponse)

    expect(mockSnackbar.open).toHaveBeenCalledWith('Requisição inválida. Verifique os dados fornecidos.', '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    })
  })

  it('deve tratar o erro 403 com a mensagem adequada', () => {
    const errorResponse = { status: 403 }

    service.handleError(errorResponse)

    expect(mockSnackbar.open).toHaveBeenCalledWith('Você não tem permissão para realizar esta ação.', '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    })
  })

  it('deve tratar o erro 409 com a mensagem adequada', () => {
    const errorResponse = { status: 409 }

    service.handleError(errorResponse)

    expect(mockSnackbar.open).toHaveBeenCalledWith(
      'Conflito de dados. Verifique se já existe um registro com essas informações.',
      '',
      { duration: 5000, verticalPosition: 'top', panelClass: ['error-snackbar'] }
    )
  })

  it('deve tratar o erro 500 com a mensagem adequada', () => {
    const errorResponse = { status: 500 }

    service.handleError(errorResponse)

    expect(mockSnackbar.open).toHaveBeenCalledWith('Erro interno do servidor. Tente novamente mais tarde.', '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    })
  })

  it('deve tratar um erro desconhecido com mensagem geral', () => {
    const errorResponse = { status: 999 }

    service.handleError(errorResponse)

    expect(mockSnackbar.open).toHaveBeenCalledWith('Erro desconhecido. Entre em contato com o suporte.', '', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    })
  })
})
