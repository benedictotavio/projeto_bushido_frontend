interface Responsavel {
  nome: string
  cpf: string
  telefone: string
  email: string
  filiacao: string
}

interface UsoMedicamento {
  resposta: boolean
  tipo: string
}

interface HistoricoSaude {
  fatorRh: string
  tipoSanguineo: string
  usoMedicamento: UsoMedicamento
  alergia: { resposta: boolean; tipo: string }
  cirurgia: { resposta: boolean; tipo: string }
  doencaCronica: { resposta: boolean; tipo: string }
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

interface Graduacao {
  kyu: number
  faltas: any[]
  status: boolean
  frequencia: number
}

interface Endereco {
  cidade: string
  estado: string
  cep: string
  numero: string
}

export interface AlunoResponse {
  nome: string
  dataNascimento: string
  genero: string
  dadosSociais: DadosSociais
  dadosEscolares: DadosEscolares
  dataPreenchimento: string
  endereco: Endereco
  rg: string
  responsaveis: Responsavel[]
  graduacao: Graduacao
  historicoSaude: HistoricoSaude
}
