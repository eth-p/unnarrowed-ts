import type {
  INDETERMINATE_TYPE,
  NOT_AN_UNNARROWED_TYPE,
  NOT_NARROWED,
  IsAny,
  IsUnion,
} from "./internal.js";
import type { NarrowedFrom, NarrowedFrom_Simple, Unnarrowed } from "./unnarrowed.js";

/**
 * Extracts the unnarrowed type.
 * 
 * If `T` is not `Unnarrowed`, this will return `WhenError` instead of the
 * type.
 */
// prettier-ignore
export type UnnarrowedType<T, WhenError = NOT_AN_UNNARROWED_TYPE> =
  IsUnnarrowed<T,
    NarrowedFrom_Simple<T>,
    WhenError,
    WhenError
  >;

/**
 * Checks if `T` is an `Unnarrowed` type.
 *
 * If `T` is `any`, `WhenError` will be returned.
 */
// prettier-ignore
export type IsUnnarrowed<
  T,
  WhenTrue = true,
  WhenFalse = false,
  WhenError = INDETERMINATE_TYPE
> = IsAny<
    T,
    WhenError,
    NOT_NARROWED extends T ? WhenTrue : WhenFalse
  >;

/**
 * Checks if `T` is not an `Unnarrowed` type.
 *
 * If `T` is `any`, `WhenError` will be returned.
 */
export type IsNarrowed<
  T,
  WhenTrue = true,
  WhenFalse = false,
  WhenError = WhenTrue
> = IsUnnarrowed<T, WhenFalse, WhenTrue, WhenError>;

/**
 * Checks if `T` is strictly narrowed to exactly one, non-union type.
 */
// prettier-ignore
export type IsStrictlyNarrowed<
  T,
  WhenTrue = true,
  WhenFalse = false,
  WhenAny = WhenFalse
> = 
  IsNarrowed<T,
    IsUnion<T, WhenFalse, WhenTrue>,
    WhenFalse,
    WhenAny
  >;
