import path from 'path'

/** The name of the top-level `/svg/* subdirectory where the icon is located */
type IconType = 'solid' | 'multi-color' | 'flags'

export default function getIconType(pathToSvg: string): IconType {
  const solidSubdirectory = path.relative(path.resolve('./svg/solid'), pathToSvg)
  const multiColorSubdirectory = path.relative(path.resolve('./svg/multi-color'), pathToSvg)
  const flagsSubdirectory = path.relative(path.resolve('./svg/flags'), pathToSvg)

  // If `/svg/multi-color/*
  if (!!multiColorSubdirectory && !multiColorSubdirectory.startsWith('..') && !path.isAbsolute(multiColorSubdirectory)) {
    return 'multi-color'
  }

  // If `/svg/flags/*
  if (!!flagsSubdirectory && !flagsSubdirectory.startsWith('..') && !path.isAbsolute(flagsSubdirectory)) {
    return 'flags'
  }

  // If `/svg/solid/*
  if (!!solidSubdirectory && !solidSubdirectory.startsWith('..') && !path.isAbsolute(solidSubdirectory)) {
    return 'solid'
  }

  // For now, default to `solid`
  return 'solid'
}
