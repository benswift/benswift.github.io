<script lang="ts">
  import { onMount } from "svelte"

  type ChatMessage = { role: "user" | "assistant"; content: string }
  type ModelState =
    | { kind: "unsupported" }
    | { kind: "ready" }
    | { kind: "loading"; progress: number; status: string }
    | { kind: "chat" }
    | { kind: "error"; message: string }

  let modelState: ModelState = $state({ kind: "ready" })
  let messages: ChatMessage[] = $state([])
  let input = $state("")
  let generating = $state(false)
  let siteContent = $state("")

  let llm: any = $state(null)
  let messagesEl: HTMLDivElement | undefined = $state(undefined)
  let inputEl: HTMLTextAreaElement | undefined = $state(undefined)

  const MODEL_URL =
    "https://huggingface.co/litert-community/gemma-4-E2B-it-litert-lm/resolve/main/gemma-4-E2B-it-web.task"
  const WASM_URL =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-genai@0.10.27/wasm"

  function scrollToBottom() {
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight
    }
  }

  function buildSystemPrompt(): string {
    return `You are "Ben Swift", answering questions from visitors to your personal website benswift.me. You are a Senior Lecturer and Cybernetic Studio Lead at the ANU School of Cybernetics in Canberra, Australia.

Answer questions in first person as Ben. Be friendly, conversational, and use Australian English. Keep answers concise but informative. If you don't know something or if the information isn't in your knowledge base, say so honestly rather than making things up.

You are actually a Gemma 4 language model running in the visitor's browser, not the real Ben. If asked, be upfront about this.

Here is content from Ben's website to use when answering questions:

${siteContent}`
  }

  function formatPrompt(): string {
    let prompt = `<|turn>system\n${buildSystemPrompt()}<turn|>\n`
    for (const msg of messages.slice(0, -1)) {
      const role = msg.role === "user" ? "user" : "model"
      prompt += `<|turn>${role}\n${msg.content}<turn|>\n`
    }
    prompt += "<|turn>model\n"
    return prompt
  }

  async function loadModel() {
    modelState = { kind: "loading", progress: 0, status: "loading libraries..." }

    try {
      const [contentResponse, mediapipe] = await Promise.all([
        fetch("/site-content.txt"),
        import("@mediapipe/tasks-genai"),
      ])

      siteContent = await contentResponse.text()

      const { FilesetResolver, LlmInference } = mediapipe

      modelState = { kind: "loading", progress: 3, status: "loading WASM runtime..." }
      const genai = await FilesetResolver.forGenAiTasks(WASM_URL)

      modelState = { kind: "loading", progress: 5, status: "downloading model (2 GB)..." }

      const response = await fetch(MODEL_URL)
      const contentLength = Number(response.headers.get("content-length"))
      const reader = response.body!.getReader()

      let loaded = 0
      const trackingStream = new ReadableStream({
        async pull(controller) {
          const { done, value } = await reader.read()
          if (done) {
            controller.close()
            return
          }
          loaded += value.byteLength
          const downloadProgress = 5 + (loaded / contentLength) * 85
          const mb = (loaded / 1024 / 1024).toFixed(0)
          const totalMb = (contentLength / 1024 / 1024).toFixed(0)
          modelState = {
            kind: "loading",
            progress: downloadProgress,
            status: `downloading model... ${mb} / ${totalMb} MB`,
          }
          controller.enqueue(value)
        },
      })

      modelState = { kind: "loading", progress: 90, status: "initialising model..." }

      llm = await LlmInference.createFromOptions(genai, {
        baseOptions: {
          modelAssetBuffer: trackingStream.getReader(),
        },
        maxTokens: 16000,
        topK: 40,
        temperature: 0.8,
        randomSeed: 101,
      })

      modelState = { kind: "chat" }
      inputEl?.focus()
    } catch (e) {
      modelState = { kind: "error", message: e instanceof Error ? e.message : String(e) }
    }
  }

  async function send() {
    const text = input.trim()
    if (!text || generating || !llm) return

    input = ""
    messages.push({ role: "user", content: text })
    messages.push({ role: "assistant", content: "" })
    generating = true

    await Promise.resolve()
    scrollToBottom()

    try {
      const prompt = formatPrompt()

      llm.generateResponse(prompt, (partialResult: string, done: boolean) => {
        messages[messages.length - 1].content += partialResult
        scrollToBottom()
        if (done) {
          generating = false
        }
      })
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e)
      messages[messages.length - 1].content += `\n\n[Error: ${errMsg}]`
      generating = false
      scrollToBottom()
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  onMount(() => {
    if (!navigator.gpu) {
      modelState = { kind: "unsupported" }
    }
  })
</script>

<div class="gemma-chat">
  {#if modelState.kind === "unsupported"}
    <div class="notice">
      <p>
        This demo requires <strong>WebGPU</strong>, which is currently only
        available in Chrome and Edge. The model is ~2 GB and runs entirely
        in your browser---nothing is sent to a server.
      </p>
      <p>
        If you're on a supported browser and still seeing this, check that
        WebGPU is enabled in your browser flags.
      </p>
    </div>
  {:else if modelState.kind === "ready"}
    <div class="notice">
      <p>
        This loads Google's <strong>Gemma 4 E2B</strong> language model (~2 GB)
        directly into your browser via WebGPU. It's primed with the content of
        this site so you can ask it questions about me and my work.
      </p>
      <button class="load-button" onclick={loadModel}>Load model and start chatting</button>
    </div>
  {:else if modelState.kind === "loading"}
    <div class="notice">
      <p>Loading model... this may take a while on the first visit (cached after that).</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {modelState.progress}%"></div>
      </div>
      <span class="progress-label">{modelState.status}</span>
    </div>
  {:else if modelState.kind === "error"}
    <div class="notice error">
      <p>Something went wrong loading the model:</p>
      <pre>{modelState.message}</pre>
    </div>
  {:else}
    <div class="chat-container">
      <div class="messages" bind:this={messagesEl}>
        {#if messages.length === 0}
          <div class="empty-state">
            Ask me anything about my research, teaching, livecoding, or whatever else you're curious about.
          </div>
        {/if}
        {#each messages as msg}
          <div class="message {msg.role}">
            <span class="message-role">{msg.role === "user" ? "You" : "Ben (LLM)"}</span>
            <div class="message-content">{msg.content}{#if msg.role === "assistant" && generating && msg === messages[messages.length - 1]}<span class="cursor">▊</span>{/if}</div>
          </div>
        {/each}
      </div>
      <div class="input-area">
        <textarea
          bind:this={inputEl}
          bind:value={input}
          onkeydown={handleKeydown}
          placeholder="Ask Ben something..."
          rows="2"
          disabled={generating}
        ></textarea>
        <button onclick={send} disabled={generating || !input.trim()}>Send</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .gemma-chat {
    border: 1px solid var(--divider, #333);
    border-radius: 8px;
    overflow: hidden;
    background: var(--bg-soft, #252525);
  }

  .notice {
    padding: 1.5rem;
    text-align: center;
  }

  .notice p {
    margin: 0 0 1rem;
    color: var(--text-2, #aaa);
    line-height: 1.5;
  }

  .notice.error pre {
    text-align: left;
    font-size: 0.8rem;
    overflow-x: auto;
    padding: 0.75rem;
    background: var(--background-color, #1a1a1a);
    border-radius: 4px;
    color: #fb4934;
  }

  .load-button {
    padding: 0.75rem 1.5rem;
    background: var(--highlight-color, #be2edd);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .load-button:hover {
    opacity: 0.85;
  }

  .progress-bar {
    height: 6px;
    background: var(--background-color, #1a1a1a);
    border-radius: 3px;
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .progress-fill {
    height: 100%;
    background: var(--highlight-color, #be2edd);
    transition: width 0.3s ease;
  }

  .progress-label {
    font-family: var(--font-family-mono, monospace);
    font-size: 0.8rem;
    color: var(--text-3, #666);
  }

  .chat-container {
    display: flex;
    flex-direction: column;
    height: 500px;
  }

  .messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .empty-state {
    color: var(--text-3, #666);
    text-align: center;
    padding: 2rem 1rem;
    font-style: italic;
  }

  .message {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .message-role {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-3, #666);
  }

  .message.assistant .message-role {
    color: var(--highlight-color, #be2edd);
  }

  .message-content {
    line-height: 1.5;
    white-space: pre-wrap;
    word-break: break-word;
  }

  .cursor {
    animation: blink 0.8s step-end infinite;
    color: var(--highlight-color, #be2edd);
  }

  @keyframes blink {
    50% { opacity: 0; }
  }

  .input-area {
    display: flex;
    gap: 0.5rem;
    padding: 0.75rem;
    border-top: 1px solid var(--divider, #333);
    background: var(--background-color, #1a1a1a);
  }

  .input-area textarea {
    flex: 1;
    resize: none;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--divider, #333);
    border-radius: 6px;
    background: var(--bg-soft, #252525);
    color: var(--text-color, #e0e0e0);
    font-family: inherit;
    font-size: 0.95rem;
    line-height: 1.4;
  }

  .input-area textarea:focus {
    outline: none;
    border-color: var(--highlight-color, #be2edd);
  }

  .input-area textarea:disabled {
    opacity: 0.5;
  }

  .input-area button {
    padding: 0.5rem 1rem;
    background: var(--highlight-color, #be2edd);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    align-self: flex-end;
    transition: opacity 0.15s;
  }

  .input-area button:hover:not(:disabled) {
    opacity: 0.85;
  }

  .input-area button:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
</style>
