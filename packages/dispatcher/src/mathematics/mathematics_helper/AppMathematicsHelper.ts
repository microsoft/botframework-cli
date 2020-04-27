/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { MathematicsHelper } from "./MathematicsHelper";

import { Utility } from "../../utility/Utility";

export function exampleFunctionMathematicsHelper(): void {
    // -----------------------------------------------------------------------
    const numerator = 1;
    const denominator = 2;
    Utility.debuggingLog(
        MathematicsHelper.safeDivide(numerator, denominator));
    Utility.debuggingLog(MathematicsHelper.safeLog(
        MathematicsHelper.safeDivide(numerator, denominator)));
    // -----------------------------------------------------------------------
    const inputValue: number = 0.5;
    const inputValueSigmoid: number = MathematicsHelper.sigmoidLogisticFunction(inputValue);
    Utility.debuggingLog(inputValueSigmoid);
    // -----------------------------------------------------------------------
}

export function exampleFunctionMathematicsHelperSoftmax(): void {
    // -----------------------------------------------------------------------
    const numerator = 1;
    const denominator = 2;
    Utility.debuggingLog(
        MathematicsHelper.safeDivide(numerator, denominator));
    Utility.debuggingLog(MathematicsHelper.safeLog(
        MathematicsHelper.safeDivide(numerator, denominator)));
    // -----------------------------------------------------------------------
    const inputValue: number = 0.5;
    const inputValueSigmoid: number = MathematicsHelper.sigmoidLogisticFunction(inputValue);
    Utility.debuggingLog(inputValueSigmoid);
    // -----------------------------------------------------------------------
    /*
     import numpy as mp

     Xraw = [ [ 1,  0.1,  0.5 ],
              [ 1,  1.1,  2.3 ],
              [ 1, -1.1, -2.3 ],
              [ 1, -1.5, -2.5 ] ]

     biasraw = [ 0.01, 0.1, 0.1 ]

     Wraw = [ [ 0.01, 0.1, 0.1 ],
              [ 0.1,  0.2, 0.3 ],
              [ 0.1,  0.2, 0.3 ] ]

     bias = np.array(biasraw)
     X = np.array(Xraw)
     W = np.array(Wraw)

     Z = W * np.transpose(X)

     */
    // -----------------------------------------------------------------------
}

if (require.main === module) {
    exampleFunctionMathematicsHelper();
    exampleFunctionMathematicsHelperSoftmax();
}
