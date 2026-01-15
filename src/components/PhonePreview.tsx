import React from 'react';
import { Battery, Signal, Wifi, CheckCheck } from 'lucide-react';

interface PhonePreviewProps {
  message: string;
  image?: string | null;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({ message, image }) => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-80 h-[40rem] bg-black rounded-[3rem] p-3 shadow-2xl border-4 border-gray-800 relative mx-auto">
      {/* Notch/Island */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-black rounded-b-xl z-20"></div>

      {/* Screen */}
      <div className="w-full h-full bg-[#E5DDD5] rounded-[2.5rem] overflow-hidden relative flex flex-col">
        {/* Status Bar */}
        <div className="h-10 bg-[#075E54] flex justify-between items-center px-6 pt-2 text-white text-xs z-10">
          <span>9:41</span>
          <div className="flex gap-1.5">
            <Signal size={12} />
            <Wifi size={12} />
            <Battery size={12} />
          </div>
        </div>

        {/* Chat Header */}
        <div className="h-14 bg-[#075E54] flex items-center px-4 gap-3 shadow-md z-10">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/50/50" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Your Business</p>
            <p className="text-white/70 text-xs">Official Account</p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 overflow-y-auto" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")', backgroundSize: 'contain' }}>
          <div className="flex justify-center mb-4">
            <span className="bg-[#DCF8C6] text-gray-800 text-[10px] px-2 py-1 rounded shadow uppercase font-bold tracking-wide">Today</span>
          </div>

          {/* Message Bubble */}
          <div className="flex justify-end mb-4">
            <div className="bg-[#DCF8C6] p-2 rounded-lg rounded-tr-none shadow-sm max-w-[85%] min-w-[100px] relative">
              {image && (
                <div className="mb-2 rounded-lg overflow-hidden">
                  <img src={image} alt="Preview" className="w-full h-auto object-cover max-h-40" />
                </div>
              )}
              <p className="text-sm text-gray-800 whitespace-pre-wrap leading-snug">
                {message || "Start typing to preview your message..."}
              </p>
              <div className="flex justify-end items-center gap-1 mt-1">
                <span className="text-[10px] text-gray-500">{currentTime}</span>
                <CheckCheck className="text-blue-500 w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Input Area Mockup */}
        <div className="h-14 bg-[#F0F0F0] flex items-center px-2 gap-2">
          <div className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xl">+</div>
          <div className="flex-1 h-9 bg-white rounded-full px-4 flex items-center text-gray-400 text-sm">Type a message</div>
          <div className="w-8 h-8 rounded-full bg-wa-green flex items-center justify-center text-white">
            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
          </div>
        </div>
      </div>

      {/* Home Bar */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-500 rounded-full"></div>
    </div>
  );
};