import fs, { existsSync, readFileSync } from "fs";
import path from "path";
import { cwd } from "process";

// 
export function dirTree(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  const result = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push({
        name: entry.name,
        type: "folder",
        path: fullPath,
        children: dirTree(fullPath) // recursion returns data now
      });
    } else {
      result.push({
        name: entry.name,
        type: "file",
        path: fullPath
      });
    }
  }

  return result;
}



export async function readDoc (path) {
  try{
    const doc = await fs.promises.readFile(path, 'utf8')
    return {ok: true, value: doc}
  }
  catch(err) {
    console.log(err)
    return {ok: false, value: ""}
  }
  
}

export async function writeFile (path, content) {
  const tempPath = path + '.tmp'

  try {
    await fs.promises.writeFile(tempPath, content, 'utf-8')
    await fs.promises.rename(tempPath, path)
    console.log("File saved")
  }
  catch(err) {
    console.log(err)
  }
}

export function createFile(dirPath, content, name) {
  let filePath = path.join(dirPath, `${name}.md`)
  let i = 1
  try {
    while(fs.existsSync(filePath)) {
      filePath = path.join(dirPath, `${name}-${i}.md`)
      i++
    }
    fs.writeFileSync(filePath, content)
    return filePath
  }
  catch(err) {
    console.log(err)
  }
}

export async function createFolder(dirPath, name) {
  let folderPath = path.join(dirPath, name)
  let i = 1

  while(fs.existsSync(folderPath)) {
    folderPath = path.join(dirPath, `${name}-${i}`)
    i++
  }

  try{
    await fs.promises.mkdir(folderPath)
  }
  catch(err) {
    console.log(err)
  }

}

export async function deleteFile(dirPath, filePath) {
      // dirpath is the path where the data folder is = /data
      //filePath is the whole path of the file = data/project/projectName/folder/file.md
      let trashPath = path.join(dirPath, '.trash') //data/.trash/
      let i = 1
      const fileName = path.basename(filePath)
      let newName = fileName  //file.md

      console.log("dirPath: ", dirPath)
      console.log("filePath: ", filePath)

      
      try{
        //Chacking if the trashfolder exist
        if(!fs.existsSync(trashPath)) {
          fs.mkdirSync(trashPath)  //data/.trash/
        } 
         //data/.trash/file.md
        while (fs.existsSync(path.join(trashPath, newName))) {
          newName = `${i}-${fileName}` 
          i++
        }

        const finalPath = path.join(trashPath, newName) //data/trash/n-file.md
          console.log("filePath inside try: ", filePath)
          console.log("finalPath: ", finalPath)
        await fs.promises.rename(filePath, finalPath)

        console.log("File moved to: ", finalPath)
      }
      catch(err) {
        console.log(err)
      }
}



export async function nameChange(dirPath, name) {
    const titleSplit = dirPath.split(/[\\/]/);
    titleSplit.pop()
    console.log("lastIndex",titleSplit)
    let newName = path.join(...titleSplit, name)
    console.log("New Name ", newName)
    let i = 1

    try{
      while(fs.existsSync(newName)) {
        newName = path.join(...titleSplit, `${i}-${name}`)
        i++
      }
      await fs.promises.rename(dirPath, newName)
      return newName
    }
    catch(err) {
      console.log(err)
    }
}

export async function moveDir(source, destination) {
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

// console.log(nameChange("../../data/Proj", "Projects" ))

// console.log(readDoc('../../data/Rewind/Content/Chapter 1.md'))