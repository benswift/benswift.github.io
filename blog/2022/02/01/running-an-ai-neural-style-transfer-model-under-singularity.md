---
title: "Running an AI neural style transfer model under Singularity"
tags:
  - dev
  - ai
---

# Running an AI neural style transfer model under Singularity




I've recently been given access to a beefy AI server (6x RTX3090s!) which is
managed via [SingularityCE](https://sylabs.io/singularity/), whose homepage
boldly asks and then forgets to answer the question: "What is SingularityCE?"

If you [dig further into the
documentation](https://sylabs.io/guides/latest/user-guide/introduction.html)
it's a little less coy:

> SingularityCE is a container platform. It allows you to create and run
> containers that package up pieces of software in a way that is portable and
> reproducible. You can build a container using SingularityCE on your laptop,
> and then run it on many of the largest HPC clusters in the world, local
> university or company clusters, a single server, in the cloud, or on a
> workstation down the hall. Your container is a single file, and you don’t have
> to worry about how to install all the software you need on each different
> operating system.

I want to fire up my new GPUs and run one of Katherine Crowson's awesome pytorch
scripts to do some [neural style
transfer](https://github.com/crowsonkb/style-transfer-pytorch). I'm very
familiar with Docker, but new to this Singularity thing, so here are some of the
hurdles I encountered (and cleared) along the way.

## Finding a base image

Looking in the style transfer repo's
[`setup.py`](https://github.com/crowsonkb/style-transfer-pytorch/blob/master/setup.py#L23),
it looks like [torch](https://pytorch.org) v1.7.1 or later is required. Having
done this sort of thing before, I know that these deep learning frameworks
change a fair bit even between minor versions, so the safest option is to pick
the exact version that it was designed for---in this case v1.7.1 (or at least
v1.7.x).

So, the challenge is to find a Singularity image with that version of torch
installed. The singularity docs [suggest using the search
command](https://sylabs.io/guides/latest/user-guide/quick_start.html#download-pre-built-images)
like so:

```shell
$ singularity search torch

Found 34 container images for amd64 matching "torch":

	library://adalisan81/default/pytorch:latest

	library://aday651/default/pytorch-geometric-gpu:latest

	library://aphoh/default/pytorch-20.11-py3:v-1

	library://aradeva24/default/ar_pytorch_21.06-py3.sif:latest
		PyTorch NGC container with CUDA11.0, where PyTorch and apex are installed

	library://calebh/hpccm-test/faircluster-pytorch-1.10-cuda11.3:sha256.7c63a6c1f6f125b8d3e14fa10203965536ec7173d50e85b8c9ecf6ee0bff2ba7

	library://claytonm/default/ubuntu18_torch_torchvision_opencv_cuda10:latest

	library://dxtr/default/hpc-pytorch:0.1

	library://guoweihe/default/pytorch:hz1

	library://guoweihe/default/pytorch:v1.2

	library://guoweihe/default/torch:deep-ed

	library://guoweihe/default/torch:sha256.ff32c85ade2c8f6a1d34bd500de1b7bd11cdac16461aeef4d7cbd16ab129d8a7

	library://guoweihe/default/torchgpipe:master

	library://guoweihe/default/torchgpipe:sha256.a6ea5d732cba07c043e2f06cccbe541d28da6a8d9e5a3d18872d58af288dbc62

	library://ipa/medimgproc/pytorch:latest

	library://jamiechang917/default/pytorch:sha256.9c60c9825f20626cc0d6e69ac61d862bfec927e82d86becee73f853d657f2425

	library://lamastex/default/pytorch_21.03.sif:berzelius-20211027

	library://lamastex/default/pytorch_21.07.sif:berzelius-20211027

	library://lev-hpc/ml/pytorch_gpu:jupyter

	library://lev-hpc/ml/torch_tf_jupyter:latest

	library://mbalazs/default/pytorch:latest

	library://mbalazs/default/pytorch_cuda110:latest

	library://mike_holcomb/pytorchvision/v0.1.0:latest,v0.1.0

	library://oscartang/default/pytorch_translation:latest

	library://ottino8/default/pytorch:first

	library://pauldhein/hpc-deep-learning/torch-base:latest

	library://sina-ehsani/default/transformer-googlecrawl-torch-opencv:latest

	library://sina-ehsani/default/transformer-googlecrawl-torch1.10:latest

	library://skykiny/default/pytorch_skykiny:latest

	library://tmyoda/default/cuda-torch-pyenv:latest

	library://tru/default/c7-conda-pytorch-10.0:2019-07-12-2053,latest

	library://ufscar/hpc/cuda_pytorch:latest

	library://uvarc/default/pytorch:1.4.0-py37

	library://yboget/default/pytorch_rdkit_visdom:sha256.d97f221ef1294a8ef57d40cf7994d05d4955abc7cf39e3ce42faafd59fe3151a

	library://zhengtang/default/torch_translation:latest
```

Hmm. It's hard to know which is official, which ones are going to work (a few of
them mention torch versions, but none of them are v1.7.x) and which ones might
even be malicious? That's a worry.

Looking a bit deeper into the Singularity docs I find that one can [also use
Docker/OCI
images](https://sylabs.io/guides/latest/user-guide/singularity_and_docker.html),
and Singularity can pull them straight from Docker hub. That's good news,
because NVIDIA do maintain [official Docker
images](https://hub.docker.com/r/pytorch/pytorch/tags) for using torch with
NVIDIA graphics cards (like the 3090), so I find the [specific container image
for torch
v1.7.1](https://hub.docker.com/layers/pytorch/pytorch/1.7.1-cuda11.0-cudnn8-runtime/images/sha256-db6086be92f439b918c96dc002f4cf40239e247f0b1b6c32e3fb36de70032bf9?context=explore)
and pull it down with:

```shell
singularity pull docker://pytorch/pytorch:1.7.1-cuda11.0-cudnn8-runtime
```

## Running the `style_transfer` python script

I'd already cloned the neural style transfer repo, so I can follow the
instructions in that
[README.md](https://github.com/crowsonkb/style-transfer-pytorch/blob/master/README.md)

```shell
$ singularity shell pytorch_1.7.0-cuda11.0-cudnn8-runtime.sif 
Singularity> cd style-transfer-pytorch/
Singularity> pip install --user .
```

I got a bunch of warnings about certain things not being on the `$PATH`, but it
seems to finish installing everthing ok.

Continuing on with the instructions in the README, let's try running this thing
(I'd downloaded a couple of image files to use as my _content_ and _style_ images).

```shell
Singularity> style_transfer ben.jpg tiger.jpg -o ben-tiger.jpg
bash: style_transfer: command not found
```

Hmm, looks like those `$PATH` warnings were prescient. Looking back, the exact
warning was:

```shell
WARNING: The script normalizer is installed in '/home/users/ben/.local/bin' which is not on PATH
```

The quickest & dirtiest fix for this is to add that `/bin` directory to my path
and try and re-run the script.

```shell
Singularity> PATH="$PATH:~/.local/bin" style_transfer ben.jpg tiger.jpg -o ben-tiger.jpg
```

And away it went! Several minutes later, it was done. Here are the original two images:

![Original ben.jpg image](/assets/images/headshots/headshot.jpg)
![Original tiger.jpg](/assets/images/posts/tiger.jpg)

and here's the output:

![style-transferred ben-tiger.jpg](/assets/images/posts/ben-tiger.jpg)

Success...ish. Clearly I need to keep tweaking parameters & input images to come
up with an output that's actually _good_, but at least that journey can now
begin.

## But is it _fast_?

Actually, that declaration of success is a bit premature. At the top of the
output I noticed that the script was running on the CPU, not the GPU.

```shell
Singularity> PATH="$PATH:~/.local/bin" style_transfer ben.jpg tiger.jpg -o ben-tiger.jpg
~/.local/lib/python3.8/site-packages/torch/cuda/__init__.py:52: UserWarning: CUDA initialization: Found no NVIDIA driver on your system. Please check that you have an NVIDIA GPU and installed a driver from https://www.nvidia.com/Download/index.aspx (Triggered internally at  /pytorch/c10/cuda/CUDAFunctions.cpp:100.)
  return torch._C._cuda_getDeviceCount() > 0
Using devices: cpu
CPU threads: 128
Loading model...
```

That's really not ok---the whole point of running on this machine is to take
advantage of the GPUs. There could be lots of reasons for this, but I have a
hunch it has something to do with Singularity not allowing the script access to
the hardware. Sure enough, looking through the [Singularity GPU support
documentation](https://sylabs.io/guides/3.7/user-guide/gpu.html) it turns out
there's a magic `--nv` flag which must be passed when starting up the
Singularity session, so let's do that.

```shell
$ singularity shell --nv pytorch_1.7.1-cuda11.0-cudnn8-runtime.sif 
Singularity> PATH="$PATH:~/.local/bin" style_transfer ben.jpg tiger.jpg -o ben-tiger.jpg
Using devices: cuda:0
~/.local/lib/python3.8/site-packages/torch/cuda/__init__.py:143: UserWarning: 
NVIDIA GeForce RTX 3090 with CUDA capability sm_86 is not compatible with the current PyTorch installation.
The current PyTorch install supports CUDA capabilities sm_37 sm_50 sm_60 sm_70.
If you want to use the NVIDIA GeForce RTX 3090 GPU with PyTorch, please check the instructions at https://pytorch.org/get-started/locally/

  warnings.warn(incompatible_device_warn.format(device_name, capability, " ".join(arch_list), device_name))
GPU 0 type: NVIDIA GeForce RTX 3090 (compute 8.6)
GPU 0 RAM: 24268 MB
Loading model...

*error traceback intensifies*
```

Well, that's progress. Looking through the output I can see

```shell
Using devices: cuda:0
GPU 0 type: NVIDIA GeForce RTX 3090 (compute 8.6)
GPU 0 RAM: 24268 MB
```

so torch can now see the GPUs. However, the error message in the middle of that
output is now the problem:

> NVIDIA GeForce RTX 3090 with CUDA capability sm_86 is not compatible with the
> current PyTorch installation.
>
> The current PyTorch install supports CUDA capabilities sm_37 sm_50 sm_60
> sm_70.
>
> If you want to use the NVIDIA GeForce RTX 3090 GPU with PyTorch, please check
> the instructions at [https://pytorch.org/get-started/locally/](https://pytorch.org/get-started/locally/)

Like I said earlier, torch/tensorflow/CUDA and deep learning frameworks in
general are really finnicky about versions. It's tricky to get things up and
running so that (i) all the versions work together and (ii) the changes you make
don't break the delicate version relationships between other deep learning
projects you want to run on the same system[^singularity-isolation].

[^singularity-isolation]:
    I had hoped that Singularity might help with the "isolation" part of this,
    but I'm not sure I understand it well enough yet to know how to do it.

After a web search, it seems [like others
](https://github.com/pytorch/vision/issues/4886) [have
had](https://discuss.pytorch.org/t/geforce-rtx-3090-with-cuda-capability-sm-86-is-not-compatible-with-the-current-pytorch-installation/123499)
[similar
issues](https://github.com/crowsonkb/style-transfer-pytorch/issues/1#issuecomment-769701949),
although I tried all the approaches listed there and none of them worked.

## Using a pytorch image from NVIDIA's container registry

Changing tack a bit (after a suggestion from a colleague) I decided to try using
a (Docker) [container image from the NVIDIA
registry](https://catalog.ngc.nvidia.com/orgs/nvidia/containers/pytorch), rather
than the official pytorch channel on Docker Hub.

```shell
$ singularity pull docker://nvcr.io/nvidia/pytorch:22.01-py3
$ singularity shell --nv pytorch_22.01-py3.sif 
Singularity> pip install --user .
```

Now, let's try running the `style_trasfer` script one more time:

```shell
Singularity> PATH="$PATH:~/.local/bin" style_transfer ben.jpg tiger.jpg -o ben-tiger.jpg
Using devices: cuda:0
GPU 0 type: NVIDIA GeForce RTX 3090 (compute 8.6)
GPU 0 RAM: 24268 MB
Loading model...
Processing content image (128x85)...
```

Hooray! It works, and runs, like 10000x faster on the GPU.

## Open questions

I really was just "hacking it until it worked" during this process, so I have a
few open questions.

- What's the "persistance" story with the singularity images (`*.sif` files)? Is
  it like docker, where I `singularity shell` in, do some things, but then any
  changes I make in the shell (container?) don't persist? It doesn't seem like
  that... but need to have a better mental model of how singularity images work.

- I didn't use [venvs](https://virtualenv.pypa.io/en/latest/) or
  [conda](https://docs.conda.io/en/latest/) or
  [poetry](https://python-poetry.org/docs/) or any of the things I'd usually use
  when python-ing on my own machine, partially because of my above questions
  about how the whole singularity shell thing actually works. I just did `pip
  install --user .` and hoped it didn't break anything else. Is that ok? Or
  should I still use venvs in the singularity image?

I will return and try and better understand these things later, but right now
this isn't on the critical path for me so I'll have to park it. This blog post
is really just me opening a ticket for myself to return to later. I share it so
that you, dear reader, can also benefit from my mistakes (and if you know of
better ways to do any of this then do [drop me a
line](mailto:ben.swift@anu.edu.au).

## Footnotes
