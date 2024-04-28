import type {
  AssociatedTypeOptionalProperties,
  IsEqual,
  NOT_NARROWED,
  ResolveAssociatedType,
  ResolvedAssociatedType,
} from "./internal";
import type { Unnarrowed, NarrowedFrom } from "./unnarrowed";
import type { IsNarrowed, IsStrictlyNarrowed } from "./utilities";

/**
 * Asserts that the type `T` has been narrowed from an `Unnarrowed<U>`.
 *
 * The behavior of the assertion can be configured through the Options
 * associated type.
 *
 * **Options:**
 *
 *     {
 *         // If set to `true`, the assertion will only pass if the type is
 *         // narrowed to a single, non-union type.
 *         strict: true | false;
 *
 *         // If set, this type will be returned when the assertion fails.
 *         failType: any;
 *     }
 *
 * @example
 *     type GlasswareMaterial = Unnarrowed<'glass' | 'crystal'>;
 *
 *     interface Glassware<T extends GlasswareMaterial> {
 *         type: AssertNarrowed<T, {
 *             strict: true,
 *             failType: never,
 *         }>
 *     }
 *
 *     const aWineGlass: Glassware<'glass' | 'crystal'> = {
 *         type: "glass"
 *     //  ~~~~ <-- T is not strictly narrowed, so `type` is never
 *     }
 */
export type AssertNarrowed<
  T,
  Options extends NarrowedFrom<AssertNarrowedOptions> = {}
> = AssertNarrowed_WithDefaultOptions<
  T,
  ResolveAssociatedType<
    AssertNarrowedOptions,
    Options,
    DefaultAssertNarrowedOptions
  >
>;

// prettier-ignore
type AssertNarrowed_WithDefaultOptions<
  T,
  Options extends ResolvedAssociatedType<AssertNarrowedOptions>
> = 
  IsEqual<Options["strict"], true,
    IsStrictlyNarrowed<T, T, Options["failType"]>,
    IsNarrowed<T, T, Options["failType"]>
  >;

/**
 * An alias for {@link AssertNarrowed} with the `strict` option set to `true`.
 */
export type AssertStrictlyNarrowed<
  T,
  Options extends NarrowedFrom<Omit<AssertNarrowedOptions, "strict">> = {}
> = AssertNarrowed<T, Options & { strict: true }>;

/**
 * Options for changing the behavior of {@link AssertNarrowed}.
 */
export type AssertNarrowedOptions = {
  /**
   * Specifies how strict {@link AssertNarrowed} should be.
   *
   * If set to `true`, the assertion will only pass if the type is narrowed to
   * a single, non-union type.
   */
  strict?: Unnarrowed<boolean>;

  /**
   * The type to return when the assertion fails.
   *
   * By default, this will use a type that causes the compiler to raise an
   * error.
   */
  failType?: Unnarrowed<any>;
};

/**
 * Default options of {@link AssertNarrowedOptions}.
 */
interface DefaultAssertNarrowedOptions
  extends Required<AssociatedTypeOptionalProperties<AssertNarrowedOptions>> {
  strict: false;
  failType: NOT_NARROWED;
}
