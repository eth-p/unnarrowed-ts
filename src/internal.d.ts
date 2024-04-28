import { NarrowedFrom } from "./unnarrowed";
import { UnnarrowedType } from "./utilities";

export const NOT_NARROWED_UNIQUE_TYPE: unique symbol;
export const NOT_AN_UNNARROWED_TYPE_UNIQUE_TYPE: unique symbol;
export const INDETERMINATE_TYPE_TYPE: unique symbol;

/**
 * A type that has not been narrowed.
 *
 * If your code contains an error involving this not being assignable to or
 * from, you have an un-narrowed generic type where a narrowed one was expected.
 */
export type NOT_NARROWED = {
  [NOT_NARROWED_UNIQUE_TYPE]: typeof NOT_NARROWED_UNIQUE_TYPE;
};

/**
 * A type that indicates some type has not been wrapped with `Unnarrowed<T>`.
 *
 * If your code contains an error involving this not being assignable to or
 * from, you might be using `UnnarrowedType<T>` on a `T` that is not
 * `Unnarrowed<any>`.
 */
export type NOT_AN_UNNARROWED_TYPE = {
  [NOT_AN_UNNARROWED_TYPE_UNIQUE_TYPE]: typeof NOT_AN_UNNARROWED_TYPE_UNIQUE_TYPE;
};

/**
 * A type that indicates its impossible to determine the correct value.
 *
 * This can happen when:
 *  - Using `IsUnnarrowed` with `Unnarrowed<any>`.
 *  - Using `UnnarrowedType` with `Unnarrowed<any>`.
 *
 * If your code contains an error involving this not being assignable to or
 * from, you might be using `UnnarrowedType<T>` on a `T` that is not
 * `Unnarrowed<any>`.
 */
export type INDETERMINATE_TYPE = {
  [INDETERMINATE_TYPE_TYPE]: typeof INDETERMINATE_TYPE_TYPE;
};

/**
 * Checks if `A` is the any type.
 */
export type IsAny<A, WhenTrue = true, WhenFalse = false> = 0 extends 1 & A
  ? WhenTrue
  : WhenFalse;

/**
 * Checks if `A` is equal to the `B` type.
 */
export type IsEqual<A, B, WhenEq = true, WhenNeq = false> = IsAny<
  A,
  IsAny<B, WhenEq, IsEqual_NotAny<A, B, WhenEq, WhenNeq>>,
  IsAny<B, WhenNeq, IsEqual_NotAny<A, B, WhenEq, WhenNeq>>
>;

type IsEqual_NotAny<A, B, WhenEq, WhenNeq> = [A, B] extends [B, A]
  ? WhenEq
  : WhenNeq;

/**
 * Converts a type union to a type intersection.
 *
 * Credit: https://stackoverflow.com/a/50375286
 */
export type UnionToIntersection<U> = (
  U extends any ? (x: U) => void : never
) extends (x: infer I) => void
  ? I
  : never;

/**
 * Checks if a type is a type union.
 */
export type IsUnion<A, WhenTrue = true, WhenFalse = false> = [A] extends [
  UnionToIntersection<A>
]
  ? WhenFalse
  : WhenTrue;

/**
 * Checks if a type is an array.
 */
export type IsArray<A, WhenTrue = true, WhenFalse = false> = A extends [...any]
  ? WhenTrue
  : WhenFalse;

/**
 * Checks if a type is an object or interface.
 */
// prettier-ignore
export type IsObject<A, WhenTrue = true, WhenFalse = false> = 
  Record<PropertyKey, any> extends A
    ? WhenTrue
    : A extends object
      ? IsArray<A, WhenFalse, WhenTrue>
      : WhenFalse;

/**
 * Returns a mapped object containing the optional properties of an associated
 * type using with this package.
 */
export type AssociatedTypeOptionalProperties<T> = {
  // Mapped type that removes all required options and maps all optional
  // options to the type of their Unnarrowed.
  [key in keyof T as undefined extends T[key] ? key : never]-?: UnnarrowedType<
    Required<T>[key]
  >;
};

/**
 * Returns a mapped object which combines an associated type with its default
 * properties. The output of this type is {@link ResolvedAssociatedType}.
 */
export type ResolveAssociatedType<
  T,
  Specified extends NarrowedFrom<T>,
  Defaults extends AssociatedTypeOptionalProperties<T>
> = Required<
  Specified & {
    [key in keyof Defaults as key extends keyof Specified
      ? never
      : key]-?: Defaults[key];
  }
>;

export type ResolvedAssociatedType<T> = {
  [key in keyof T]-?: UnnarrowedType<Required<T>[key]>;
};

/**
 * A type equivalent to `any` but without the absorption property that destroys
 * the ability to check if some given type is in the union.
 */
export type _Any = {} | null | undefined;

export type IsUnderscoreAny<T, WhenTrue = true, WhenFalse = false> = IsAny<
  T,
  WhenFalse,
  _Any extends T ? WhenTrue : WhenFalse
>;
