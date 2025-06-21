import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { FiUserPlus } from "react-icons/fi";
import { MdOutlineArrowOutward } from "react-icons/md";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { LuCircleCheckBig } from "react-icons/lu";
import "swiper/css";

const cardData = [
  {
    icon: <FiUserPlus />,
    step: "Step 01",
    title: "Verify ID",
    description: "Automated secure system to verify your identity.",
  },
  {
    icon: <FaArrowRightArrowLeft />,
    step: "Step 02",
    title: "Request Trade",
    description: "Tell us what you want to buy or sell, and we’ll provide a quote.",
  },
  {
    icon: <LuCircleCheckBig />,
    step: "Step 03",
    title: "Confirm & Settle",
    description: "Approve the rate, send payment, and receive directly to your wallet.",
  },
  {
    icon: <FiUserPlus />,
    step: "Step 01",
    title: "Verify ID",
    description: "Automated secure system to verify your identity.",
  },
  {
    icon: <FaArrowRightArrowLeft />,
    step: "Step 02",
    title: "Request Trade",
    description: "Tell us what you want to buy or sell, and we’ll provide a quote.",
  },
];

export default function HowItWorks() {
  // Only show first 3 cards on desktop
  const desktopCards = cardData.slice(0, 3);

  return (
    <section className="bg-[#252E75] py-14 px-4 sm:px-6 md:px-10 lg:px-16 xl:px-28">
      {/* Heading */}
      <div className="text-center mb-12 text-white">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-wide">
          How It <span className="text-green-400">Works</span>
        </h2>
      </div>

      {/* Swiper for screens < lg only (mobile + tablet + small laptops) */}
      <div className="block lg:hidden w-full">
        <Swiper
          modules={[Autoplay]}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          spaceBetween={40}
          slideToClickedSlide={true}
          breakpoints={{
            0: { slidesPerView: 1.2 },
            480: { slidesPerView: 1.5 },
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            900: { slidesPerView: 3 },
          }}
          className="pb-10"
        >
          {cardData.map((card, index) => (
            <SwiperSlide key={index}>
              <div className="border border-white rounded-3xl p-6 text-white relative h-full">
                <div className="flex items-start relative mb-6">
                  <div className="h-[50px] w-[50px] rounded-full bg-white text-[#252E75] text-xl flex justify-center items-center">
                    {card.icon}
                  </div>
                  <div className="h-[50px] bg-white text-[#252E75] rounded-2xl absolute right-[-60px] top-0 pl-4 pr-6 font-semibold text-sm flex items-center shadow-md ml-3 w-[160px] sm:w-[200px]">
                    {card.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-gray-300 mb-4 max-w-[200px]">
                  {card.description}
                </p>
                <div className="flex items-center gap-1 text-green-400 font-medium cursor-pointer hover:underline">
                  <p>Explore More</p>
                  <MdOutlineArrowOutward />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Grid layout for xl and up */}
      <div className="hidden lg:flex flex-col justify-center items-center">
        <div className="w-[90%] mt-10 flex justify-between gap-6">
          {desktopCards.map((card, index) => (
            <div
              key={index}
              className="border border-white rounded-3xl p-6 w-[29%] text-white relative"
            >
              <div className="flex items-start relative mb-6">
                <div className="h-[50px] w-[50px] rounded-full bg-white flex justify-center items-center text-2xl text-[#252E75]">
                  {card.icon}
                </div>
                <div className="h-[50px] bg-white rounded-2xl absolute lg:right-[-80px] md:right-[-120px]  pl-4 flex items-center font-semibold text-[#252E75] w-[120px] lg:w-[200px] md:w-[160px] shadow-md text-sm">
                  {card.step}
                </div>
              </div>
              <h1 className="text-xl font-semibold mb-2">{card.title}</h1>
              <p className="text-sm mb-4 text-gray-300 w-[180px]">
                {card.description}
              </p>
              <div className="flex items-center gap-1 text-[#42c842] font-medium cursor-pointer hover:underline">
                <p>Explore More</p>
                <MdOutlineArrowOutward />
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="text-white w-full flex justify-center items-center mt-16 gap-5">
          <button className="bg-[#42c842] cursor-pointer h-[50px] w-[140px] rounded-3xl hover:bg-transparent border border-[#42c842] hover:border-white transition-all duration-300 shadow-md">
            Start Now
          </button>
          <button className="cursor-pointer border border-[#25C866] h-[50px] w-[210px] rounded-3xl text-white hover:bg-[#42c842] hover:text-white transition-all shadow-md">
            See Supported Currencies
          </button>
        </div>
      </div>

   
    </section>
  );
}
