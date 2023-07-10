import fs from 'fs'
import path from 'path'

/**
 *
 * @param {string} directoryPath The path to get all files recursively
 * @param {string} fileExtension The file extension to look for, e.g. `svg`, without leading period
 * @param {[]} arrayOfFiles Only used when called recursively
 * @returns
 */
export default function getAllFiles(directoryPath, fileExtension, arrayOfFiles = []) {
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
}
