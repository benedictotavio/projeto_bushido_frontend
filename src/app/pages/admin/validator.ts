import { cpf as cpfValidator } from 'cpf-cnpj-validator'

export function validarCPF(cpf: string | null): boolean {
  if (!cpf) {
    return false
  }
  return cpfValidator.isValid(cpf)
}

export function validarRG(rg: string | null): boolean {
  if (!rg) {
    return false
  }

  rg = rg.replace(/[^\dX]+/g, '')
  return rg.length >= 7 && rg.length <= 12 && /^(\d{7,11}X?)$/.test(rg)
}

export function validarCartaoSus(cartaoSus: string | null): boolean {
  if (!cartaoSus) {
    return false
  }
  cartaoSus = cartaoSus.replace(/[^\dX]+/g, '')
  const regex = /^\d{14}[X]?$|^\d{15}$/
  return regex.test(cartaoSus)
}

export function validarEmail(email: string | null): boolean {
  if (!email) {
    return false
  }
  const regex =
    /^(([^<>()[]+(\.[^<>()[]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return regex.test(email)
}

export function validarTelefone(telefone: string | null): boolean {
  if (!telefone) {
    return false
  }
  const regex = /(^[0-9]{2})?(\s|-)?(9?[0-9]{4})-?([0-9]{4}$)/
  return regex.test(telefone)
}

export function validarCep(cep: string | null): boolean {
  if (!cep) {
    return false
  }
  cep = cep.replace(/[^\d]+/g, '')
  const regex = /(^[0-9]{5})-?([0-9]{3}$)/
  return regex.test(cep)
}

export function validarIdadeAluno(dateString: number | null): boolean {
  if (!dateString) {
    return false
  }
  const today = new Date()
  const birthDate = new Date(dateString)

  const ageInMilliseconds = today.getTime() - birthDate.getTime()
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25)

  return ageInYears >= 5
}
