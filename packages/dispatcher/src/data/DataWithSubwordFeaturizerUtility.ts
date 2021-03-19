/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// ---- NOTE-FOR-REFERENCE ---- @deprecated — since v4.0.0 - use value === null instead.
// ---- NOTE-FOR-REFERENCE ---- 'isNull' is deprecatedts(6385)
// ---- NOTE-FOR-REFERENCE ---- import { isNull } from "util";
// ---- NOTE-FOR-REFERENCE ---- import { isUndefined } from "util";

import { NgramSubwordFeaturizer } from "../model/language_understanding/featurizer/NgramSubwordFeaturizer";

// import { Data } from "./Data";
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
        if (// ---- NOTE-FOR-REFERENCE ---- isNull(featurizerNullable) || isUndefined(featurizerNullable)
            (featurizerNullable === null) || (featurizerNullable === undefined)
        ) {
            featurizerNullable = new NgramSubwordFeaturizer();
            toResetFeaturizerLabelFeatureMaps = true;
        }
        if (filetype === DataUtility.DATA_FORMAT_TYPE_LU) {
            const luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer =
                await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    toResetFeaturizerLabelFeatureMaps);
            return luDataWithSubwordFeaturizer;
        }
        if (filetype === DataUtility.DATA_FORMAT_TYPE_QUESTION_AND_ANSWER) {
            const luDataWithSubwordFeaturizer: LuDataWithSubwordFeaturizer =
                await LuDataWithSubwordFeaturizer.createLuDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    toResetFeaturizerLabelFeatureMaps);
            return luDataWithSubwordFeaturizer;
        }
        if (filetype === DataUtility.DATA_FORMAT_TYPE_ENTITY_ANNOTATED_CORPUS) {
            const entityAnnotatedCorpusDataWithSubwordFeaturizer: EntityAnnotatedCorpusDataWithSubwordFeaturizer =
                EntityAnnotatedCorpusDataWithSubwordFeaturizer.createEntityAnnotatedCorpusDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    linesToSkip,
                    toResetFeaturizerLabelFeatureMaps);
            return entityAnnotatedCorpusDataWithSubwordFeaturizer;
        }
        {
            const columnarDataWithSubwordFeaturizer: ColumnarDataWithSubwordFeaturizer =
                ColumnarDataWithSubwordFeaturizer.createColumnarDataWithSubwordFeaturizer(
                    content,
                    featurizerNullable,
                    labelColumnIndex,
                    textColumnIndex,
                    weightColumnIndex,
                    linesToSkip,
                    toResetFeaturizerLabelFeatureMaps);
            return columnarDataWithSubwordFeaturizer;
        }
    }
}
