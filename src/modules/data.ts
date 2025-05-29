// destinations img
import room1 from "@/assets/view20.jpg";
import room2 from "@/assets/view10.jpg";
import room3 from "@/assets/view13.jpg";
import room4 from "@/assets/view2.jpg";
import room5 from "@/assets/view15.jpg";
import room6 from "@/assets/view8.jpg";

// populars img
import Anchorage from "@/assets/view1.jpg";
import Singapore from "@/assets/view5.jpg";
import Kiwiana from "@/assets/view15.jpg";
import Quito from "@/assets/view3.jpg";
import Cuzco from "@/assets/view9.jpg";
import Ushuaia from "@/assets/view12.jpg";
import Santiago from "@/assets/view11.jpg";
import Explorer from "@/assets/view18.jpg";

// room detail img
import image1 from "@/assets/room1.jpg";
import image2 from "@/assets/room2.jpg";
import image3 from "@/assets/room3.jpg";
import image4 from "@/assets/room4.jpg";
import image5 from "@/assets/room5.jpg";
import image6 from "@/assets/room6.jpg";
import image7 from "@/assets/room9.jpg";
import image8 from "@/assets/room3.jpg";

export const roomTierData = [
  {
    id: 0,
    name: "King Room",
    rooms: "2 rooms available",
    image: room1, // Thay thế với hình ảnh phòng King thực tế
    link: "room-name", // Liên kết tới trang chi tiết phòng
    shortDes: "A spacious room with a king-size bed and luxurious amenities.",
  },
  {
    id: 1,
    name: "Luxury Suite",
    rooms: "3 rooms available",
    image: room2, // Thay thế với hình ảnh phòng Luxury thực tế
    link: "room-name", // Liên kết tới trang chi tiết phòng
    shortDes: "A lavish suite with an ocean view, private balcony, and premium facilities.",
  },
  {
    id: 2,
    name: "Standard Room",
    rooms: "5 rooms available",
    image: room3, // Thay thế với hình ảnh phòng Standard thực tế
    link: "room-name", // Liên kết tới trang chi tiết phòng
    shortDes: "A comfortable and affordable room with essential amenities.",
  },
  {
    id: 3,
    name: "Presidential Suite",
    rooms: "1 room available",
    image: room4, // Thay thế với hình ảnh phòng Presidential thực tế
    link: "room-name", // Liên kết tới trang chi tiết phòng
    shortDes: "The most luxurious room with exclusive services and breathtaking views.",
  },
  {
    id: 4,
    name: "Deluxe Room",
    rooms: "4 rooms available",
    image: room5, // Thay thế với hình ảnh phòng Deluxe thực tế
    link: "room-name", // Liên kết tới trang chi tiết phòng
    shortDes: "A deluxe room with premium furnishings and a stunning view.",
  },
  {
    id: 5,
    name: "Superior Room",
    rooms: "3 rooms available",
    image: room6, // Thay thế với hình ảnh phòng Superior thực tế
    link: "room-name", // Liên kết tới trang chi tiết phòng
    shortDes: "A well-appointed room with a cozy atmosphere and modern amenities.",
  },
];


export const popularsData: {
  id: number;
  title: string;
  image: string;
  category: string[];
  price: number;
  tier: string;
  features: string[];
  rating: number;
}[] = [
  {
    id: 0,
    title: "Deluxe Double Room",
    image: Anchorage,
    category: ["Double"],
    price: 120,
    tier: "Luxury",
    features: ["TV", "Air Conditioner", "Bathtub", "WiFi", "Mini Bar"],
    rating: 4.5,
  },
  {
    id: 1,
    title: "Standard Single Room",
    image: Singapore,
    category: ["Single"],
    price: 75,
    tier: "Standard",
    features: ["TV", "WiFi", "Air Conditioner"],
    rating: 4.0,
  },
  {
    id: 2,
    title: "King Suite",
    image: Kiwiana,
    category: ["Double"],
    price: 250,
    tier: "King",
    features: ["TV", "Air Conditioner", "Bathtub", "WiFi", "Private Balcony", "Mini Bar"],
    rating: 5.0,
  },
  {
    id: 3,
    title: "Luxury Double Room",
    image: Quito,
    category: ["Double"],
    price: 180,
    tier: "Luxury",
    features: ["TV", "Air Conditioner", "Bathtub", "WiFi", "Coffee Maker"],
    rating: 4.8,
  },
  {
    id: 4,
    title: "Economy Single Room",
    image: Cuzco,
    category: ["Single"],
    price: 50,
    tier: "Standard",
    features: ["WiFi", "Air Conditioner"],
    rating: 3.8,
  },
  {
    id: 5,
    title: "Presidential Suite",
    image: Ushuaia,
    category: ["Double"],
    price: 500,
    tier: "King",
    features: ["TV", "Air Conditioner", "Bathtub", "WiFi", "Private Pool", "Butler Service"],
    rating: 5.0,
  },
  {
    id: 6,
    title: "Economy Single Room",
    image: Santiago,
    category: ["Single"],
    price: 50,
    tier: "Standard",
    features: ["WiFi", "Air Conditioner"],
    rating: 3.8,
  },
  {
    id: 7,
    title: "Presidential Suite",
    image: Explorer,
    category: ["Double"],
    price: 500,
    tier: "King",
    features: ["TV", "Air Conditioner", "Bathtub", "WiFi", "Private Pool", "Butler Service"],
    rating: 5.0,
  },
];


export const roomDetails = {
  title: "Deluxe Room with Ocean View",
  des: `This spacious and luxurious deluxe room offers stunning ocean views, perfect for relaxation. With modern furnishings and elegant design, the room features a king-sized bed, a comfortable seating area, and all the amenities you need for a pleasant stay. Located on the upper floors, it provides both privacy and breathtaking views of the sea. Ideal for couples or solo travelers seeking comfort and tranquility.`,
  price: "150.00", // Giá phòng mỗi đêm
  rating: "4.8", // Đánh giá của khách hàng
  reviews: "245 reviews", // Số lượng đánh giá

  roomInfo: [
    '<strong className="font-bold">Location:</strong> Ocean View, 5th Floor',
    '<strong className="font-bold">Room Size:</strong> 35 m²',
    '<strong className="font-bold">Bed Type:</strong> King-size Bed',
    '<strong className="font-bold">Facilities:</strong> Air conditioning, Free Wi-Fi, Mini bar, Smart TV, In-room safe, Coffee machine',
  ],

  highlights: [
    "Stunning ocean view from your private balcony",
    "Luxury amenities including high-end toiletries and bed linens",
    "24/7 room service and daily housekeeping",
    "Access to the hotel’s spa, gym, and infinity pool",
  ],

  itinerary: [
    {
      title: `<span class="me-1 fw-bold">Day 1:</span> Check-in and Relaxation`,
      des: `Arrive at the hotel, check into your Deluxe Room with Ocean View, and enjoy a relaxing evening by the sea. Unwind and explore the hotel’s amenities at your leisure.`,
    },
    {
      title: `<span class="me-1 fw-bold">Day 2:</span> Spa and Wellness`,
      des: `Indulge in a rejuvenating spa treatment followed by a relaxing day by the infinity pool. Enjoy lunch at the rooftop restaurant with panoramic views of the ocean.`,
    },
    {
      title: `<span class="me-1 fw-bold">Day 3:</span> Private Beach and Sunset Cruise`,
      des: `Spend the day on the private beach, followed by a scenic sunset cruise. Return to the hotel for a gourmet dinner at the restaurant.`,
    },
    {
      title: `<span class="me-1 fw-bold">Day 4:</span> Explore the Local Culture`,
      des: `Take a guided tour of the local cultural sites. Enjoy lunch at a traditional restaurant and return to the hotel for some relaxation before checking out.`,
    },
  ],

  included: [
    "Comfortable stay in the Deluxe Ocean View Room for 4 nights",
    "Daily breakfast included",
    "Access to hotel facilities including the spa, gym, and infinity pool",
    "Round-trip airport transfers",
    "Complimentary Wi-Fi",
    "Guided tour to local cultural sites",
  ],

  exclusion: [
    "Lunch and dinner are not included in the room rate",
    "Additional spa treatments or services",
    "Personal expenses (e.g., minibar, souvenirs)",
    "Tourist taxes or fees",
  ],

  images: [
    {
      original: image1, // Thay thế với đường dẫn đến hình ảnh thực tế
      thumbnail: image1, // Thay thế với đường dẫn đến hình ảnh thu nhỏ
    },
    {
      original: image2,
      thumbnail: image2,
    },
    {
      original: image3,
      thumbnail: image3,
    },
    {
      original: image4,
      thumbnail: image4,
    },
    {
      original: image5,
      thumbnail: image5,
    },
    {
      original: image6,
      thumbnail: image6,
    },
    {
      original: image7,
      thumbnail: image7,
    },
    {
      original: image8,
      thumbnail: image8,
    },
  ],
};


export const location = [
  "Bali",
  "Tokyo",
  "Bangkok",
  "Cancun",
  "Nha Trang",
  "Phuket",
  "Malaysia",
  "Paris",
];

export const Categories = [
  "History",
  "Calture",
  "Netural",
  "Urban room",
  "Relax",
];

export const Duration = ["1-3 Days", "3-5 Days", "5-7 Days", "7-10 Day"];
export const PriceRange = [
  "$ 0 - $50",
  "$ 50 - $ 100",
  "$ 100 - $ 200",
  "$ 200 - ₹ $ 400",
  "$ 400 - ₹ $ 800",
];

export const Ratings = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"]; 
