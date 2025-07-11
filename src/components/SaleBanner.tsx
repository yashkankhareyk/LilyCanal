import React from 'react';

const SaleBanner: React.FC = () => {
  return (
    <div className="w-full">
      <img
        src="./assets/banner.jpg"
        alt="Skincare Banner"
        className="w-full h-auto object-cover"
      />
    </div>
  );
};

export default SaleBanner;
