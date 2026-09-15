import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css'
import 'leaflet-defaulticon-compatibility'

function ListingMap({ listing }) {
  if (!listing || !listing.lat || !listing.lng) return null;

  const position = [parseFloat(listing.lat), parseFloat(listing.lng)];

  return (
    <div className="mt-12">
      <div className="inline-flex items-center gap-3 mb-8">
        <span className="w-12 h-1 bg-brand-green rounded-full" />
        <h2 className="text-3xl font-heading font-black text-brand-navy tracking-tight uppercase">Location Map</h2>
      </div>
      
      <div className="w-full h-80 rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 relative z-0">
        <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>
              <div className="text-center pb-2">
                <p className="font-bold text-brand-navy text-sm mb-1">{listing.name}</p>
                <p className="text-xs text-gray-500 mb-4">{listing.address}</p>
                <p className="text-xs font-semibold mb-3">Open in Google Maps Navigation?</p>
                <div className="flex gap-2 justify-center">
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${position[0]},${position[1]}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-brand-green text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-brand-green/90 transition-colors"
                  >
                    Yes
                  </a>
                  <button 
                    className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1.5 rounded hover:bg-gray-300 transition-colors"
                    onClick={() => {
                       const closeBtn = document.querySelector('.leaflet-popup-close-button');
                       if (closeBtn) closeBtn.click();
                    }}
                  >
                    Stay here
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  )
}

export default ListingMap
