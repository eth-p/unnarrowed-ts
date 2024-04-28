import type { Unnarrowed, NarrowedFrom } from "../";

/**
 * An interface of associated types.
 */
interface AssociatedTypes {
  TimestampType: Unnarrowed<any>;
  NumberType: Unnarrowed<string | number | bigint>;
}

/**
 * A bank account class which has property types defined by a generic interface
 * of associated types.
 */
class BankAccount<P extends NarrowedFrom<AssociatedTypes>> {
  date: P["TimestampType"];
  balance: P["NumberType"];
  owner: string;
}

/**
 * A bank account with JSON-compatible properties.
 *
 * Resolves to the following type:
 *
 *     {
 *         date: number,
 *         balance: string,
 *         owner: string,
 *     }
 */
type JsonCompatibleBankAccount = BankAccount<{
  TimestampType: number;
  NumberType: string;
}>;

/**
 * A bank account with JSON-incompatible properties.
 *
 * Resolves to the following type:
 *
 *     {
 *         date: Date,
 *         balance: bigint,
 *         owner: string,
 *     }
 */
type RehydratedBankAccount = BankAccount<{
  TimestampType: Date;
  NumberType: bigint;
}>;

// @ts-expect-error
type RejectedFor_UnnarrowedType = BankAccount<AssociatedTypes>;
//                                            ~~~~~~~~~~~~~~~ <-- Not narrowed.

// @ts-expect-error
type RejectedFor_BadType = BankAccount<{
  TimestampType: any;
  NumberType: null;
  //          ~~~~ <-- Not a valid option for the associated type.
}>;
