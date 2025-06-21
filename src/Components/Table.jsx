import React, { useEffect, useState } from "react";
import { FaArrowsAltH } from "react-icons/fa";
import hPic from '../assets/h-pic.png'

const flags = {
  USD: "us",
  CAD: "ca",
  AUD: "au",
  EUR: "eu",
};

const cryptoIds = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
};

export default function Table() {
  const [active, setActive] = useState(0);
  const [convertAmount, setConvertAmount] = useState("0");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("");
  const [convertedAmount, setConvertedAmount] = useState("0");
  const [rate, setRate] = useState(0);

  const listItems = [
    { label1: "CAD", label2: "Fiat", from: "CAD", to: "USD" },
    { label1: "CAD", label2: "Crypto", from: "CAD", to: "BTC" },
    { label1: "AUD", label2: "Crypto", from: "AUD", to: "ETH" },
    { label1: "Crypto", label2: "Fiat", from: "BTC", to: "USD" },
  ];

  const fiatOptions = ["CAD", "USD", "AUD", "EUR"];
  const cryptoOptions = ["BTC", "ETH", "USDT"];
  const allOptions = [...fiatOptions, ...cryptoOptions];

  const isCrypto = (currency) => cryptoOptions.includes(currency);

  // Get filtered options based on active tab
  const getFromOptions = () => {
    const activeItem = listItems[active];
    if (!activeItem) return allOptions;
    
    if (activeItem.label1 === "CAD") {
      return ["CAD"];
    } else if (activeItem.label1 === "AUD") {
      return ["AUD"];
    } else if (activeItem.label1 === "Crypto") {
      return cryptoOptions;
    }
    return allOptions;
  };

  const getToOptions = () => {
    const activeItem = listItems[active];
    if (!activeItem) return allOptions;
    
    if (activeItem.label2 === "Fiat") {
      return fiatOptions;
    } else if (activeItem.label2 === "Crypto") {
      return cryptoOptions;
    }
    return allOptions;
  };

  // Swap function
  const handleSwap = () => {
    const tempCurrency = fromCurrency;
    const tempAmount = convertAmount;
    
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    setConvertAmount(convertedAmount);
    setConvertedAmount(tempAmount);
  };

  const fetchConversionRate = async () => {
    if (!fromCurrency || !toCurrency || !convertAmount || isNaN(convertAmount)) return;

    try {
      if (!isCrypto(fromCurrency) && !isCrypto(toCurrency)) {
        // Fiat-to-Fiat using ExchangeRate API
        const res = await fetch(
          `https://v6.exchangerate-api.com/v6/4b62264ba9885245d18dd142/pair/${fromCurrency}/${toCurrency}/${convertAmount}`
        );
        const data = await res.json();
        if (data?.conversion_result && data?.conversion_rate) {
          setRate(data.conversion_rate);
          setConvertedAmount(data.conversion_result.toFixed(6));
        }
      } else {
        // Crypto-to-Fiat or Fiat-to-Crypto using CoinGecko
        let priceResponse;
        const amount = parseFloat(convertAmount);

        if (isCrypto(fromCurrency) && !isCrypto(toCurrency)) {
          // Crypto to Fiat
          priceResponse = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds[fromCurrency]}&vs_currencies=${toCurrency.toLowerCase()}`
          );
          const priceData = await priceResponse.json();
          const price = priceData?.[cryptoIds[fromCurrency]]?.[toCurrency.toLowerCase()];
          if (price) {
            setRate(price);
            setConvertedAmount((price * amount).toFixed(6));
          }
        } else if (!isCrypto(fromCurrency) && isCrypto(toCurrency)) {
          // Fiat to Crypto
          priceResponse = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds[toCurrency]}&vs_currencies=${fromCurrency.toLowerCase()}`
          );
          const priceData = await priceResponse.json();
          const price = priceData?.[cryptoIds[toCurrency]]?.[fromCurrency.toLowerCase()];
          if (price) {
            const result = amount / price;
            setRate(1 / price);
            setConvertedAmount(result.toFixed(6));
          }
        }
      }
    } catch (err) {
      console.error("Conversion error:", err);
    }
  };

  useEffect(() => {
    if (fromCurrency && toCurrency) {
      fetchConversionRate();
    }
  }, [convertAmount, fromCurrency, toCurrency]);

  return (
    <div className="flex justify-center items-center mt-10 px-4">
      <div className="w-full sm:w-[90%] md:w-[80%] lg:w-[75%] xl:w-[60%] py-8 px-6 sm:px-10 rounded-3xl bg-white flex flex-col justify-center items-center shadow-lg">

        {/* Top Tabs */}
        <div className="sm:rounded-full rounded-md w-full sm:w-[505px] md:w-[530px] bg-[#252E75] flex items-center justify-center flex-wrap py-2 px-3 mb-6 overflow-x-auto scrollbar-hide">
          <ul className="text-white flex-wrap sm:flex-nowrap flex sm:justify-start justify-center  gap-3 text-[11px] sm:text-[13px] md:text-[14px] w-auto">
            {listItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  setActive(index);
                  setFromCurrency(item.from);
                  setToCurrency(item.to);
                }}
                className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 ease-in-out ${active === index ? "bg-[#25C866] shadow-md" : "hover:bg-[#37429b]"
                  }`}
              >
                <span>{item.label1}</span>
                <FaArrowsAltH />
                <span>{item.label2}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Convert Section */}
        <div className="h-[90px] w-full sm:w-[85%] bg-[#252E75] flex justify-between items-center rounded-xl mb-4 px-6 shadow-md">
          <div className="flex flex-col text-white justify-center items-center text-sm sm:text-base">
            <p className="opacity-80">Convert</p>
            <input
              type="number"
              inputMode="decimal"
              pattern="[0-9]*"
              value={convertAmount}
              onChange={(e) => setConvertAmount(e.target.value)}
              className="bg-transparent border-b-2 border-white text-white text-xl sm:text-2xl font-semibold w-12 sm:w-24 text-center focus:outline-none appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            {flags[fromCurrency] && (
              <img
                src={`https://flagcdn.com/${flags[fromCurrency]?.toLowerCase()}.svg`}
                alt={fromCurrency}
                className="w-6 h-4 rounded-sm"
              />
            )}
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="bg-[#25C866] h-[38px] w-[100px] sm:w-[130px] rounded-full text-white text-[14px] px-4 outline-none shadow-md"
            >
              <option value="">Select</option>
              {getFromOptions().map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center items-center mb-4">
          {/* Conversion Illustration - Now clickable for swap */}
          <div 
            onClick={handleSwap}
            className="cursor-pointer hover:scale-110 transition-transform duration-200"
          >
            <img src={hPic} alt="Conversion Illustration" className="w-12 h-auto object-cover" />
          </div>
        </div>

        {/* Result Section */}
        <div className="h-[90px] w-full sm:w-[85%] bg-[#252E75] flex justify-between items-center rounded-xl mb-6 px-6 shadow-md">
          <div className="flex flex-col text-white justify-center items-center text-sm sm:text-base">
            <p className="opacity-80">You Should Get</p>
            <span className="text-xl sm:text-2xl font-semibold">{convertedAmount}</span>
          </div>

          <div className="flex items-center gap-2">
            {flags[toCurrency] && (
              <img
                src={`https://flagcdn.com/${flags[toCurrency]?.toLowerCase()}.svg`}
                alt={toCurrency}
                className="w-6 h-4 rounded-sm"
              />
            )}
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="bg-[#25C866] h-[38px]  w-[90px] sm:w-[130px] rounded-full text-white text-[14px] px-4 outline-none shadow-md"
            >
              <option value="">Select</option>
              {getToOptions().map((cur) => (
                <option key={cur} value={cur}>{cur}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full sm:w-[85%] text-sm text-gray-600">
          <p>1 {fromCurrency || "---"} = {rate} {toCurrency || "---"}</p>
          <p>Fees = 0</p>
        </div>
      </div>
    </div>
  );
}