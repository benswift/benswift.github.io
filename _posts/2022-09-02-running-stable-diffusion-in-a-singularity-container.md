---
title: Running stable diffusion in a singularity container
published: false
---

singularity pull docker://nvcr.io/nvidia/pytorch:22.08-py3

git clone https://github.com/lstein/stable-diffusion.git

SINGULARITYENV_CUDA_VISIBLE_DEVICES=0 singularity shell --nv ../sifs/pytorch_22.08-py3.sif 

source /opt/conda/etc/profile.d/conda.sh && conda activate ldm

ffmpeg -framerate 30 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p genesis.mp4

ideas for actually packaging this stuff...

- https://stackoverflow.com/a/66598345
