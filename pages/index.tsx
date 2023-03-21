import { Page, Text } from "@vercel/examples-ui"
import { useState } from "react"
import { Chat } from "../components/Chat"

function Home() {
  const [transcript, setTranscript] = useState("")
  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        {/* <Text variant="h1">OpenAI GPT-3 What is this stuff</Text> */}
      </section>

      <section className="flex flex-col gap-3">
        {/* <Text variant="h2">AI Chat Bot:</Text> */}
        <div className="lg:w-2/3">
          <Chat transcript={transcript} onMessage={(d) => console.log(d)} />
          <div>
            {/* <WhisperAi onTranscribe={setTranscript}></WhisperAi> */}
          </div>
        </div>
      </section>
    </Page>
  )
}

export default Home
