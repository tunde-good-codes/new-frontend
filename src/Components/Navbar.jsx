import React, { useState, useEffect, useRef, useContext } from "react";
import img from "../assets/2c5b2aba95942b5174ad3a139de34673c8226241.png";
import { FaBars, FaUserCircle } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { Link } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";

export default function Navbar() {
  const { logout } = useContext(AuthContext);
  const [openslide, setOpenSlide] = useState(false);
  const [active, setActive] = useState("Home");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);


    const [user , setUser] = React.useState(null);
  
  
    useEffect(() => {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => setOpenSlide(true);
  const handleClose = () => setOpenSlide(false);

  const navLinkClass = (name) =>
    `cursor-pointer transition-all duration-300 px-3 py-1 rounded-full font-bold ${
      active === name ? " bg-[#252E75] text-white" : ""
    }`;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setOpenSlide(false);
  };

  return (
    <div>
      <nav className="h-[65px] w-full bg-[#FFFFFF] flex items-center xl:pr-10 lg:pr-20 md:pr-10 sm:pr-8 xl:pl-30 lg:pl-10 md:pl-10 sm:pl-8 justify-between px-6 shadow-md relative z-50">
        {/* Logo */}
        <div className="xl:w-[120px] lg:w-[120px] md:w-[120px] sm:w-[100px] w-[100px] mt-2">
          <Link to="/">
            <img src={img} alt="logo" className="w-full h-auto object-contain" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <ul className="justify-between items-center rounded-full xl:flex lg:flex md:flex sm:hidden hidden xl:text-[18px] lg:text-[16px] md:text-[14px] lg:h-[40px] md:h-[36px] p-6 bg-[#f8f8fc] border  text-[#252E75]">
          <li
            className={navLinkClass("Home")}
            onMouseEnter={() => setActive("Home")}
          >
            <Link to="/">Home</Link>
          </li>
          <li
            className={navLinkClass("Products")}
            onMouseEnter={() => setActive("Products")}
          >
            <Link to="/products">Products</Link>
          </li>
          <li className="company">
            <select
              className="border-none focus:outline-none focus:ring-0 bg-transparent text-[#252E75] cursor-pointer px-2"
              onMouseEnter={() => setActive("Company")}
              onChange={(e) => {
                // Handle company navigation based on selected value
                const value = e.target.value;
                if (value !== "Company") {
                  // Navigate to specific company page
                  console.log("Navigate to:", value);
                }
              }}
            >
              <option value="Company">Company</option>
              <option value="about">About Us</option>
              <option value="careers">Careers</option>
              <option value="contact">Contact</option>
            </select>
          </li>
          <li
            className={navLinkClass("Resource")}
            onMouseEnter={() => setActive("Resource")}
          >
            <Link to="/resources">Resource</Link>
          </li>
          <li
            className={navLinkClass("Help")}
            onMouseEnter={() => setActive("Help")}
          >
            <Link to="/help">Help</Link>
          </li>
        </ul>

        {/* Desktop: Verify Button and User Profile Dropdown */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/kyc-start"
            className="text-white bg-[#252E75] h-[35px] sm:h-[35px] md:h-[36px] lg:h-[40px] xl:h-[40px] 
                       w-[135px] sm:w-[160px] md:w-[150px] lg:w-[180px] xl:w-[180px] 
                       text-[13.5px] sm:text-[16px] md:text-[14px] lg:text-[17px] xl:text-[18px] 
                       rounded-full hover:bg-blue-600 transition duration-300 shadow-md whitespace-nowrap cursor-pointer flex justify-center items-center"
          >
            Verify with pinovX
          </Link>

          <div
            ref={dropdownRef}
            className="relative cursor-pointer"
            onClick={() => setDropdownOpen((open) => !open)}
          >
            <FaUserCircle className="text-3xl text-[#252E75]" />
            {dropdownOpen && (
              <ul className="absolute right-0 top-[40px] w-40 bg-white rounded-md shadow-lg text-[#252E75] font-semibold z-50">
                {!user ? (
                  <>
                    <Link to="/login">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Login
                      </li>
                    </Link>
                    <Link to="/register">
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Signup
                      </li>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to={`${user.role === "admin" ? "/admin" : "/dashboard"}`}>
                      <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                        Dashboard
                      </li>
                    </Link>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Logout
                    </li>
                  </>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Mobile Button + Hamburger Container */}
        <div className="flex items-center gap-4 md:hidden">
          <Link
            to="/kyc-start"
            className="text-white bg-[#252E75] h-[35px] sm:h-[35px] md:h-[36px] lg:h-[40px] xl:h-[40px] 
                       w-[135px] sm:w-[160px] md:w-[150px] lg:w-[180px] xl:w-[180px] 
                       text-[13.5px] sm:text-[16px] md:text-[14px] lg:text-[17px] xl:text-[18px] 
                       rounded-full hover:bg-blue-600 transition duration-300 shadow-md whitespace-nowrap flex justify-center items-center"
          >
            Verify with pinovX
          </Link>

          <FaBars
            onClick={handleOpen}
            className="text-3xl text-[#252E75] cursor-pointer transition-transform duration-200 hover:scale-110"
          />
        </div>

        {/* Mobile slide-out menu */}
        <div
          className={`transition-all duration-500 ease-in-out w-full bg-white absolute top-0 left-0 z-50 xl:hidden lg:hidden md:hidden flex flex-col text-[#252E75] ${
            openslide ? "h-[100vh] p-6" : "h-0 overflow-hidden"
          }`}
        >
          <ImCross
            onClick={handleClose}
            className="absolute right-5 top-5 text-[#252E75] text-xl cursor-pointer hover:text-gray-500 transition-colors duration-300"
          />

          <ul className="space-y-6 text-lg mt-16">
            <li
              className={navLinkClass("Home")}
              onClick={() => {
                setActive("Home");
                handleClose();
              }}
            >
              <Link to="/">Home</Link>
            </li>
            <li
              className={navLinkClass("Products")}
              onClick={() => {
                setActive("Products");
                handleClose();
              }}
            >
              <Link to="/products">Products</Link>
            </li>
            <li>
              <select
                className="border-none focus:outline-none text-[#252E75] cursor-pointer bg-transparent"
                onChange={(e) => {
                  setActive("Company");
                  const value = e.target.value;
                  if (value !== "Company") {
                    // Handle navigation
                    console.log("Navigate to:", value);
                    handleClose();
                  }
                }}
              >
                <option value="Company" className="text-[#252E75]">Company</option>
                <option value="about" className="text-[#252E75]">About Us</option>
                <option value="careers" className="text-[#252E75]">Careers</option>
                <option value="contact" className="text-[#252E75]">Contact</option>
              </select>
            </li>
            <li
              className={navLinkClass("Resource")}
              onClick={() => {
                setActive("Resource");
                handleClose();
              }}
            >
              <Link to="/resources">Resource</Link>
            </li>
            <li
              className={navLinkClass("Help")}
              onClick={() => {
                setActive("Help");
                handleClose();
              }}
            >
              <Link to="/help">Help</Link>
            </li>

            <hr className="border-gray-400" />

            {/* Mobile User links */}
            {!user ? (
              <>
                <Link to="/login">
                  <li
                    className="cursor-pointer text-[#252E75] font-bold px-3 py-2 rounded-full bg-white"
                    onClick={handleClose}
                  >
                    Login
                  </li>
                </Link>
                <Link to="/register">
                  <li
                    className="cursor-pointer text-[#252E75] font-bold px-3 py-2 rounded-full bg-white"
                    onClick={handleClose}
                  >
                    Signup
                  </li>
                </Link>
              </>
            ) : (
              <>
                <Link to={`${user?.role === "admin" ? "/admin" : "/dashboard"}`}>
                  <li
                    className="cursor-pointer text-[#252E75] font-bold px-3 py-2 rounded-full bg-white"
                    onClick={handleClose}
                  >
                    Dashboard
                  </li>
                </Link>
                <li
                  className="cursor-pointer text-[#252E75] font-bold px-3 py-2 rounded-full bg-white"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}