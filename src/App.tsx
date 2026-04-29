import { useMemo, useState } from 'react';

type PersonaKey = 'anshuman' | 'abhimanyu' | 'kshitij';

type Message = { role: 'user' | 'assistant'; content: string };

const personas: Record<PersonaKey, { label: string; description: string; chips: string[] }> = {
  anshuman: {
    label: 'Anshuman Singh',
    description: 'Scaler / InterviewBit founder-style mentor who is direct, structured, and product-focused.',
    chips: [
      'How do I prepare for backend interviews in 3 months?',
      'What is the best way to improve system design intuition?',
      'How should I build a study plan for FAANG interviews?',
    ],
  },
  abhimanyu: {
    label: 'Abhimanyu Saxena',
    description: 'Supportive practice coach who explains fundamentals clearly and helps you build confidence.',
    chips: [
      'My recursion keeps failing. What should I do?',
      'How do I stay consistent with daily coding practice?',
      'How can I improve my debugging process?',
    ],
  },
  kshitij: {
    label: 'Kshitij Mishra',
    description: 'Interview strategy mentor known for clear algorithmic thinking and fast problem breakdown.',
    chips: [
      'How do I approach a tree problem in interviews?',
      'What are the 3 steps for solving a dynamic programming question?',
      'How should I answer a time complexity question in the interview?',
    ],
  },
};

const initialMessage = { role: 'assistant' as const, content: 'Choose a persona and start the conversation with your first question.' };

function App() {
  const [activePersona, setActivePersona] = useState<PersonaKey>('anshuman');
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const persona = personas[activePersona];

  const visibleMessages = useMemo(() => messages, [messages]);

  const resetConversation = (personaKey: PersonaKey) => {
    setActivePersona(personaKey);
    setMessages([initialMessage]);
    setDraft('');
    setError(null);
  };

  const sendChat = async (content: string) => {
    if (!content.trim()) return;
    setError(null);
    const userMessage = { role: 'user' as const, content };
    const nextMessages = [...messages.filter((m) => m.role !== 'assistant' || m.content !== initialMessage.content), userMessage];
    setMessages((prev) => [...prev.filter((m) => m.role !== 'assistant' || m.content !== initialMessage.content), userMessage]);
    setDraft('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona: activePersona, messages: nextMessages }),
      });

      if (!response.ok) {
        const json = await response.json().catch(() => null);
        throw new Error(json?.error || 'Could not connect to the AI service.');
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error.');
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I could not process that. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Scaler Persona Chatbot</p>
          <h1>Practice with Anshuman, Abhimanyu, or Kshitij</h1>
          <p>Switch personas, ask a real question, and see how each mentor answers in their own voice.</p>
        </div>
      </header>

      <section className="persona-panel">
        {Object.entries(personas).map(([key, personaInfo]) => (
          <button
            key={key}
            className={key === activePersona ? 'persona-card active' : 'persona-card'}
            onClick={() => resetConversation(key as PersonaKey)}
          >
            <strong>{personaInfo.label}</strong>
            <span>{personaInfo.description}</span>
          </button>
        ))}
      </section>

      <main className="chat-container">
        <div className="chat-header">
          <div>
            <span className="active-badge">Active Persona</span>
            <h2>{persona.label}</h2>
          </div>
          <p>{persona.description}</p>
        </div>

        <div className="suggestion-bar">
          {persona.chips.map((chip) => (
            <button key={chip} className="chip" onClick={() => sendChat(chip)}>
              {chip}
            </button>
          ))}
        </div>

        <section className="messages">
          {visibleMessages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-role">{message.role === 'user' ? 'You' : persona.label}</div>
              <div className="message-text">{message.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message assistant typing">
              <div className="message-role">{persona.label}</div>
              <div className="message-text">Typing...</div>
            </div>
          )}
        </section>

        {error && <div className="error-banner">{error}</div>}

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            sendChat(draft);
          }}
        >
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask a question to the current persona..."
            rows={2}
          />
          <button type="submit" disabled={loading || !draft.trim()}>
            Send
          </button>
        </form>
      </main>
    </div>
  );
}

export default App;
