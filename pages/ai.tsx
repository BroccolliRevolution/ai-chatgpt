import { useEffect, useState } from "react"

import { Button, Container, TextField } from "@mui/material"
import { useSpeechContext } from "@speechly/react-client"
import useSpeechSynthesis from "../components/speech/useSpeechSynthesis"

function Speechly() {
  // const { listening, segment, attachMicrophone, start, stop } =
  //   useSpeechContext()
  const { segment, listening, attachMicrophone, start, stop } =
    useSpeechContext()
  const [transcripts, setTranscripts] = useState<string[]>([])
  const [tentative, setTentative] = useState<string>("")

  // Make sure that you call `attachMicrophone` from a user initiated
  // action handler, like a button press.

  useEffect(() => {
    if (segment) {
      const transcript = segment.words.map((word) => word.value).join(" ")
      setTentative(transcript)
      if (segment.isFinal) {
        setTentative("")
        // @ts-ignore
        setTranscripts((current) => [...current, segment])
      }
    }
  }, [segment])

  const handleClick = async () => {
    if (listening) {
      await stop()
    } else {
      await attachMicrophone()
      await start()
    }
  }

  return (
    <div>
      <Button variant="contained" onClick={handleClick}>
        {listening ? "Stop" : "Start"} microphone
      </Button>
      <div>
        {transcripts.map((transcript, i) => (
          <p key={transcript + i}>
            {/* <pre>{JSON.stringify(transcript, null, 4)}</pre> */}
          </p>
        ))}
        <em>{tentative}</em>
      </div>
    </div>
  )
}

function TextToSpeech() {
  const [value, setValue] = useState("")
  const { speak, cancel, speaking } = useSpeechSynthesis()

  return (
    <div>
      <TextField
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <pre>{JSON.stringify(speaking, null, 4)}</pre>
      <Button onClick={() => speak({ text: value, rate: 1.1 })}>Speak</Button>
      <Button onClick={cancel}>Cancel</Button>
    </div>
  )
}
function Yipiay() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <div>
        {/* <WhisperAi
          onTranscribe={(d) => console.log("+++++++++++" + d)}
        ></WhisperAi> */}
        {/* <Speechly></Speechly> */}
        {/* <TextToSpeech></TextToSpeech> */}
      </div>
    </div>
  )
}

export default function Ai() {
  return (
    <Container>
      <div
        className="flex flex-col gap-12"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          margin: "0 auto",
        }}
      >
        <div className="">
          <Yipiay />
        </div>
      </div>
    </Container>
  )
}
