export interface Flight {
    id: string;
    from: string;
    to: string;
    departureDate: string;
    price: number;
    airline: string;
    totalSeats: number;
    availableSeats: string;  // since your JSON has "string[]" as a string
    unavailableSeats: string;  // since your JSON has "string[]" as a string
    fromTime: string;
    toTime: string;
    duration: string;
  }