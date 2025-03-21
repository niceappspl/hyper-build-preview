import React from 'react';
import SpotifyMock from '../mocks/SpotifyMock';

interface PreviewScreenProps {
  prompt: string;
  mockType?: 'default' | 'spotify';
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ prompt, mockType = 'default' }) => {
  // Definiujemy rzeczywiste proporcje iPhone'a
  const iphoneWidth = 393;
  const iphoneHeight = 852;
  
  // Ustalamy skalę dla interfejsu (zwiększamy szerokość dla lepszego wyświetlania)
  const scale = 0.9; // Większa skala dla komponentu podglądu
  const deviceWidth = iphoneWidth * scale;
  const deviceHeight = iphoneHeight * scale;
  
  // Obliczamy marginesy dla zawartości z uwzględnieniem Dynamic Island i Home Indicator
  const contentMarginX = deviceWidth * 0.05; // 5% marginesu po bokach
  const contentMarginTop = deviceWidth * 0.06; // 6% marginesu z góry (dla Dynamic Island)
  const contentMarginBottom = deviceWidth * 0.07; // 7% marginesu z dołu (dla Home Indicator)
  const contentWidth = deviceWidth - (contentMarginX * 2);
  const contentHeight = deviceHeight - contentMarginTop - contentMarginBottom;
  
  return (
    <div className="font-sans h-full flex flex-col items-center justify-center relative p-8 bg-gradient-to-b from-[#0c0c0c] to-black">
      {/* Zaawansowane tło z gradientami, siatką i orbs */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtelna siatka */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:64px_64px]" />
        
        {/* Gradient nakładka */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-transparent" />
        
        {/* Gradient orbs - jaśniejsze */}
        <div className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-gradient-to-r from-blue-500/15 to-blue-700/15 rounded-full blur-[80px] opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-400/15 to-cyan-500/15 rounded-full blur-[80px] opacity-60" />
      </div>
      
      {/* Phone Frame */}
      <div className="relative z-10" style={{ width: `${deviceWidth}px`, height: `${deviceHeight}px` }}>
        {/* iPhone Frame SVG */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <svg width="100%" height="100%" viewBox="0 0 1294 2656" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter16_ii_1_36)">
              <rect x="7" width="1279" height="2656" rx="215" fill="#CECAC0"/>
            </g>
            <g filter="url(#filter17_d_1_36)">
              <rect x="25" y="18" width="1243" height="2620" rx="198" fill="black"/>
            </g>
            {/* Notch */}
            <path d="M646 18H647C647 18 647 18 647 18C647 18 647 18 647 18H646Z" fill="black"/>
            <mask id="mask0" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="546" y="0" width="200" height="60">
              <path d="M646 18H647C647 18 647 18 647 18C647 18 647 18 647 18H646Z" fill="black"/>
            </mask>
            <g mask="url(#mask0)">
              <rect x="546" width="200" height="60" rx="30" fill="black"/>
            </g>
          </svg>
        </div>
        
        {/* Phone Content */}
        <div className="absolute z-0 overflow-hidden rounded-[30px]" style={{ 
          top: `${contentMarginTop}px`, 
          left: `${contentMarginX}px`, 
          width: `${contentWidth}px`, 
          height: `${contentHeight}px`
        }}>
          {mockType === 'spotify' ? (
            <div className="w-full h-full relative">
              <SpotifyMock containerStyle={{ position: 'relative', height: '100%' }} />
            </div>
          ) : (
            <div className="font-sans h-full flex flex-col">
              {/* Status bar */}
              <div className="flex justify-between items-center bg-white px-4 py-2 text-xs text-gray-700">
                <div>9:41</div>
                <div className="flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z"/>
                  </svg>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z"/>
                  </svg>
                </div>
              </div>
              
              {/* App Content */}
              <div className="flex-1 bg-white">
                {/* App Header */}
                <div className="bg-blue-500 text-white p-4">
                  <div className="text-xl font-semibold">HyperApp</div>
                  <div className="text-sm mt-1 opacity-80">Powered by AI</div>
                </div>
                
                {/* App Body */}
                <div className="p-4">
                  <div className="mb-6">
                    <h2 className="text-lg font-bold text-gray-800">Welcome</h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      {prompt || 'Your custom mobile application'}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Feature Card */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Fast Performance</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Optimized for speed and efficiency
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature Card */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Secure & Private</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Your data is protected and private
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Feature Card */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-start">
                        <div className="bg-purple-100 p-2 rounded-full mr-3">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">Customizable</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Tailor the app to your needs
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Navigation */}
              <div className="grid grid-cols-4 bg-white border-t border-gray-200 py-2">
                <button className="flex flex-col items-center justify-center text-blue-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="text-xs mt-1">Home</span>
                </button>
                <button className="flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-xs mt-1">Search</span>
                </button>
                <button className="flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-xs mt-1">Profile</span>
                </button>
                <button className="flex flex-col items-center justify-center text-gray-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-xs mt-1">Settings</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewScreen; 