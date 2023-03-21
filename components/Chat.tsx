import styled from "@emotion/styled"
import { Button, Card, TextField } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { useCookies } from "react-cookie"
import { ChatLine, LoadingChatLine, type ChatGPTMessage } from "./ChatLine"
import useSpeechSynthesis from "./speech/useSpeechSynthesis"
import { WhisperAi } from "./WhisperAi"
// import { useTranscript } from "./utils"

const COOKIE_NAME = "nextjs-example-ai-chat-gpt3"

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am a friendly AI assistant. Ask me anything!",
  },
]

const InputMessage = ({ input, setInput, sendMessage }: any) => (
  <div className="flex-auto bg-center">
    <TextField
      multiline={true}
      rows={5}
      fullWidth={true}
      value={input}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          sendMessage(input)
          setInput("")
        }
      }}
      onChange={(e) => {
        setInput(e.target.value)
      }}
    />
  </div>
)

type Props = {
  onMessage: (message: string) => void
  transcript: string
}

export function Chat({ onMessage, transcript }: Props) {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages)
  const [input, setInput] = useState("")
  const [speachRate, setSpeachRate] = useState(1.1)
  const [loading, setLoading] = useState(false)
  const [cookie, setCookie] = useCookies([COOKIE_NAME])

  const messagesEndRef = useRef(null)

  const { speak, cancel, speaking } = useSpeechSynthesis()

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!cookie[COOKIE_NAME]) {
      // generate a semi random short id
      const randomId = Math.random().toString(36).substring(7)
      setCookie(COOKIE_NAME, randomId)
    }
  }, [cookie, setCookie])

  // send message to API /api/chat endpoint
  const sendMessage = useCallback(
    async (message: string) => {
      setLoading(true)
      const newMessages = [
        ...messages,
        { role: "user", content: message } as ChatGPTMessage,
      ]

      console.log("SEND MESSAGES")

      const last10messages = newMessages.slice(-10) // remember last 10 messages

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: last10messages,
          user: cookie[COOKIE_NAME],
        }),
      })

      console.log("Edge function returned.")

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      // This data is a ReadableStream
      const data = response.body
      if (!data) {
        return
      }

      const reader = data.getReader()
      const decoder = new TextDecoder()
      let done = false

      let lastMessage = ""

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)

        lastMessage = lastMessage + chunkValue
      }
      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ])

      setLoading(false)
      onMessage(lastMessage)

      speak({ text: lastMessage, rate: speachRate })

      return lastMessage
    },
    [cookie, messages, onMessage, speachRate, speak]
  )

  return (
    <Wrapper>
      <div>
        {messages.map(({ content, role }, index) => (
          <ChatLine key={index} role={role} content={content} />
        ))}

        {loading && <LoadingChatLine />}

        {messages.length < 2 && (
          <span className="mx-auto flex flex-grow text-gray-600 clear-both">
            Type a message to start the conversation
          </span>
        )}
      </div>
      <Card>
        <InputMessage
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
        />
      </Card>
      <Buttons>
        <div ref={messagesEndRef} />
        <Button
          disabled={!speaking}
          variant="outlined"
          onClick={() => cancel()}
        >
          Stop Reading
        </Button>
        <WhisperAi onTranscribe={setInput}></WhisperAi>
        <Button
          disabled={input.length < 5}
          color="info"
          fullWidth={true}
          variant="contained"
          style={{ background: "green", width: 120 }}
          type="submit"
          onClick={() => {
            sendMessage(input)
            setInput("")
          }}
        >
          Ask The robot
        </Button>
      </Buttons>
      <Buttons style={{ justifyContent: "flex-start" }}>
        <span style={{ margin: 5 }}>Speed:</span>
        <Button
          variant={speachRate == 1.0 ? "outlined" : "text"}
          onClick={() => setSpeachRate(1.0)}
        >
          1.0x
        </Button>
        <Button
          variant={speachRate == 1.1 ? "outlined" : "text"}
          onClick={() => setSpeachRate(1.1)}
        >
          1.1x
        </Button>
        <Button
          variant={speachRate == 1.2 ? "outlined" : "text"}
          onClick={() => setSpeachRate(1.2)}
        >
          1.2x
        </Button>
        <Button
          variant={speachRate == 1.3 ? "outlined" : "text"}
          onClick={() => setSpeachRate(1.3)}
        >
          1.3x
        </Button>
      </Buttons>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  max-width: 600px;
  display: flex;
  flex-direction: column;
`
const Buttons = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`
