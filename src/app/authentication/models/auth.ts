export interface RegisterPostData {
  fullName: string;
  email: string;
  password: string;
  role: string; // Ensure this is defined
}

export interface User extends RegisterPostData {
  id: string;
}
export interface User {
  email: string;
  password: string;

}
export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  location: string;
  name: string;
  profilePic: string;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  location: string;
  name: string;
  role: string;
  profilePic: string;
}
export interface AdminDashboardComponent {
  id: string;
  fullName: string;
  email: string;
  password: string;
  age: number;
  gender: string;
  location: string;
  name: string;
  role: string;

}
