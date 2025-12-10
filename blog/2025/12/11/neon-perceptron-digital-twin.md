---
title: Interactive neon perceptron visualisation
tags:
  - ai
  - web
---

::: info

This is a digital twin of the
[neon perceptron](https://github.com/ANUcybernetics/neon-perceptron)---a
physical neural network that my colleague Brendan Traw and I planning to build.
While the physical version is still a work in progress, you can play with this
interactive 3D version right now.

:::

Draw on the 5×5 input grid (on the left) and watch the activations flow through
the network to the output layer. The coloured lines show you what's happening
inside: orange for positive activations, blue for negative, with brightness and
thickness showing the magnitude.

<NeonPerceptron />

## How it works

The neon perceptron has three layers:

1. **Input layer** (left): a 5×5 grid of pixels. Click and drag to "draw" on it.
2. **Hidden layer** (middle): 9 neurons with tanh activation.
3. **Output layer** (right): 10 neurons with softmax activation, displayed as
   seven-segment displays showing digits 0--9.

The coloured lines show the weighted connections between neurons---orange for
positive activations (the input is reinforcing this connection), blue for
negative (the input is inhibiting it). Line thickness and brightness indicate
the magnitude of the activation.

The weights are randomly initialised, so hit "Randomise" to generate a new set.
Since the network hasn't been trained on anything, it won't actually recognise
digits[^untrained]. But you can see how different input patterns produce
different output distributions.

[^untrained]:
    In the physical neon perceptron, we're planning to train it by manually
    adjusting potentiometers---proper old-school analogue computing.

## Controls

- **Reset**: clear the input grid
- **Randomise**: generate new random weights
- **Fullscreen**: expand to fill your screen (press Escape to exit)
- **Wire gamma**: adjust how bright the connection lines appear (higher values
  make weak activations more visible)

You can also click and drag on the background to orbit the camera, and scroll to
zoom.

## The maths

The forward pass is straightforward:

```
hidden = tanh(input @ W1)
output = softmax(hidden @ W2)
```

Where `W1` is a 25×9 weight matrix and `W2` is a 9×10 weight matrix. The weights
are initialised using Xavier/Glorot initialisation.

The seven-segment displays show the softmax probability for each digit
class---brighter segments indicate higher probability. Since the weights are
random, you'll see fairly uniform (and nonsensical) output distributions.
