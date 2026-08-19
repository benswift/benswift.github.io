"""One look for all seven charts, so they sit consistently down the page.

Every chart renders to the same total SVG width (TARGET_WIDTH), which is the
width of the article column. PLOT_WIDTHS holds the plot width each chart needs
to land there once Vega has added its axes, headers and legends --- they were
found by rendering and measuring, so re-tune them if the font sizes change.

REPOS maps the public entries in the by-project chart to their GitHub page;
render_svgs.py turns those labels into links.
"""

FONT = "Helvetica, Arial, sans-serif"

BG = "#1c1a1d"
INK = "#e0e0e0"
INK2 = "#aaa"
GRID = "#363338"
TOKENS = "#be2edd"  # brand purple: token counts
SPEND = "#d97706"  # amber: dollars
EMPTY = "#241f28"
RAMP = ["#5b2a6b", "#8f2fae", "#be2edd", "#e879f9"]

LABEL = 14

CONFIG = {
    "background": BG,
    "font": FONT,
    "axis": {
        "labelColor": INK2,
        "titleColor": INK2,
        "domainColor": GRID,
        "tickColor": GRID,
        "gridColor": GRID,
        "gridOpacity": 0.6,
        "labelFontSize": LABEL,
        "titleFontSize": LABEL,
        "titleFontWeight": "normal",
    },
    "legend": {
        "labelColor": INK,
        "titleColor": INK2,
        "labelFontSize": LABEL,
        "symbolType": "square",
        "symbolSize": 130,
    },
    "title": {
        "color": INK,
        "fontSize": 19,
        "fontWeight": 600,
        "anchor": "start",
        "subtitleColor": INK2,
        "subtitleFontSize": LABEL,
        "subtitleLineHeight": 20,
        "offset": 12,
    },
    "header": {
        "labelColor": INK,
        "labelFontSize": LABEL,
        "labelFontWeight": 600,
        "titleColor": INK2,
    },
    "view": {"stroke": None},
}

TARGET_WIDTH = 900

PLOT_WIDTHS = {
    "daily-heatmap": 858,
    "rise-and-fall": 813,
    "by-project": 622,
    "cumulative": 856,
    "diurnal": 845,
    "by-model": 396,  # per facet column, of which there are two
    "where-the-tokens-go": 778,
}

REPOS = {
    "slop-university": "https://github.com/benswift/slop-university",
    "llms-unplugged": "https://github.com/ANUcybernetics/llms-unplugged",
    "dotfiles": "https://github.com/benswift/.dotfiles",
    "extempore": "https://github.com/digego/extempore",
    "benswift.me": "https://github.com/benswift/benswift.github.io",
    "out-of-office-cv": "https://github.com/out-of-office-cv/out-of-office-cv-website",
    "slop-salon": "https://github.com/ANUcybernetics/slop-salon",
    "panic-tda": "https://github.com/ANUcybernetics/panic-tda",
    "aps-ai-transparency-tracker": "https://github.com/ANUcybernetics/aps-ai-transparency-tracker",
    "panic": "https://github.com/ANUcybernetics/panic",
}
