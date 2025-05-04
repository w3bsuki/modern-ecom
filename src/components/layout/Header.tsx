import React from "react";
import Navbar from "./Navbar";
import Banner from "./Banner";

const Header: React.FC = () => {
  return (
    <>
      <Banner 
        message="Summer Sale! Get 20% off all hats with code:"
        link={{
          text: "SUMMER20",
          url: "/product"
        }}
      />
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Navbar />
      </header>
    </>
  );
};

export default Header; 