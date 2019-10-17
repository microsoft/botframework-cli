import { Writer } from './helpers/writer';
export declare namespace LuisToCsConverter {
    function writeFromLuisJson(luisJson: any, className: string, space: string, outPath: string): Promise<void>;
    function converter(className: string, writer: Writer): void;
    function topScoringIntent(writer: Writer): void;
}
