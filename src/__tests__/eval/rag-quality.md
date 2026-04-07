# RAG Quality Evaluation Guide

## Setup
1. Start the dev server: `npm run dev`
2. Load a test episode — recommended: any Lex Fridman or Huberman Lab episode
3. Note the episode video ID for reference

## Test Questions (run these in order)

For each question, score:
- **Citation (0/1):** Does the answer include a [MM:SS] timestamp?
- **Grounded (0/1):** Does clicking the timestamp reveal relevant content?
- **Accurate (0/1):** Is the answer factually correct per the episode?

| # | Question Type | Question | Citation | Grounded | Accurate |
|---|---|---|---|---|---|
| 1 | Direct factual | "What is the main topic of this episode?" | | | |
| 2 | Definition | "How does [guest] define [key term from episode]?" | | | |
| 3 | Opinion | "What does [host] think about [topic]?" | | | |
| 4 | Off-topic | "What is the capital of France?" | N/A | N/A | Should say not covered |
| 5 | Follow-up | Ask a follow-up to Q1's answer | | | |
| 6 | Timestamp-aware | Set timestamp to 5:00, ask about something at 45:00 | | | Shouldn't reveal it |
| 7 | Specific quote | "Did they mention [specific term]?" | | | |
| 8 | Summary | "What were the main takeaways?" | | | |
| 9 | Comparison | "How did they compare X and Y?" | | | |
| 10 | Follow-up chain | Third question in a conversation thread | | | |

## Scoring
- **≥ 80%:** Concept validated — proceed to v1.1 planning
- **60-79%:** Prompt tuning needed before user testing
- **< 60%:** Retrieval strategy needs rework

## Common failure modes
- **No citation:** Prompt Agent should tighten the citation instruction
- **Wrong chunk cited:** Increase topK or tune embedding/keyword weighting
- **Spoiler revealed:** Decrease timestamp decay constant (from 0.14 toward 0.07)
- **Hallucination:** Temperature too high, or topK too low (model inventing when no good chunk found)
