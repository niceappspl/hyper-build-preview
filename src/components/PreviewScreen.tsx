import React from 'react';

interface PreviewScreenProps {
  prompt: string;
  mockType?: 'default';
  selectedDevice?: 'iphone' | 'android';
}

const PreviewScreen: React.FC<PreviewScreenProps> = ({ 
  prompt, 
  mockType = 'default',
  selectedDevice = 'iphone'
}) => {
  // Definiujemy rzeczywiste proporcje iPhone'a
  const iphoneWidth = 393;
  const iphoneHeight = 852;
  
  // Ustalamy skalę dla interfejsu (zwiększamy szerokość dla lepszego wyświetlania)
  const scale = 0.7; // Mniejsza skala, tak jak w oryginalnym kodzie
  const deviceWidth = iphoneWidth * scale;
  const deviceHeight = iphoneHeight * scale;
  
  // Obliczamy marginesy dla zawartości z uwzględnieniem Dynamic Island i Home Indicator
  const contentMarginTop = deviceWidth * 0.06; // 6% marginesu z góry (dla Dynamic Island)
  const contentMarginX = deviceWidth * 0.05; // 5% marginesu po bokach
  const contentMarginBottom = deviceWidth * 0.07; // 7% marginesu z dołu (dla Home Indicator)
  const contentWidth = deviceWidth - (contentMarginX * 2);
  const contentHeight = deviceHeight - contentMarginTop - contentMarginBottom;
  
  return (
    // Usuwamy zewnętrzny kontener z gradientem, ponieważ jest on już w DesignerPage
    <div className="relative transform transition-transform duration-300">
      {/* Glow effect pod urządzeniem */}
      <div className="absolute -inset-2 bg-gradient-to-b from-blue-500/10 to-cyan-500/10 rounded-[50px] blur-xl"></div>
      
      {/* Phone Frame */}
      <div className="relative" style={{ width: `${deviceWidth}px`, height: `${deviceHeight}px` }}>
        {/* iPhone Frame - używamy obrazu zamiast SVG */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <img 
            src="/frames/iphone.svg" 
            alt="iPhone frame" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Phone Content - teraz pusty */}
        <div className="absolute z-0 rounded-[30px] overflow-hidden bg-black" style={{ 
          top: `${contentMarginTop}px`, 
          left: `${contentMarginX}px`, 
          width: `${contentWidth}px`, 
          height: `${contentHeight}px`
        }}>
          {/* Zawartość telefonu została usunięta, pozostawiając tylko czarne tło */}
        </div>
      </div>
    </div>
  );
};

export default PreviewScreen; 