interface AlunoProps {
  nome: string
  turma: string
  genero: 'M' | 'F' | 'OUTRO'
  dataNascimento: number
  dadosSociais: DadosSociaisProps
  dadosEscolares: DadosEscolaresProps // Assuming date format is "yyyy-MM-ddTHH:mm:ss"
  endereco: EnderecoProps
  rg: string
  responsaveis: ResponsavelProps
  graduacao: {
    kyu: number
    dan: number
  }
  historicoSaude: historicoSaudeProps
}

interface DadosSociaisProps {
  bolsaFamilia: boolean
  auxilioBrasil: boolean
  imovel: 'CEDIDO' | 'ALUGADO' | 'PROPRIO' // Enum for imovel
  numerosDePessoasNaCasa: number
  contribuintesDaRendaFamiliar: number
  alunoContribuiParaRenda: boolean
  rendaFamiliar: number
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
  logradouro: string
}

interface EnderecoViaCepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}
