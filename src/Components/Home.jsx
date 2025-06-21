import React from 'react'
import Hero from '../Components/Hero'
import Table from '../Components/Table'
import CartPart2 from '../Components/CartPart2'
import Sliderfacebook from '../Components/Sliderfacebook'
import Lastt1 from '../Components/Lastt1'
import WhyChooseUs from '../Components/Slider1'
import CurrencyCoins from './CurrencyCoins'
export default function Home() {
  return (
    <div className='bg-[#252E75] '>

      <Hero />
      <Table />
      <CurrencyCoins />
      <WhyChooseUs />
      <CartPart2 />
      <Sliderfacebook />
      <Lastt1 />
    </div>
  )
}
