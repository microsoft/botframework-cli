"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const lodash_1 = require("lodash");
const path = require("path");
const LuisToCsConverter = require('./../../../parser/converters/luistocsconverter');
const file = require('./../../../utils/filehelper');
const fs = require('fs-extra');
class LuisGenerateCs extends bf_cli_command_1.Command {
    reorderEntities(app, name) {
        if (app[name] !== null && app[name] !== undefined) {
            app[name].sort((a, b) => (a.name > b.name ? 1 : -1));
        }
    }
    async run() {
        const { flags } = this.parse(LuisGenerateCs);
        let space = 'Luis';
        let stdInput = await this.readStdin();
        const pathPrefix = path.isAbsolute(flags.in) ? '' : process.cwd();
        let app;
        try {
            app = stdInput ? JSON.parse(stdInput) : await fs.readJSON(path.join(pathPrefix, flags.in));
        }
        catch (err) {
            throw new bf_cli_command_1.CLIError(err);
        }
        flags.className = flags.className || app.name;
        flags.className = lodash_1.upperFirst(lodash_1.camelCase(flags.className));
        const dot_index = flags.className ? flags.className.indexOf('.') : -1;
        if (dot_index !== -1) {
            space = flags.className.substr(dot_index + 1);
            flags.className = flags.className.substr(0, dot_index);
        }
        this.reorderEntities(app, 'entities');
        this.reorderEntities(app, 'prebuiltEntities');
        this.reorderEntities(app, 'closedLists');
        this.reorderEntities(app, 'regex_entities');
        this.reorderEntities(app, 'patternAnyEntities');
        this.reorderEntities(app, 'composites');
        const outputPath = file.validatePath(flags.out, flags.className + '.cs', flags.force);
        this.log(`Generating file at ${outputPath || ''} that contains class ${space}.${flags.className}.`);
        await LuisToCsConverter.writeFromLuisJson(app, flags.className, space, outputPath);
    }
}
exports.default = LuisGenerateCs;
LuisGenerateCs.description = 'Generate:cs generates a strongly typed C# source code from an exported (json) LUIS model.';
LuisGenerateCs.flags = {
    in: bf_cli_command_1.flags.string({ description: 'Source .lu file(s) or LUIS application JSON model' }),
    out: bf_cli_command_1.flags.string({ description: 'Output file or folder name. If not specified stdout will be used as output', default: '' }),
    className: bf_cli_command_1.flags.string({ description: 'Name of the class' }),
    force: bf_cli_command_1.flags.boolean({ description: 'If --in flag provided with the path to an existing file, overwrites it', default: false }),
};
