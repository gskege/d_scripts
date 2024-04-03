import {argv, file, $} from 'bun'
import path from 'path'
import pc from 'picocolors'

const url = argv[2]
if (URL.canParse(url)) {
    try {
        const res = await fetch(url)
        if (res.ok) {
            await $`bun -e ${await res.text()}`
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
