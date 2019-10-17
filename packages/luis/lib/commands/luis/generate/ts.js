"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bf_cli_command_1 = require("@microsoft/bf-cli-command");
const lodash_1 = require("lodash");
const path = require("path");
const LuisToTsConverter = require('./../../../parser/converters/luistotsconverter');
const file = require('./../../../utils/filehelper');
const fs = require('fs-extra');
class LuisGenerateTs extends bf_cli_command_1.Command {
    reorderEntities(app, name) {
        if (app[name] !== null && app[name] !== undefined) {
            app[name].sort((a, b) => (a.name > b.name ? 1 : -1));
        }
    }
    async run() {
        const { flags } = this.parse(LuisGenerateTs);
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
        this.reorderEntities(app, 'entities');
        this.reorderEntities(app, 'prebuiltEntities');
        this.reorderEntities(app, 'closedLists');
        this.reorderEntities(app, 'regex_entities');
        this.reorderEntities(app, 'patternAnyEntities');
        this.reorderEntities(app, 'composites');
        const outputPath = file.validatePath(flags.out, lodash_1.kebabCase(flags.className) + '.ts', flags.force);
        this.log(`Generating file at ${outputPath || ''} that contains class ${flags.className}.`);
        await LuisToTsConverter.writeFromLuisJson(app, flags.className, outputPath);
    }
}
exports.default = LuisGenerateTs;
LuisGenerateTs.description = 'Generate:ts generates a strongly typed typescript source code from an exported (json) LUIS model.';
LuisGenerateTs.flags = {
    in: bf_cli_command_1.flags.string({ description: 'Source .lu file(s) or LUIS application JSON model' }),
    out: bf_cli_command_1.flags.string({ description: 'Output file or folder name. If not specified stdout will be used as output', default: '' }),
    className: bf_cli_command_1.flags.string({ description: 'Name of the class' }),
    force: bf_cli_command_1.flags.boolean({ description: 'If --in flag provided with the path to an existing file, overwrites it', default: false }),
};
