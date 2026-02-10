
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

interface BurnMeterProps {
  stats: {
    wit: number;
    heat: number;
    chaos: number;
  };
}

const BurnMeter: React.FC<BurnMeterProps> = ({ stats }) => {
  const data = [
    { subject: 'HEAT', value: stats.heat },
    { subject: 'WIT', value: stats.wit },
    { subject: 'CHAOS', value: stats.chaos },
  ];

  return (
    <div className="h-64 w-full mx-auto relative group flex items-center justify-center">
      {/* Background Target Reticle UI */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <div className="w-48 h-48 border border-white/20 rounded-full"></div>
        <div className="w-32 h-32 border border-white/20 rounded-full absolute"></div>
        <div className="w-px h-56 bg-white/10 absolute"></div>
        <div className="w-56 h-px bg-white/10 absolute"></div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
          <PolarGrid stroke="#444" strokeDasharray="3 3" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: '#ffffff', 
              fontSize: 11, 
              fontWeight: 900, 
              letterSpacing: '0.15em',
              paintOrder: 'stroke',
              stroke: '#000000',
              strokeWidth: 4,
            }} 
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Burn Dynamics"
            dataKey="value"
            stroke="#ff4d00"
            strokeWidth={3}
            fill="#ff4d00"
            fillOpacity={0.6}
            animationDuration={800}
            isAnimationActive={true}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BurnMeter;
