import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { IoStarSharp } from "react-icons/io5";
import "swiper/css"; // Import Swiper styles

import img1 from "../assets/pick1.png";
import img2 from "../assets/pick2.png";

// Data for the slider
let DataSlider = [
  {
    img: img1,
    title: "Emily R.",
    date: "March 3, 2025",
    para:
      "The platform is fast, reliable, and very easy to use. I was able to convert currencies without any hassle or delay.",
  },
  {
    img: img1,
    title: "Kumar N. J.",
    date: "February 12, 2025",
    para: "Excellent service! Very smooth transaction and great customer support. Will definitely use again.",
  },
  {
    img: img2,
    title: "Anonymous",
    date: "May 5, 2025",
    para: "Best in the business! 👍👍👍 Quick, accurate, and no unnecessary steps.",
  },
  {
    img: img2,
    title: "Michael T.",
    date: "January 20, 2025",
    para:
      "I’ve used many currency converters, but pinovX stands out for its speed and simplicity. Highly recommended!",
  },
  {
    img: img1,
    title: "Kumar N. J.",
    date: "February 15, 2025",
    para:
      "Every transaction has been seamless. The interface is clean, and I appreciate the focus on fiat only.",
  },
  {
    img: img1,
    title: "Sophia M.",
    date: "April 9, 2025",
    para:
      "pinovX makes currency conversion stress-free. I always get updated rates and zero confusion.",
  },
  {
    img: img2,
    title: "Anonymous",
    date: "May 5, 2025",
    para: "Reliable and fast service! 👍👍👍 A must-have tool for anyone dealing with global payments.",
  },
];


export default function Section8() {
  return (
    <div className="w-full flex flex-col items-center overflow-hidden justify-center py-16">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl text-white text-center mb-4">
        Our Clients <span className="text-green-500">Feedback</span>
      </h2>

      {/* Subtext */}
      <p className="text-center max-w-3xl px-6 text-white text-lg">
        Our clients trust us for dependable service and honest support—hear how we build long-term relationships through transparency and integrity.
      </p>

      {/* Swiper Slider Container */}
      <div className="w-full mt-12">
        <Swiper
          spaceBetween={20} // Space between slides
          loop={true} // Loop the slides infinitely
          autoplay={{ delay: 3000, disableOnInteraction: false }} // Autoplay every 3 seconds
          slidesPerView={1} // Default to showing 1 slide
          breakpoints={{
            320: {
              slidesPerView: 1, // Show 1 slide on mobile
              centeredSlides: true, // Center the single slide
              spaceBetween: 10, // Space between slides
            },
            400: {
              slidesPerView: 1.3, // Show 1.3 slides on small mobile screens
              spaceBetween: 15, // Space between slides
                centeredSlides: true, // Center the single slide
            },
            480: {
              slidesPerView: 2, // Show 2 slides on small tablets
              spaceBetween: 15, // Space between slides
                centeredSlides: true, // Center the single slide
            },
            768: {
              slidesPerView: 3, // Show 3 slides on tablets
              spaceBetween: 140, // Space between slides
                centeredSlides: true, // Center the single slide
            },
            900: {
              slidesPerView: 3, // Show 3 slides on medium tablets and above
              spaceBetween: 140, // Space between slides
                centeredSlides: true, // Center the single slide
            },
            998: {
              slidesPerView: 4, // Show 4 slides on large screens (from 998px)
              spaceBetween: 40, // Space between slides
                centeredSlides: true, // Center the single slide
            },
            1100: {
              slidesPerView: 4, // Show 4 slides on large screens (from 998px)
              spaceBetween: 80, // Space between slides
                centeredSlides: true, // Center the single slide
            },
            1197: {
              slidesPerView: 4, // Show 4 slides on larger screens
              spaceBetween: 100, // Space between slides
                centeredSlides: true, // Center the single slide
            },
            1240: {
              slidesPerView: 4, // Keep 4 slides on larger screens
              spaceBetween: 80, // Space between slides
              centeredSlides: true, // Center the single slide
            },
          }}
          className="pb-10"
        >
          {DataSlider.map((ele, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex-shrink-0 bg-white shadow-xl rounded-xl p-4 w-[250px] sm:w-[280px] md:w-[300px] h-auto border border-gray-200">
                <div className="h-[83%]">
                  <p className="text-sm text-gray-700">{ele.para}</p>
                  <p className="text-sm mt-2 text-gray-700">{ele.tital}</p>
                  <p className="text-sm text-gray-700">{ele.date}</p>
                </div>
                <div className="w-12 h-12 relative">
                  <img
                    src={ele.img}
                    alt={ele.name}
                    className="w-12 h-12 rounded-full object-cover ml-6 mt-5 border absolute left-[-10px] bottom-[-30px]"
                  />
                  <div className="absolute flex text-[#7de77d] text-[12px] left-1 bottom-[-50px]">
                    <IoStarSharp />
                    <IoStarSharp />
                    <IoStarSharp />
                    <IoStarSharp />
                    <IoStarSharp />
                    <IoStarSharp />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
