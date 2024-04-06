interface Aluno {
  nome: string
  dataNascimento: Date
  genero: string
  rg: string
  dataPreenchimento: Date
}

export interface Turma {
  nome: string
  tutor: string
  endereco: string
  alunos: Aluno[]
}
