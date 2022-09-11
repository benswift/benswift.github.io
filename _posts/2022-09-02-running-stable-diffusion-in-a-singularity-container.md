---
title: Running stable diffusion in a singularity container
published: false
---

singularity pull docker://nvcr.io/nvidia/pytorch:22.08-py3

git clone https://github.com/lstein/stable-diffusion.git

SINGULARITYENV_CUDA_VISIBLE_DEVICES=0 singularity shell --nv ../sifs/pytorch_22.08-py3.sif 

source /opt/conda/etc/profile.d/conda.sh && conda activate ldm

ffmpeg -framerate 30 -pattern_type glob -i '*.png' -c:v libx264 -pix_fmt yuv420p genesis.mp4
ffmpeg -framerate 5 -pattern_type glob -i '*-Joel-*.png' -c:v libx264 -pix_fmt yuv420p Joel.mp4

ideas for actually packaging this stuff...

- https://stackoverflow.com/a/66598345

```python
import re
import json
import torch
from torch.multiprocessing import spawn
from torch import autocast
from diffusers import StableDiffusionImg2ImgPipeline
from PIL import Image

model_id = "CompVis/stable-diffusion-v1-4"
pipe = StableDiffusionImg2ImgPipeline.from_pretrained(model_id, use_auth_token=True).to("cuda")

def load_json_file(filename):
    with open(filename) as f:
        return json.load(f)

def slugify(s):
    ## my kingdom for a pipe operator
    s = re.sub(r" ", "_", s)
    s = re.sub(r"[',:]", "", s)
    return s

def verse_generator(book):
    for chapter in load_json_file(f"../Bible-kjv/{book}.json")["chapters"]:
        for verse in chapter["verses"]:
            yield (book, chapter["chapter"], verse["verse"], verse["text"])

def generate(prompt, init_image):
    with autocast("cuda"):
        return pipe(prompt, init_image)["sample"][0]  
    
def generate_book_video(book):
    image = Image.new("RGB", (512, 512), color = "white")
    for i, verse in enumerate(verse_generator(book)):
        print(verse)
        image = generate(verse[3], image)
        image.save(f"output/{i:04d}-{verse[0]}-{verse[1]}-{verse[2]}.png")


if __name__ == "__main__":
    books = load_json_file("../Bible-kjv/Books.json")
    generate_book_video("Joel")
    #spawn(generate, ("purple ball", img), 9)
```
