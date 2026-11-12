import { PACKAGE_NAME } from '@dsh-telegram-style/contracts/package'
import { createCacheFiles } from '@dsh-telegram-style/engine/node/cache-file'

/** This plugin's derived cache files (packages/engine/node/cache-file.ts). */
export const { cachePath, readJsonDocument, writeJsonDocument } = createCacheFiles(PACKAGE_NAME)
