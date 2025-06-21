import React, { useState } from 'react';
import { LuDollarSign } from "react-icons/lu";
import { TiFlashOutline } from "react-icons/ti";
import { BsShield } from "react-icons/bs";
import { TbWorld } from "react-icons/tb";

export default function Cards() {
  const cards = [
    {
      icon: <LuDollarSign />,
      title: 'Easy Account Funding',
      description: 'Fund your account using trusted local methods.',
    },
    {
      icon: <TiFlashOutline />,
      title: 'Instant Execution',
      description: 'Lightning-fast order execution with no delays.',
    },
    {
      icon: <BsShield />,
      title: 'Secure & Regulated',
      description: 'Your funds are protected in a secure environment.',
    },
    {
      icon: <TbWorld />,
      title: 'Global Access',
      description: 'Trade anywhere in the world, anytime.',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const total = cards.length;
  const getWrappedIndex = (index) => (index + total) % total;

  return (
    <div className="h-max w-full flex flex-col justify-center items-center overflow-hidden">
      <h1 className="xl:text-4xl text-white mb-6">
        Why <span className="text-green-400">Choose Us?</span>
      </h1>

      {/* Mobile layout */}
<div className="md:hidden flex flex-wrap justify-center gap-4 px-4">
  {cards.map((card, index) => (
    <div
      key={index}
      className="h-[270px] w-[280px] bg-white rounded-xl shadow-lg flex flex-col items-center justify-center text-black p-4 text-center
        hover:scale-[1.05] hover:shadow-[0_10px_25px_rgba(0,123,255,0.3)] transition-all duration-500"
    >
      <div className="text-4xl h-[45px] w-[45px] flex justify-center items-center text-white rounded-xl bg-[#162283] mb-3">
        {card.icon}
      </div>
      <h2 className="text-2xl text-[#162283] mb-2">{card.title}</h2>
      <p className="text-[16px]">{card.description}</p>
    </div>
  ))}
</div>


      {/* Desktop 3D carousel */}
      <div className="hidden md:flex mt-6 w-full justify-center items-center relative h-[300px]">
        <div className="relative w-[700px] h-full flex justify-center items-center">
          {cards.map((card, index) => {
            const prevIndex = getWrappedIndex(activeIndex - 1);
            const nextIndex = getWrappedIndex(activeIndex + 1);

            let positionClass = "hidden";

            if (index === activeIndex) {
              positionClass = "translate-x-0 rotate-y-0 scale-110 z-20";
            } else if (index === prevIndex) {
              positionClass = "-translate-x-52 rotate-y-[-10deg] scale-90 z-10";
            } else if (index === nextIndex) {
              positionClass = "translate-x-52 rotate-y-[10deg] scale-90 z-10";
            }

            return (
              <div
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`
                  absolute w-[280px] h-[270px] bg-white rounded-xl shadow-xl cursor-pointer
                  flex flex-col items-center justify-center text-black p-4 text-center
                  transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
                  ${positionClass}
                  ${index === activeIndex ? 'border-4 border-blue-500 opacity-100' : 'opacity-70'}
                `}
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                }}
              >
                <div className="text-4xl h-[45px] w-[45px] flex justify-center items-center text-white rounded-xl bg-[#162283] mb-3">
                  {card.icon}
                </div>
                <h2 className="text-2xl text-[#162283] mb-2">{card.title}</h2>
                <p className="text-[16px]">{card.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
