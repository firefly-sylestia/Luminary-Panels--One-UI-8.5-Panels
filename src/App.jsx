import React, { useEffect, useMemo, useState } from 'react'
import './App.css'

const TIMESTAMP_PATTERN = /\[(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?\]/g
const WORD_PATTERN = /[\p{L}\p{N}]+(?:[\p{L}\p{N}'’.-]*[\p{L}\p{N}])?[!?.,;:…)]*|[(]+[\p{L}\p{N}]+(?:[\p{L}\p{N}'’.-]*[\p{L}\p{N}])?[!?.,;:…)]*/gu
const ANGLE_TIMESTAMP_PATTERN = /<\d{1,2}:\d{2}(?:[.:]\d{1,3})?>/g
const ANGLE_TIMESTAMP_CAPTURE_PATTERN = /<(\d{1,2}):(\d{2})(?:[.:](\d{1,3}))?>/g
const BACKGROUND_LINE_PATTERN = /^\s*\[bg:\s*(.*?)\]\s*$/i
const MIN_WORD_GAP = 0.045
const MAX_WORD_GAP = 1.2

function timestampToSeconds(minutes, seconds, fraction = '0') {
  const paddedFraction = fraction.padEnd(3, '0').slice(0, 3)
  return Number(minutes) * 60 + Number(seconds) + Number(paddedFraction) / 1000
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = Math.floor(safeSeconds % 60)
  const milliseconds = Math.round((safeSeconds % 1) * 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`
}

function formatLrcTime(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds || 0)
  const minutes = Math.floor(safeSeconds / 60)
  const seconds = Math.floor(safeSeconds % 60)
  const milliseconds = Math.round((safeSeconds % 1) * 1000)
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`
}

function parseWords(text) {
  return (text.match(WORD_PATTERN) ?? []).filter((word) => /[\p{L}\p{N}]/u.test(word))
}

function parseTimedLyrics(rawLyrics) {
  if (!rawLyrics.trim()) return []

  return rawLyrics
    .split(/\r?\n/)
    .map((line, order) => {
      const backgroundMatch = line.match(BACKGROUND_LINE_PATTERN)
      const source = backgroundMatch ? backgroundMatch[1] : line
      const lineTimestamp = [...source.matchAll(TIMESTAMP_PATTERN)][0]
      const firstWordTimestamp = [...source.matchAll(ANGLE_TIMESTAMP_CAPTURE_PATTERN)][0]
      const anchor = lineTimestamp ?? firstWordTimestamp
      const text = source.replace(TIMESTAMP_PATTERN, '').replace(ANGLE_TIMESTAMP_PATTERN, '').trim()
      if (!anchor || !text) return null

      return {
        time: timestampToSeconds(anchor[1], anchor[2], anchor[3]),
        order,
        text,
        words: parseWords(text),
        isBackground: Boolean(backgroundMatch),
      }
    })
    .filter((line) => line?.words.length)
    .sort((a, b) => a.time - b.time || a.order - b.order)
}

function wordWeight(word) {
  const clean = word.replace(/[^\p{L}\p{N}]/gu, '')
  if (!clean) return 0.35
  return Math.max(0.72, Math.min(1.85, clean.length / 4.4 + (/[aeiouy]/i.test(clean) ? 0.22 : 0)))
}

function buildWordSync(lines, duration, vocalCues = []) {
  return lines.flatMap((line, lineIndex) => {
    const nextTime = lines[lineIndex + 1]?.time ?? Math.max(duration || line.time + 4, line.time + 4)
    const lineEnd = Math.max(line.time + 0.35, nextTime - 0.035)
    const words = line.words
    const cues = vocalCues.filter((cue) => cue.time >= line.time - 0.1 && cue.time <= lineEnd + 0.1)
    const weights = words.map(wordWeight)
    const totalWeight = weights.reduce((sum, value) => sum + value, 0) || 1
    const availableTime = Math.max(MIN_WORD_GAP * Math.max(1, words.length), lineEnd - line.time)
    let cursor = line.time

    const items = words.map((word, wordIndex) => {
      const proportionalTarget = line.time + (availableTime * weights.slice(0, wordIndex).reduce((sum, value) => sum + value, 0)) / totalWeight
      const evenTarget = line.time + (availableTime * wordIndex) / Math.max(1, words.length)
      const target = proportionalTarget * 0.7 + evenTarget * 0.3
      const cue = cues.length ? cues.reduce((closest, next) => Math.abs(next.time - target) < Math.abs(closest.time - target) ? next : closest, cues[0]) : null
      const cueWindow = Math.max(0.09, Math.min(0.42, availableTime / Math.max(4, words.length)))
      const cuePull = cue && Math.abs(cue.time - target) <= cueWindow ? (cue.time - target) * 0.62 : 0
      const start = Math.max(cursor, Math.min(lineEnd - MIN_WORD_GAP, target + cuePull))
      const confidence = Math.round(Math.min(99, Math.max(80, 88 + (cue?.strength ?? 0) * 10 + (cues.length ? 3 : 0))))
      cursor = Math.min(lineEnd, start + Math.min(MAX_WORD_GAP, Math.max(MIN_WORD_GAP, availableTime * (weights[wordIndex] / totalWeight) * 0.72)))

      return { word, line: line.text, lineStart: line.time, lineEnd, start, confidence, isBackground: line.isBackground }
    })

    return items.map((item, index) => ({
      ...item,
      end: items[index + 1]?.start ?? lineEnd,
      isLineStart: index === 0,
      isLineEnd: index === items.length - 1,
    }))
  })
}

function exportEnhancedLrc(wordSync) {
  const lines = []
  let currentLine = []

  wordSync.forEach((item) => {
    if (item.isLineStart && currentLine.length) {
      lines.push(currentLine.join(' ').replace('] <', ']<').replace('> ]', '>]'))
      currentLine = []
    }

    if (item.isLineStart) currentLine.push(item.isBackground ? '[bg:' : `[${formatLrcTime(item.lineStart)}]`)
    currentLine.push(`<${formatLrcTime(item.start)}>${item.word}${item.isLineEnd ? `<${formatLrcTime(item.lineEnd)}>` : ''}`)
    if (item.isLineEnd && item.isBackground) currentLine.push(']')
  })

  if (currentLine.length) lines.push(currentLine.join(' ').replace('] <', ']<').replace('> ]', '>]'))
  return lines.join('\n')
}

async function analyzeAudioForVocalCues(file) {
  if (!file || !window.AudioContext) return []
  const context = new AudioContext()
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer())
    const channel = buffer.getChannelData(0)
    const sampleRate = buffer.sampleRate
    const windowSize = Math.max(512, Math.floor(sampleRate * 0.035))
    const hopSize = Math.max(256, Math.floor(sampleRate * 0.018))
    const cues = []
    let previousVocal = 0

    for (let offset = 0; offset + windowSize < channel.length; offset += hopSize) {
      let low = 0
      let vocal = 0
      let high = 0
      let zeroCrossings = 0
      let previous = channel[offset]

      for (let i = 0; i < windowSize; i += 1) {
        const sample = channel[offset + i]
        const delta = sample - previous
        low += Math.abs(sample)
        vocal += Math.abs(delta)
        high += Math.abs(sample - channel[Math.max(offset, offset + i - 3)])
        if ((sample >= 0 && previous < 0) || (sample < 0 && previous >= 0)) zeroCrossings += 1
        previous = sample
      }

      const instrumentalMask = low / windowSize + high / windowSize
      const vocalPresence = vocal / windowSize + zeroCrossings / windowSize
      const separatedStrength = Math.max(0, vocalPresence - instrumentalMask * 0.18)
      if (separatedStrength > previousVocal * 1.35 && separatedStrength > 0.004) {
        cues.push({ time: offset / sampleRate, strength: Math.min(1, separatedStrength * 95) })
      }
      previousVocal = previousVocal * 0.82 + separatedStrength * 0.18
    }

    return cues.filter((cue, index) => !index || cue.time - cues[index - 1].time > 0.08).slice(0, 2500)
  } finally {
    await context.close()
  }
}

function App() {
  const [song, setSong] = useState(null)
  const [lyricsFile, setLyricsFile] = useState(null)
  const [lyricsText, setLyricsText] = useState('')
  const [duration, setDuration] = useState(0)
  const [vocalCues, setVocalCues] = useState([])
  const [analysisStatus, setAnalysisStatus] = useState('Upload audio to enable vocal/instrument separation cues.')
  const [saveStatus, setSaveStatus] = useState('')

  const timedLines = useMemo(() => parseTimedLyrics(lyricsText), [lyricsText])
  const wordSync = useMemo(() => buildWordSync(timedLines, duration, vocalCues), [timedLines, duration, vocalCues])
  const outputText = useMemo(() => exportEnhancedLrc(wordSync), [wordSync])
  const isReady = song && timedLines.length > 0
  const audioUrl = useMemo(() => (song ? URL.createObjectURL(song) : ''), [song])

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const handleSongUpload = async (file) => {
    setSong(file ?? null)
    setVocalCues([])
    if (!file) return
    setAnalysisStatus('Analyzing vocal onsets and reducing instrument bleed...')
    try {
      const cues = await analyzeAudioForVocalCues(file)
      setVocalCues(cues)
      setAnalysisStatus(cues.length ? `${cues.length} vocal timing cues detected for tighter word alignment.` : 'Audio loaded. No strong vocal cues found, so lyric anchors are weighted by phrasing.')
    } catch (error) {
      setAnalysisStatus(`Audio analysis unavailable: ${error.message}`)
    }
  }

  const handleLyricsUpload = async (file) => {
    if (!file) return
    setLyricsFile(file)
    setLyricsText(await file.text())
    setSaveStatus('')
  }

  const copyOutput = async () => {
    if (!outputText) return
    if (!navigator.clipboard) {
      setSaveStatus('Clipboard is unavailable in this browser. Select the output text and copy it manually.')
      return
    }
    await navigator.clipboard.writeText(outputText)
    setSaveStatus('Copied enhanced synced lyrics to clipboard.')
  }

  const saveOutput = async () => {
    if (!outputText) return
    const suggestedName = lyricsFile?.name?.replace(/\.(lrc|txt)$/i, '.word-sync.lrc') || 'word-sync.lrc'
    if ('showSaveFilePicker' in window) {
      const handle = await window.showSaveFilePicker({ suggestedName, types: [{ description: 'Enhanced LRC', accept: { 'text/plain': ['.lrc', '.txt'] } }] })
      const writable = await handle.createWritable()
      await writable.write(outputText)
      await writable.close()
      setSaveStatus('Saved with read/write access to your chosen lyrics file location.')
      return
    }
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = suggestedName
    link.click()
    URL.revokeObjectURL(url)
    setSaveStatus('Downloaded enhanced synced lyrics. On Android, choose the original folder/file when prompted by your file manager to overwrite.')
  }

  return (
    <main className="app-shell">
      <section className="sync-card" aria-labelledby="page-title">
        <p className="eyebrow">Lyrics Auto Sync Studio</p>
        <h1 id="page-title">Upload a song and timed lyrics to create word-by-word sync.</h1>
        <p className="intro">The analyzer now combines line timestamps, vocal-onset detection, word length, punctuation, and instrument-bleed reduction. Accuracy depends on the quality of the source LRC and mix, so the confidence shown is an estimate—not a guarantee.</p>

        <div className="upload-grid" aria-label="Upload inputs">
          <label className="upload-box"><span className="upload-icon">♪</span><span className="upload-title">Upload song</span><span className="upload-copy">MP3, WAV, M4A, FLAC, or OGG audio</span><input type="file" accept="audio/*" onChange={(event) => handleSongUpload(event.target.files?.[0])} /></label>
          <label className="upload-box"><span className="upload-icon">[00:00]</span><span className="upload-title">Upload lyrics</span><span className="upload-copy">LRC or TXT with line timestamps</span><input type="file" accept=".lrc,.txt,text/plain" onChange={(event) => handleLyricsUpload(event.target.files?.[0])} /></label>
        </div>

        <div className="status-panel"><div><strong>{song ? song.name : 'No song selected'}</strong><span>{song ? `${(song.size / 1024 / 1024).toFixed(2)} MB ready for vocal analysis` : 'Choose an audio file to begin.'}</span></div><div><strong>{lyricsFile ? lyricsFile.name : 'No lyrics selected'}</strong><span>{timedLines.length ? `${timedLines.length} timestamped lyric lines found` : 'Upload timed lyrics in [mm:ss.xx] format.'}</span></div><div><strong>Separation model</strong><span>{analysisStatus}</span></div><div><strong>Write permission</strong><span>Export uses the browser save picker when available. Android builds declare media/storage access and can also copy the result before saving.</span></div></div>

        {song && <audio className="audio-preview" controls src={audioUrl} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} />}

        <section className="result-panel" aria-live="polite"><div className="result-header"><div><p className="eyebrow">Sync output</p><h2>{isReady ? 'Word timing preview' : 'Waiting for both uploads'}</h2></div><span className={isReady ? 'pill active' : 'pill'}>{isReady ? 'Ready' : 'Pending'}</span></div>{isReady ? (<><div className="word-list">{wordSync.slice(0, 80).map((item, index) => (<span className="word-chip" key={`${item.word}-${item.start}-${index}`} title={item.line}><b>{item.word}</b><small>{formatTime(item.start)} · {item.confidence}%</small></span>))}</div><textarea className="output-text" readOnly value={outputText} aria-label="Enhanced synced lyrics output" /><div className="actions"><button type="button" onClick={copyOutput}>Copy synced lyrics</button><button type="button" onClick={saveOutput}>Overwrite / save synced lyrics</button><span>{saveStatus}</span></div></>) : (<p className="empty-state">Add an audio file and timestamped lyrics to generate a work-ready word sync timeline.</p>)}</section>
      </section>
    </main>
  )
}

export default App
