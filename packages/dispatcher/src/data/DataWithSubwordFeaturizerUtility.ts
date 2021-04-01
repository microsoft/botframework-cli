/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

import { DataWithSubwordFeaturizer } from "./DataWithSubwordFeaturizer";

import { ColumnarDataWithSubwordFeaturizer } from "./ColumnarDataWithSubwordFeaturizer";
import { EntityAnnotatedCorpusDataWithSubwordFeaturizer } from "./EntityAnnotatedCorpusDataWithSubwordFeaturizer";
import { LuDataWithSubwordFeaturizer } from "./LuDataWithSubwordFeaturizer";

import { DataUtility } from "./DataUtility";

import { Utility } from "../utility/Utility";

export class DataWithSubwordFeaturizerUtility extends DataUtility {
    public static async LoadDataWithSubwordFeaturizer(
        filename: string,
        featurizerNullable: NgramSubwordFeaturizer|null = null,
        toResetFeaturizerLabelFeatureMaps: boolean = true,
        filetype: string = "",
        labelColumnIndex: number = 0,
        textColumnIndex: number = 1,
        weightColumnIndex: number = -1,
        linesToSkip: number = 0): Promise<DataWithSubwordFeaturizer> {
        const content: string =
            Utility.loadFile(filename);
        if (Utility.isEmptyString(filetype)) {
            filetype = DataUtility.getDataFileTypeFromFilenameExtension(filename);
        }
        if ((featurizerNullable === null) || (featurizerNullable === undefined)) {
            featurizerNullable = new NgramSubwordFeaturizer();
            toResetFeaturizerLabelFeatureMaps = true;
        }
        switch (filetype) {
            case DataUtility.DATA_FORMAT_TYPE_LU:
                return await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    toResetFeaturizerLabelFeatureMaps);
            case DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER:
                return await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    toResetFeaturizerLabelFeatureMaps);
            case DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS:
                // tslint:disable-next-line: max-line-length
                return EntityAnnotatedCorpusDataWithSubwordFeaturizer.createEntityAnnotatedCorpusDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    linesToSkip,
                    toResetFeaturizerLabelFeatureMaps);
            default:
                return ColumnarDataWithSubwordFeaturizer.createColumnarDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    labelColumnIndex,
                    textColumnIndex,
                    weightColumnIndex,
                    linesToSkip,
                    toResetFeaturizerLabelFeatureMaps);
        }
    }
}
