import { useState, useEffect } from 'react';

interface TeamMember {
  name: string;
  role: string;
  img: string;
  bio: string;
}

const TEAM: TeamMember[] = [
  {
    name: 'Jonas Adler',
    role: 'Founder',
    img: '/images/team/jonas-headshot.png',
    bio: "Jonas is an entrepreneur and a lover of all things snow. He attended college in Vermont, and ever since 2006, has owned a cozy ski house in Killington. After years of exploring the slopes at countless ski resorts around the world, he couldn't help but notice there was a real need for a website that could simplify the lives of out-of-town skiers and riders. KillingtonGetaway.com was born. His mission is simple yet powerful: to create an online platform that not only connects fellow skiers and riders with businesses but also provides them with all the essential information they need to have an unforgettable skiing experience - less time searching and more time skiing!"
  },
  {
    name: 'Paul Savage',
    role: 'Advisor',
    img: '/images/team/paul-headshot.png',
    bio: "Meet Paul Savage who hails from the mighty mountains of Ireland and learned to snowboard in the German and Austrian alps. He is proud \"honorary Vermonter\" who owns a ski home in Vermont and aims for 30+ days on the slopes. He is a beer aficionado and loves all things Apre' and tech. Paul has helped to run and advise a good number of tech start-ups in Boston and cooks an amazing eggs benedict."
  },
  {
    name: 'Marc Sullivan',
    role: 'Ambassador',
    img: '/images/team/marc-headshot.png',
    bio: "Marc (aka \"Sully\") is seasoned skier, proud Vermonter, and number-crunching aficionado. When he is not busy ripp'n trees at Killington or Pico you can find him mountain biking with his family or spending time with his dogs. Over the years, Marc has had the incredible opportunity to work at some of Vermont's top-ranked resorts. From managing budgets to ensuring financial stability, he thrives on helping businesses reach their full potential. His precision is unmatched - whether it's analyzing financial data or crafting the perfect slope strategy."
  },
  {
    name: 'Jorge Jaramillo',
    role: 'Web Developer',
    img: '/images/team/jorge-headshot.png',
    bio: "Jorge is a web developer extraordinaire with a knack for quick thinking and cutting-edge tech skills. Admittedly he has never really strapped on a pair of skis or hopped on a snowboard, but that hasn't stopped him from carving his own path in the digital world. As a founding team member of Killington Getaway, he has been instrumental in bringing our vision to life and earned a spot on the team."
  },
  {
    name: 'John Eidson',
    role: 'Public Relations',
    img: '/images/team/john-headshot.png',
    bio: "John is a content editor, media manager, and public relations guru, with a passion for helping startups find their voice and make an impact. When he is not busy shaping brands, you can find him at his family ski house nestled in the picturesque mountains of Vermont. John thrives on helping businesses better define their mission on a deeper level and of course always looking for those deeper powder stashes."
  },
];

export default function TeamSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TEAM.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeMember = TEAM[activeIndex];

  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Team Slider Card */}
        <div className="relative group mb-12">
          <div className="bg-white rounded-[3rem] shadow-premium border border-gray-100 overflow-hidden transition-all duration-700 h-[750px] md:h-[600px]">
            <div className="flex flex-col md:flex-row h-full">
              {/* Photo Side */}
              <div className="w-full md:w-[35%] relative bg-gray-50 flex items-center justify-center p-8 md:p-12 h-[300px] md:h-full">
                <div className="w-48 h-48 md:w-64 md:h-64 relative rounded-full overflow-hidden shadow-inner border-8 border-white">
                  <img
                    key={activeMember.name}
                    src={activeMember.img}
                    alt={activeMember.name}
                    className="w-full h-full object-cover animate-fade-in transition-transform duration-[2000ms] group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-[65%] p-10 md:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center gap-3 mb-6">
                  <span className="w-8 h-[2px] bg-brand-green" />
                  <p className="uppercase tracking-[0.3em] text-xs font-black text-brand-navy/40">Team Member</p>
                </div>
                <h3 className="text-4xl md:text-5xl font-heading font-black text-brand-navy uppercase tracking-tight mb-4 leading-tight">
                  {activeMember.name}
                </h3>
                <p className="text-brand-green font-black text-sm uppercase tracking-widest mb-8 border-l-4 border-brand-green pl-4">
                  {activeMember.role}
                </p>
                <p className="text-gray-400 font-medium leading-relaxed text-lg animate-fade-in-up">
                  {activeMember.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + TEAM.length) % TEAM.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-brand-navy hover:bg-brand-blue hover:text-white transition-all z-20 md:-left-6 hidden md:flex"
          >
            ←
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % TEAM.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur shadow-lg rounded-full flex items-center justify-center text-brand-navy hover:bg-brand-blue hover:text-white transition-all z-20 md:-right-6 hidden md:flex"
          >
            →
          </button>
        </div>

        {/* Desktop Pagination (Small Photos) */}
        <div className="hidden md:flex justify-center items-center gap-6">
          {TEAM.map((member, index) => (
            <button
              key={member.name + '-pager'}
              onClick={() => setActiveIndex(index)}
              className={`group relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                activeIndex === index ? 'border-brand-green scale-110 shadow-lg' : 'border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100'
              }`}
            >
              <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
              {activeIndex === index && (
                <div className="absolute inset-0 bg-brand-green/10" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
