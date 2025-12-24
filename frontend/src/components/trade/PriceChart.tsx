import { createChart, ColorType, IChartApi, ISeriesApi, UTCTimestamp, CandlestickSeries } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { fetchOHLCV, Timeframe } from '@/lib/blockchain/exchange';

interface PriceChartProps {
    symbol: string;
    poolAddress: string | null;
}

export function PriceChart({ symbol, poolAddress }: PriceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [loading, setLoading] = useState(false);
    const [timeframe, setTimeframe] = useState<Timeframe>('1H');

    // Fetch data from GeckoTerminal
    useEffect(() => {
        const fetchData = async () => {
            if (!poolAddress) return;
            setLoading(true);
            try {
                // Fetch OHLCV data for the pool
                const data = await fetchOHLCV(poolAddress, timeframe);

                if (seriesRef.current) {
                    // Map time to UTCTimestamp
                    const validData = data.map(d => ({
                        ...d,
                        time: d.time as UTCTimestamp
                    }));
                    seriesRef.current.setData(validData);
                }
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [poolAddress, timeframe]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: 'transparent' },
                textColor: '#9ca3af',
            },
            grid: {
                vertLines: { color: '#1f2937' },
                horzLines: { color: '#1f2937' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            }
        });

        const candlestickSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
        });

        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, []);

    return (
        <Card className="p-4 border-border bg-card/50 backdrop-blur-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h3 className="font-display font-medium text-lg flex items-center gap-2">
                        {symbol}/USDC
                    </h3>
                    <div className="flex bg-secondary/30 rounded-lg p-1 gap-1">
                        {(['15m', '1H', '4H', '1D'] as Timeframe[]).map((tf) => (
                            <button
                                key={tf}
                                onClick={() => setTimeframe(tf)}
                                className={`px-2 py-1 text-xs rounded-md transition-all ${timeframe === tf
                                        ? 'bg-background text-foreground shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tf}
                            </button>
                        ))}
                    </div>
                </div>
                {loading && <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>}
            </div>
            <div ref={chartContainerRef} className="flex-1 w-full min-h-[200px]" />
        </Card>
    );
}
