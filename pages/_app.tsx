import type { AppProps } from "next/app"
import { Analytics } from "@vercel/analytics/react"

import "@vercel/examples-ui/globals.css"
import { SpeechProvider } from "@speechly/react-client"
import { QueryClient, QueryClientProvider } from "react-query"
import Layout from "../components/layout"

function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()
  return (
    <SpeechProvider
      appId="6fa937e3-7829-45a8-a4bc-eb911692a739"
      debug
      logSegments
    >
      <QueryClientProvider client={queryClient}>
        <div>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          <Analytics />
        </div>
      </QueryClientProvider>
    </SpeechProvider>
  )
}

export default App
