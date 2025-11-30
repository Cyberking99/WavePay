import { APP_NAME, APP_DESCRIPTION, APP_ICON, APP_URL, SUPPORTED_NETWORKS } from '@/lib/constants'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { ReactNode } from 'react'

const projectId = import.meta.env.VITE_REOWN_PROJECT_ID

const metadata = {
    name: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    icons: [APP_ICON]
}

const wagmiAdapter = new WagmiAdapter({
    networks: SUPPORTED_NETWORKS,
    projectId,
    ssr: true
})

createAppKit({
    adapters: [wagmiAdapter],
    networks: SUPPORTED_NETWORKS,
    projectId,
    metadata,
    features: {
        analytics: true
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
