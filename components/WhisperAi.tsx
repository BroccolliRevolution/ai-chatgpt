import { useEffect } from "react"

import { useWhisper } from "@chengsokdara/use-whisper"
import { Button } from "@mui/material"

type Props = {
  onTranscribe: (text: any) => any
}
export const WhisperAi = ({ onTranscribe }: Props) => {
  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  })

  useEffect(() => {
    console.log("AAAAAAAAa")

    if (!transcript.text || transcribing) return
    console.log(transcript.text)
    onTranscribe(transcript.text)
  }, [onTranscribe, transcribing, transcript.text])

  const status = () => {
    if (recording) {
      return "Recording..."
    } else if (speaking) {
      return "Speaking..."
    }
    return "Idle"
  }

  return (
    <div className="max-w-md">
      {/* <pre>{JSON.stringify(recording, null, 4)}</pre> */}
      {/* <p>Transcribed Text: {transcript.text}</p> */}

      {recording ? (
        <Button
          style={{ background: "navy", color: "white" }}
          fullWidth={true}
          onClick={() => {
            stopRecording()
          }}
        >
          Save Recording
        </Button>
      ) : (
        <Button
          style={{ background: "orange", color: "black" }}
          fullWidth={true}
          onClick={() => startRecording()}
        >
          Say Something
        </Button>
      )}

      {/* <Button onClick={() => pauseRecording()}>Pause</Button> */}

      {/* <p className="text-teal-600">Transcript: {status()}</p> */}
    </div>
  )
}
