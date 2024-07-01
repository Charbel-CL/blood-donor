import React, { useState } from "react";
import "./Testimonials.css";
import person1 from "../../assets/person1.jpg";
import person2 from "../../assets/person2.jpg";
import person3 from "../../assets/person3.jpg";

const testimonials = [
  {
    id: 1,
    quote:
      "Thanks to the timely donation, my sister received the care she needed. I’m forever grateful to the generous donors!",
    name: "John Doe",
    image: person1,
  },
  {
    id: 2,
    quote:
      "Donating blood was a simple process, but knowing I helped save someone’s life was incredibly rewarding.",
    name: "Jane Smith",
    image: person2,
  },
  {
    id: 3,
    quote:
      "It's a privilege to contribute to such a noble cause. I encourage everyone to donate if they can.",
    name: "Emily Johnson",
    image: person3,
  },
];

function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(1);

  const nextTestimonial = () => {
    const newIndex = (activeIndex + 1) % testimonials.length;
    setActiveIndex(newIndex);
  };

  const prevTestimonial = () => {
    const newIndex =
      activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    setActiveIndex(newIndex);
  };

  return (
    <div className="testimonials" id="about-us">
      <h1 className="testimonials-title">Stories from Our Community</h1>
      <div className="testimonial-cards">
        {testimonials.map((testimonial, index) => {
          let position = 'nextCard';
          if (index === activeIndex) {
            position = 'activeCard';
          } else if (
            index === activeIndex - 1 ||
            (activeIndex === 0 && index === testimonials.length - 1)
          ) {
            position = 'prevCard';
          }
          return (
            <div
              key={testimonial.id}
              className={`testimonial-item ${position}`}
            >
              <div className="testimonial-quote-container">
                <div className="testimonial-quote-icon">“</div>
                <p className="testimonial-quote">{testimonial.quote}</p>
                <div className="testimonial-quote-icon">”</div>
                <div
                  className="testimonial-image"
                  style={{ backgroundImage: `url(${testimonial.image})` }}
                ></div>
                <p className="testimonial-name">{testimonial.name}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="testimonial-controls">
        <button onClick={prevTestimonial} className="btn">
          Prev
        </button>
        <button onClick={nextTestimonial} className="btn">
          Next
        </button>
      </div>
    </div>
  );
}

export default Testimonials;
