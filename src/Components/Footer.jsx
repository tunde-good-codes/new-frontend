import React from 'react'
import logo from '../assets/4bbedcd37744588f6c0f61756721f323bde5935a.png'

export default function Footer() {
  return (
          <footer className="bg-[#0d0f1a] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8">
        
        {/* Logo & About */}
        <div className="flex flex-col items-start">
          <div className="w-32 h-auto">
            <img src={logo} alt="Logo" className="w-full h-auto object-contain" />
          </div>
          <p className="mt-4 text-sm text-gray-400">
            Proven in Network of Value<br />
            Powering Payments with Purpose
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#"><i className="fab fa-linkedin text-green-400 text-lg hover:text-green-300"></i></a>
            <a href="#"><i className="fab fa-twitter text-green-400 text-lg hover:text-green-300"></i></a>
            <a href="#"><i className="fab fa-instagram text-green-400 text-lg hover:text-green-300"></i></a>
          </div>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold text-green-400 mb-2">Company</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Blog</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-semibold text-green-400 mb-2">Legal</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li><a href="#">AML/CTF Policy</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-green-400 mb-2">Support</h3>
          <ul className="space-y-1 text-gray-300 text-sm">
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQs</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal Section */}
      <div className="text-xs text-gray-400 text-center mt-6 px-4">
        <p className="mb-1">
          Pinov Inc. [1591582-1] is a Money Services Business registered and regulated by the Financial Transactions and Reports Analysis Centre of Canada. MSB Registration Number: C100000263
        </p>
        <p>
          Pinov Pty Ltd (ACN: 682 072 608) is a Digital Currency Exchange registered and regulated by the Australian Transaction Reports and Analysis Centre (AUSTRAC). Registered Provider Number: DCE100884196-001
        </p>
      </div>
    </footer>
  )
}
