import React from 'react';

const WonderfulText = () => {
  return (
    <div className="w-full flex items-center justify-center py-16 overflow-hidden">
      <div className="relative text-center group cursor-pointer">
        <h1 className="text-5xl md:text-8xl font-black tracking-tight text-white transition-transform duration-300 group-hover:-translate-y-2 group-hover:translate-x-2"
            style={{
              fontFamily: "'Lobster', 'Google Sans', cursive",
              textShadow: `
                1px 1px 0 #e11d48,
                2px 2px 0 #e11d48,
                3px 3px 0 #e11d48,
                4px 4px 0 #e11d48,
                5px 5px 0 #e11d48,
                6px 6px 0 #e11d48,
                7px 7px 0 #e11d48,
                8px 8px 0 #e11d48,
                9px 9px 0 #be123c,
                10px 10px 20px rgba(225, 29, 72, 0.4)
              `
            }}
        >
          you are <br /> Wonderful
        </h1>
      </div>
    </div>
  );
};

export default WonderfulText;
