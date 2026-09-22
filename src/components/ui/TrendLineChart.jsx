import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

// data: [{ month, Meetings, Emails, Calls, Events }]
// lines: [{ key, color }]
export default function TrendLineChart({ data, lines }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E4E8EF" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#0F213680' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: '#0F213680' }} axisLine={false} tickLine={false} />
          <Tooltip />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: '12px' }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
