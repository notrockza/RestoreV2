import userEvent from "@testing-library/user-event";
import React, { Component, useEffect } from "react";
import Slider from "react-slick";
import { useAppDispatch } from "../../app/store/configureStore";
import { setscreen } from "./HomeSilce";

export default function HomePage() {
  const dispatch = useAppDispatch();



  useEffect(() => {
     dispatch(setscreen());
  
    return () => {
      dispatch(setscreen());
    }
  }, [dispatch])
  


    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1
    };
  return (
    <>
     <div>
        <h2> HomePage </h2>
        <Slider {...settings}>
         {[1,2,3,4,5].map(itme=>( <img src={`https://picsum.photos/200/300/?ู${Math.random}`} width={100} height={500} />))}
        
        </Slider>
      </div>
    </>
  )
}
function userEffort(arg0: () => void) {
  throw new Error("Function not implemented.");
}

