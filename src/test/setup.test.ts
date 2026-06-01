import { describe, it, expect } from 'vitest'
import fc from 'fast-check'

describe('Configuração de Testes', () => {
    it('deve executar testes unitários básicos', () => {
        expect(true).toBe(true)
    })

    it('deve executar testes baseados em propriedades com fast-check', () => {
        fc.assert(
            fc.property(fc.integer(), (n) => {
                return n + 0 === n
            })
        )
    })
})
