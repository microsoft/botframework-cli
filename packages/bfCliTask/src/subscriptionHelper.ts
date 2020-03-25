/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import task = require('azure-pipelines-task-lib/task');

export class SubscriptionHelper {

    private connectedServiceName: string;

    constructor(connectedServiceName: string) {
        this.connectedServiceName = connectedServiceName;
    }

    public getSubscriptionId(): string {
        return task.getEndpointDataParameter(this.connectedServiceName, 'subscriptionid', true);
    }

    public getServicePrincipalClientId(): string {
        return task.getEndpointAuthorizationParameter(this.connectedServiceName, 'serviceprincipalid', true) as string;
    }

    public getServicePrincipalKey(): string {
        return task.getEndpointAuthorizationParameter(this.connectedServiceName, 'serviceprincipalkey', true) as string;
    }

    public getTenantId(): string {
        return task.getEndpointAuthorizationParameter(this.connectedServiceName, 'tenantid', false) as string;
    }
}