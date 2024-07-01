import React, { useState } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import Slide1 from "../../assets/Slide1.jpg";
import Slide2 from "../../assets/Slide2.jpg";
import Slide3 from "../../assets/Slide3.jpg";
import "./MyCarousel.css";

const items = [
  {
    src: Slide1,
    altText: "Save Lives",
    caption: "Donate blood and save lives today",
    key: 1,
  },
  {
    src: Slide2,
    altText: "Be a Hero",
    caption: "Be a hero in someone's life by donating blood",
    key: 2,
  },
  {
    src: Slide3,
    altText: "Join the Cause",
    caption: "Join the cause and help those in need",
    key: 3,
  },
];

function MyCarousel(args) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} className="d-block w-100 high-res-image" />
        <CarouselCaption captionText={item.caption} captionHeader={item.altText} />
      </CarouselItem>
    );
  });

  return (
    <Carousel
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      interval={5000}
      className="custom-carousel"
      {...args}
    >
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
  );
}

export default MyCarousel;
