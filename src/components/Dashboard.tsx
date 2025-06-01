/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const container = css`
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  background: #0f172a;
  min-height: 100vh;
  color: #f1f5f9;
`;

const header = css`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.8s ease-out;
`;

const grid = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const card = css`
  background: #1e293b;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  animation: ${fadeIn} 0.8s ease-out;
`;

const label = css`
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 0.5rem;
`;

const value = css`
  font-size: 1.5rem;
  font-weight: 600;
  color: #38bdf8;
`;

const progressBarContainer = css`
  background: #334155;
  border-radius: 0.5rem;
  overflow: hidden;
  height: 14px;
  margin-bottom: 0.5rem;
`;

const progressBar = (percent: number) => css`
  width: ${percent}%;
  height: 100%;
  background-color: #38bdf8;
  transition: width 0.5s ease;
`;

export const Dashboard = () => {
  const [cpuUsage, setCpuUsage] = useState([20, 40, 60, 80]);
  const [ram, setRam] = useState({ used: 4.5, total: 8 });
  const [networkData, setNetworkData] = useState<{ up: number; down: number; time: number }[]>([]);
  const batteryLevel = 88;

  // Update every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newCpu = Array.from({ length: 4 }, () => Math.floor(Math.random() * 100));
      setCpuUsage(newCpu);

      setRam({
        used: +(Math.random() * 8).toFixed(1),
        total: 8
      });

      setNetworkData(prev => {
        const next = [...prev, {
          up: parseFloat((Math.random() * 5).toFixed(2)),
          down: parseFloat((Math.random() * 10).toFixed(2)),
          time: Date.now(),
        }];
        return next.slice(-20);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const avgCpu = Math.round(cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length);
  const ramPercent = Math.round((ram.used / ram.total) * 100);

  return (
    <div css={container}>
      <div css={header}>🖥️ System Monitor Dashboard</div>
      <div css={grid}>
        {/* CPU */}
        <div css={card}>
          <div css={label}>CPU Usage (Quad Core)</div>
          <div css={value}>{avgCpu}% Total</div>
          <div css={progressBarContainer}><div css={progressBar(avgCpu)} /></div>
          {cpuUsage.map((usage, i) => (
            <div key={i}>
              <div css={label}>Core {i + 1}: {usage}%</div>
              <div css={progressBarContainer}><div css={progressBar(usage)} /></div>
            </div>
          ))}
        </div>

        {/* RAM */}
        <div css={card}>
          <div css={label}>RAM Usage</div>
          <div css={value}>{ram.used} GB / {ram.total} GB</div>
          <div css={progressBarContainer}><div css={progressBar(ramPercent)} /></div>
        </div>

        {/* Battery */}
        <div css={card}>
          <div css={label}>Battery Level</div>
          <div css={value}>{batteryLevel}%</div>
          <div css={progressBarContainer}><div css={progressBar(batteryLevel)} /></div>
        </div>

        {/* Network */}
        <div css={card}>
          <div css={label}>Network (Upload / Download)</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={networkData}>
              <Line type="monotone" dataKey="up" stroke="#38bdf8" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="down" stroke="#f43f5e" strokeWidth={2} dot={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#f1f5f9' }}
                labelFormatter={() => ''}
              />
            </LineChart>
          </ResponsiveContainer>
          <div css={label}>Blue = Upload | Red = Download</div>
        </div>
      </div>
    </div>
  );
};
