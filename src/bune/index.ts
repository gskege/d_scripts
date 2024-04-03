import {argv,file} from 'bun'
import path from 'path'
const url = argv[2]
if (URL.canParse(url)) {
    try {
        const res = await fetch(url)
        if (res.ok) {
            eval(await res.text())
        } else {
            console.log(`error: Module not found ${url}.`)
        }
    } catch (e) {
        console.error(e)
    }
} else {
    try {
        const currentPath = path.join(process.cwd(), url)
        const local_file = file(currentPath)
        if(await local_file.exists()){
            console.log(await local_file.text(),44)
            eval(await local_file.text())
        }else {
            console.log(`error: Module not found ${currentPath}.`)
        }
    }catch (e) {
        console.error(e,12122)
    }
}


