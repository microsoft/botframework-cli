export namespace ParseMultiPlatformLuis {
    class Composite {
      compositeName = ''
      attributes: string[] = []
    }

    interface LuisEntity {
      name: string
      roles: string[]
      children?: string[]
    }

    export class MultiPlatformLuis {
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
        ].map(entity => jsonPropertyName(entity)).sort()

        let hi = [...new Set(entities)]
        return hi
      }
    }

    export function fromLuisApp(luisApp: any): MultiPlatformLuis {
      const classData: MultiPlatformLuis = new MultiPlatformLuis()
      classData.intents = processIntents(luisApp.intents)
      classData.simpleEntities = extractEntities(luisApp.entities) as string[]
      classData.builtInEntities = extractEntities(luisApp.prebuiltEntities, true) as string[][]
      classData.listEntities = extractEntities(luisApp.closedLists) as string[]
      classData.regexEntities = extractEntities(luisApp.regex_entities) as string[]
      classData.patternEntities = extractEntities(luisApp.patternAnyEntities) as string[]

      classData.composites = extractComposites(luisApp.composites)

      return classData
    }

    export function normalizeName(name: any): string {
      return name.replace(/\./g, '_').replace(/ /g, '_')
    }

    function processIntents(intents: any): string[] {
      const result: string[] = []
      intents.forEach((intent: any) => {
        result.push(normalizeName(intent.name))
      })

      return result
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
        const composite: Composite = {compositeName: normalizeName(entity.name), attributes: []}
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
