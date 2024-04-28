# narrowable

A type-only TypeScript library for detecting unnarrowed types and asserting narrowing of generic types.

## What can I do with this?

- **[Associated types.](./examples/associated-types.ts)**
- **[Type narrowing assertions.](./examples/asserted-narrow.ts)**
- [Detecting when `infer T` uses the `extends` type as a fallback.](./examples/infer-fallback.ts)

## Types

### Unnarrowed

A type that has not been narrowed yet.

```ts
type Unnarrowed<T>
```

**Usage:**

```ts
interface AssociatedTypes {
    DateType: Unnarrowed<Date | number | string>
}
```

### NarrowedFrom

The narrowed form of an [`Unnarrowed`](#unnarrowed) type.

If used on the right-hand side of an `extends` statement such as
`MyClass<U extends NarrowedFrom<T>>` where `T` is `Unnarrowed`, it will cause an
error when `U = T`.

```ts
type NarrowedFrom<T>
```

**Behavior:**

  * If `T` is `Unnarrowed<U>`, returns `U`.
  * If `T` is an object with `Unnarrowed<U>` properties, the `Unnarrowed` is stripped from them.
  * Otherwise, returns an *error type*.

**Usage:**

```ts
type DateType = Unnarrowed<Date | number | string>
type DateGetter<T extends NarrowedFrom<DateType> = NarrowedFrom<DateType>> = () => T;
//                        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ <-- assert narrowing

/** Defined elsewhere */
declare function getPublishDate(package: string): DateType;

/**
 * Prints a date returned by a DateGetter.
 */
function printDateFrom<F extends DateGetter>(getter: F) {
    console.log(getter());
}

printDateFrom(() => new Date()); // ok
printDateFrom(() => getPublishDate("unnarrowed"));
//                  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ <-- error, it returns unnarrowed DateType
```

### AssertNarrowed

Asserts that the given type has been narrowed from an `Unnarrowed<U>`.

```ts
type AssertNarrowed<T, Options = {}>
```

**Options:**

```ts
{

    // If set to `true`, the assertion will only pass if the type is
    // narrowed to a single, non-union type.
    strict?: true | false
    
    // If set, this type will be returned when the assertion fails.
    failType: any;

}
```

**Usage:**

```ts
type GlasswareMaterial = Unnarrowed<'glass' | 'crystal'>;
interface Glassware<T extends GlasswareMaterial> {
    type: AssertNarrowed<T, {
        strict: true,
        failType: never,
    }>
}
const aWineGlass: Glassware<'glass' | 'crystal'> = {
    type: "glass"
//  ~~~~ <-- T is not strictly narrowed, so `type` is never
}
```

### AssertStrictlyNarrowed

An alias for [`AssertNarrowed`](#assertnarrowed) with the `strict` option set to `true`.

```ts
type AssertStrictlyNarrowed<T, Options = {}>
```

## Utility Types

### IsUnnarrowed

Checks if a type is [`Unarrowed<T>`](#unnarrowed).

If the given type is `any`, an *error type* will be returned.

```ts
type IsUnnarrowed<T, WhenTrue=true, WhenFalse=false, WhenError=/* error */>
```

**Usage:**

```ts
type should_be_true  = IsUnnarrowed<Unnarrowed<string>>;
type should_be_false = IsUnnarrowed<string>;
type is_error        = IsUnnarrowed<any>;
```

### IsNarrowed

Checks if a type is not [`Unarrowed<T>`](#unnarrowed).

If the given type is `any`, the `WhenTrue` type will be returned.

```ts
type IsUnnarrowed<T, WhenTrue=true, WhenFalse=false, WhenError=WhenTrue>
```

**Usage:**

```ts
type should_be_true  = IsNarrowed<string>;
type should_be_false = IsNarrowed<Unnarrowed<string>>;
type also_true       = IsNarrowed<any>;
```

### IsStrictlyNarrowed

Checks if a type is not [`Unarrowed<T>`](#unnarrowed), and is not a type union.

If the given type is `any`, the `WhenFalse` type will be returned.

```ts
type IsUnnarrowed<T, WhenTrue=true, WhenFalse=false, WhenError=WhenTrue>
```

**Usage:**

```ts
type should_be_true  = IsStrictlyNarrowed<string>;
type should_be_false = IsStrictlyNarrowed<Unnarrowed<string>>;
type also_false_1    = IsStrictlyNarrowed<string | boolean>;
type also_false_2    = IsStrictlyNarrowed<any>;
```
