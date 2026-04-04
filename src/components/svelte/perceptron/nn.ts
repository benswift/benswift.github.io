export function forwardDense(
  input: number[],
  w: number[],
  inSize: number,
  outSize: number,
): number[] {
  const output = Array.from({ length: outSize }, () => 0);
  for (let j = 0; j < outSize; j++) {
    for (let i = 0; i < inSize; i++) {
      output[j] += input[i] * w[i * outSize + j];
    }
  }
  return output;
}

export function softmax(x: number[]): number[] {
  const max = Math.max(...x);
  const exps = x.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function xavierWeights(fanIn: number, fanOut: number): number[] {
  const scale = Math.sqrt(2 / (fanIn + fanOut));
  return Array.from({ length: fanIn * fanOut }, () => (Math.random() * 2 - 1) * scale);
}
