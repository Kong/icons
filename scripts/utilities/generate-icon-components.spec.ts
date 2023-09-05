import { describe, it, expect } from 'vitest'
import { getAllFiles } from './index'
import fs from 'fs'
import path, { basename } from 'path'
import * as importedComponents from '../../src/components'

/**
 * The tests in this file will only successfully run after
 * the `yarn build` (or `yarn generate`) script has been run.
 *
 * See the `vitest.config.ts` `globalSetup` configuration.
 */

describe('generate', () => {
  describe('`/svg/` directory', () => {
    it('generates one icon component per svg file in the `/svg/` directory', () => {
      const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
      const allComponentFiles = getAllFiles(path.resolve('./src/components'), 'vue')

      expect(allSvgFiles.length).not.toEqual(0)
      expect(allSvgFiles.length).toEqual(allComponentFiles.length)
    })

    it('ensures all `/flag/` directory SVGs have a two-letter filename', () => {
      const allFlagSvgFiles = getAllFiles(path.resolve('./svg/flags'), 'svg')
      const allFlagComponentFiles = getAllFiles(path.resolve('./svg/flags'), 'vue')

      for (const svg of allFlagSvgFiles) {
        expect(basename(svg).replace(/\.svg$/, '').length).toEqual(2)
      }

      for (const component of allFlagComponentFiles) {
        expect(basename(component).replace(/^Flag/, '').replace(/Icon\.vue$/, '').length).toEqual(2)
      }
    })
  })

  describe('`/src/components/index.ts` file', () => {
    it('generates the file with the correct number of exports', () => {
      const componentIndexFile = fs.existsSync(path.resolve('./src/components/index.ts'))
      expect(componentIndexFile).toEqual(true)

      const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
      expect(allSvgFiles.length).not.toEqual(0)
      expect(allSvgFiles.length).toEqual(Object.keys(importedComponents).length)
    })

    it('has exports that match the previous snapshot', async () => {
      const componentExports = await import(path.resolve('./src/components/index.ts'))

      expect(Object.keys(componentExports)).toMatchSnapshot()
    })
  })

  describe('`/src/component-list.ts` file', () => {
    it('exports an array of component filenames', async () => {
      const componentListFile = fs.existsSync(path.resolve('./src/component-list.ts'))
      expect(componentListFile).toEqual(true)

      const { default: componentList } = await import(path.resolve('./src/component-list.ts'))

      console.log('componentList', componentList)

      expect(typeof componentList).toEqual('object')
      expect(componentList.length).toBeGreaterThan(0)
      expect(componentList[0]).toContain('.vue')
    })
  })

  describe('`/src/temp-generated-component-list.ts` file', () => {
    it('generates the `/src/temp-generated-component-list.ts` file with the correct number of exports', async () => {
      const componentListFile = fs.existsSync(path.resolve('./src/temp-generated-component-list.ts'))
      expect(componentListFile).toEqual(true)

      const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
      expect(allSvgFiles.length).not.toEqual(0)

      const { default: componentList } = await import(path.resolve('./src/temp-generated-component-list.ts'))
      expect(componentList.length).toEqual(Object.keys(importedComponents).length)
    })
  })

  it('does not remove icons from the previous build', async () => {
    const { default: componentList } = await import(path.resolve('./src/component-list.ts'))

    // Ensure the stored snapshot matches the updated file
    expect(componentList).toMatchSnapshot()
  })
})
