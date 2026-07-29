import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

export default function Banner() {
  const banners = [
    "Banner1.jpg",
    "Banner2.jpg",
    "Banner3.jpg",
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,           // ✅ Auto Slider ON
    autoplaySpeed: 2500,      // Har 2.5 seconds mein apne aap slide hoga
    speed: 1000,              // Sliding animation ki speed (Smooth transition)
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,            // Clean modern look ke liye
    pauseOnHover: false,      // ✅ Mouse le jane par bhi nahi rukega, chalta rahega
    cssEase: "ease-in-out",   // Smooth movement logic
    appendDots: dots => (
      <div style={{ bottom: "18px" }}>
        <ul className="custom-dots"> {dots} </ul>
      </div>
    ),
  };

  return (
    <div className="w-full relative group mb-6 sm:mb-8">
      <div className="w-full relative">
        <div className="overflow-hidden">
          <Slider {...settings}>
            {banners.map((src, idx) => (
              <div key={idx} className="outline-none relative">
                <img
                  src={src}
                  alt={`banner-${idx}`}
                  className="w-full h-[38vh] sm:h-[52vh] md:h-[70vh] lg:h-[80vh] object-cover"
                />
                
                {/* Image ke upar halka sa darkness layer taaki design premium lage */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none" />
              </div>
            ))}
          </Slider>
        </div>

        {/* Global CSS for Modern Dots Style */}
        <style>{`
          .slick-dots li {
            margin: 0 6px;
          }
          .slick-dots li button:before {
            color: white !important;
            font-size: 10px !important;
            opacity: 0.5;
            transition: all 0.4s ease;
          }
          .slick-dots li.slick-active button:before {
            color: white !important;
            opacity: 1;
            transform: scale(1.6); /* Active dot bada aur bright dikhega */
          }
          .custom-dots {
            margin: 0;
            padding: 0;
            display: flex !important;
            justify-content: center;
            align-items: center;
          }
        `}</style>
      </div>
    </div>
  );
}