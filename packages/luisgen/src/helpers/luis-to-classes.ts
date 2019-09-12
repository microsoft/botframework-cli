import {Utils} from './utils'

export namespace LuisTransformToClass {
    class Composite {
      compositeName = ''
      attributes: string[] = []
    }

    interface LuisEntity {
      name: string
      roles: string[]
      children?: string[]
    }

    export class LuisClassData {
      intents: string[] = []
      composites: Composite[] = []
      simpleEntities: string[] = []
      builtInEntities: string[][] = []
      listEntities: string[] = []
      regexEntities: string[] = []
      patternEntities: string[] = []

      public getInstancesList(): string[] {
        const builtIns: string[] = []
        const composites: string[] = []

        this.builtInEntities.forEach(entityList => {
          builtIns.push(...entityList)
        })

        this.composites.forEach(composite => {
          composites.push(composite.compositeName)
          composites.push(...composite.attributes)
        })

        const entities = [
          ...this.simpleEntities,
          ...builtIns,
          ...this.listEntities,
          ...this.regexEntities,
          ...this.patternEntities,
          ...composites
        ].map(entity => Utils.jsonPropertyName(entity)).sort()

        let hi = [...new Set(entities)]
        return hi
      }

      public getInstances2(app: any): any[] | undefined {
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

          return entities
        }
      }
    }

    export function fromLuisApp(luisApp: any): LuisClassData {
      const classData: LuisClassData = new LuisClassData()
      classData.intents = processIntents(luisApp.intents)
      classData.simpleEntities = extractEntities(luisApp.entities) as string[]
      classData.builtInEntities = extractEntities(luisApp.prebuiltEntities, true) as string[][]
      classData.listEntities = extractEntities(luisApp.closedLists) as string[]
      classData.regexEntities = extractEntities(luisApp.regex_entities) as string[]
      classData.patternEntities = extractEntities(luisApp.patternAnyEntities) as string[]

      classData.composites = extractComposites(luisApp.composites)

      return classData
    }

    function processIntents(intents: any): string[] {
      const result: string[] = []
      intents.forEach((intent: any) => {
        result.push(Utils.normalizeName(intent.name))
      })

      return result
    }

    function extractEntities(entities: LuisEntity[], builtIn = false): string[] | string[][] {
      const result: string[] | string[][] = []

      entities.forEach(entity => {
        const aux = []
        aux.push(entity.name)
        entity.roles.sort()
        entity.roles.forEach(role => {
          aux.push(role)
        })
        if (entity.children !== undefined) {
          entity.children.forEach(child => {
            aux.push(child)
          })
        }

        if (builtIn) {
          (result as string[][]).push(aux)
        } else {
          (result as string[]).push(...aux)
        }
      })

      return result
    }

    function extractComposites(entities: LuisEntity[]): Composite[] {
      const result: Composite[] = []
      entities.forEach(entity => {
        const composite: Composite = {compositeName: Utils.normalizeName(entity.name), attributes: []}
        entity.roles.sort()
        entity.roles.forEach(role => {
          composite.attributes.push(role)
        })

        entity.children!.forEach(child => {
          composite.attributes.push(child)
        })

        result.push(composite)
      })

      return result
    }
}
