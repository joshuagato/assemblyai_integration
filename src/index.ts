// import { Readable } from 'stream'
import { AssemblyAI, RealtimeTranscript } from 'assemblyai'
import { SoxRecording } from './sox.js'

const run = async () => {
    const client = new AssemblyAI({
        // apiKey: '759ff5438d1f4b5897d716bce6940e8b'
        apiKey: '21f5f08bb661498d8f74b2fa53e82ab1'
    })

    const SAMPLE_RATE = 48_000

    const transcriber = client.realtime.transcriber({
        sampleRate: SAMPLE_RATE
    })

    transcriber.on('open', ({ sessionId }) => {
        console.log(`Session opened with ID: ${sessionId}`)
    })

    transcriber.on('error', (error: Error) => {
        console.error('Error:', error)
    })

    transcriber.on('close', (code: number, reason: string) =>
        console.log('Session closed:', code, reason)
    )

    transcriber.on('transcript', (transcript: RealtimeTranscript) => {
        if (!transcript.text) {
            return
        }

        if (transcript.message_type === 'PartialTranscript') {
            console.log('Partial:', transcript.text)
        } else {
            console.log('Final:', transcript.text)
        }
    })

    console.log('Connecting to real-time transcript service')
    await transcriber.connect()

    console.log('Starting recording')
    const recording = new SoxRecording({
        channels: 1,
        sampleRate: SAMPLE_RATE,
        audioType: 'wav' // Linear PCM
    })

    recording.stream().pipeTo(transcriber.stream())

    // Stop recording and close connection using Ctrl-C.
    process.on('SIGINT', async function () {
        console.log()
        console.log('Stopping recording')
        recording.stop()

        console.log('Closing real-time transcript connection')
        await transcriber.close()

        process.exit()
    })
}

run()