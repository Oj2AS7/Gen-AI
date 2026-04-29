# Reflection

Building this persona-based chatbot taught me how much the quality of the system prompt shapes the final experience. The same question produces very different answers once the model is guided to adopt a distinct persona. That means the real work is not just writing code, but investing in prompt engineering and persona design.

What worked:
- Structuring each persona with a clear background, values, communication style, and conversational constraints made the replies feel more authentic.
- Adding few-shot examples directly inside the system prompt helped the model imitate each persona’s tone and advice pattern.
- Implementing persona switching with a full conversation reset made the interface predictable and aligned with the assignment requirements.

The GIGO principle taught me that prompt engineering is exacting: if I wrote a vague system prompt, the bot would answer vaguely. I avoided that by giving each persona explicit behavior rules, output guidelines, and a chain-of-thought instruction so the model reasons internally before replying.

What I would improve next:
- Add a dedicated backend session store so the app can maintain longer persona-specific conversations more reliably.
- Expand the prompt set with more contextual details from real talks, LinkedIn posts, and Scaler classroom language.
- Add a small onboarding tutorial inside the UI so a new student understands the difference between the three personas and the best way to ask questions.

Overall, this project reinforced that a working product depends on both a functional interface and good prompt engineering. The frontend makes the experience smooth, but the backend prompt quality is what determines whether the chatbot truly feels like Anshuman, Abhimanyu, or Kshitij.`,}