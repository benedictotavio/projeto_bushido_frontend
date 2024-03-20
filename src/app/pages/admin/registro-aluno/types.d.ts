interface AlunoProps {
  nome: string
  sobrenome: string
  genero: 'M' | 'F' | 'OUTRO'
  dataNascimento: string // Assuming date format is "dd-MM-yyyy"
  dadosSociais: DadosSociaisProps
  dadosEscolares: DadosEscolaresProps // Assuming date format is "yyyy-MM-ddTHH:mm:ss"
  endereco: EnderecoProps
  rg: string
  responsaveis: ResponsavelProps[]
  graduacao: {
    kyu: number
    frequencia: number
  }
  historicoSaude: historicoSaudeProps
}

interface DadosSociaisProps {
  bolsaFamilia: boolean
  auxilioBrasil: boolean
  imovel: 'CEDIDO' | 'ALUGADO' | 'PRÓPRIO' // Enum for imovel
  numerosDePessoasNaCasa: number
  contribuintesDaRendaFamiliar: number
  alunoContribuiParaRenda: boolean
  rendaFamiliarEmSalariosMinimos: number
}

interface historicoSaudeProps {
  tipoSanguineo:
    | 'A_POSITIVO'
    | 'A_NEGATIVO'
    | 'B_POSITIVO'
    | 'B_NEGATIVO'
    | 'AB_POSITIVO'
    | 'AB_NEGATIVO'
    | 'O_POSITIVO'
    | 'O_NEGATIVO'
  fatorRh: 'POSITIVO' | 'NEGATIVO'
  usoMedicamentoContinuo: {
    resposta: string
    tipo: string
  }
  cirurgia: {
    resposta: boolean
    tipo: string
  }
  alergia: {
    resposta: boolean
    tipo: string
  }
  doencaCronica: {
    resposta: boolean
    tipo: string
  }
  deficiencia: string[]
  acompanhamentoSaude: string[]
}

interface ResponsavelProps {
  nome: string
  cpf: string
  telefone: string
  email: string
  filiacao: 'PAI' | 'MÃE' | 'OUTRO'
}

interface DadosEscolaresProps {
  turno: 'MANHA' | 'TARDE' | 'NOITE'
  escola: string
  serie: number
}

interface EnderecoProps {
  cidade: string
  estado: string
  cep: string
  numero: string
}
