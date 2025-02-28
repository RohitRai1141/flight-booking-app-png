export interface cabs{
      id: string
      agencyId:string
      driverName: string
      type: string,
      fareEstimate: number
      location: string
      available: true,
      seater:number
      image:string[]
      dropLocation: string
      estimatedTime:number
      pinGenerated: number
      contactNumber: number
      carNumber:string
      reviews: [
        {
          user: string
          comment: string
          rating: string
        },
      ],
      rating: string
    }


    export interface Booking {
      id: string;
      date: string;
      contactNumber: string;
      status: string;
      firstname: string;
      lastname: string;
      gender: string;
      type: string,
      location:string,
      cabs: cabs[];
      users: User[];
      reviews: []; 
    }
    

  export interface faqs{
      question: string;
      answer: string;
    }
 
    export interface User {
      id:string;
      firstname: string;
      midname:string;
      lastname: string;
      gender: string;
      date: string;
      contactNumber: string;
       
    }

    export interface drivers {
      id:string;
      cab: cabs;  
      available: true;
      location:string;
      city:string;
      driverName:string;
      cabNumber:string;
      chats: ChatMessage[];
    }

    export interface ChatMessage {
      sender: string;
      receiver: string;
      text: string;
      timestamp: string;
    }
    
    export interface reviews{
      id:string;
      Bookingid: string;
      Userid:string;
      rating:string;
      comment: string;
     
    }