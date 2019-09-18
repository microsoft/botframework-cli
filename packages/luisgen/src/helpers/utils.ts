import {existsSync} from 'fs'
import {basename, dirname, extname, isAbsolute, join} from 'path'
import {CLIError} from '@microsoft/bf-cli-command'

export namespace Utils {
  type Action = (value: string) => void

  export function normalizeName(name: any): string {
    return name.replace(/\./g, '_').replace(/ /g, '_')
  }

  export function isHierarchical(name: any, app: any): boolean {
    let isHierarchical = false
    if (app.entities !== null && app.entities !== null) {
      for (let child of app.entities) {
        if (child.name === name) {
          isHierarchical = child.children !== null
          break
        }
      }
    }
    return isHierarchical
  }

  export function isList(name: any, app: any): boolean {
    if (app.closedLists !== null && app.closedLists !== undefined) {
      return (app.closedLists as Array<any>).some(list => {
        return (
          list.name === name ||
          (list.roles as Array<any>).some(role => {
            return role === name
          })
        )
      })
    }
    return false
  }

  export function jsonPropertyName(property: any): string {
    let name = (property as string).split(':').slice(-1)[0]
    if (
      !name.startsWith('geographyV2') &&
      !name.startsWith('ordinalV2') &&
      name.endsWith('V2')
    ) {
      name = name.substring(0, name.length - 2)
    }
    return normalizeName(name)
  }

  export function entityApply(entity: any, action: Action): void {
    action(entity.name as string)
    if (entity.roles !== null) {
      entity.roles.sort()
      entity.roles.forEach((item: any) => {
        action(item)
      })
    }
  }

  export function entity(name: any): any {
    let obj: any = {}
    obj.name = name
    obj.roles = []

    return obj
  }

  export function writeInstances(app: any, writeInstance: Action): void {
    if (app !== null && app !== undefined) {
      let lists = [
        app.entities,
        app.prebuiltEntities,
        app.closedLists,
        app.regex_entities,
        app.patternAnyEntities,
        app.composites
      ]

      let entities: any[] = [].concat(...lists)
      .filter((a: any) => a !== null && a !== undefined)
      .sort((a: any, b: any) => (a.name > b.name ? 1 : -1))

      entities.forEach(entity => {
        entityApply(entity, writeInstance)
        if (isHierarchical(entity, app)) {
          entity.children.forEach((child: any) => {
            writeInstance(child as string)
          })
        }
      })
    }
  }

  export function validatePath(outputPath: string, workingDirectory: string, defaultFileName: string): string {
    let completePath = isAbsolute(outputPath) ? outputPath : join(workingDirectory, outputPath)
    const containingDir = dirname(completePath)

    // If the cointaining folder doesnt exist
    if (!existsSync(containingDir)) throw new CLIError("Path doesn't exist")

    const baseElement = basename(completePath)
    const pathAlreadyExist = existsSync(completePath)

    // If the last element in the path is a file
    if (baseElement.includes('.')) {
      return pathAlreadyExist ? enumerateFileName(completePath) : completePath
    } else { // If the last element in the path is a folder
      if (!pathAlreadyExist) throw new CLIError("Path doesn't exist")
      return join(completePath, defaultFileName)
    }
  }

  function enumerateFileName(filePath: string): string {
    const fileName = basename(filePath)
    const containingDir = dirname(filePath)

    if (!existsSync(containingDir)) throw new CLIError("Path doesn't exist")

    const extension = extname(fileName)
    const baseName = basename(fileName, extension)
    let nextNumber = 0
    let newPath = ''

    do {
      newPath = join(containingDir, baseName + `(${++nextNumber})` + extension)
    } while (existsSync(newPath))

    return newPath
  }
}
