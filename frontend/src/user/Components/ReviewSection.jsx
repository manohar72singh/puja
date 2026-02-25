import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const reviewsData = [
  {
    name: "Sita Sharma",
    avatar: "/img/review1.jpg",
    date: "5 months ago",
    rating: 5,
    comment: "Amazing service! The puja was conducted beautifully and on time.",
  },
  {
    name: "Ramesh Gupta",
    avatar: "/img/review2.jpg",
    date: "5 months ago",
    rating: 5,
    comment: "Highly recommended! Very easy to book online and trusted pandits.",
  },
  {
    name: "Anita Singh",
    avatar: "/img/review3.jpg",
    date: "5 months ago",
    rating: 5,
    comment: "I loved the experience. The pandit guided everything perfectly.",
  },
  {
    name: "Rajesh Kumar",
    avatar: "/img/review4.jpg",
    date: "5 months ago",
    rating: 5,
    comment: "Simple, smooth, and professional. Will book again!",
  },
];

export default function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviewsData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === reviewsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
    <section className="bg-[#FFF4E1] py-16">
      {/* Heading + Google Rating */}
      <div className="max-w-7xl mx-auto px-6 md:px-20 text-center mb-8">
        <h2 className="text-2xl md:text-4xl font-serif font-bold text-[#3b2a1a] mb-10 md:mb-15">
          What Our Customers Say
        </h2>
        <div className="inline-flex items-center bg-white px-6 py-3 rounded-full shadow">
          <span className="font-bold mr-2">Google Reviews</span>
          <span className="font-bold text-xl mr-1">5.0</span>
          <div className="flex mr-2">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className="text-yellow-400" />
            ))}
          </div>
          <span className="text-gray-500">(15)</span>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-20">
        {/* Slide */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {reviewsData.map((review, i) => (
              <div
                key={i}
                className="w-full md:w-1/3 flex-shrink-0 px-2"
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg h-full flex flex-col">
                  {/* Avatar + Name */}
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{review.name}</h3>
                      <p className="text-gray-400 text-sm">{review.date}</p>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-yellow-400 ${
                          i < review.rating ? "opacity-100" : "opacity-30"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 flex-1">{review.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 -translate-y-1/2 left-0 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <IoIosArrowBack size={20} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute top-1/2 -translate-y-1/2 right-0 bg-white p-2 rounded-full shadow hover:bg-gray-100"
        >
          <IoIosArrowForward size={20} />
        </button>
      </div>

      {/* Google Review Button */}
      <div className="text-center mt-8">
        <a
          href="#"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
        >
          Review us on Google
        </a>
      </div>
    </section>
    </>
  );
}
