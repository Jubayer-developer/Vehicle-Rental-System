                                                  Vehicle Rental System
Live Link: https://assignment-2-psi-liart.vercel.app/

Features ঃ

১. Vehicle Management

এডমিন নতুন গাড়ি যোগ করতে পারবে

গাড়ির তথ্য আপডেট করা যাবে

গাড়ি ডিলিট করা (যদি কোনো active booking না থাকে)

গাড়ি available না booked — এই অবস্থা ট্র্যাক করা

২. Customer Management

কাস্টমার রেজিস্ট্রেশন ও প্রোফাইল ম্যানেজ করা

কাস্টমার নিজের তথ্য আপডেট করতে পারে

Admin চাইলে যেকোনো ইউজারের রোল বা তথ্য পরিবর্তন করতে পারে

৩. Booking System

গাড়ি ভাড়ার জন্য booking করা যায়

ভাড়ার দিন অনুযায়ী অটোমেটিক total price হিসাব হয়

Booking হলে গাড়ির স্ট্যাটাস “booked” হয়ে যায়

সময় শেষ হলে গাড়ি ও booking অটোমেটিকভাবে “returned” হয়ে যায়

Customer তার নিজের booking দেখতে পারে

Admin সব booking দেখতে পারে

৪. Authentication & Security

password bcrypt দিয়ে secure করা আছে

Login করলে JWT token পাওয়া যায়

ওই Token ছাড়া কোনো protected route এ ঢোকা যাবে না

Role-based access (Admin & Customer) implement করা হয়েছে

Technology Stack ঃ

Node.js -> Backend সার্ভার চালানোর জন্য

TypeScript -> কোডকে আরো সেফ ও পরিষ্কার রাখার জন্য

Express.js  -> API তৈরি করার জন্য

PostgreSQL-> ডাটাবেস হিসেবে

bcrypt  -> পাসওয়ার্ড হ্যাশ করার জন্য

jsonwebtoken (JWT) → Authentication ও Authorization এর জন্য

সবকিছু modular system অনুযায়ী আলাদা আলাদা ফাইলে ভাগ করা হয়েছে যেমনঃ
routes, controllers, services, middlewares — যাতে কোড পরিষ্কার ও maintainable থাকে।


Setup & Usage Instructions ঃ

1।  প্রোজেক্ট  গিটহাব  থেকে  ক্লোন   করতে হবে

2। দরকারি প্যাকেজ  ইন্সটল    করতে হবে -> 

 যেমনঃ  npm install   

3। প্রোজেক্টের  রুট  ফোল্ডারে  .env ফাইল  তৈরি  করতে হবে 
 
  এখানে   database  এর connection string , port  এসব রাখতে হবে 


4। postgreSQL এ  ডাটাবেস  তৈরি  করে  user, bookings,  vehicles  এর জন্য  টেবিল  তৈরি  করতে হবে  এখানে আমরা neonDB   ইউজ করতে পারি 

5।  node js   দিয়ে  সার্ভার  তৈরি  করে টা চালু  করা 

6।  postman  দিয়ে সব  রাউট  চেক করা যে অ্যাপ্লিকেশান   ঠিকমত  কাজ করছে  কিনা। 

