import { useState } from 'react';

interface Business {
  name: string;
  types: string;
  phone: string;
  address: string;
  hours?: string;
  years?: string;
}

interface Category {
  label: string;
  icon: string;
  desc: string;
  businesses: Business[];
}

const CONTRACTORS: Record<string, Category> = {
  arborist: {
    label: 'Arborist',
    icon: '🌲',
    desc: 'Tree care, removal, and health assessments from certified arborists serving the Killington region.',
    businesses: [
      { name: 'Black Bear Tree Land & Forest', types: 'Tree Service, Landscaping & Lawn Services', phone: '(802) 683-2294', address: '3466 Franklin St, Brandon, VT 05733', hours: 'Open 24 Hours' },
      { name: 'Trees Incorporated', types: 'Tree Service', phone: '(802) 773-2300', address: '53 Gleason Rd, Rutland, VT 05701', hours: '8:00 AM – 5:00 PM' },
      { name: 'Lawn Master of Vermont', types: 'Tree Service, Landscape Contractors', phone: '(802) 773-7833', address: '100 Park Ln, Mendon, VT 05701', hours: '8:00 AM – 5:00 PM' },
      { name: 'Grassdogs Lawncare', types: 'Tree Service, Gardeners', phone: '(802) 773-8724', address: '21 Chittenden Rd, Rutland, VT 05701', years: '20 Years', hours: 'Check Availability' },
      { name: 'Mc Cullough Brothers Inc', types: 'Tree Service, Landscape Contractors', phone: '(802) 747-7103', address: 'PO Box 724, Rutland, VT 05702', hours: '7:00 AM – 7:00 PM' },
      { name: 'Black Bear Tree Service', types: 'Tree Service', phone: '(802) 247-6026', address: '5841 Whipple Hollow Rd, Florence, VT 05744', years: '23 Years', hours: 'Check Availability' },
      { name: 'G M Tree Tech & Landscaping', types: 'Tree Service, Landscape Contractors', phone: '(802) 259-8733', address: '175 Vt Route 155 N, East Wallingford, VT 05742', years: '19 Years', hours: '9:00 AM – 6:00 PM' },
      { name: 'SavAtree', types: 'Leading Tree Care Specialists, Certified Arborists', phone: '(802) 244-5100', address: '15 Tayer Lane, Waterbury Center, VT 05677', hours: 'Mon–Fri: 7:00 AM – 5:00 PM' },
      { name: 'Vaillancourt Tree-Landscape Service', types: 'Tree Service, Landscape Contractors', phone: '(802) 773-3215', address: 'Serving the Killington Area', hours: '7:00 AM – 4:00 PM' },
      { name: 'Ace Arborist', types: 'Tree Service', phone: '(802) 345-5459', address: 'Serving the Killington Area', hours: 'Open 24 Hours' },
    ],
  },
  builders: {
    label: 'Builders & General Contractors',
    icon: '🏗️',
    desc: 'Full-service builders and general contractors for new construction and major renovation projects.',
    businesses: [
      { name: 'Wood Brothers Roofing Co.', types: 'Roofing Contractors, Building Contractors', phone: '(802) 353-3927', address: '1051 Ccc Rd, Cuttingsville, VT 05738', years: '15 Years', hours: 'Check Availability' },
      { name: 'La Valley Building Supply', types: 'Building Materials, Home Centers, Windows', phone: '(802) 775-0834', address: '48 Windcrest Rd, Rutland, VT 05701', years: '23 Years', hours: 'Check Availability' },
      { name: 'Mendon Trucking & Excavating', types: 'Excavation Contractors, Home Builders, General Contractors', phone: '(802) 773-0353', address: 'Serving the Killington Area', hours: 'Check Availability' },
      { name: 'Richard W Moore Construction', types: 'Home Builders, Building Contractors', phone: '(802) 773-4189', address: '335 Killington Rd, Killington, VT 05751', hours: 'Check Availability' },
      { name: 'Rotella Building Materials Inc', types: 'Home Builders, Building Contractors, Building Materials', phone: '(802) 773-3100', address: '325 West Street, Rutland, VT 05701', hours: 'Mon–Fri: 8:00 AM – 5:00 PM' },
      { name: 'Instone Design', types: 'Masonry Contractors, Masonry Equipment & Supplies', phone: '(802) 345-1707', address: '3748 US Route 4, Killington, VT 05751', years: '15 Years', hours: 'Check Availability' },
      { name: 'A B L E Waste Management Inc.', types: 'Construction Site Clean-Up, Building Contractors', phone: '(833) 200-7489', address: '1515 Lynds Hill Rd, Plymouth, VT 05056', years: '23 Years', hours: 'Check Availability' },
    ],
  },
  chimney: {
    label: 'Chimney Technicians',
    icon: '🧱',
    desc: 'Chimney sweeps, inspections, relining, and masonry repairs — essential for Vermont homes.',
    businesses: [
      { name: 'Chimney Savers', types: 'Chimney Cleaning, Chimney Contractors', phone: '(802) 728-3900', address: '895 VT Route 12 South, Randolph, VT 05060', years: 'Serving VT & NH Since 1989', hours: 'Mon–Fri: 8:00 AM – 4:00 PM' },
      { name: 'Grey Goose Chimney Sweeps', types: 'Chimney Cleaning, Chimney Contractors', phone: '(802) 492-3549', address: '2101 Keiffer Rd, Cuttingsville, VT 05738', hours: 'Check Availability' },
      { name: 'Northeast Chimney Service', types: 'Chimney Cleaning, Chimney Contractors', phone: '(802) 259-3622', address: '128 Sawyer Hill Rd, Mount Holly, VT 05758', hours: 'Check Availability' },
      { name: 'Friendly Sweep Chimney Services', types: 'Chimney Cleaning, Chimney Contractors, Heating Stoves', phone: '(802) 775-1251', address: '22 Champlain St, Brandon, VT 05733', hours: 'Check Availability' },
      { name: 'Central Vermont Chimney Sweeping', types: 'Chimney Cleaning, Chimney Caps, Chimney Contractors', phone: '(802) 558-4336', address: '47 Carver St, Brandon, VT 05733', hours: 'Check Availability' },
      { name: 'Rutland Chimney Services, Inc', types: 'Chimney Cleaning, Chimney Contractors, Chimney Lining', phone: '(802) 773-2936', address: '3 Wendy Ln, Rutland, VT 05701', hours: 'Check Availability' },
    ],
  },
  electricians: {
    label: 'Electricians',
    icon: '⚡',
    desc: 'Licensed electricians for residential and commercial electrical work throughout the Killington area.',
    businesses: [
      { name: 'Patch Electric', types: 'Electricians', phone: '(802) 558-5036', address: '49 South St, Proctor, VT 05765', years: '12 Years', hours: 'Open 24 Hours' },
      { name: 'Robert Stubbins Electric Contractor', types: 'Electricians, Electric Contractors', phone: '(802) 775-1484', address: '493 Post Rd Ext, Rutland, VT 05701', years: '26 Years', hours: 'Open 24 Hours' },
      { name: 'Electrical Solutions Inc', types: 'Electricians, Electric Equipment Repair, Fire Alarm Systems', phone: '(802) 747-5989', address: '154 Woodstock Ave Apt 3, Rutland, VT 05701', years: '21 Years', hours: 'Check Availability' },
      { name: 'Consolidated Electrical Distributors', types: 'Electricians, Electric Equipment & Supplies', phone: '(802) 775-2972', address: '207B Randbury Rd, Rutland, VT 05701', years: '67 Years', hours: 'Check Availability' },
      { name: 'Thompson Electric', types: 'Electric Services', phone: '(802) 773-9003', address: '57 Grover Dr, Rutland, VT 05701', hours: 'Check Availability' },
      { name: 'Vermont Electric Power Co. Inc', types: 'Electric Services', phone: '(802) 770-6252', address: '3666 Pentacle Rich Rd, Rutland, VT 05701', hours: 'Check Availability' },
    ],
  },
  excavator: {
    label: 'Excavator',
    icon: '🚜',
    desc: 'Excavation, grading, land clearing, and site preparation services.',
    businesses: [
      { name: 'Quirk Brothers Excavating', types: 'Excavation Contractors, Topsoil, Building Contractors', phone: '(802) 342-4464', address: '223 McKinley Ave, Rutland, VT 05701', years: '41 Years', hours: 'Check Availability' },
      { name: 'Fabian Earth Moving', types: 'Excavation Contractors, Building Contractors', phone: '(802) 438-5040', address: '1409 Pleasant St, West Rutland, VT 05777', years: '87 Years', hours: 'Check Availability' },
      { name: 'Mosher Excavating Inc', types: 'Excavation Contractors, General Contractors', phone: '(802) 422-3146', address: '225 Johnson Rd, Killington, VT 05751', years: '45 Years', hours: 'Check Availability' },
      { name: 'Kendrick Hurley Inc', types: 'Excavation Contractors', phone: '(802) 773-4353', address: '145 Johnson Brook Rd, Killington, VT 05751', hours: 'Check Availability' },
      { name: 'CJ Williams Excavating', types: 'Excavation Contractors, Sewer Contractors', phone: '(844) 630-7696', address: 'Rutland, VT 05701', years: '47 Years', hours: 'Check Availability' },
      { name: 'Richard Reed & Son', types: 'Excavation Contractors, Building Specialties', phone: '(802) 747-9041', address: '1934 Corn Hill Rd, Pittsford, VT 05763', years: '51 Years', hours: 'Check Availability' },
      { name: 'Beardmore Excavating', types: 'Excavation Contractors, Home Builders', phone: '(802) 342-3507', address: 'PO Box 328, Cuttingsville, VT 05738', hours: 'Check Availability' },
      { name: 'Gecha Brothers Excavation', types: 'Excavation Contractors, Septic Tanks & Systems', phone: '(802) 483-9311', address: '107 Gecha Ln, Pittsford, VT 05763', years: '23 Years', hours: 'Check Availability' },
    ],
  },
  'glass-repair': {
    label: 'Glass Repair',
    icon: '🪟',
    desc: 'Window replacement, glass repair, and custom glazing for homes and commercial spaces.',
    businesses: [
      { name: "Clark's Glass LLC", types: 'Window Glass Repair & Replacement, Glass Doors', phone: '(802) 772-0668', address: '131 Woodstock Ave Unit 2, Rutland, VT 05701', years: '5 Years', hours: 'Check Availability' },
      { name: 'Royal Group', types: 'Window Glass Repair & Replacement, Mirrors, Windows', phone: '(802) 773-3313', address: '150 Woodstock Ave, Rutland, VT 05701', years: '89 Years', hours: 'Check Availability' },
      { name: 'Northeast Window Svc', types: 'Window Glass Repair & Replacement', phone: '(802) 776-4192', address: '184 Woodstock Ave, Rutland, VT 05701', years: '8 Years', hours: 'Check Availability' },
      { name: 'Green Mountain Insulated Glass', types: 'Window Glass Repair, Glass Auto/Plate', phone: '(802) 772-4394', address: '10 Ripley Rd #2, Rutland, VT 05701', years: '7 Years', hours: 'Check Availability' },
      { name: 'Legacy Glass', types: 'Glass Auto, Plate, Window', phone: '(802) 775-1400', address: '56 Howe St Ste E, Rutland, VT 05701', years: '39 Years', hours: 'Check Availability' },
      { name: 'Portland Glass of Rutland', types: 'Glass, Window Repair & Installation', phone: '(802) 775-9720', address: '228 S Main St, Rutland, VT 05701', years: '77 Years', hours: 'Check Availability' },
      { name: 'Safelite AutoGlass', types: 'Windshield Repair, Auto Glass', phone: '(877) 465-5224', address: '134 Strongs Ave, Mendon, VT 05701', hours: 'Check Availability' },
    ],
  },
  handyman: {
    label: 'Handyman',
    icon: '🛠️',
    desc: 'Reliable handyman services for repairs, maintenance, and small renovation projects.',
    businesses: [
      { name: 'Killington Handyman Inc', types: 'Handyman Services', phone: '(802) 775-0692', address: '20 Overbrook Dr, Killington, VT 05751', hours: 'Check Availability' },
      { name: 'Brian Hathaway & Sons', types: 'Handyman Services, Home Improvements, Home Repair', phone: '(802) 236-5350', address: '116 Park Ave, Rutland, VT 05701', hours: 'Open 24 Hours' },
      { name: 'Fix All Handyman Services', types: 'Handyman Services', phone: '(802) 236-6577', address: '216 Dorr Dr, Rutland, VT 05701', hours: 'Check Availability' },
      { name: "David's Home Repair", types: 'Handyman Services, Bathroom Remodeling', phone: '(802) 342-9235', address: '789 Gates Rd S, Belmont, VT 05730', hours: 'Check Availability' },
      { name: 'Happy Valley Painters, Inc.', types: 'Handyman Services, Painting Contractors, Drywall', phone: '(877) 753-7831', address: '6 Chittenden Rd, Rutland, VT 05701', hours: 'Check Availability' },
      { name: 'Ski Door Inc', types: 'Home Repair, Fence Repair, Overhead Doors', phone: '(844) 409-1199', address: '45 Old Route 4a, Center Rutland, VT 05736', hours: 'Check Availability' },
      { name: 'East Coast Doorworks', types: 'Home Repair, Door Repair', phone: '(802) 558-3564', address: '216 Dorr Drive, Rutland, VT 05701', hours: 'Check Availability' },
      { name: 'Ace Painting', types: 'Drywall, Home Improvements, Home Repair', phone: '(802) 282-1152', address: '103 Lincoln Ave, Rutland, VT 05701', hours: 'Check Availability' },
    ],
  },
  'hot-tub': {
    label: 'Hot Tub & Spa Service',
    icon: '♨️',
    desc: 'Hot tub installation, repair, maintenance, and water treatment for Vermont properties.',
    businesses: [
      { name: 'Allen Pools & Spas', types: 'Spas & Hot Tubs, Swimming Pool Dealers', phone: '(802) 775-5952', address: '1901 US Route 4, Mendon, VT 05701', hours: 'Check Availability' },
      { name: 'Mountain Spas Pools & More', types: 'Spas & Hot Tubs, Swimming Pool Construction', phone: '(802) 645-9757', address: 'Serving the Killington Area', hours: 'Check Availability' },
      { name: 'Resort Spa Services', types: 'Spas & Hot Tubs, Swimming Pool Dealers', phone: '(802) 786-0747', address: '118 Woodstock Ave, Rutland, VT 05701', hours: 'Check Availability' },
      { name: 'Poultney Pools Inc', types: 'Spas & Hot Tubs, Swimming Pool Repair', phone: '(802) 438-2500', address: '551 Rutland Rd, West Rutland, VT 05777', hours: 'Check Availability' },
      { name: 'Knight Tubs Pools & Spas', types: 'Spas & Hot Tubs, Rentals', phone: '(802) 228-2260', address: '11 Main St, Ludlow, VT 05149', hours: 'Check Availability' },
      { name: 'All Seasons Pool & Spa', types: 'Spas & Hot Tubs, Sauna Equipment', phone: '(603) 448-5580', address: '264 Mechanic St, Lebanon, NH 03766', hours: 'Check Availability' },
    ],
  },
  'pest-control': {
    label: 'Pest Control',
    icon: '🐛',
    desc: 'Licensed pest management services keeping Vermont homes and businesses pest-free year-round.',
    businesses: [
      { name: 'Orkin Pest & Termite Control', types: 'Pest Control', phone: '(866) 204-8204', address: '446 Avenue D Ste 20, Williston, VT 05495', hours: '24 Hours' },
      { name: 'Vermont Pest Control', types: 'Pest Control', phone: '(802) 235-1021', address: '377 East Street, Middletown Springs, VT 05757', hours: 'Mon–Fri: 8:00 am – 5:00 pm' },
      { name: "Nature's Way Pest Control", types: 'Pest Control', phone: '(802) 855-2978', address: 'North Main Street, Rutland, VT 05701', hours: 'Mon–Fri: 8:00 am – 5:00 pm' },
      { name: 'Ecotech Pest Management', types: 'Pest Control', phone: '(802) 747-0300', address: 'Bennington, VT 05201', hours: 'Mon–Fri: 8:00 am – 5:00 pm' },
      { name: 'L & R Pest Elimination Services', types: 'Pest Control', phone: '(802) 342-5311', address: 'Serving the Killington Area', hours: 'Mon–Fri: 8:00 am – 5:00 pm' },
    ],
  },
  plumbers: {
    label: 'Plumbers',
    icon: '🚿',
    desc: 'Plumbing installation, repair, and emergency services across the Killington and Rutland areas.',
    businesses: [
      { name: 'Roto-Rooter', types: 'Plumbers, Sewer Contractors', phone: '(802) 438-5669', address: '335 Gravel Pit Rd, West Rutland, VT 05777', years: '89 Years', hours: 'Check Availability' },
      { name: 'A-1 Sewer & Drain Cleaning', types: 'Plumbers, Sewer Contractors', phone: '(802) 671-4121', address: '157 Quality Ln, Rutland, VT 05701', years: '40 Years', hours: 'Check Availability' },
      { name: 'McLaughlin & Son Plumbing & Heating', types: 'Plumbers, Septic Tanks & Systems', phone: '(802) 775-1375', address: '210 Russell Dr, Rutland, VT 05701', years: '54 Years', hours: 'Check Availability' },
      { name: 'Christie Plumbing & Heating', types: 'Plumbers, Drain & Sewer Cleaning, Furnaces', phone: '(802) 773-3607', address: '169 Church St, Rutland, VT 05701', years: '40 Years', hours: 'Check Availability' },
      { name: 'Marshall Plumbing & Heating', types: 'Plumbers', phone: '(802) 446-7048', address: '42 E Washington St #1, Rutland, VT 05701', years: '16 Years', hours: 'Check Availability' },
      { name: 'Robert Evegan Plumbing Heating', types: 'Plumbers', phone: '(802) 773-7780', address: '769 Old Turnpike Rd, Rutland, VT 05701', years: '20 Years', hours: 'Check Availability' },
      { name: 'Jim Manley Plumbing & Heating', types: 'Plumbers, Drain & Sewer Cleaning', phone: '(802) 438-2363', address: '782 Main St, West Rutland, VT 05777', years: '16 Years', hours: 'Check Availability' },
      { name: 'Service Experts Heating & Air', types: 'Plumbers, Water Heaters, Sewer Cleaning', phone: '(866) 559-1134', address: 'Serving the Killington Area', years: '59 Years', hours: 'Check Availability' },
    ],
  },
  'property-managers': {
    label: 'Property Managers',
    icon: '🏠',
    desc: 'Full-service property management for vacation rentals and year-round residential properties.',
    businesses: [
      { name: 'TPW Management', types: 'Real Estate Management, Property Maintenance', phone: '(802) 772-7240', address: '2326 US Route 4, Killington, VT 05751', hours: 'Check Availability' },
      { name: 'Getaway Vacations', types: 'Real Estate Management, Property Managers', phone: '(802) 438-8077', address: '1995 US Route 4, Killington, VT 05751', hours: 'Mon–Fri: 9:00 am – 9:00 pm' },
      { name: 'North Country Property Management', types: 'Real Estate Management, Property Maintenance', phone: '(802) 773-2301', address: '1995 Route 4, Killington, VT 05751', hours: 'Check Availability' },
      { name: 'ERA Mountain Real Estate', types: 'Real Estate Management, Real Estate Agents', phone: '(802) 775-0340', address: '1913 US Route 4, Killington, VT 05751', hours: 'Mon–Fri: 9:00 am – 5:00 pm' },
      { name: 'The Killington Group', types: 'Real Estate Management, Rental Service', phone: '(802) 422-2300', address: '10 W Park Rd, Killington, VT 05751', hours: 'Mon–Fri: 9:00 am – 5:00 pm' },
      { name: 'Killington Vacation Rentals', types: 'Real Estate Management, Real Estate Agents', phone: '(802) 422-3000', address: '905 Killington Road, Killington, VT', hours: 'Always Open' },
      { name: 'Paquette Property Management', types: 'Real Estate Management', phone: '(802) 855-8344', address: '125 Valley Vw, Rutland, VT 05701', hours: 'Mon–Fri: 7:30 am – 4:00 pm' },
    ],
  },
};

const CAT_KEYS = Object.keys(CONTRACTORS);

export default function LocalContractors() {
  const [activeCategory, setActiveCategory] = useState('arborist');
  const cat = CONTRACTORS[activeCategory];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col gap-2 w-72 flex-shrink-0">
        <div className="sticky top-24">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-navy/30 mb-6 ml-4 leading-relaxed">Categories</p>
          <div className="flex flex-col gap-2">
            {CAT_KEYS.map((key) => {
              const c = CONTRACTORS[key];
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`flex items-center gap-4 px-6 py-5 rounded-[2rem] text-sm font-black text-left transition-all duration-300 relative overflow-hidden group ${
                    isActive ? 'text-white bg-brand-navy shadow-xl translate-x-2' : 'text-brand-navy/60 hover:bg-gray-50 hover:text-brand-navy'
                  }`}
                >
                  <span className={`text-2xl transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{c.icon}</span>
                  <span className="truncate uppercase tracking-tight">{c.label}</span>
                  <span className={`ml-auto text-[10px] font-black px-3 py-1 rounded-full ${isActive ? 'bg-brand-green text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-brand-green/20 group-hover:text-brand-green'}`}>
                    {c.businesses.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Mobile category pills */}
      <div className="flex-1 min-w-0">
        <div className="flex lg:hidden gap-3 overflow-x-auto pb-6 -mx-6 px-6 no-scrollbar mb-10">
          {CAT_KEYS.map((key) => {
            const c = CONTRACTORS[key];
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`text-[10px] font-black px-6 py-4 rounded-full border-2 transition-all whitespace-nowrap uppercase tracking-widest ${
                  isActive ? 'bg-brand-navy text-white border-brand-navy shadow-lg' : 'bg-white text-brand-navy/40 border-gray-100 hover:border-brand-green/30'
                }`}
              >
                {c.icon} {c.label}
              </button>
            );
          })}
        </div>

        {/* Category header */}
        <div className="mb-12 group">
          <div className="flex items-center gap-6 mb-4">
            <div className="w-20 h-20 rounded-[2rem] bg-gray-50 flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform duration-500">{cat.icon}</div>
            <h2 className="text-4xl md:text-5xl font-heading font-black text-brand-navy uppercase tracking-tight">{cat.label}</h2>
          </div>
          <p className="text-gray-400 text-lg font-medium max-w-3xl leading-relaxed">{cat.desc}</p>
        </div>

        {/* Business listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cat.businesses.map((biz) => (
            <div key={biz.name} className="bg-gray-50/30 border border-gray-100 rounded-[3rem] p-10 hover:bg-white hover:shadow-premium transition-all duration-500 group/card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-green/5 rounded-full -mr-12 -mt-12 opacity-0 group-hover/card:opacity-100 transition-opacity" />
              <h3 className="font-heading font-black text-brand-navy text-2xl mb-2 uppercase tracking-tight group-hover/card:text-brand-green transition-colors">{biz.name}</h3>
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-8 border-b border-gray-100/50 pb-4">{biz.types}</p>

              <div className="space-y-6">
                {biz.phone && (
                  <a
                    href={`tel:${biz.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-4 text-brand-navy font-black text-sm hover:text-brand-green transition-colors group/link"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand-green/10 text-brand-green flex items-center justify-center group-hover/link:bg-brand-green group-hover/link:text-white transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                    </div>
                    <span className="uppercase tracking-widest">{biz.phone}</span>
                  </a>
                )}
                {biz.address && (
                  <div className="flex items-center gap-4 text-gray-400 font-medium text-sm">
                    <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    </div>
                    <span className="leading-tight">{biz.address}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  {biz.hours && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
                      <span className="text-xs">🕐</span>
                      <span className="text-[10px] font-black text-brand-navy/60 uppercase tracking-widest">{biz.hours}</span>
                    </div>
                  )}
                  {biz.years && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green text-white shadow-lg">
                      <span className="text-[10px] font-black uppercase tracking-widest">{biz.years}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
