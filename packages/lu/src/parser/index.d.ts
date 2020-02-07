declare module parser {
    function parseFile(fileContent: any, log: any, locale: any): any;
    function validateLUISBlob(LUISJSONBlob: any): any;
}

declare module sectionHandler {
    namespace luParser {
        function parse(content: string): any;
    }
    
    function sectionOperator(resource: any): any;
}