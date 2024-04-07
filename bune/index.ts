import {$, argv, file, write} from 'bun'
import os from 'os'
import path from 'path'
import pc from 'picocolors'

const url = argv[2]

const getFileName = (url: string): string => path.basename(url)

const createTempFile = async (tempFilePath: string, content: string) => {
    await write(tempFilePath, content)
}

const getTempFilePath = (url: string) => path.join(os.tmpdir(), getFileName(url))

if (URL.canParse(url)) {
    try {
        const res = await fetch(url)
        if (res.ok) {
            if (url.endsWith('.sh')) {
                const text = await res.text()
                const tempFilePath = getTempFilePath(url)
                await createTempFile(tempFilePath, text)
                //Variables are also escaped to prevent command injection.
                await $`bun run ${tempFilePath}`
            } else {
                await $`bun -e ${await res.text()}`
            }
        } else {
            console.error(pc.red('error: '), `Module not found ${url}.`)
        }
    } catch (e: any) {
        console.error(pc.red(e))
    }
} else {
    try {
        const currentPath = path.join(process.cwd(), url ?? '')
        const local_file = file(currentPath)
        if (await local_file.exists()) {
            await $`bun run ${currentPath}`
        } else {
            console.error(pc.red('error: '), `Module not found ${currentPath}.`)
        }
    } catch (e: any) {
        console.error(pc.red(e))
    }
}
