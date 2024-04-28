import type { Unnarrowed, AssertNarrowed } from "..";

/**
 * A wheel.
 */
declare type Wheel = { pressure: number; size: number };

/**
 * A car.
 */
interface Car {
  frontLeftWheel: Wheel;
  frontRightWheel: Wheel;
  backLeftWheel: Wheel;
  backRightWheel: Wheel;
}

/**
 * A bike.
 */
interface Bike {
  frontWheel: Wheel;
  backWheel: Wheel;
}

/**
 * Some type of vehicle.
 */
type VehicleType = Unnarrowed<Bike | Car>;

/**
 * A repair shop for a single type of vehicle.
 */
interface VechicleRepairShop<T> {
  hours: [Date, Date];
  repair(vehicle: AssertNarrowed<T, {strict: true}>);
}

/**
 * A repair shop for cars.
 */
export class JimsTrucksAndCars implements VechicleRepairShop<Car> {
  hours: [Date, Date];
  repair(vehicle: Car) {
    // repair the bike
  }
}

/**
 * A repair shop for both cars and bikes.
 */
export class MasterOfNoneRepairs implements VechicleRepairShop<Car | Bike> {
  hours: [Date, Date];

  // @ts-expect-error
  repair(vehicle: Car | Bike) {
    //            ~~~~~~~~~~ <-- AssertNarrowed failed, raising an error
  }
}
