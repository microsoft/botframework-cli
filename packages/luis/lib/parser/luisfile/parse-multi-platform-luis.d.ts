export declare namespace ParseMultiPlatformLuis {
    class Composite {
        compositeName: string;
        attributes: string[];
    }
    class MultiPlatformLuis {
        intents: string[];
        composites: Composite[];
        simpleEntities: string[];
        builtInEntities: string[][];
        listEntities: string[];
        regexEntities: string[];
        patternEntities: string[];
        getInstancesList(): string[];
    }
    function fromLuisApp(luisApp: any): MultiPlatformLuis;
    function normalizeName(name: any): string;
    function jsonPropertyName(property: any): string;
}
