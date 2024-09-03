import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Router } from '@angular/router'
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FormsModule, NgForm } from '@angular/forms'
import { RegistroAlunoComponent } from './registro-aluno.component'
import { AlunoService } from 'src/app/services/services-admin/aluno.service'
import { AuthService } from 'src/app/services/services-admin/auth.service'
import { of } from 'rxjs'
import { AlunoProps } from '../../types'
import * as EventEmitter from 'events'

describe('RegistroAlunoComponent', () => {
  function createTestAluno(): AlunoProps {
    return {
      cpf: '12345678909',
      rg: '1234567',
      nome: 'Teste Aluno',
      telefone: '91234-5678',
      email: 'teste@email.com',
      genero: 'M',
      corDePele: '',
      turma: '1A',
      cartaoSus: '12345678901234',
      dataNascimento: new Date('2000-01-01').getTime(),
      dadosSociais: {
        bolsaFamilia: true,
        auxilioBrasil: false,
        imovel: '',
        numerosDePessoasNaCasa: 4,
        contribuintesDaRendaFamiliar: 2,
        alunoContribuiParaRenda: false,
        rendaFamiliar: 2000
      },
      dadosEscolares: {
        turno: '',
        escola: 'Escola Teste',
        serie: 5
      },
      endereco: {
        estado: 'RJ',
        cidade: 'Teste Cidade',
        cep: '01001000',
        numero: '123',
        logradouro: 'Rua Teste'
      },
      responsaveis: {
        nome: 'Responsável 1',
        cpf: '12345678901',
        telefone: '91234-5678',
        email: 'email@email.com',
        filiacao: 'PAI'
      },
      graduacao: { kyu: 1, dan: null },
      historicoSaude: {
        tipoSanguineo: 'AB_POSITIVO',
        usoMedicamentoContinuo: { resposta: 'Sim', tipo: 'Antibiótico' },
        cirurgia: { resposta: false, tipo: '' },
        alergia: { resposta: true, tipo: 'Amendoim' },
        doencaCronica: { resposta: false, tipo: '' },
        deficiencia: [],
        acompanhamentoSaude: ['Acompanhamento 2']
      }
    }
  }

  let component: RegistroAlunoComponent
  let fixture: ComponentFixture<RegistroAlunoComponent>
  let mockAlunoService: Partial<AlunoService>
  let mockRouter: Partial<Router>
  let mockActivatedRoute: any
  let mockAuthService: Partial<AuthService>
  let mockSnackBar: Partial<MatSnackBar>

  beforeEach(async () => {
    mockAlunoService = {
      listarTurmas: jest.fn(),
      showSnackbar: jest.fn(),
      registrarAluno: jest.fn(),
      buscarEnderecoPeloCep: jest.fn(),
      handleError: jest.fn()
    }

    mockRouter = {
      navigate: jest.fn()
    }

    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jest.fn().mockReturnValue('test-email@example.com')
        }
      }
    }

    mockAuthService = {
      removeToken: jest.fn()
    }

    mockSnackBar = {
      open: jest.fn()
    }

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RegistroAlunoComponent],
      providers: [
        { provide: AlunoService, useValue: mockAlunoService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: AuthService, useValue: mockAuthService },
        { provide: MatSnackBar, useValue: mockSnackBar }
      ]
    }).compileComponents()

    fixture = TestBed.createComponent(RegistroAlunoComponent)
    component = fixture.componentInstance
  })

  beforeEach(() => {
    mockAlunoService.listarTurmas = jest.fn().mockReturnValue(of([]))
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('deveria chamar listar turmas listarTurmas on ngOnInit', () => {
    component.ngOnInit()
    expect(mockAlunoService.listarTurmas).toHaveBeenCalled()
  })

  it('deveria validar a data de nascimento nascimento', () => {
    component.aluno = createTestAluno()

    expect(component.isDataNascValid()).toBe(true)

    component.aluno.dataNascimento = new Date('2024-01-01').getTime()
    expect(component.isDataNascValid()).toBe(false)
  })

  it('deveria registrar aluno e chamar o snackbar de sucesso', () => {
    const mockForm = {
      invalid: false,
      controls: {
        nome: { markAsTouched: jest.fn() },
        cpf: { markAsTouched: jest.fn() }
      },
      submitted: false
    } as unknown as NgForm

    const mockResponse = { message: 'Aluno registrado com sucesso', id: 1 }
    mockAlunoService.registrarAluno = jest.fn().mockReturnValue(of(mockResponse))

    component.registrarAluno(mockForm)

    expect(mockAlunoService.showSnackbar).toHaveBeenCalledWith(mockResponse.message, 'success-snackbar')
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/test-email@example.com/aluno', mockResponse.id])
  })

  it('deveria chamar markAllFieldsAsTouched quando o formulário for inválido', () => {
    const mockForm = {
      invalid: true,
      controls: {
        nome: { markAsTouched: jest.fn() },
        cpf: { markAsTouched: jest.fn() }
      },
      submitted: false,
      _directives: [],
      form: {},
      ngSubmit: new EventEmitter()
    } as unknown as NgForm

    component.markAllFieldsAsTouched(mockForm)

    expect(mockForm.controls['nome'].markAsTouched).toHaveBeenCalled()
    expect(mockForm.controls['cpf'].markAsTouched).toHaveBeenCalled()
  })

  it('deveria buscar endereço pelo CEP e atualizar o endereço', () => {
    const mockCepResponse = {
      cep: '01001-000',
      localidade: 'São Paulo',
      uf: 'SP',
      logradouro: 'Rua Teste'
    }

    component.endereco.cep = '01001-000'
    mockAlunoService.buscarEnderecoPeloCep = jest.fn().mockReturnValue(of(mockCepResponse))

    component.buscarEnderecoPeloCep()

    expect(mockAlunoService.buscarEnderecoPeloCep).toHaveBeenCalledWith(component.endereco.cep)
    expect(component.endereco).toEqual({
      cep: '01001-000',
      cidade: 'São Paulo',
      estado: 'SP',
      logradouro: 'Rua Teste',
      numero: ''
    })
  })
  it('deveria chamar handleCepError para erro de busca de CEP', () => {
    const mockError = { status: 404 }
    component.handleCepError(mockError)

    expect(mockAlunoService.showSnackbar).toHaveBeenCalledWith('CEP inválido', 'error-snackbar')
    expect(component.endereco.cep).toBe('')
  })

  it('Deveria validar CPF', () => {
    expect(component.isCpfValid('11773473778')).toBe(true)
    expect(component.isCpfValid('12345678909')).toBe(false)
  })

  it('Deveria validar RG', () => {
    expect(component.isRgValid('1234567')).toBe(true)
    expect(component.isRgValid('')).toBe(false)
  })

  it('Deveria validar  Cartão SUS', () => {
    expect(component.isCartaoSusValid('12345678901234')).toBe(true)
    expect(component.isCartaoSusValid(null)).toBe(false)
  })

  it('Deveria validar Email', () => {
    expect(component.isEmailValid('valid@email.com')).toBe(true)
    expect(component.isEmailValid('invalid-email')).toBe(false)
  })

  it('Deveria validar Telefone', () => {
    expect(component.isTelefoneValid('(91234-5678')).toBe(true)
    expect(component.isTelefoneValid('invalid-phone')).toBe(false)
  })

  it('Deveria validar CEP', () => {
    expect(component.isCepValid('01001000')).toBe(true)
    expect(component.isCepValid('invalid-cep')).toBe(false)
  })

  it('Deveria validar Renda', () => {
    expect(component.isRendaValid(1000)).toBe(true)
    expect(component.isRendaValid(300001)).toBe(false)
    expect(component.isRendaValid(null)).toBe(true)
  })

  it('Deveria validar Série', () => {
    expect(component.isSerieValid(3)).toBe(true)
    expect(component.isSerieValid(0)).toBe(false)
    expect(component.isSerieValid(10)).toBe(false)
    expect(component.isSerieValid(null)).toBe(true)
  })

  it('Deveria validar Número de Pessoas na Casa', () => {
    expect(component.isPessoasNaCasaValid(5)).toBe(true)
    expect(component.isPessoasNaCasaValid(0)).toBe(false)
    expect(component.isPessoasNaCasaValid(16)).toBe(false)
    expect(component.isPessoasNaCasaValid(null)).toBe(true)
  })

  it('Deveria validar Contribuintes da Renda', () => {
    expect(component.isContribuintesDaRendaValid(3)).toBe(true)
    expect(component.isContribuintesDaRendaValid(0)).toBe(false)
    expect(component.isContribuintesDaRendaValid(16)).toBe(false)
    expect(component.isContribuintesDaRendaValid(null)).toBe(true)
  })

  it('Deveria validar Deficiência', () => {
    expect(component.isDeficienciaValid('')).toBe(true)
    expect(component.isDeficienciaValid('Deficiência A')).toBe(true)
    expect(component.isDeficienciaValid(null)).toBe(true)
  })

  it('Deveria validar Acompanhamento de Saúde', () => {
    expect(component.isAcompanhamentoSaudeValid('')).toBe(true)
    expect(component.isAcompanhamentoSaudeValid('Acompanhamento')).toBe(true)
    expect(component.isAcompanhamentoSaudeValid(null)).toBe(true)
  })

  it('Deveria validar Alergia', () => {
    expect(component.isAlergiaValid('')).toBe(true)
    expect(component.isAlergiaValid('Alergia A')).toBe(true)
    expect(component.isAlergiaValid(null)).toBe(true)
  })

  it('Deveria validar Uso de Medicamentos', () => {
    expect(component.isUsoMedicamentosValid('')).toBe(true)
    expect(component.isUsoMedicamentosValid('Uso Medicamento A')).toBe(true)
    expect(component.isUsoMedicamentosValid(null)).toBe(true)
  })

  it('Deveria validar Cirurgias', () => {
    expect(component.isCirurgiasValid('')).toBe(true)
    expect(component.isCirurgiasValid('Cirurgia A')).toBe(true)
    expect(component.isCirurgiasValid(null)).toBe(true)
  })

  it('Deveria validar Doença Crônica', () => {
    expect(component.isDoencaCronicaValid('')).toBe(true)
    expect(component.isDoencaCronicaValid('Doença A')).toBe(true)
    expect(component.isDoencaCronicaValid(null)).toBe(true)
  })
})
