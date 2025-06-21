import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import coin1 from '../assets/coin1.png'
import coin2 from '../assets/coin2.png'
import coin3 from '../assets/coin3.png'
import coin4 from '../assets/coin4.png'
import coin5 from '../assets/coin5.png'
import coin6 from '../assets/coin6.png'
import coin7 from '../assets/coin7.png'
import coin8 from '../assets/coin8.png'
import coin9 from '../assets/coin9.png'

export default function CurrencyCoins() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(3)
  const coins = [
    { name: 'AUD', image: coin1 },
    { name: 'INR', image: coin2 },
    { name: 'NGN', image: coin3 },
    { name: 'Euro', image: coin4 },
    { name: 'PKR', image: coin5 },
    { name: 'USD', image: coin6 },
    { name: 'ETH', image: coin7 },
    { name: 'CAD', image: coin8 },
    { name: 'BTC', image: coin9 }
  ]

  useEffect(() => {
    const updateItemsPerPage = () => {
      const width = window.innerWidth
      if (width < 375) setItemsPerPage(2)
        else if (width < 425) setItemsPerPage(3)
      else if (width < 768) setItemsPerPage(4)
      else if (width < 1024) setItemsPerPage(7)
      // else if (width < 1536) setItemsPerPage(5)
      else setItemsPerPage(9)
    }

    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [])

  const totalSlides = Math.ceil(coins.length / itemsPerPage)

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? totalSlides - 1 : prev - 1
    )
  }

  const startIndex = currentIndex * itemsPerPage
  const visibleCoins =
    coins.length <= itemsPerPage
      ? coins
      : coins.slice(startIndex, startIndex + itemsPerPage).length === itemsPerPage
        ? coins.slice(startIndex, startIndex + itemsPerPage)
        : [...coins.slice(startIndex), ...coins.slice(0, (startIndex + itemsPerPage) % coins.length)]

  const showNavigation = coins.length > itemsPerPage

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 relative">
      <div className={`flex justify-center gap-6 transition-all duration-500`}>
        {visibleCoins.map((coin, index) => (
          <div key={index} className="flex flex-col items-center p-2 rounded-xl hover:scale-105 transition-transform">
            <p className="text-sm font-semibold text-gray-300">{coin.name}</p>
            <div className="w-16 h-16 bg-white p-1 rounded-full mt-2">
              <img src={coin.image} alt={coin.name} className="w-full h-full object-contain" />
            </div>
          </div>
        ))}
      </div>

      {showNavigation && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}
    </div>
  )
}
