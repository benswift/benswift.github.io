#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.12"
# dependencies = ["typer", "loguru"]
# ///
"""Drive a fresh, ELIZA-blind Claude against Weizenbaum's DOCTOR script.

Claude is invoked via the authenticated `claude` CLI in non-interactive mode
with a neutral chat persona and no project settings, so it has no idea its
conversational partner is a 1966 pattern-matcher. ELIZA opens, casting Claude
as the "patient"; we then shuttle lines back and forth.

ELIZA itself lives in the adjacent `eliza.py` (Joe Strout's knock-off of the
DOCTOR script, via Jez Higgins) --- vendored unchanged, hence the second file.
"""

from __future__ import annotations

import subprocess
from pathlib import Path
from typing import Annotated, Literal

import typer
from loguru import logger

from eliza import eliza

SYSTEM_PROMPT = (
    "You are a person chatting one-on-one in an anonymous online text chat. "
    "You do not know who you are talking to. Reply naturally and briefly, the "
    "way someone would in a casual chat --- usually a sentence or two. Do not act "
    "as an assistant, do not offer help, do not address the other person by any "
    "name. Output only the literal text of your next chat message: no labels, no "
    "quotation marks, no narration of your own thoughts or actions."
)

Speaker = Literal["claude", "eliza"]
Turn = tuple[Speaker, str]


def claude_reply(transcript: list[Turn], model: str) -> str:
    """Ask a fresh `claude` process for the next message in the chat."""
    convo = "\n".join(
        f"{'Them' if who == 'eliza' else 'You'}: {text}" for who, text in transcript
    )
    prompt = (
        f"This is the chat so far:\n\n{convo}\n\n"
        "Write your next message (the next 'You:' line). Output only the message text."
    )
    result = subprocess.run(
        [
            "claude",
            "-p",
            "--setting-sources",
            "",
            "--exclude-dynamic-system-prompt-sections",
            "--system-prompt",
            SYSTEM_PROMPT,
            "--model",
            model,
            prompt,
        ],
        capture_output=True,
        text=True,
        timeout=120,
        check=True,
    )
    return result.stdout.strip()


def eliza_reply(bot: eliza, text: str) -> str:
    """Strip trailing sentence punctuation (as ELIZA's REPL does), then respond."""
    s = text.strip()
    while s and s[-1] in "!.":
        s = s[:-1]
    return bot.respond(s or "hello")


def main(
    turns: Annotated[int, typer.Option(help="Number of Claude/ELIZA exchanges.")] = 16,
    model: Annotated[
        str, typer.Option(help="Model id for the Claude side.")
    ] = "claude-opus-4-8",
    out: Annotated[Path, typer.Option(help="Where to write the transcript.")] = Path(
        "transcript.txt"
    ),
) -> None:
    bot = eliza()
    transcript: list[Turn] = [("eliza", "Hello. How are you feeling today?")]
    logger.info("ELIZA opens: {}", transcript[0][1])

    for turn in range(turns):
        reply = claude_reply(transcript, model)
        transcript.append(("claude", reply))
        logger.info("[{}/{}] CLAUDE: {}", turn + 1, turns, reply)

        response = eliza_reply(bot, reply)
        transcript.append(("eliza", response))
        logger.info("[{}/{}] ELIZA:  {}", turn + 1, turns, response)

    lines = ["Claude ({}) meets ELIZA (DOCTOR script)".format(model), "=" * 50, ""]
    lines += [
        f"{'ELIZA ' if who == 'eliza' else 'CLAUDE'}: {text}\n"
        for who, text in transcript
    ]
    out.write_text("\n".join(lines))
    logger.success("Wrote {} ({} lines)", out, len(transcript))


if __name__ == "__main__":
    typer.run(main)
