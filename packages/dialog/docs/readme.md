# Dialog Commands

## Merge

This will merge together [Microsoft Bot Builder](https://github.com/Microsoft/BotBuilder) .schema JSON schema files into a single JSON schema file and .uischema files into a per-locale .uischema file.  You can point to the files either directly with a glob pattern or indirectly through a glob pattern that matches a package.json or /*.csproj file. The .schema files should have a unique filename that is used to refer to that type using `$kind`. The .schema files should include a `$schema: "https://schemas.botframework.com/schemas/component/v1.0/component.schema"` which defines the schema they are validated against. 

You can also mark properties with a `$role: "expression"` to indicate to tooling that an expression is allowed for that property. A simple way to do this is to make use of common expression definitions like `$ref: "schema:#/definitions/<type>Expression"` in a property definition.  

At the top-level in a component schema you can use `$role:"implements(<kind>)` to project the type definition into interface types defined using `$role:"interface"` while merging. 

To extend an existing .schema file use `$role: "extends(<kind>)"`.  This will add onto the existing definitions in `<kind>`.

To refer to a type in a property, use `$kind:"<kind>"` and the corresponding kind will be wired into your schema.  The merger combines all of the component .schema files into a single .schema file that has resolved all external `$ref`, merged `allOf` and connected together schemas through `$role` and `$kind`.

For `<kind>[.<locale>].uischema` files, use `$schema: "https://schemas.botframework.com/schemas/ui/v1.0/ui.schema"` to define their contents.  The `<kind>` must be found in the .schema file and the optional `<locale>` is a string like en-us.  All of the individual .uischema files will be combined into a composite one per-locale.  If definitions conflict, the definition found first in the topological sort of bread-first, parent before child will be used. 

For C#, nuget does not deal well with content files so all declarative .dialog, .lu, .lg, and .qna files will be copied into `generated/<package>` so you can easily include all of them in your project output.  

For examples look at these files:

- [IRecognizer.schema](../test/schemas/IRecognizer.schema) defines the place holder for `IRecognizer` including a default option which is a bare string.
- [Recognizer.schema](../test/schemas/Recognizer.schema) includes `$role:"implements(IRecognizer)"` which extends the `IRecognizer` definition when merged.
- [root.schema](../test/schemas/root.schema) is a schema file that includes `$kind:"IRecognizer"` in order to make use of the `IRecognizer` place holder.  The `$role: []` ensures that this is available as a top-level object.
- [app.schema](../test/schemas/app.schema) was created by this tool shows how all of these definitions are merged together. In particular if you look at `IRecognizer` you will see the definition that includes a string, or the complete definition of `Recognizer`.
- [nuget3.en-us.uischema](../test/commands/dialog/projects/project3/nuget3.en-us.uischema) shows an example component .uischema file.
- [project3.en-us.uischema](../test/commands/dialog/oracles/project3.en-us.uischema) shows a merged .uischema file.

[root.dialog](../test/examples/root.dialog) Shows how you could use the resulting schema to enter in JSON schema and get intellisense.

## Verify

The verify command will check .dialog files to ensure that they all meet their $schema.

