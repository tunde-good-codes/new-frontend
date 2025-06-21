import React from 'react'
import img from '../assets/mobile.png'
import cross from '../assets/2d9b81167e21ea61e44847f07911b4f1f48d754d.png'
import { BsDashLg } from "react-icons/bs";
import { LuShieldCheck } from "react-icons/lu";
import { FiCheckCircle } from "react-icons/fi";
import { LuLock } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import { MdArrowOutward } from "react-icons/md";
import { Link } from 'react-router-dom';
export default function Hero() {
  return (
    <div className='p-6 xl:p-10 lg:p-8 md:p-6 sm:p-4'>


      <div className='flex relative justify-center items-center flex-col md:flex-row mt-26'>

        <div className=' text-white w-full  xl:w-[38%] lg:w-[50%]'>
          <h1 className='xl:text-4xl lg:text-4xl md:text-3xl sm:text-[24px] text-white'>Send & Convert Money Globally </h1>
          <h1 className='text-green-400 xl:text-3xl lg:text-4xl md:text-3xl sm:text-[24px] mt-7 flex items-center'><BsDashLg className='text-white' />Fast, Secure, Compilant.</h1>
          <div className='xl:w-[540px] md:w-[520px] sm:w-[400px] md:text-[15px] sm:text-[12px] text-white mt-6'>
            <p>Exchange currencies or crypto with ease. Whether you’re sending CAD to USD, AUD or BTC, we make it safe and simple</p>
          </div>
          <div className='flex flex-wrap mt-14 gap-3'>
            <Link to={'/order-table'}>
            <button className='bg-[#25C866] transition-all duration-300 cursor-pointer hover:bg-transparent text-xs  sm:text-sm   border border-white px-3 py-2 sm:py-1 md:h-[45px]  rounded-full'>Start Sending Money</button>
            </Link>
            
            <Link className='' to={'/register'}>
            <button className='transition-all duration-300 cursor-pointer hover:bg-[#25C866] ml-0 sm:ml-3 text-xs sm:text-sm   border border-white md:h-[45px] sm:h-[38px] w-[150px] md:w-[190px] sm:w-[170px] rounded-full px-3 py-2 sm:py-1'>Create a Free Account</button>
            </Link>
          </div>

          <div className='flex items-center gap-4  flex-wrap xl:w-[500px]  lg:w-[500px] md:w-[500px] sm:w-[] mt-9'>
            <div className=' flex gap-2'>
              <LuShieldCheck className='text-[#67f567] xl:text-[27px] lg:text-[26px] md:text-[25px] sm:text-[20px]' /> <p className='text-[17px] '>Regulated</p>
            </div>

            <div className='flex gap-2' >
              <FiCheckCircle className='text-[#67f567] xl:text-[27px] ml-2 lg:text-[27px] md:text-[25px] sm:text-[20px]' /> <p className='xl:text-[17px]'>AML/CTF Compliant</p>
            </div>

            <div className='flex gap-2'>
              <LuLock className='text-[#67f567] xl:text-[27px] lg:text-[27px] md:text-[25px] sm:text-[20px]' /> <p className='xl:text-[17px]'>End-to-End ENcrypted</p>
            </div>

            <div className='flex gap-2'>
              <FiUsers className='text-[#67f567] xl:text-[27px] lg:text-[27px] md:text-[25px] sm:text-[20px]' /> <p className='xl:text-[17px]'>Trusted by 1000+ users</p>
            </div>
          </div>
        </div>


        {/* _____________________---------------------------------------------------------________________-- */}

        <div className=' h-[max-content] xl:w-[43.50%] ml-3 lg:w-[38%]  md:w-[30%] sm:w-[60%]'>

          <div className='overflow-hidden sm:h-[70%]'>

            <img className='scale-[0.8] lg:hidden  sm:flex flex' src={img} alt="" />
          </div>
          <div className='absolute top-[-40px]'>
            <img src={cross} alt="cross butterfly" />
          </div>
          <div className="w-[100px] h-[100px] items-center justify-center xl:flex lg:flex md:flex sm:hidden hidden">
            <div className="w-[130px] h-[130px] flex items-center justify-center absolute xl:bottom-[-15px]  md:bottom-[10px]">
              <div className="relative w-[100px] h-[100px] rounded-full border-2 border-green-500 flex items-center justify-center">
                {/* Rotating Text Around Circle */}
                <svg className="absolute w-full h-full animate-spin-slow" viewBox="0 0 100 100">
                  <defs>
                    <path
                      id="circlePath"
                      d="M50,50 m-42,0 a42,42 0 1,1 84,0 a42,42 0 1,1 -84,0"

                    />
                  </defs>
                  <text
                    fill="green"
                    fontSize="10"
                    fontWeight="bold"
                    letterSpacing="2"
                    dy="2"
                  >
                    <textPath href="#circlePath" startOffset="0%">
                      • G E T   S T A R T E D •   G E T   S T A R T E D •
                    </textPath>
                  </text>
                </svg>
                {/* Center Icon */}
                <MdArrowOutward className="text-green-600 text-4xl z-10" />
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
