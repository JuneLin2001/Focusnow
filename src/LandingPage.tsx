import React from "react";

const LandingPage: React.FC = () => {
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <div className="w-96 h-96 border-4 border-black rounded-full flex flex-col justify-center items-center">
          <p className="text-[96px]">25:00</p>
          <button className="bg-black text-white px-4 py-2 mt-4 block rounded">
            Start
          </button>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
