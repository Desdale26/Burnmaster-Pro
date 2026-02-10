
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface BurnMeterProps {
  stats: {
    wit: number;
    heat: number;
    originality: number;
  };
}

const BurnMeter: React.FC<BurnMeterProps> = ({ stats }) => {
  const data = [
    { subject: 'Wit', A: stats.wit, fullMark: 100 },
    { subject: 'Heat', A: stats.heat, fullMark: 100 },
    { subject: 'Originality', A: stats.originality, fullMark: 100 },
  ];

  return (
    <div className="h-48 w-48 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="60%" data={data}>
          <PolarGrid stroke="#333" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#888', fontSize: 10 }} />
          <Radar
            name="Burn Stats"
            dataKey="A"
            stroke="#f97316"
            fill="#f97316"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BurnMeter;
