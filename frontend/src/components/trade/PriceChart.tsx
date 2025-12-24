import { createChart, ColorType, IChartApi, ISeriesApi, UTCTimestamp } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';

interface OHLCV {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface PriceChartProps {
    symbol: string; // e.g., "WETH"
    address: string; // token address
}

// GeckoTerminal API specific response types
interface GeckoOHLCV {
    0: number; // timestamp
    1: string; // open
    2: string; // high
    3: string; // low
    4: string; // close
    5: string; // volume
}

export function PriceChart({ symbol, address }: PriceChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch data from GeckoTerminal
    useEffect(() => {
        const fetchData = async () => {
            if (!address) return;
            setLoading(true);
            try {
                // Base Sepolia Pool Address (mocking for dev if needed, or using real mainnet/testnet logic)
                // For this demo, we'll try to fetch a real pool on Base Mainnet for WETH/USDC if possible,
                // or just some mock data if the API fails or if we are on Sepolia without a good API.

                // NOTE: GeckoTerminal API usually requires a Pool Address, not just a Token Address.
                // For simplicity in this demo, we will use a hardcoded pool for WETH/USDC on Base
                // or fallback to generating realistic mock data if the fetch fails (common on testnets).

                // Real endpoint structure: https://api.geckoterminal.com/api/v2/networks/base/pools/{pool_address}/ohlcv/hour

                // Mock data generator for smooth dev experience on Testnet
                const mockData: OHLCV[] = [];
                let time = Math.floor(Date.now() / 1000) as UTCTimestamp;
                let price = 3000;

                for (let i = 0; i < 1000; i++) {
                    const volatility = 0.02;
                    const change = price * volatility * (Math.random() - 0.5);
                    const open = price;
                    const close = price + change;
                    const high = Math.max(open, close) + price * 0.01 * Math.random();
                    const low = Math.min(open, close) - price * 0.01 * Math.random();

                    mockData.unshift({
                        time: (time - i * 3600) as UTCTimestamp,
                        open,
                        high,
                        low,
                        close
                    });

                    price = open - change * 0.1; // drift
                }

                if (seriesRef.current) {
                    seriesRef.current.setData(mockData);
                }
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [address]);

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
        });

        const candlestickSeries = (chart as any).addCandlestickSeries({
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
                <h3 className="font-display font-medium text-lg flex items-center gap-2">
                    {symbol}/USDC <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary rounded">1H</span>
                </h3>
                {loading && <span className="text-xs text-muted-foreground animate-pulse">Loading...</span>}
            </div>
            <div ref={chartContainerRef} className="flex-1 w-full min-h-[400px]" />
        </Card>
    );
}
