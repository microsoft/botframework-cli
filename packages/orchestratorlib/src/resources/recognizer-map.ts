/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

interface RecognizerMap {
    [index: string]: string;
}

export const PrebuiltToRecognizerMap: RecognizerMap = {
  personname: '',
  geographyv2: '',
  keyphrase: '',
  money: '',
  age: 'Microsoft.AgeEntityRecognizer',
  datetimev2: 'Microsoft.DateTimeEntityRecognizer',
  dimension: 'Microsoft.DimensionEntityRecognizer',
  email: 'Microsoft.EmailEntityRecognizer',
  number: 'Microsoft.NumberEntityRecognizer',
  ordinal: 'Microsoft.OrdinalEntityRecognizer',
  ordinalv2: 'Microsoft.OrdinalEntityRecognizer',
  percentage: 'Microsoft.PercentageEntityRecognizer',
  phonenumber: 'Microsoft.PhoneNumberEntityRecognizer',
  temperature: 'Microsoft.TemperatureEntityRecognizer',
  url: 'Microsoft.UrlEntityRecognizer',
  datetime: 'Microsoft.DateTimeEntityRecognizer',
};
