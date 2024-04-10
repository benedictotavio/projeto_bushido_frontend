interface Endereco {
  cidade: string
  estado: string
  cep: string
  numero: string
}

interface Responsavel {
  nome: string
  cpf: string
  telefone: string
  email: string
  filiacao: 'PAI' | 'MAE' | 'OUTRO'
}

interface Faltas {
  data: string
  motivo: string
  observacao: string
}

export interface Graduacao {
  kyu: number
  faltas: Faltas[]
  status: boolean
  inicioGraduacao: string
  fimGraduacao: string
  frequencia: number
  aprovado: boolean
  cargaHoraria: number
  dan: number
}

interface UsoMedicamento {
  resposta: boolean
  tipo: string
}

interface Alergia {
  resposta: boolean
  tipo: string
}

interface Cirurgia {
  resposta: boolean
  tipo: string
}

interface DoencaCronica {
  resposta: boolean
  tipo: string
}

export interface HistoricoSaude {
  tipoSanguineo: string
  usoMedicamentoContinuo: UsoMedicamento
  alergia: Alergia
  cirurgia: Cirurgia
  doencaCronica: DoencaCronica
  deficiencias: string[]
  acompanhamentoSaude: string[]
}

interface DadosSociais {
  bolsaFamilia: boolean
  auxilioBrasil: boolean
  imovel: string
  numerosDePessoasNaCasa: number
  contribuintesDaRendaFamiliar: number
  alunoContribuiParaRenda: boolean
  rendaFamiliarEmSalariosMinimos: number
}

interface DadosEscolares {
  turno: string
  escola: string
  serie: string
}

export interface AlunoResponse {
  nome: string
  dataNascimento: string
  genero: string
  turma: string
  dadosSociais: DadosSociais
  dadosEscolares: DadosEscolares
  dataPreenchimento: string
  endereco: Endereco
  rg: string
  responsaveis: Responsavel[]
  graduacao: Graduacao[]
  historicoSaude: HistoricoSaude
}

interface HistoricoSaudeEditado {
  tipoSanguineo: string
  usoMedicamentoContinuo: UsoMedicamento
  alergia: Alergia
  cirurgia: Cirurgia
  doencaCronica: DoencaCronica
}

export interface AlunoEditado {
  dadosSociais: DadosSociais
  dadosEscolares: DadosEscolares
  endereco: Endereco
  historicoDeSaude: HistoricoSaudeEditado
}
