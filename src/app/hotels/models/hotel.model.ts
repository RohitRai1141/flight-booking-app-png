
//hotel.model.ts

export interface specialOffers {
  discount: number;
  description: string;
}

export interface Room {
  type: string;
  bed: string;
  size: string;
  amenities: string[];
  price: number;
  image: string;
  totalRooms: number; //
  availability:{}; //
  capacity: { 
    adults: number;
    children: number;
  };
}

export interface Hotel {
    id: string;
    name: string;
    location: string;
    Address: string;
    price: number;
    images: string[];
    amenities: string[];
    description: string;
    nearbyAttractions: string[];//
    specialOffers: specialOffers[]; //
    discountedPrice: number;
    offerDescription: string;
    rooms: Room[];
    surroundings: {
      'Airport':string;
      'Train': string;
      'Bus': string;
    };
    reviews: [
    {
      username: string;
      rating: number;
      comment: string;
    } ];
    rating: number;
    star: number;
    faqs: [
      {
        question: string;
        answer: string;
      }
    ];
  }
  
  export interface Guest {
    name: string;
    age: number;
    gender: string;
  }
  
  export interface Booking {
    id: string;
    userid: string;
    hotelid: string;
    hotelName: string;
    hotelImage: string;
    location: string;
    name: string;
    age: number;
    gender: string;
    email: string;
    phone: string;
    guests: Guest[];
    roomType: string;
    roomPrice: number;
    noOfrooms: number;
    stayDuration: number;
    noOfGuests: number;
    totalPrice: number;
    totalPayable: number;
    checkIn: string;
    checkOut: string;
    status: string;
    offer: number;
    netPrice: number;
  }
  