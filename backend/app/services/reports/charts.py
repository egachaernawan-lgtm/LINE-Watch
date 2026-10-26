"""Matplotlib charts for the monthly PDF, returned as base64 PNG data URIs."""

import base64
import io

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402

GREEN, RED, ORANGE, GRAY = "#06C755", "#FF334B", "#FF9900", "#888888"
SENTIMENT_COLORS = {"POSITIVE": GREEN, "NEUTRAL": GRAY, "NEGATIVE": RED}
plt.rcParams.update({"font.family": "DejaVu Sans", "axes.spines.top": False, "axes.spines.right": False})


def _png(fig) -> str:
    buf = io.BytesIO()
    fig.savefig(buf, format="png", dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def sentiment_donut(counts: dict[str, int]) -> str | None:
    items = [(k, v) for k, v in counts.items() if v > 0 and k in SENTIMENT_COLORS]
    if not items:
        return None
    fig, ax = plt.subplots(figsize=(4, 4))
    ax.pie(
        [v for _, v in items],
        labels=[f"{k.title()} ({v})" for k, v in items],
        colors=[SENTIMENT_COLORS[k] for k, _ in items],
        wedgeprops={"width": 0.38, "edgecolor": "white"},
        startangle=90,
    )
    return _png(fig)


def hbar(rows: list[tuple[str, int]], color: str = GREEN) -> str | None:
    if not rows:
        return None
    labels, values = zip(*reversed(rows))
    fig, ax = plt.subplots(figsize=(6, max(2, 0.4 * len(rows))))
    bars = ax.barh(labels, values, color=color)
    ax.bar_label(bars, padding=3, fontsize=9)
    ax.set_xticks([])
    ax.spines["bottom"].set_visible(False)
    return _png(fig)


def share_of_voice_bar(rows: list[dict]) -> str | None:
    if not rows:
        return None
    fig, ax = plt.subplots(figsize=(6, max(2, 0.45 * len(rows))))
    labels = [r["company"] for r in reversed(rows)]
    colors = [GREEN if r["company"] == "LINE" else GRAY for r in reversed(rows)]
    bars = ax.barh(labels, [r["share"] for r in reversed(rows)], color=colors)
    ax.bar_label(bars, labels=[f"{r['share']}%" for r in reversed(rows)], padding=3, fontsize=9)
    ax.set_xticks([])
    ax.spines["bottom"].set_visible(False)
    return _png(fig)


def daily_line(daily: list[tuple[str, int]]) -> str | None:
    if not daily:
        return None
    fig, ax = plt.subplots(figsize=(7, 2.6))
    days = [d[-2:] for d, _ in daily]
    values = [n for _, n in daily]
    ax.plot(days, values, color=GREEN, linewidth=2.5)
    ax.fill_between(days, values, color=GREEN, alpha=0.1)
    ax.tick_params(axis="x", labelsize=8)
    ax.set_ylabel("Articles")
    return _png(fig)
