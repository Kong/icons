import fs from 'fs'
import path from 'path'

export default function getAllFiles(directoryPath, arrayOfFiles) {
  const allFiles = fs.readdirSync(directoryPath)

  arrayOfFiles = arrayOfFiles || []

  for (const file of allFiles) {
    const isDirectory = fs.statSync(directoryPath + '/' + file).isDirectory()
    const isSvgFile = file.endsWith('.svg')

    if (!isDirectory && !isSvgFile) {
      continue
    }

    if (isDirectory) {
      arrayOfFiles = getAllFiles(directoryPath + '/' + file, arrayOfFiles)
    } else if (isSvgFile) {
      arrayOfFiles.push(path.join(path.resolve(directoryPath), '/', file))
      // arrayOfFiles.push(path.join(path.resolve(), directoryPath, '/', file))
    }
  }

  return arrayOfFiles
}
