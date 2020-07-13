# Dialog Commands

## Merge

This will merge together [Microsoft Bot Builder](https://github.com/Microsoft/BotBuilder) .schema JSON schema files into a single JSON schema file. You can point to the files either directly with a glob pattern or indirectly through a glob pattern that matches a package.json, packages.config or \*.csproj file. The .schema files should have a unique filename that is used to refer to that type using `$kind`. The .schema files should include a `$schema: "https://schemas.botframework.com/schemas/component/v1.0/component.schema"` which defines the schema they are validated against. You can access common definitions by using `$ref: "schema:#/definitions/stringExpression"` in a property definition.  At the top-level in a component schema you can use `$role:"implements(<kind>)` to project the type definition into interface types defined using `$role:"interface"` while merging. To extend an existing .schema file use `$role: "extends(<kind>)"`.  To refer to a type in a property, use `"$kind":"<kind>"` and the corresponding kind will be wired into your schema.  The merger combines all of the component .schema files into a single .schema file that has resolved all external `$ref`, merged `allOf` and connected together schemas through `$role` and `$kind`.

You can also mark properties with a `$role: "expression"` to indicate to tooling that an expression is allowed for that property. 

For example look at these files:

- [IRecognizer.schema](test/schemas/IRecognizer.schema) defines the place holder for `IRecognizer` including a default option which is a bare string.
- [Recognizer.schema](test/schemas/Recognizer.schema) includes `$role:"implements(IRecognizer)"` which extends the `IRecognizer` definition when merged.
- [root.schema](test/schemas/root.schema) is a schema file that includes `$kind:"IRecognizer"` in order to make use of the `IRecognizer` place holder.  The `$role: []` ensures that this is available as a top-level object.
- [app.schema](test/schemas/app.schema) was created by this tool shows how all of these definitions are merged together. In particular if you look at `IRecognizer` you will see the definition that includes a string, or the complete definition of `Recognizer`.

[root.dialog](test/examples/root.dialog) Shows how you could use the resulting schema to enter in JSON schema and get intellisense.

## Verify

The verify command will check .dialog files to ensure that they all meet their $schema.

