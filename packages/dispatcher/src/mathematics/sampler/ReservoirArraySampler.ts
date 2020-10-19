/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Utility } from "../../Utility/Utility";

export class ReservoirArraySampler<T> {

    protected instances: T[] = [];
    protected instancesBeginIndex: number = 0;
    protected instancesEndIndex: number = -1;

    public constructor(
        instances: T[] = [],
        instancesBeginIndex: number = 0,
        instancesEndIndex: number = -1) {
        this.instances = instances;
        this.resetInstancesBeginEndIndex(
            instancesBeginIndex,
            instancesEndIndex);
    }

    public getInstances(): T[] {
        return this.instances;
    }
    public getInstancesBeginIndex(): number {
        return this.instancesBeginIndex;
    }
    public getInstancesEndIndex(): number {
        return this.instancesEndIndex;
    }

    public resetInstancesBeginEndIndex(
        instancesBeginIndex: number = 0,
        instancesEndIndex: number = -1): void {
        this.instancesBeginIndex = instancesBeginIndex;
        if (this.instancesBeginIndex < 0) {
            this.instancesBeginIndex = 0;
        }
        this.instancesEndIndex = instancesEndIndex;
        if (this.instancesEndIndex < 0) {
            this.instancesEndIndex = this.instances.length;
        }
        if (this.instancesEndIndex > this.instances.length) {
            this.instancesEndIndex = this.instances.length;
        }
    }

    public addInstance(instance: T) {
        this.instances.push(instance);
    }

    public getNumberInstances(): number {
        return this.getInstances().length;
    }
    public getNumberInstancesSampling(): number {
        return (this.getInstancesEndIndex() - this.getInstancesBeginIndex());
    }

    public *sampleInstances(
        sampleSize: number) {
        const numberInstancesSampling = this.getNumberInstancesSampling();
        const instances: T[] = this.getInstances();
        const instancesBeginIndex: number = this.getInstancesBeginIndex();
        const instancesEndIndex: number = this.getInstancesEndIndex();
        if (sampleSize >= numberInstancesSampling) {
            for (let index = instancesBeginIndex; index < instancesEndIndex; index++) {
                yield instances[index];
            }
        } else {
            const sampledInstances: T[] = new Array<T>(sampleSize);
            let indexSampled: number = 0;
            for (let index = instancesBeginIndex; index < instancesEndIndex; index++) {
                if (indexSampled < sampleSize) {
                    sampledInstances[indexSampled++] = instances[index];
                } else {
                    const indexRandom = Utility.getRandomInt(++indexSampled);
                    if (indexRandom < sampleSize) {
                        sampledInstances[indexRandom] = instances[index];
                    }
                }
            }
            for (const instance of sampledInstances) {
                yield instance;
            }
        }
    }
}
