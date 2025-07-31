'use client';

import { useState } from 'react';
import { ChevronDown, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

const storeData = [
  {
    id: 1,
    name: 'Sheshi "Wilson"',
    address: 'Rruga Wilson, Tiranë',
    hours: '11:30 - 17:00',
    mapPosition: { top: '40%', left: '25%' }
  },
  {
    id: 2,
    name: 'Toptani Center',
    address: 'Bulevardi Dëshmorët e Kombit, Tiranë',
    hours: '10:00 - 22:00',
    mapPosition: { top: '30%', right: '35%' }
  },
  {
    id: 3,
    name: 'Ring Tirana',
    address: 'Autostrada Tiranë-Durrës, Tiranë',
    hours: '10:00 - 22:00',
    mapPosition: { top: '55%', right: '25%' }
  },
  {
    id: 4,
    name: 'Kristal center',
    address: 'Rruga e Kavajës, Tiranë',
    hours: '09:30 - 21:30',
    mapPosition: { bottom: '25%', left: '15%' }
  },
  {
    id: 5,
    name: 'Kopshti Zoologjik',
    address: 'Rruga e Elbasanit, Tiranë',
    hours: '09:00 - 18:00',
    mapPosition: { bottom: '15%', right: '20%' }
  }
];

export default function StoresPage() {
  const [expandedStore, setExpandedStore] = useState<number | null>(1);

  const toggleStore = (storeId: number) => {
    setExpandedStore(expandedStore === storeId ? null : storeId);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Content Layout */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-[#C11202] mb-4 font-grandstander">
              Our stores
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Store List */}
            <div className="space-y-4">
              {storeData.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-lg overflow-hidden  "
                >
                  {/* Store Header - Always Visible */}
                  <div
                    className="p-3 cursor-pointer flex items-center justify-between bg-[#FFF2D1]"
                    onClick={() => toggleStore(store.id)}
                  >
                    <h3 className="text-md font-semibold text-gray-900 font-albertsans">
                      {store.name}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                        expandedStore === store.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {/* Store Details - Expandable */}
                  {expandedStore === store.id && (
                    <div className="px-2 pt-3 pb-6 bg-white">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700 font-albertsans">
                            {store.address}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                          <p className="text-gray-700 font-albertsans">
                            {store.hours}
                          </p>
                        </div>

                        {/* <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-albertsans">
                          More details
                        </button> */}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Side - Map */}
            <div className="relative  overflow-hidden ">
              <div className="h-96 lg:h-[500px] relative ">
                {/* Real Map Background */}
                <Image
                  src="/map.jpg"
                  alt="Tirana Map"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}