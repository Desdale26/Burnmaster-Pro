
import React from 'react';

interface SliderProps {
  label: string;
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  accentColor?: string;
}

const Slider: React.FC<SliderProps> = ({ label, min, max, value, onChange, accentColor = 'bg-orange-500' }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center text-sm font-semibold text-gray-400">
        <span>{label}</span>
        <span className="text-white font-mono">{value}%</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-800 accent-orange-600`}
      />
    </div>
  );
};

export default Slider;
