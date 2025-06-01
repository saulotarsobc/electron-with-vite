/** @jsxImportSource @emotion/react */
import { css, keyframes } from '@emotion/react';
import CountUp from 'react-countup';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const container = css`
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  background: #0f172a;
  min-height: calc(100vh - 50px);
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
  font-size: 2rem;
  font-weight: 700;
  color: #38bdf8;
`;

export const Dashboard = () => {
  return (
    <div css={container}>
      <div css={header}>📊 Info Panel</div>
      <div css={grid}>
        <div css={card}>
          <div css={label}>Active Users</div>
          <div css={value}><CountUp end={1250} duration={2} /></div>
        </div>
        <div css={card}>
          <div css={label}>Conversions</div>
          <div css={value}><CountUp end={321} duration={2} /></div>
        </div>
        <div css={card}>
          <div css={label}>Engagement Rate (%)</div>
          <div css={value}><CountUp end={87.5} duration={2} decimals={1} /></div>
        </div>
        <div css={card}>
          <div css={label}>New Leads</div>
          <div css={value}><CountUp end={89} duration={2} /></div>
        </div>
      </div>
    </div>
  );
};
