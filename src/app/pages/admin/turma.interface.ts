export interface Turma {
  nome: string
  tutor: {
    nome: string
    email: string
  }
  endereco: string
  dataCriacao: string
}

interface AlunoTurma {
  nome: string
  matricula: string
  genero: string
  dataNascimento: Date
}

export interface DadosDaTurmaProps {
  email: string
  alunos: AlunoTurma[]
}
