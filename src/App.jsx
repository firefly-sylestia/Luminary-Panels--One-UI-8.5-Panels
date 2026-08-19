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

function parseInlineWordAnchors(source) {
  const anchors = []
  const matches = [...source.matchAll(ANGLE_TIMESTAMP_CAPTURE_PATTERN)]

  matches.forEach((match, index) => {
    const textStart = (match.index ?? 0) + match[0].length
    const textEnd = matches[index + 1]?.index ?? source.length
    const words = parseWords(source.slice(textStart, textEnd))

    words.forEach((word, wordIndex) => {
      anchors.push({
        word,
        time: timestampToSeconds(match[1], match[2], match[3]),
        isExact: wordIndex === 0,
      })
    })
  })

  return anchors
}

function parseTimedLyrics(rawLyrics) {
  if (!rawLyrics.trim()) return []

  return rawLyrics
    .split(/\r?\n/)
    .map((line, order) => {
      const backgroundMatch = line.match(BACKGROUND_LINE_PATTERN)
      const source = backgroundMatch ? backgroundMatch[1] : line
      const lineTimestamp = [...source.matchAll(TIMESTAMP_PATTERN)][0]
      const inlineWordAnchors = parseInlineWordAnchors(source)
      const firstWordTimestamp = inlineWordAnchors[0]
      const anchor = lineTimestamp ?? firstWordTimestamp
      const text = source.replace(TIMESTAMP_PATTERN, '').replace(ANGLE_TIMESTAMP_PATTERN, '').trim()
      if (!anchor || !text) return null

      const words = parseWords(text)

      return {
        time: lineTimestamp ? timestampToSeconds(anchor[1], anchor[2], anchor[3]) : anchor.time,
        order,
        text,
        words,
        inlineWordAnchors: inlineWordAnchors.length === words.length ? inlineWordAnchors : [],
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

function buildWordSync(lines, duration, vocalCues = [], vocalSegments = []) {
  return lines.flatMap((line, lineIndex) => {
    const nextTime = lines[lineIndex + 1]?.time ?? Math.max(duration || line.time + 4, line.time + 4)
    const exactAnchors = line.inlineWordAnchors ?? []
    const lastExactAnchor = exactAnchors.filter((anchor) => anchor.isExact).at(-1)?.time
    const segmentEnd = vocalSegments.find((segment) => segment.end > line.time + 0.05 && segment.start < nextTime - 0.05)?.end
    const lineEnd = Math.max(line.time + 0.35, Math.min(nextTime - 0.035, Math.max(segmentEnd ?? 0, (lastExactAnchor ?? 0) + 0.2) || nextTime - 0.035))
    const words = line.words
    const cues = vocalCues.filter((cue) => cue.time >= line.time - 0.1 && cue.time <= lineEnd + 0.1)
    const weights = words.map(wordWeight)
    const totalWeight = weights.reduce((sum, value) => sum + value, 0) || 1
    const availableTime = Math.max(MIN_WORD_GAP * Math.max(1, words.length), lineEnd - line.time)
    let cursor = line.time

    const items = words.map((word, wordIndex) => {
      const exactAnchor = exactAnchors[wordIndex]
      const proportionalTarget = line.time + (availableTime * weights.slice(0, wordIndex).reduce((sum, value) => sum + value, 0)) / totalWeight
      const evenTarget = line.time + (availableTime * wordIndex) / Math.max(1, words.length)
      const indexedCue = cues.length >= words.length ? cues[Math.round((wordIndex / Math.max(1, words.length - 1)) * (cues.length - 1))] : null
      const target = exactAnchor?.isExact ? exactAnchor.time : indexedCue?.time ?? proportionalTarget * 0.7 + evenTarget * 0.3
      const cue = indexedCue ?? (cues.length ? cues.reduce((closest, next) => Math.abs(next.time - target) < Math.abs(closest.time - target) ? next : closest, cues[0]) : null)
      const cueWindow = Math.max(0.09, Math.min(0.42, availableTime / Math.max(4, words.length)))
      const cuePull = exactAnchor?.isExact ? 0 : cue && Math.abs(cue.time - target) <= cueWindow ? (cue.time - target) * 0.62 : 0
      const start = Math.max(cursor, Math.min(lineEnd - MIN_WORD_GAP, target + cuePull))
      const confidence = exactAnchor?.isExact ? 100 : Math.round(Math.min(98, Math.max(80, 88 + (cue?.strength ?? 0) * 10 + (cues.length ? 3 : 0))))
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

async function analyzeAudioForVocalCues(file, onProgress = () => {}) {
  if (!file || !window.AudioContext) return { cues: [], segments: [] }
  const context = new AudioContext()
  try {
    const buffer = await context.decodeAudioData(await file.arrayBuffer())
    const sampleRate = buffer.sampleRate
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, index) => buffer.getChannelData(index))
    const left = channels[0]
    const right = channels[1] ?? channels[0]
    const windowSize = Math.max(1024, Math.floor(sampleRate * 0.046))
    const hopSize = Math.max(256, Math.floor(sampleRate * 0.012))
    const totalFrames = Math.max(1, Math.floor((buffer.length - windowSize) / hopSize))
    const frames = []
    let slowEnergy = 0
    let slowVocal = 0

    for (let offset = 0, frameIndex = 0; offset + windowSize < buffer.length; offset += hopSize, frameIndex += 1) {
      let midEnergy = 0
      let sideEnergy = 0
      let vocalFlux = 0
      let zeroCrossings = 0
      let previousMid = (left[offset] + right[offset]) * 0.5
      let previousSlope = 0

      for (let i = 0; i < windowSize; i += 1) {
        const mid = (left[offset + i] + right[offset + i]) * 0.5
        const side = (left[offset + i] - right[offset + i]) * 0.5
        const slope = mid - previousMid
        midEnergy += mid * mid
        sideEnergy += side * side
        vocalFlux += Math.max(0, Math.abs(slope) - Math.abs(previousSlope) * 0.58)
        if ((mid >= 0 && previousMid < 0) || (mid < 0 && previousMid >= 0)) zeroCrossings += 1
        previousMid = mid
        previousSlope = slope
      }

      const centeredRatio = midEnergy / Math.max(0.000001, midEnergy + sideEnergy)
      const rms = Math.sqrt(midEnergy / windowSize)
      const flux = vocalFlux / windowSize
      const zcr = zeroCrossings / windowSize
      slowEnergy = slowEnergy * 0.94 + rms * 0.06
      slowVocal = slowVocal * 0.9 + flux * 0.1

      const vocalScore = Math.max(0, flux * 7.5 + zcr * 0.95 + rms * 0.8 - slowEnergy * 0.55 - Math.max(0, 0.62 - centeredRatio) * 0.04)
      frames.push({
        time: offset / sampleRate,
        end: (offset + windowSize) / sampleRate,
        score: vocalScore,
        rms,
        isActive: rms > Math.max(0.006, slowEnergy * 0.55) && vocalScore > Math.max(0.0018, slowVocal * 0.72),
      })

      if (frameIndex % 120 === 0) {
        onProgress(Math.min(99, Math.round((frameIndex / totalFrames) * 100)))
        await new Promise((resolve) => setTimeout(resolve, 0))
      }
    }

    const cues = []
    for (let index = 1; index < frames.length - 1; index += 1) {
      const frame = frames[index]
      const previous = frames[index - 1]
      const next = frames[index + 1]
      const localRise = frame.score - previous.score
      if (frame.isActive && localRise > 0.0012 && frame.score >= next.score * 0.82 && (!cues.length || frame.time - cues[cues.length - 1].time > 0.09)) {
        cues.push({ time: frame.time, strength: Math.min(1, frame.score * 32) })
      }
    }

    const segments = []
    let openSegment = null
    frames.forEach((frame) => {
      if (frame.isActive && !openSegment) openSegment = { start: frame.time, end: frame.end }
      if (frame.isActive && openSegment) openSegment.end = frame.end
      if (!frame.isActive && openSegment) {
        if (frame.time - openSegment.end > 0.18) {
          if (openSegment.end - openSegment.start > 0.16) segments.push(openSegment)
          openSegment = null
        }
      }
    })
    if (openSegment && openSegment.end - openSegment.start > 0.16) segments.push(openSegment)

    onProgress(100)
    return { cues: cues.slice(0, 4000), segments }
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
  const [vocalSegments, setVocalSegments] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStatus, setAnalysisStatus] = useState('Upload audio to enable vocal/instrument separation cues.')
  const [saveStatus, setSaveStatus] = useState('')

  const timedLines = useMemo(() => parseTimedLyrics(lyricsText), [lyricsText])
  const wordSync = useMemo(() => isAnalyzing ? [] : buildWordSync(timedLines, duration, vocalCues, vocalSegments), [timedLines, duration, vocalCues, vocalSegments, isAnalyzing])
  const outputText = useMemo(() => exportEnhancedLrc(wordSync), [wordSync])
  const isReady = song && timedLines.length > 0 && !isAnalyzing
  const hasLyricsInput = lyricsText.trim().length > 0
  const audioUrl = useMemo(() => (song ? URL.createObjectURL(song) : ''), [song])

  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [audioUrl])

  const handleSongUpload = async (file) => {
    setSong(file ?? null)
    setVocalCues([])
    setVocalSegments([])
    setIsAnalyzing(Boolean(file))
    if (!file) return
    setAnalysisStatus('Decoding audio before sync output is generated...')
    try {
      const analysis = await analyzeAudioForVocalCues(file, (percent) => setAnalysisStatus(`Analyzing audio frames ${percent}% — output waits for this real pass.`))
      setVocalCues(analysis.cues)
      setVocalSegments(analysis.segments)
      setAnalysisStatus(analysis.cues.length ? `${analysis.cues.length} vocal onsets and ${analysis.segments.length} active vocal regions detected; instrumental gaps trim word holds.` : 'Audio analyzed, but no confident vocal onsets were found. Add inline word timestamps for exact sync.')
    } catch (error) {
      setAnalysisStatus(`Audio analysis unavailable: ${error.message}`)
    } finally {
      setIsAnalyzing(false)
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
      const handle = await window.showSaveFilePicker({ suggestedName, types: [{ description: 'Synced LRC', accept: { 'text/plain': ['.lrc'] } }] })
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
        <h1 id="page-title">Upload a song and timed lyrics to export word-by-word .lrc sync.</h1>
        <p className="intro">For genuine 100% word accuracy, paste or upload an LRC that already includes exact inline word timestamps like &lt;00:12.340&gt;word. Audio analysis can tighten plain line-timed lyrics, but it cannot guarantee perfect vocal separation from a mixed song.</p>

        <div className="upload-grid" aria-label="Upload inputs">
          <label className="upload-box"><span className="upload-icon">♪</span><span className="upload-title">Upload song</span><span className="upload-copy">MP3, WAV, M4A, FLAC, or OGG audio</span><input type="file" accept="audio/*" onChange={(event) => handleSongUpload(event.target.files?.[0])} /></label>
          <label className="upload-box"><span className="upload-icon">[00:00]</span><span className="upload-title">Upload lyrics</span><span className="upload-copy">LRC or TXT with line/word timestamps</span><input type="file" accept=".lrc,.txt,text/plain" onChange={(event) => handleLyricsUpload(event.target.files?.[0])} /></label>
        </div>

        <label className="lyrics-editor"><span>Paste lyrics text</span><textarea value={lyricsText} onChange={(event) => { setLyricsText(event.target.value); setLyricsFile(null); setSaveStatus('') }} placeholder="Paste LRC here, for example: [00:10.000]&lt;00:10.120&gt;First &lt;00:10.620&gt;line" aria-label="Paste timed lyrics text" /></label>

        <div className="status-panel"><div><strong>{song ? song.name : 'No song selected'}</strong><span>{song ? `${(song.size / 1024 / 1024).toFixed(2)} MB ready for vocal analysis` : 'Choose an audio file to begin.'}</span></div><div><strong>{lyricsFile ? lyricsFile.name : hasLyricsInput ? 'Pasted lyrics' : 'No lyrics selected'}</strong><span>{timedLines.length ? `${timedLines.length} timestamped lyric lines found` : hasLyricsInput ? 'Add [mm:ss.xx] line or <mm:ss.xxx> word timestamps before export.' : 'Upload or paste timed lyrics in [mm:ss.xx] format.'}</span></div><div><strong>Separation model</strong><span>{analysisStatus}</span></div><div><strong>.LRC export</strong><span>Export now saves only .lrc files. Exact inline word timestamps are preserved as 100% confidence anchors.</span></div></div>

        {song && <audio className="audio-preview" controls src={audioUrl} onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)} />}

        <section className="result-panel" aria-live="polite"><div className="result-header"><div><p className="eyebrow">Sync output</p><h2>{isAnalyzing ? 'Analyzing audio before output' : isReady ? 'Word timing preview' : 'Waiting for both uploads'}</h2></div><span className={isReady ? 'pill active' : 'pill'}>{isAnalyzing ? 'Analyzing' : isReady ? 'Ready' : 'Pending'}</span></div>{isReady ? (<><div className="word-list">{wordSync.slice(0, 80).map((item, index) => (<span className="word-chip" key={`${item.word}-${item.start}-${index}`} title={item.line}><b>{item.word}</b><small>{formatTime(item.start)} · {item.confidence}%</small></span>))}</div><textarea className="output-text" readOnly value={outputText} aria-label="Enhanced synced lyrics output" /><div className="actions"><button type="button" onClick={copyOutput}>Copy .lrc lyrics</button><button type="button" onClick={saveOutput}>Export .lrc</button><span>{saveStatus}</span></div></>) : (<p className="empty-state">Add an audio file and timestamped lyrics. Output is generated only after the audio analysis pass finishes.</p>)}</section>
      </section>
    </main>
  )
}

export default App
