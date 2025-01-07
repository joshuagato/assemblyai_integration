import { AssemblyAI } from 'assemblyai'

const client = new AssemblyAI({
    apiKey: '21f5f08bb661498d8f74b2fa53e82ab1'
})

// You can use a local filepath:
// const audioFile = "./example.mp3"

// Or use a publicly-accessible URL:
// const audioFile = 'https://assembly.ai/sports_injuries.mp3'
const audioFile = './RiskSpot.mp4'

const params = {
    audio: audioFile,
    speaker_labels: true
}

// @ts-ignore
const run = async () => {
    const transcript = await client.transcripts.transcribe(params)

    if (transcript.status === 'error') {
        console.error(`Transcription failed: ${transcript.error}`)
        process.exit(1)
    }

    console.log(transcript.text)

    for (let utterance of transcript.utterances) {
        console.log(`Speaker ${utterance.speaker}: ${utterance.text}`)
    }
}

run()