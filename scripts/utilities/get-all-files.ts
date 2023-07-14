import fs from 'fs'
import path from 'path'
import pc from 'picocolors'

/**
 * Get all files that match a given fileExtension, recursively, from a directory
 * @param {string} directoryPath The path to get all files recursively
 * @param {('svg' | 'vue')} fileExtension The file extension to look for, e.g. `svg`, without leading period
 * @param {string[]} [arrayOfFiles=[]] Only used when called recursively
 * @return {string[]} The array of files
 */
export default function getAllFiles(directoryPath: string, fileExtension: string, arrayOfFiles: string[] = []) {
  try {
    const allFiles = fs.readdirSync(directoryPath)
    const extension = fileExtension.replace(/^\./, '') // Strip off a leading period

    for (const file of allFiles) {
      const isDirectory = fs.statSync(directoryPath + '/' + file).isDirectory()
      const isSvgFile = file.endsWith(`.${extension}`)

      if (!isDirectory && !isSvgFile) {
        continue
      }

      if (isDirectory) {
        arrayOfFiles = getAllFiles(directoryPath + '/' + file, extension, arrayOfFiles)
      } else if (isSvgFile) {
        arrayOfFiles.push(path.join(path.resolve(directoryPath), '/', file))
      }
    }

    return arrayOfFiles
  } catch (err: any) {
    console.error(pc.red('getAllFiles: An uncaught error occurred while attempting to retrieve all files recursively: '), err.message)
    console.log('')
    process.exit(1)
  }
}
