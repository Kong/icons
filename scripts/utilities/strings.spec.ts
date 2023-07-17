import { describe, it, expect } from 'vitest'
import { capitalize, pascalCase, camelCase, kebabCase } from './index'

describe('string utilities', () => {
  describe('capitalize', () => {
    it('capitalizes the input string', () => {
      const str = 'my test string'
      const result = capitalize(str)

      expect(result).toEqual('My test string')
    })
  })

  describe('pascalCase', () => {
    it('converts an input string to pascal case', () => {
      const str = 'my test string'
      const result = pascalCase(str)

      expect(result).toEqual('MyTestString')
    })
  })

  describe('camelCase', () => {
    it('converts an input string to camel case', () => {
      const str = 'my test string'
      const result = camelCase(str)

      expect(result).toEqual('myTestString')
    })
  })

  describe('kebabCase', () => {
    it('converts an input string to kebab case', () => {
      const str = 'my test string'
      const result = kebabCase(str)

      expect(result).toEqual('my-test-string')
    })
  })
})
