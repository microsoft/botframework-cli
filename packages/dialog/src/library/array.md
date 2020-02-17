# Supporting arrays
We want to define operations as composites that correspond to operations.

We also need to consider roles?  I think it is just the top-level entity.

Could either be entity -> operation.
Use $operations: {
    "addIngredient": "add",
    "removeIngredient": "remove"
    "changeIngredient": "change"
}

Want to also build in add/remove to arrays by default.  From a modeling perspective, generate as children each possible entity.

Model looks like:
1) Pick up underlying type and create entity.  (Or use existing entity if used.)
2) 
$BreadEntity:multiGrainWheat=
- multi
- grain
- wheat
- multi grain
- grain wheat
- multi grain wheat

$add

Current defines: <prop>Entity, choose<prop>Entity, 

For .lu: 
1) Underlying entity type, ToppingsEntity, populated from enum if needed.
2) Add/Remove composites on top of entity AddToppings, RemoveToppings
3) Schema has $operations

For .lg
* ToppingsEntity(value) -> value for one entity
* AskToppings
* ToppingsName
* Toppings(value) -> foreach ToppingsEntity(value)

For .dialog:
* ToppingsEntity-Choose
* Toppings-missing
* Toppings-assign-ToppingsEntity
