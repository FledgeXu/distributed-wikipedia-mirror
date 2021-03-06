import { cli } from 'cli-ux'

import { Options } from './domain'
import {
  appendJavscript as appendJavascript,
  copyImageAssetsIntoWiki,
  generateMainPage,
  insertIndexRedirect,
  moveArticleFolderToWiki,
  resolveDirectories
} from './site-transforms'
import { checkUnpackedZimDir } from './utils/check-unpacked-zim-dir'

export const zimToWebsite = async (options: Options) => {
  const directories = resolveDirectories(options)

  checkUnpackedZimDir(options.unpackedZimDir)

  cli.log('-------------------------')
  cli.log('Zim to Website Conversion')
  cli.log('-------------------------')
  cli.log(`  Unpacked Zim Directory: ${options.unpackedZimDir}`)
  cli.log(`   Zim File Download Url: ${options.zimFileSourceUrl}`)
  cli.log(`               Main Page: ${options.mainPage}`)
  cli.log(`         Kiwix Main Page: ${options.kiwixMainPage}`)

  if (options.hostingDNSDomain) {
    cli.log(`      Hosting DNS Domain: ${options.hostingDNSDomain}`)
  }

  if (options.hostingIPNSHash) {
    cli.log(`       Hosting IPNS Hash: ${options.hostingIPNSHash}`)
  }

  if (options.mainPageVersion) {
    cli.log(`       Main Page version: ${options.mainPageVersion}`)
  }

  cli.log('-------------------------')
  cli.log('')

  cli.log(`Starting zim to website conversion ...`)

  copyImageAssetsIntoWiki('./assets', directories)
  moveArticleFolderToWiki(directories)
  insertIndexRedirect(options)
  appendJavascript(options, directories)
  await generateMainPage(options, directories)

  cli.log('done')
}
