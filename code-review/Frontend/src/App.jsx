import { useState, useEffect } from 'react'
import "prismjs/themes/prism-tomorrow.css"
import Editor from "react-simple-code-editor"
import prism from "prismjs"
import Markdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import axios from 'axios'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [code, setCode] = useState(` function sum() {
  return 1 + 1
}`)
  const [review, setReview] = useState(``)
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    prism.highlightAll()
  }, [])

  async function reviewCode() {
    if (cooldown) return  

    setCooldown(true)    
    try {
      const response = await axios.post('https://ai-code-reviewer-4-05h5.onrender.com/ai/get-review', { "code": code })
      setReview(response.data)
    } catch (err) {
      setReview("Something went wrong.")
    }

    setTimeout(() => {
      setCooldown(false)
    }, 5000)
  }

  return (
    <>
      <main>
        <div className="left">
          <div className="code">
            <Editor
              value={code}
              onValueChange={code => setCode(code)}
              highlight={code => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{
                fontFamily: '"Fira code", "Fira Mono", monospace',
                fontSize: 16,
                border: "1px solid #ddd",
                borderRadius: "5px",
                height: "100%",
                width: "100%"
              }}
            />
          </div>

          <div
            onClick={reviewCode}
            className={`review ${cooldown ? 'disabled' : ''}`}
            style={{ opacity: cooldown ? 0.6 : 1, pointerEvents: cooldown ? 'none' : 'auto' }}
          >
            {cooldown ? 'Please wait...' : 'Review'}
          </div>
        </div>

        <div className="right">
          <Markdown rehypePlugins={[rehypeHighlight]}>
            {review}
          </Markdown>
        </div>
      </main>
    </>
  )
}

export default App
