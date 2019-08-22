type Action = (value: string) => void

export class Utils {
    public static normalizeName(name: any): string {
        return (name as string).replace(/./g, "_").replace(/ /g, "_")
    }

    public static isHierarchical(name: any, app: any): boolean {
        let isHierarchical: boolean = false;
        if (app.entities != null) {
            for (let index = 0; index < app.entities.length; index++) {
                const child = app.entities[index];
                if (child.name == name) {
                    isHierarchical = child.children != null;
                    break;
                }
            }
        }
        return isHierarchical;
    }

    public static isList(name: any, app: any): boolean {
        if (app.closedLists != null) {
            return (app.closedLists as Array<any>).some(list => {
                return (
                    list.name === name ||
                    (list.roles as Array<any>).some(role => {
                        return role === name
                    })
                )
            });
        }
        return false;
    }

    public static jsonPropertyName(property: any, app: any): string{
        let name = (property as string).split(':').slice(-1)[0]
        if (!name.startsWith("geographyV2") && !name.startsWith("ordinalV2") && name.endsWith("V2"))
        {
            name = name.substring(0, name.length - 2);
        }
        return Utils.normalizeName(name);
    }

    public static entityApply(entity: any, action: Action): void {
        action(entity.name as string);
        if (entity && entity.roles != null)
        {
            (entity.roles as Array<any>)
            .sort((a, b) => a.role > b.role ? 1 : -1)
            .forEach(item => {
                action(item.role)
            });
        }
    }

    public static entity(name: any): any {
        let obj: any  = {};
        obj.name = name
        obj.roles = []
        
        return obj
    }

    public static writeInstances(app: any, writeInstance: Action): void {
        if (app != null) {
            let empty = [];
            let lists = [
                app.entities,
                app.prebuiltEntities,
                app.closedLists,
                app.regex_entities,
                app.patternAnyEntities,
                app.composites
            ];
            let entities = ([].concat(...lists)).sort((a, b) => a.name > b.name ? 1 : -1);
            entities.forEach( entity => {
                Utils.entityApply(entity, writeInstance);
                if (Utils.isHierarchical(entity, app)) {
                    entity.children.forEach(child => {
                        writeInstance(child as string);
                    })
                }
            })
        }
    }
}