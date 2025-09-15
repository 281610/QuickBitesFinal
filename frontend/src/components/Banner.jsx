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
    autoplay: true,
    autoplaySpeed: 3000,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <div className="mt-6 flex justify-center">
      {/* Centered container with border */}
      <div className="w-full border-[16px] border-white rounded-lg overflow-hidden shadow-lg">
        <Slider {...settings}>
          {banners.map((src, idx) => (
            <div key={idx} className="flex justify-center">
              <img
                src={src}
                alt={`banner-${idx}`}
                className="w-full h-[180px] sm:h-[220px] md:h-[280px] object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
