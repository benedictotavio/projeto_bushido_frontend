export interface Turma {
  nome: string
  tutor: {
    nome: string
    email: string
  }
  endereco: string
}

export interface AlunoTurma {
  nome: string
  rg: string
  genero: string
  dataNascimento: Date
}
