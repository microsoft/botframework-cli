"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const command_1 = require("./command");
exports.Command = command_1.Command;
const flags = tslib_1.__importStar(require("./flags"));
exports.flags = flags;
exports.default = command_1.Command;
