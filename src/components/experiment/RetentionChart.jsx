import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts'

export default function RetentionChart({ data, currentN }) {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid stroke="#E4E1D8" vertical={false} />
          <XAxis
            dataKey="n"
            tick={{ fontSize: 12, fontFamily: 'IBM Plex Mono', fill: '#82878D' }}
            label={{ value: 'Facts stored (N)', position: 'insideBottom', offset: -2, fontSize: 12, fill: '#4A4F55' }}
          />
          <YAxis
            domain={[0, 1]}
            tickFormatter={(v) => `${Math.round(v * 100)}%`}
            tick={{ fontSize: 12, fontFamily: 'IBM Plex Mono', fill: '#82878D' }}
          />
          <Tooltip
            formatter={(v) => `${(v * 100).toFixed(1)}%`}
            labelFormatter={(n) => `N = ${n} facts`}
            contentStyle={{ fontFamily: 'IBM Plex Sans', fontSize: 13, borderRadius: 2 }}
          />
          <Legend wrapperStyle={{ fontSize: 13, fontFamily: 'IBM Plex Sans' }} />
          {currentN && (
            <ReferenceLine x={currentN} stroke="#82878D" strokeDasharray="4 4" />
          )}
          <Line
            type="monotone"
            dataKey="fullAccuracy"
            name="Full Attention"
            stroke="#2A5FE8"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
          <Line
            type="monotone"
            dataKey="linearAccuracy"
            name="Linear Attention"
            stroke="#C7791A"
            strokeWidth={2.5}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
