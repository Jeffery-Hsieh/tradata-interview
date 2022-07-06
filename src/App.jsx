import "./App.scss";
import { useState, useRef } from "react";
import useGetData from "./hooks/useGetData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";
import { STAT_TYPES, TOTAL_COLUMNS, STAT_CHART_SETTINGS } from "./consts";
import { numberFormatter } from "./utils";

const getChartData = (chartData) => {
  const barChartData = chartData.reduce(
    (prevChartData, currentData) => {
      const { type: statType, value } = currentData;
      const { column } = STAT_CHART_SETTINGS[statType];

      if (column !== undefined) {
        const copyChartData = [...prevChartData];
        const columnData = copyChartData[column];

        copyChartData[column] = {
          ...columnData,
          [statType]: value,
        };

        return copyChartData;
      }

      return prevChartData;
    },
    Array.from({ length: TOTAL_COLUMNS }).map((_, index) => {
      return { column: index };
    })
  );

  return barChartData;
};

const BAR_SIZE = 32;

function App() {
  const { data: chartData, isLoading } = useGetData();

  const tooltipRef = useRef(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [tooltipText, setTooltipText] = useState({});
  const [offset, setOffset] = useState(0);

  const [isSelected, setIsSelected] = useState(false);

  if (!chartData || isLoading) {
    return <div>isLoading...</div>;
  }

  const legends = chartData.map(({ type, description }) => {
    const { color } = STAT_CHART_SETTINGS[type];
    return (
      <div className="legend" key={description}>
        <div className="legend__color" style={{ backgroundColor: color }}></div>
        <div className="legend__text">{description}</div>
      </div>
    );
  });

  const onMouseEnter = (barChartEvent) => {
    if (!isSelected) {
      const { x, payload } = barChartEvent;
      const statType = Object.keys(payload).find((key) =>
        STAT_TYPES.includes(key)
      );

      const statData = chartData.find((stat) => stat.type === statType);

      const { description, value } = statData;
      const currencyFormatter = new Intl.NumberFormat("en-US");

      setTooltipText({
        description,
        value: `$${currencyFormatter.format(value)}`,
      });
      setSelectedType(statType);

      const offset = x + BAR_SIZE / 2 - tooltipRef.current.offsetWidth / 2;
      setOffset(offset);
      setIsTooltipOpen(true);
    }
  };

  const onMouseLeave = () => {
    if (!isSelected) {
      setIsTooltipOpen(false);
    }
  };

  const onClick = () => {
    setIsSelected((prev) => !prev);
  };

  const positiveData = chartData.filter((data) => data.value >= 0);
  const negativeData = chartData.filter((data) => data.value < 0);

  const positiveBars = positiveData.map(({ type }) => ({
    key: type,
    dataKey: type,
    fill: STAT_CHART_SETTINGS[type].color,
    fillOpacity: isTooltipOpen && selectedType !== type ? 0.3 : 1,
  }));
  const negativeBars = negativeData.map(({ type }) => ({
    key: type,
    dataKey: type,
    fill: STAT_CHART_SETTINGS[type].color,
    fillOpacity: isTooltipOpen && selectedType !== type ? 0.3 : 1,
  }));

  const positiveBarChartData = getChartData(positiveData);
  const negativeBarChartData = getChartData(negativeData);

  const { description, value } = tooltipText;

  return (
    <div className="card">
      <h2 className="card__title">圖表標題</h2>
      <p className="card__text">
        那明感頭政、合行利更有動不！議突創天海來、發心們有多，把有灣展子幾上國陸不真傳數
      </p>
      <div className="card__tooltip">
        <div
          className="card__tooltip--text"
          ref={tooltipRef}
          style={{
            transform: `translate(${offset}px)`,
            visibility: isTooltipOpen ? "visible" : "hidden",
          }}
        >
          <div>{description}</div>
          <div className="card__tooltip--currency">{value}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart
          barSize={BAR_SIZE}
          data={positiveBarChartData}
          stackOffset="sign"
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <XAxis hide={true} />
          <YAxis
            type="number"
            ticks={[271000, 0]}
            interval={0}
            tickFormatter={numberFormatter}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={0} />
          {positiveBars.map((barProps) => (
            <Bar
              stackId="1"
              radius={[5, 5, 0, 0]}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={onClick}
              {...barProps}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer
        width="100%"
        height={50}
        className="barChartContainer__negative"
      >
        <BarChart
          barSize={32}
          data={negativeBarChartData}
          stackOffset="sign"
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
        >
          <XAxis hide={true} />
          <YAxis
            type="number"
            ticks={[0, -800]}
            interval={0}
            tickFormatter={numberFormatter}
            axisLine={false}
            tickLine={false}
          />
          {negativeBars.map((barProps) => (
            <Bar
              stackId="2"
              radius={[5, 5, 0, 0]}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onClick={onClick}
              {...barProps}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <div className="card__footer">{legends}</div>
    </div>
  );
}

export default App;
