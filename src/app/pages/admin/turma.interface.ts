export interface Turma {
  nome: string
  tutor: {
    nome: string
    email: string
  }
  endereco: string
}

interface AlunoTurma {
  nome: string
  rg: string
  genero: string
  dataNascimento: Date
}

export interface DadosDaTurmaProps {
  email: string
  alunos: AlunoTurma[]
}
