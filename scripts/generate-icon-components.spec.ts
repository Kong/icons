import { describe, it, expect } from 'vitest'
import { getAllFiles } from './utilities'
import fs from 'fs'
import path from 'path'
// import { mount } from '@vue/test-utils'

describe('generate-icon-components', () => {
  it('generates one icon component per svg file in the `/svg/` directory', () => {
    const allSvgFiles = getAllFiles(path.resolve('./svg'), 'svg')
    const allComponentFiles = getAllFiles(path.resolve('./src/components'), 'vue')

    expect(allSvgFiles.length).not.toEqual(0)
    expect(allComponentFiles.length).toEqual(allSvgFiles.length)
  })

  it('generates the `/src/components/index.ts` file', () => {
    const indexFile = fs.existsSync(path.resolve('./src/components/index.ts'))

    expect(indexFile).toEqual(true)
  })
})

// describe.skip('<ComponentTemplate />', () => {
//   it('renders', () => {
//     const wrapper = mount(ComponentTemplate)

//     expect(wrapper.exists()).toBe(true)
//   })
// })
