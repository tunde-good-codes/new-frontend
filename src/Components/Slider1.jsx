import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FaDollarSign, FaGlobe } from "react-icons/fa";
import { BsLightningChargeFill } from "react-icons/bs";
import { HiShieldCheck } from "react-icons/hi";

import "swiper/css";

const features = [
  {
    icon: <FaDollarSign className="text-white text-xl" />,
    title: "Easy Account Funding",
    description: "Fund your account using trusted local methods.",
  },
  {
    icon: <BsLightningChargeFill className="text-white text-xl" />,
    title: "Fast Transfers",
    description: "Funds arrive in minutes, not days.",
  },
  {
    icon: <HiShieldCheck className="text-white text-xl" />,
    title: "Secure & Compliant",
    description: "Fully regulated with bank-level encryption.",
  },
  {
    icon: <FaGlobe className="text-white text-xl" />,
    title: "Multi-Currency Support",
    description: "Convert fiat and send crypto easily.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#252E75] py-14 px-4 sm:px-6 md:px-10 lg:px-20 xl:px-28 text-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-wide">
          Why <span className="text-green-400">Choose Us?</span>
        </h2>
      </div>

      {/* Swiper Slider for small to medium screens */}
      <div className="block lg:hidden w-full">
        <Swiper
          modules={[Autoplay]}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={20}
          slideToClickedSlide={true}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 2.5 },
            900: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {features.map((item, i) => (
            <SwiperSlide key={i}>
              <div className="bg-white mx-3 text-center text-[#252E75] rounded-2xl shadow-xl px-6 py-8 min-h-48 transform transition-all duration-300 hover:scale-105 scale-95">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-md bg-[#252E75] flex items-center justify-center">
                    {item.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Grid layout with 3 columns centered */}
      <div className="hidden lg:flex justify-center mt-8 gap-10">
        {features.map((item, i) => (
          <div
            key={i}
            className="bg-white text-center rounded-2xl shadow-lg text-[#252E75] p-6 w-[300px] min-h-[200px] flex flex-col justify-between" // Ensuring equal height
          >
            <div className="flex justify-center mb-6">
              <div className="w-14 h-14 rounded-md bg-[#252E75] flex items-center justify-center">
                {item.icon}
              </div>
            </div>
            <h3 className="font-semibold text-xl mb-4">{item.title}</h3>
            <p className="text-md text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
