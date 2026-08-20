"""What the charts count, and what it costs.

Two filters decide what makes it in. A model absent from PRICES is dropped
rather than guessed at, and so is any response whose numbers were estimated
rather than reported --- which is the whole of the Zed assistant-panel era,
reconstructed from conversation text. Both stay in the log tree and in
analytics.db, where they can be asked about explicitly; they just do not go on
a chart beside measured numbers.

Between them the two filters start the charts on 11 May 2025. Zed's agent
panel recorded its first token counts a few weeks earlier, but those weeks
were Gemini and o3, and this only prices Claude.

Prices are US$ per million tokens, list rates applied retrospectively --- an
indicative figure rather than a bill anyone paid.

Two 3.5 Sonnet ids share one label on purpose: they are the same model
generation, and splitting them would put two near-empty rows on the ridgeline
where one belongs.
"""

PRICES = {
    "claude-fable-5": (10, 50),
    "claude-opus-5": (5, 25),
    "claude-opus-4-8": (5, 25),
    "claude-opus-4-7": (5, 25),
    "claude-opus-4-6": (5, 25),
    "claude-opus-4-5-20251101": (5, 25),
    "claude-opus-4-1-20250805": (15, 75),
    "claude-opus-4-20250514": (15, 75),
    "claude-sonnet-5": (2, 10),
    "claude-sonnet-4-6": (3, 15),
    "claude-sonnet-4-5-20250929": (3, 15),
    "claude-sonnet-4-20250514": (3, 15),
    "claude-haiku-4-5-20251001": (1, 5),
    # the Zed era
    "claude-3-7-sonnet-20250219": (3, 15),
    "claude-3-5-sonnet-20241022": (3, 15),
    "claude-3-5-sonnet-20240620": (3, 15),
    "claude-3-opus-20240229": (15, 75),
}

LABEL = {
    "claude-3-opus-20240229": "Opus 3",
    "claude-3-5-sonnet-20240620": "Sonnet 3.5",
    "claude-3-5-sonnet-20241022": "Sonnet 3.5",
    "claude-3-7-sonnet-20250219": "Sonnet 3.7",
    "claude-opus-4-20250514": "Opus 4",
    "claude-sonnet-4-20250514": "Sonnet 4",
    "claude-opus-4-1-20250805": "Opus 4.1",
    "claude-sonnet-4-5-20250929": "Sonnet 4.5",
    "claude-haiku-4-5-20251001": "Haiku 4.5",
    "claude-opus-4-5-20251101": "Opus 4.5",
    "claude-opus-4-6": "Opus 4.6",
    "claude-sonnet-4-6": "Sonnet 4.6",
    "claude-opus-4-7": "Opus 4.7",
    "claude-opus-4-8": "Opus 4.8",
    "claude-sonnet-5": "Sonnet 5",
    "claude-opus-5": "Opus 5",
    "claude-fable-5": "Fable 5",
}

# Cache writes and reads, as multiples of the model's input price.
W5, W1, RD = 1.25, 2.0, 0.1
M = 1_000_000


def cost(model: str, i: int, o: int, rd: int, w5: int, w1: int) -> float:
    """US$ for one response, at list prices."""
    pin, pout = PRICES[model]
    return (i * pin + w5 * pin * W5 + w1 * pin * W1 + rd * pin * RD + o * pout) / M
