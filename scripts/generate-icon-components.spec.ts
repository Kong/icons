import { describe, it, expect } from 'vitest'
import { getAllFiles } from './utilities'
import fs from 'fs'
import path from 'path'
import { mount } from '@vue/test-utils'
import * as importedComponents from '../src/components'

describe('generate-icon-components', () => {
  it('generates one icon component per svg file in the `/svg/` directory', () => {
    const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
    const allComponentFiles = getAllFiles(path.resolve('./src/components'), 'vue')

    expect(allSvgFiles.length).not.toEqual(0)
    expect(allSvgFiles.length).toEqual(allComponentFiles.length)
  })

  it('generates the `/src/components/index.ts` file with the correct number of exports', () => {
    const indexFile = fs.existsSync(path.resolve('./src/components/index.ts'))
    expect(indexFile).toEqual(true)

    const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
    expect(allSvgFiles.length).not.toEqual(0)
    expect(allSvgFiles.length).toEqual(Object.keys(importedComponents).length)
  })

  it('does not remove or rename icons from the previous build', () => {
    // TODO: Add test
    expect(true).toEqual(true)
  })
})
