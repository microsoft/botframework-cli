# Dialog Commands

## Merge

Ths will merge together [Microsoft Bot Builder](https://github.com/Microsoft/BotBuilder) .schema JSON schema files into a single JSON schema file. You can point to the files either directly with a glob pattern or indirectly through a glob pattern that matches a package.json, packages.config or \*.csproj file. The .schema files should have a unique filename that is used to refer to that type using `$kind`. The .schema files can optionally include a `$schema: "https://raw.githubusercontent.com/Microsoft/botbuilder-tools/SchemaGen/packages/DialogSchema/src/dialogSchema.schema"` which defines the schema they are validated against. Within a schema definition you can use `$role:"union(<kind>)` to project the type definition into union types defined using `$role:"union"` while merging. To refer to a type in a property, just use `"$kind":"<kind>"`. The merger combines all of the component .schema files into a single .schema file that has resolved all external `$ref`, merged `allOf` and connected together schemas through `$role` and `$kind`.

In addition to types you can also mark properties with a `$role` which will define the underlying type and restrictions. This is also useful information for UI tools to help you construct values. Roles include:

- `$role: "expression"`which marks a string property which is expected to contain an expression string.
- `$role: "lg"`which marks a string property which is used for lanuage generation and can refer to LG templates.
- `$role: "memoryPath"`which marks a string property which is expected to contain a path in memory like `user.name`.

For example look at these files:

- [IRecognizer.schema](test/schemas/IRecognizer.schema) defines the place holder for `IRecognizer` including a default option which is a bare string.
- [Recognizer.schema](test/schemas/Recognizer.schema) includes `$role:"union(IRecognizer)"` which extends the `IRecognizer` definition when merged.
- [root.schema](test/schemas/root.schema) is a schema file that includes `$kind:"IRecognizer"` in order to make use of the `IRecognizer` place holder.
- [app.schema](test/examples/app.schema) was created by this tool shows how all of these defintions are merged together. In particular if you look at `IRecognizer` you will see the definition that includes a string, or the complete definition of `Recognizer`.

[root.dialog](test/examples/root.dialog) Shows how you could use the resulting schema to enter in JSON schema and get intellisense.

## Verify

## Generate

The generate command generates .lu, .lg, .qna and .dialog assets from a schema defined using JSON Schema. The parameters to the command are:

- **--force, -f** Force overwriting generated files.
- **--help, -h** Generate help.
- **--locale, -l** Locales to generate. By default en-us.
- **--output, -o** Output directory.
- **--schema, -s** Path to your app.schema file. By default is the standard SDK app.schema.
- **--templates, -t** Directories with templates to use for generating assets.  First definition wins.  A directory of "standard" includes the standard templates included with the tool.
- **--verbose, -v** Verbose logging of generated files.

### Schema

Schemas are specified using JSON Schema. You can use the normal JSON Schema mechanisms including \$ref and allOf which will be resolved into a single schema which also includes $entities for all properties. This makes the schema easier to use for things like language generation. You can  use expression syntax, i.e. `${<expr>}` to compute schema, either initially or after generation is done if there are properties that are only available at the end. `<schemaName>.schema.dialog` will have the resulting schema with all references resolved and expanded to simplify usage in language generation and dialogs.

Globally there are a few extra keywords including:
- **\$public** List of the public properties in the schema. By default these are the top-level properties in the root schema and this will be automatically generated if missing.
- **\$requires** A list of JSON Schema to include.  This is different than $ref in that you can either use a URL or just a filename which will be looked for in the template directories.  If you want to include the standard confirmation/cancel/navigation functionality you should include include `standard.schema`.
- **\$expectedOnly** A global list of entities which will only be bound to properties if the property is expected.  This can be overriden for specific properties as well.
- **\$triggerIntent** Name of the trigger intent or by default the name of the schema.
- **\$templates** Global templates to include.

 The final schema and all of the required schemas will have the top-level `properties`, `definitions`, `required`, `$expectedOnly`, `$public` and `$templates` merged.  

In addition there are a few extra keywords per-property including:
- **\$entities** List of entity names that can map to a property. The order of the entities also defines the precedence to use when resolving entities. If not present, \$entities will be computed based on the type: 
  - **enum** `["<property>Entity"]` corresponds to an entity generated from the enumerated values.
  - **number** `["number:<property>", "number"]`, i.e. the prebuilt number entity recognizer with a role of this specific property and otherwise just prebuilt number.
  - **string** `["utterance"]` Utterance corresponds to the whole entity.
- **\$templates** The template names to use for generating assets. If not specified, the templates are: `["<type>Entity.lu", "<type>Entity.lg", "<type>Property.lg", "<type>Ask.dialog"]` plus for each entity `<type>Set<entity>.dialog` and if an enum `enumSetenum.dialog`.
- **\$expectedOnly** A list of entities that are only possible if they are expected.  This overrides the top-level \$expectedOnly.

### Templates

Each entity or property can have associated .lu, .lg, .qna and .dialog files that are generated by
copying or instantiating templates found in the template directories. If a template name matches exactly it is just copied. If the template ends with .lg then it is analyzed to see if it has a template named 'template' and optionally one named 'filename'. If 'filename' is specified, then the filename will be the result of generating generated file is the result of evaluating that template, otherwise it defaults to `<root>-<templateName>[.<locale>].<extension>`. When evaluating templates there are a number of variables defined in the scope including:

- **schemaName** The name of the root schema used as a prefix to make files unique.
- **appSchema** The path to the app.schema to use.
- **schema** The full JSON Schema including the root schema + internal properties.
- **locales** The list of all locales being generated.
- **properties** All of the $public property names.
- **entities** All of the types of schema entities being used.
- **triggerIntent** \$triggerIntent or the schema name by default.
- **locale** The locale being generated or empty if no locale.
- **property** For per-property templates this the property name being generated.
- **templates** Object with generated templates per lu, lg, qna, json and dialog. The object contains:
  - **name** Base name of the template without final extension.
  - **fallbackName** For .lg files the base filename without locale.
  - **fullName** The name of the template including the extension.
  - **relative** Path relative to the output directory of where template is.

Templates are generated in the following order:

- Generate per-locale language resources
  - Per-entity generate .lg, .lu, .qna files
  - Per-property
    - Per-template in `<property>.$templates` generate .lg, .lu, .qna files.
  - Per-template in `$templates` generate .lg, .lu, .qna files.
- Generate non language resources
  - Per-property
    - Per-template in `<property>.$templates` generate .dialog and .json files.
  - Per-template in `$templates` generate .dialog and .json files.
- Evaluate schema expressions

### Default templates
The tool includes a standard set of templates.  Current functionality includes:
- Generating .lg, .lu and .dialog files that robustly handle out of order and multiple responses.
- Support for choosing between ambiguous entity values and entity property mappings.
- Recognizing and mapping all LUIS prebuilt entities.
- Help including auto-help on multiple retries.
- Cancel
- Confirmation

### Dialog Generation Example
To see dialog generation in action:
1. Install the latest version of the [bf cli tool](https://github.com/microsoft/botframework-cli) from the [myget](https://botbuilder.myget.org/gallery) feed.  
   1.  `npm config set registry https://botbuilder.myget.org/F/botframework-cli/npm/`
   2.  `npm install -g @microsoft/botframework-cli`
   3.  `npm config set registry https://registry.npmjs.org/`
3. Download an [example sandwich JSON schema](https://raw.githubusercontent.com/microsoft/botframework-cli/master/packages/dialog/test/commands/dialog/forms/sandwich.schema)
4. `bf dialog:generate sandwich.schema -o bot`
5. This will generate .lg, .lu and .dialog assets in the bot directory.  In order to run them, you will need to build a LUIS model.
   1. `bf luis:build --in bot\luis --authoringKey <yourKey> --botName sandwich --dialog --suffix %USERNAME%`
6. At this point you have a complete bot rooted in `bot\sandwich.main.dialog`.
7. You can run this bot and test in the emulator either through the composer or like this:
   1. Add your LUIS authoring key to your user secrets like this: `dotnet user-secrets set luis:endpointKey <yourKey> --id TestBot`
   2. Copy TestBot to your local machine. `xcopy /s \\chrimc3\tools\TestBot\* TestBot\`
   3. Start the web server `dotnet Microsoft.Bot.Builder.TestBot.Json.dll --root <dialogFolder>`
   4. Connect emulator to `http://localhost:5000/api/messages`.
