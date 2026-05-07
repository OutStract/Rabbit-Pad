import { error } from 'console';
import fs from 'fs';
import path from "path";

// const nodes = ["apple", "banana", "mango"]

// function bulkOps(selectedNode) {
//     selectedNode.forEach(path => {
//         path
//     });
// }

// console.log(bulkOps(nodes))


const sourcePath_1 = "../../data/Projects/1-Rewind/Idea/Scenes/file.md" //file-1.md
const sourcePath_2 = "../../data/Projects/1-Rewind/Idea/Scenes" //Scenes folder

const destination = "../../data/Projects/1-Rewind/Idea/Dialouges"

async function moveDir(source, destination) {
    const sourceArr = source.split(/[\\/]/)
    const sourceName = sourceArr.pop()
    console.log("SourceName",sourceName)
    let i = 1

    let newPath = path.join(destination, sourceName)
    console.log("newPath: ", newPath)
    try {
        while(fs.existsSync(newPath)) {
                newPath = path.join(destination, `${i}-${sourceName}`)
                i++
                console.log("Renamed Path :", newPath)
        }
         await fs.promises.rename(source, newPath)

        return {ok: true, path: newPath }
    } catch(err) {
        console.log(err)
        return {ok: false, error: err }
    }
}

console.log(moveDir(sourcePath_1, destination))