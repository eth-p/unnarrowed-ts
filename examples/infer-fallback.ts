import type { Unnarrowed, IsNarrowed, IsUnnarrowed } from "..";

const aString = "hello world";

/**
 * A generic type in which `T` may not always be possible to infer.
 *
 * This will happen when `string` satisifes `PossiblyUninferrable`.
 * In such an event, attempting to `infer T` will infer T as the right-hand
 * side of the `extends` expression due it being the widest possible type for
 * `T`.
 */
type PossiblyUninferrable<T extends string | number> = { value: T } | string;
type InferPossiblyUninferrable<T> = T extends PossiblyUninferrable<infer V>
  ? V
  : never;

// This resolves to `string | number`.
type inferred1 = InferPossiblyUninferrable<typeof aString>;

/**
 * A generic type in which `T` may not always be possible to infer.
 *
 * With the right-hand side of extends being wrapped in `Unnarrowed<U>`, it
 * becomes possible to use `IsUnnarrowed<V>` determine when `T` cannot be
 * inferred.
 */
type BetterPossiblyUninferrable<T extends Unnarrowed<string | number>> = { value: T } | string;
type InferBetterPossiblyUninferrable<T> = T extends BetterPossiblyUninferrable<infer V>
  ? V
  : never;

// This resolves to `string | number | NOT_NARROWED`.
type inferred2 = InferBetterPossiblyUninferrable<typeof aString>;

// This resolves to `false`.
type inferred2_is_narrowed = IsNarrowed<inferred2>

// This resolves to `true`.
type inferred2_is_unnarrowed = IsUnnarrowed<inferred2>
