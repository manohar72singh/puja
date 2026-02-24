import React from "react";
import { CalendarDays, MapPin } from "lucide-react";

const eventsData = [
  {
    id: 1,
    title: "Buddha Purnima Celebration",
    date: "23 May 2026",
    location: "Mahabodhi Temple, Bodh Gaya",
    description:
      "Buddha Purnima marks the sacred birth, enlightenment, and Mahaparinirvana of Lord Gautama Buddha. Devotees gather under the holy Bodhi Tree to meditate and offer prayers. The temple complex glows with spiritual serenity. Chanting ceremonies and teachings of compassion inspire visitors. The atmosphere becomes peaceful and deeply reflective. It is a celebration of wisdom, kindness, and enlightenment.",
    image:
      "/img/Buddha.jpg",
  },
  {
    id: 2,
    title: "Evening Maha Aarti",
    date: "Daily - 6:00 PM",
    location: "Prem Mandir, Vrindavan",
    description:
      "The Evening Maha Aarti is performed with grandeur and devotion. As the sun sets, temple lights create a divine aura. Devotees sing bhajans with deep faith. The synchronized rituals uplift the spiritual atmosphere. Visitors feel inner peace and positivity. The experience remains unforgettable.",
    image:
      "/img/prem_mandir.jpg",
  },
  {
    id: 3,
    title: "Navratri Special Pooja",
    date: "10 Oct 2026",
    location: "Vaishno Devi Temple, Katra",
    description:
      "Navratri is dedicated to Goddess Durga and her divine forms. Thousands gather for blessings and rituals. The temple is beautifully decorated with flowers and lights. Devotional singing fills the atmosphere. Fasting and prayer strengthen faith. It symbolizes victory of good over evil.",
    image:
      "/img/navratri_special_pooja.jpg",
  },
  {
    id: 4,
    title: "Janmashtami Mahotsav",
    date: "18 Aug 2026",
    location: "ISKCON Temple, Vrindavan",
    description:
      "Janmashtami celebrates the birth of Lord Krishna. Devotees observe fasts and chant prayers. The temple glows with vibrant decorations. Midnight celebrations mark Krishna’s birth. Spiritual discourses inspire devotion. The festival spreads joy and divine love.",
    image:
      "/img/Janmashtami.jpg",
  },
  {
    id: 5,
    title: "Diwali Deep Mahotsav",
    date: "12 Nov 2026",
    location: "Kashi Vishwanath Temple, Varanasi",
    description:
      "Thousands of diyas illuminate the temple during Diwali. Devotees pray for prosperity and peace. The temple shines with golden lights. Special aartis are performed with devotion. The festival symbolizes light over darkness. Spiritual energy fills the surroundings.",
    image:
      "/img/diwali.webp",
  },
  {
    id: 6,
    title: "Rath Yatra Festival",
    date: "7 July 2026",
    location: "Jagannath Temple, Puri",
    description:
      "Rath Yatra is a grand procession of Lord Jagannath. Massive chariots are pulled by devotees. The streets echo with devotional chants. Millions participate in this sacred journey. The festival symbolizes unity and devotion. It is spiritually powerful.",
    image:
      "/img/The-Rathyatra-2.jpeg",
  },
  {
    id: 7,
    title: "Guru Purnima Celebration",
    date: "1 July 2026",
    location: "Sarnath Temple, Uttar Pradesh",
    description:
      "Guru Purnima honors spiritual teachers. Devotees express gratitude through prayers. Discourses highlight the importance of wisdom. Meditation sessions bring inner peace. The celebration strengthens faith. It inspires righteous living.",
    image:
      "/img/Guru.webp",
  },
  {
    id: 8,
    title: "Mahashivratri Night Jagran",
    date: "26 Feb 2026",
    location: "Somnath Temple, Gujarat",
    description:
      "Mahashivratri is dedicated to Lord Shiva. Devotees perform abhishekam and chant mantras. The temple remains open all night. Spiritual stories inspire devotion. Fasting marks the sacred observance. The night is spiritually transformative.",
    image:
      "/img/Maha-Shivratri.webp",
  },
  {
    id: 9,
    title: "Ram Navami Celebration",
    date: "5 April 2026",
    location: "Ram Janmabhoomi, Ayodhya",
    description:
      "Ram Navami celebrates the birth of Lord Rama. Devotees sing bhajans and offer prayers. The temple is magnificently decorated. Spiritual talks narrate Rama’s life. The festival inspires truth and devotion. It spreads harmony and peace.",
    image:
      "/img/Ram.jpg",
  },
];

const EventsPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-100 to-white min-h-screen">

      {/* Header */}
      <div className="bg-orange-400 py-8 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Temple Events & Festivals
        </h1>
        <p className="text-lg opacity-90 max-w-2xl mx-auto">
          Discover sacred celebrations, spiritual gatherings, and divine rituals 
          that bring positivity and peace into life.
        </p>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 sm:grid-cols-2 gap-8">

        {eventsData.map((event) => (
          <div
            key={event.id}
            className="bg-white rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-[600px]"
          >
            <div className="h-56">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 flex flex-col justify-between flex-1">

              <div>
                <div className="flex items-center gap-2 text-orange-400 text-sm font-semibold mb-2">
                  <CalendarDays size={16} />
                  {event.date}
                </div>

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {event.title}
                </h2>

                <div className="flex items-center gap-2 text-gray-500 text-sm mb-3">
                  <MapPin size={16} />
                  {event.location}
                </div>

                <p className="text-gray-600 text-sm leading-6">
                  {event.description}
                </p>
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default EventsPage;