import { describe, it, expect } from 'vitest'
import { getAllFiles } from './index'
import fs from 'fs'
import path from 'path'
import * as importedComponents from '../../src/components'

/**
 * The tests in this file will only successfully run after
 * the `yarn build` (or `yarn generate`) script has been run.
 *
 * See the `vitest.config.ts` `globalSetup` configuration.
 */

describe('generate', () => {
  it('generates one icon component per svg file in the `/svg/` directory', () => {
    const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
    const allComponentFiles = getAllFiles(path.resolve('./src/components'), 'vue')

    expect(allSvgFiles.length).not.toEqual(0)
    expect(allSvgFiles.length).toEqual(allComponentFiles.length)
  })

  it('generates the `/src/components/index.ts` file with the correct number of exports', () => {
    const componentIndexFile = fs.existsSync(path.resolve('./src/components/index.ts'))
    expect(componentIndexFile).toEqual(true)

    const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
    expect(allSvgFiles.length).not.toEqual(0)
    expect(allSvgFiles.length).toEqual(Object.keys(importedComponents).length)
  })

  it('`/src/components/index.ts` matches the snapshot', async () => {
    const { default: componentExports } = await import(path.resolve('./src/components/index.ts'))

    expect(componentExports).toMatchSnapshot()
  })

  it('`/src/component-list.ts` file exports an array of component filenames', async () => {
    const componentListFile = fs.existsSync(path.resolve('./src/component-list.ts'))
    expect(componentListFile).toEqual(true)

    const { default: componentList } = await import(path.resolve('./src/component-list.ts'))
    expect(typeof componentList).toEqual('object')
    expect(componentList.length).toBeGreaterThan(0)
    expect(componentList[0]).toContain('.vue')
  })

  it('generates the `/src/temp-generated-component-list.ts` file with the correct number of exports', async () => {
    const componentListFile = fs.existsSync(path.resolve('./src/temp-generated-component-list.ts'))
    expect(componentListFile).toEqual(true)

    const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
    expect(allSvgFiles.length).not.toEqual(0)

    const { default: componentList } = await import(path.resolve('./src/temp-generated-component-list.ts'))
    expect(componentList.length).toEqual(Object.keys(importedComponents).length)
  })

  it('does not remove icons from the previous build', async () => {
    const { default: componentList } = await import(path.resolve('./src/component-list.ts'))

    expect(componentList).toMatchSnapshot()
  })
})
