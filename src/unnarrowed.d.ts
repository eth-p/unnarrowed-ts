import type {
  INDETERMINATE_TYPE,
  IsAny,
  IsObject,
  IsUnderscoreAny,
  NOT_AN_UNNARROWED_TYPE,
  NOT_NARROWED,
  _Any,
} from "./internal.js";
import { IsNarrowed, IsUnnarrowed } from "./utilities.js";

/**
 * A type that has not been narrowed yet.
 *
 * @example
 *     type PossibleTypes = Unnarrowed<string | number>;
 */
export type Unnarrowed<T> = IsAny<T, _Any, T> | NOT_NARROWED;

/**
 * The narrowed form of an {@link Unnarrowed `Unnarrowed`} type.
 *
 * When this is on the right-hand side of an `extends` expression with `T` being
 * a type alias for {@link Unnarrowed `Unnarrowed<U>`}, it causes the compiler
 * to raise an error when `T ⊄ U` (`T` is not a subset of `U`).
 * 
 * If `T` is `any` or a type that is not `Unnarrowed`, this will return an
 * error type.
 *
 * @note Improper subset. `T = U` is allowed.
 *
 * @example
 *     type PossibleTypes = Unnarrowed<string | number>;
 *     function print<T extends NarrowedFrom<PossibleTypes>>(value: T) {
 *         console.log(value);
 *     }
 *
 *     print<string>("a string");         // No error.
 *     print<string|number>("a string");  // No error.
 *     print<PossibleTypes>("a string");  // Not narrowed from PossibleTypes.
 */
// prettier-ignore
export type NarrowedFrom<T> = IsAny<
  T, INDETERMINATE_TYPE, // error if `any`
  NarrowedFrom_Branch<T,
    /* if Unnarrowed */ NarrowedFrom_Simple<T>,
    /* if object     */ NarrowedFrom_Object<T>,
    /* else          */ NOT_AN_UNNARROWED_TYPE
  >
>;

/**
 * Branch for `NarrowedFrom` depending on the input.
 */
// prettier-ignore
type NarrowedFrom_Branch<T, WhenDirect, WhenObject, WhenElse> =
  IsUnnarrowed<T,
    WhenDirect, // it's directly an Unnarrowed<T>
    IsObject<T,
      WhenObject,
      WhenElse
    >
  >;

/**
 * Removed `Unnarrowed` from `T`.
 *
 * If `T` is `Unnarrowed<any>`, make sure to return `any` instead of the special
 * marker `_Any`.
 */
type NarrowedFrom_Simple<T> = IsUnderscoreAny<
  Exclude<T, NOT_NARROWED>,
  any,
  Exclude<T, NOT_NARROWED>
>;

/**
 * Removed `Unnarrowed` from all properties of the object `T`.
 */
type NarrowedFrom_Object<T> = {
  [key in keyof T]: IsNarrowed<T[key], T[key], NarrowedFrom_Simple<T[key]>>;
};
