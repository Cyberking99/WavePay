import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { baseSepolia } from '@reown/appkit/networks'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode } from 'react'

// 1. Get projectId at https://cloud.reown.com
const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

// 2. Create a metadata object - optional
const metadata = {
    name: 'WavePay',
    description: 'WavePay - Blockchain Stablecoin Payments',
    url: 'https://wave-pay.vercel.app', // origin must match your domain & subdomain
    icons: ['https://wave-pay.vercel.app/favicon.ico']
}

// 3. Set the networks
const networks = [baseSepolia]

// 4. Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
    networks,
    projectId,
    ssr: true
})

// 5. Create modal
createAppKit({
    adapters: [wagmiAdapter],
    networks,
    projectId,
    metadata,
    features: {
        analytics: true // Optional - defaults to your Cloud configuration
    }
})

export function ContextProvider({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient()

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    )
}
