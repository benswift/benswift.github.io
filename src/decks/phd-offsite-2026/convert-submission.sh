#!/usr/bin/env bash
# Convert a student's PhD-offsite submission into deck-ready assets.
#
# Usage:
#   ./convert-submission.sh <student-id> <src-file> [<src-file>...]
#
# Behaviour, by source type:
#   .pdf                 -> one AVIF per page:  <id>-01.avif, <id>-02.avif, ...
#   .pptx .ppt .key .odp -> LibreOffice to PDF, then as above
#   .png .jpg .svg .webp -> a single AVIF:      <id>-<basename>.avif
#   .mp4 .mov .webm      -> a web-optimised H.264 MP4: <id>-<basename>.mp4
#
# AVIFs are fit within 1920x1080 (16:9 slide canvas). Re-run any time a student
# sends new/updated slides --- it overwrites that student's assets in place.
set -euo pipefail

here="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
out="$here/assets"
mkdir -p "$out"
work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

id="${1:?usage: convert-submission.sh <student-id> <src-file>...}"
shift

# Render pages at 150dpi, crop away the page-background margins, then fit
# within 1920x1080 preserving aspect ratio. Non-16:9 PDFs (A4 exports,
# letter pages) otherwise carry big baked-in white margins onto the dark
# deck. The crop box is the UNION of every page's content bounding box, so
# all pages get the same framing (no per-page zoom jitter).
# (The old version passed both -scale-to-x and -scale-to-y to pdftoppm,
# which stretched non-16:9 pages to exactly 1920x1080.)
# Non-16:9 output needs `![bg contain]` in the deck, not plain `![bg]`.
pages_from_pdf() {
  local pdf="$1"
  pdftoppm -png -r 150 "$pdf" "$work/$id-page"
  local xmin='' ymin='' xmax='' ymax='' g w h x y
  for png in "$work/$id-page"-*.png; do
    g="$(magick "$png" -fuzz 4% -format '%@' info: 2>/dev/null)" || continue
    [[ "$g" =~ ^([0-9]+)x([0-9]+)\+([0-9]+)\+([0-9]+)$ ]] || continue
    w=${BASH_REMATCH[1]} h=${BASH_REMATCH[2]} x=${BASH_REMATCH[3]} y=${BASH_REMATCH[4]}
    ((w < 50 || h < 50)) && continue # effectively blank page --- ignore
    [[ -z $xmin ]] || ((x < xmin)) && xmin=$x
    [[ -z $ymin ]] || ((y < ymin)) && ymin=$y
    [[ -z $xmax ]] || ((x + w > xmax)) && xmax=$((x + w))
    [[ -z $ymax ]] || ((y + h > ymax)) && ymax=$((y + h))
  done
  local crop=()
  if [[ -n $xmin ]]; then
    crop=(-crop "$((xmax - xmin))x$((ymax - ymin))+$xmin+$ymin" +repage)
  fi
  local n=0
  for png in "$work/$id-page"-*.png; do
    n=$((n + 1))
    printf -v num '%02d' "$n"
    magick "$png" "${crop[@]}" -resize 1920x1080 "$work/$id-fit-$num.png"
    avifenc -q 60 -s 6 "$work/$id-fit-$num.png" "$out/$id-$num.avif" >/dev/null
    echo "  $id-$num.avif"
  done
}

# Render a presentation (pptx/ppt/key/odp/svg) to PDF/PNG. Tries local
# LibreOffice first; if that produces nothing (the headless soffice on this
# box is currently broken), falls back to rendering on `daysy` over SSH.
# Usage: office_convert <src> <target-ext: pdf|png> <out-file>
office_convert() {
  local src="$1" target="$2" outfile="$3"
  local filter=""
  [ "$target" = png ] && filter="png:draw_png_Export"
  soffice --headless --convert-to "${filter:-pdf}" --outdir "$work" \
    -env:UserInstallation="file://$work/lo" "$src" >/dev/null 2>&1 || true
  local local_out="$work/$(basename "${src%.*}").$target"
  if [ -s "$local_out" ]; then
    mv "$local_out" "$outfile"
    return 0
  fi
  echo "  (local LibreOffice unavailable --- rendering on daysy)" >&2
  local rdir
  rdir="$(ssh daysy 'd=$(mktemp -d); echo "$d"')"
  scp -q "$src" "daysy:$rdir/in.${src##*.}"
  ssh daysy "/Applications/LibreOffice.app/Contents/MacOS/soffice --headless \
    --convert-to '${filter:-pdf}' --outdir '$rdir' '$rdir/in.${src##*.}'" >/dev/null 2>&1
  scp -q "daysy:$rdir/in.$target" "$outfile"
  ssh daysy "rm -rf '$rdir'" >/dev/null 2>&1 || true
  [ -s "$outfile" ]
}

for src in "$@"; do
  ext="${src##*.}"
  ext="${ext,,}"
  base="$(basename "$src")"
  base="${base%.*}"
  # sanitise basename -> lowercase kebab
  slug="$(echo "$base" | tr '[:upper:] ' '[:lower:]-' | tr -cd 'a-z0-9-')"
  echo "$base ($ext):"
  case "$ext" in
    pdf)
      pages_from_pdf "$src"
      ;;
    pptx | ppt | key | odp)
      office_convert "$src" pdf "$work/$slug.pdf"
      pages_from_pdf "$work/$slug.pdf"
      ;;
    svg)
      # ImageMagick has no reliable SVG delegate here; render via LibreOffice.
      office_convert "$src" png "$work/$slug-raw.png"
      convert -background none "$work/$slug-raw.png" -resize 1920x1080 "$work/$slug.png"
      avifenc -q 62 -s 6 "$work/$slug.png" "$out/$id-$slug.avif" >/dev/null
      echo "  $id-$slug.avif"
      ;;
    png | jpg | jpeg | webp | gif | avif)
      # rasterise/resize to fit the 16:9 canvas, then AVIF
      convert -background none "$src" -resize 1920x1080 "$work/$slug.png"
      avifenc -q 62 -s 6 "$work/$slug.png" "$out/$id-$slug.avif" >/dev/null
      echo "  $id-$slug.avif"
      ;;
    mp4 | mov | webm | m4v)
      ffmpeg -y -loglevel error -i "$src" \
        -vf "scale='min(1920,iw)':-2" \
        -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p \
        -c:a aac -b:a 96k -movflags +faststart \
        "$out/$id-$slug.mp4"
      echo "  $id-$slug.mp4"
      ;;
    *)
      echo "  !! unhandled type: $ext (skipped)" >&2
      ;;
  esac
done
