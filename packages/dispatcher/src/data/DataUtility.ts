/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { isNull } from "util";
import { isUndefined } from "util";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { EntityAnnotatedCorpusData } from "./EntityAnnotatedCorpusData";
import { ColumnarData } from "./ColumnarData";
import { LuData } from "./LuData";
import { Data } from "./Data";

import { Utility } from "../utility/Utility";

export class DataUtility {

    public static readonly DATA_FORMAT_TYPE_LU: string = "lu";
    public static readonly DATA_FORMAT_TYPE_QUESTION_AND_ANSWER: string = "qna";
    public static readonly DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS: string = "eac";
    public static readonly DATA_FORMAT_TYPE_TAB_DELIMITED: string = "tsv";

    public static readonly DATA_FORMAT_FILE_ENTENSION_LU: string =
        "." + DataUtility.DATA_FORMAT_TYPE_LU;
    public static readonly DATA_FORMAT_FILE_ENTENSION_QUESTION_AND_ANSWER: string =
        "." + DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER;
    public static readonly DATA_FORMAT_FILE_ENTENSION_ENTITY_ANNOTATED_CORPUS: string =
        "." + DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS;
    public static readonly DATA_FORMAT_FILE_ENTENSION_TAB_DELIMITED: string =
        "." + DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED;

    public static getDataFileTypeFromFilenameExtension(filename: string): string {
        let filetype: string = DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED;
        if (filename.endsWith(DataUtility.DATA_FORMAT_FILE_ENTENSION_LU)) {
            filetype = DataUtility.DATA_FORMAT_TYPE_LU;
        } else if (filename.endsWith(DataUtility.DATA_FORMAT_FILE_ENTENSION_QUESTION_AND_ANSWER)) {
            filetype = DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER;
        } else if (filename.endsWith(DataUtility.DATA_FORMAT_FILE_ENTENSION_ENTITY_ANNOTATED_CORPUS)) {
            filetype = DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS;
        } else if (filename.endsWith(DataUtility.DATA_FORMAT_FILE_ENTENSION_TAB_DELIMITED)) {
            filetype = DataUtility.DATA_FORMAT_TYPE_TAB_DELIMITED;
        }
        return filetype;
    }
    public static async LoadData(
        filename: string,
        featurizerNullable: NgramSubwordFeaturizer|null = null,
        toResetFeaturizerLabelFeatureMaps: boolean = true,
        filetype: string = "",
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        linesToSkip: number = 0): Promise<Data> {
        const content: string =
            Utility.loadFile(filename);
        if (Utility.isEmptyString(filetype)) {
            filetype = DataUtility.getDataFileTypeFromFilenameExtension(filename);
        }
        if (isNull(featurizerNullable) || (isUndefined(featurizerNullable))) {
            featurizerNullable = new NgramSubwordFeaturizer();
            toResetFeaturizerLabelFeatureMaps = true;
        }
        if (filetype === DataUtility.DATA_FORMAT_TYPE_LU) {
            const luData: LuData =
                await LuData.createLuData(
                    content,
                    featurizerNullable,
                    toResetFeaturizerLabelFeatureMaps);
            return luData;
        }
        if (filetype === DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER) {
            const luData: LuData =
                await LuData.createLuData(
                    content,
                    featurizerNullable,
                    toResetFeaturizerLabelFeatureMaps);
            return luData;
        }
        if (filetype === DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS) {
            const entityAnnotatedCorpusData: EntityAnnotatedCorpusData =
                EntityAnnotatedCorpusData.createEntityAnnotatedCorpusData(
                    content,
                    featurizerNullable,
                    linesToSkip,
                    toResetFeaturizerLabelFeatureMaps);
            return entityAnnotatedCorpusData;
        }
        {
            const columnarData: ColumnarData =
                ColumnarData.createColumnarData(
                    content,
                    featurizerNullable,
                    labelColumnIndex,
                    textColumnIndex,
                    linesToSkip,
                    toResetFeaturizerLabelFeatureMaps);
            return columnarData;
        }
    }
}
