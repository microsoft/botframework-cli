/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// import { MathematicsHelper } from "../mathematics_helper/MathematicsHelper";

import { Utility } from "../../utility/Utility";

export abstract class AbstractBaseSampler<T, TLabelMap, TInstances> {

    protected labels: string[] = [];
    protected labelMap: TLabelMap | undefined;
    protected instances: TInstances;

    public constructor(
        instances: TInstances,
        toResetLabelsAndMap: boolean = true) {
        this.labels = [];
        this.instances = instances;
        if (toResetLabelsAndMap) {
            this.resetLabelsAndMap();
        }
    }

    public abstract addInstance(label: string, instance: T): void;

    public abstract resetLabelsAndMap(): void;

    public getNumberLabels(): number {
        return this.labels.length;
    }
    public getLabels(): string[] {
        return this.labels;
    }
    public getLabelMap(): TLabelMap {
        return (this.labelMap as TLabelMap);
    }
    public getInstances(): TInstances {
        return this.instances;
    }

    public abstract getNumberInstances(): number;
}
