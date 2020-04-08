# Dialog Commands

## Merge

Ths will merge together [Microsoft Bot Builder](https://github.com/Microsoft/BotBuilder) .schema JSON schema files into a single JSON schema file. You can point to the files either directly with a glob pattern or indirectly through a glob pattern that matches a package.json, packages.config or \*.csproj file. The .schema files should have a unique filename that is used to refer to that type using `$kind`. The .schema files can optionally include a `$schema: "https://raw.githubusercontent.com/Microsoft/botbuilder-tools/SchemaGen/packages/DialogSchema/src/dialogSchema.schema"` which defines the schema they are validated against. Within a schema definition you can use `$role:"implements(<kind>)` to project the type definition into interface types defined using `$role:"interface"` while merging. To refer to a type in a property, just use `"$kind":"<kind>"`. The merger combines all of the component .schema files into a single .schema file that has resolved all external `$ref`, merged `allOf` and connected together schemas through `$role` and `$kind`.

In addition to types you can also mark properties with a `$role` which will define the underlying type and restrictions. This is also useful information for UI tools to help you construct values. Roles include:

- `$role: "expression"` which marks a string property which is expected to contain an expression string.
- `$role: "lg"` which marks a string property which is used for language generation and can refer to LG templates.
- `$role: "memoryPath"` which marks a string property which is expected to contain a path in memory like `user.name`.

For example look at these files:

- [IRecognizer.schema](test/schemas/IRecognizer.schema) defines the place holder for `IRecognizer` including a default option which is a bare string.
- [Recognizer.schema](test/schemas/Recognizer.schema) includes `$role:"implements(IRecognizer)"` which extends the `IRecognizer` definition when merged.
- [root.schema](test/schemas/root.schema) is a schema file that includes `$kind:"IRecognizer"` in order to make use of the `IRecognizer` place holder.
- [app.schema](test/examples/app.schema) was created by this tool shows how all of these definitions are merged together. In particular if you look at `IRecognizer` you will see the definition that includes a string, or the complete definition of `Recognizer`.

[root.dialog](test/examples/root.dialog) Shows how you could use the resulting schema to enter in JSON schema and get intellisense.

## Verify

The verify command will check .dialog files to ensure that they all meet the schema.

