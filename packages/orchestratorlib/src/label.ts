/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {LabelType} from './labeltype';
import {Span} from './span';

export class Label {
  public static newIntentLabel(label: string, spanOffset: number = 0, spanLength: number = 0): Label {
    return new Label(LabelType.Intent, label, new Span(spanOffset, spanLength));
  }

  public static newEntityLabel(label: string, spanOffset: number = 0, spanLength: number = 0): Label {
    return new Label(LabelType.Entity, label, new Span(spanOffset, spanLength));
  }

  public static newIntentLabelByPosition(
    label: string,
    spanStartPosition: number = 0,
    spanEndPosition: number = 0): Label {
    return new Label(LabelType.Intent, label, new Span(spanStartPosition, spanEndPosition - spanStartPosition + 1));
  }

  public static newEntityLabelByPosition(
    label: string,
    spanStartPosition: number = 0,
    spanEndPosition: number = 0): Label {
    return new Label(LabelType.Entity, label, new Span(spanStartPosition, spanEndPosition - spanStartPosition + 1));
  }

  public labeltype: LabelType;

  public name: string;

  public span: Span;

  constructor(labeltype: LabelType, name: string, span: Span) {
    this.labeltype = labeltype;
    this.name = name;
    this.span = span;
  }

  public toSimpleString(): string {
    return `${this.name}-${this.labeltype}-${this.span.offset}-${this.span.length}`;
  }

  public toObject(): {
    'name': string;
    'labeltype': number;
    'span': {
      'offset': number;
      'length': number; }; } {
    return {
      name: this.name,
      labeltype: this.labeltype,
      span: this.span.toObject(),
    };
  }

  public toEntityObject(): {
    'entity': string;
    'startPos': number;
    'endPos': number; } {
    return {
      entity: this.name,
      startPos: this.getStartPos(),
      endPos: this.getEndPos(),
    };
  }

  public toEntityObjectWithText(utterance: string): {
    'entity': string;
    'startPos': number;
    'endPos': number;
    'text': string; } {
    return {
      entity: this.name,
      startPos: this.getStartPos(),
      endPos: this.getEndPos(),
      text: utterance.substring(this.getStartPos(), this.getEndPos() + 1),
    };
  }

  public getStartPos(): number {
    return this.span.offset;
  }

  public getEndPos(): number {
    return this.span.offset + this.span.length - 1;
  }

  public equals(other: Label): boolean {
    if (other) {
      if (other.name !== this.name) {
        return false;
      }
      if (other.labeltype !== this.labeltype) {
        return false;
      }
      if (this.span) {
        if (!this.span.equals(other.span)) {
          return false;
        }
        return true;
      }
    }
    return false;
  }
}
