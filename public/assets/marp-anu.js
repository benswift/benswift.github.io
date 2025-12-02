// ANU Marp Theme JavaScript Utilities

// Import dependencies as ES modules
import { QR } from "https://cdn.jsdelivr.net/npm/@qrgrid/core@latest/+esm";
import { animate } from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";
import { SVG } from "https://cdn.jsdelivr.net/npm/@svgdotjs/svg.js@latest/+esm";

// Animated QR Code Generator
export async function createAnimatedQR(containerId, url, options = {}) {
  
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with id "${containerId}" not found`);
    return;
  }
  
  // Create SVG element
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.width = options.size || "500px";
  svg.style.height = options.size || "500px";
  container.appendChild(svg);
  
  const qr = new QR(url, { errorCorrectionLevel: "H" });
  const moduleSize = 10;
  const margin = 40;
  
  svg.setAttribute("viewBox", `0 0 ${qr.gridSize * moduleSize + margin * 2} ${qr.gridSize * moduleSize + margin * 2}`);
  
  // Prime numbers for pseudo-random timing
  const primes = [11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71];
  
  // Create individual rect elements for each module
  qr.data.forEach((bit, i) => {
    if (bit) {
      const row = Math.floor(i / qr.gridSize);
      const col = i % qr.gridSize;
      const x = col * moduleSize + margin;
      const y = row * moduleSize + margin;
      
      // Check if part of finder pattern
      const isFinderPattern = (row < 7 && col < 7) ||
                            (row < 7 && col >= qr.gridSize - 7) ||
                            (row >= qr.gridSize - 7 && col < 7);
      
      // Create rect element
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", x);
      rect.setAttribute("y", y);
      rect.setAttribute("width", moduleSize);
      rect.setAttribute("height", moduleSize);
      rect.setAttribute("fill", isFinderPattern ? "var(--anu-gold)" : "#000000");
      rect.setAttribute("rx", moduleSize / 2);
      rect.setAttribute("ry", moduleSize / 2);
      
      svg.appendChild(rect);
      
      // Animation parameters with pseudo-random timing
      const baseDelay = (i * primes[i % primes.length]) % 5000;
      const duration = 1.5 + (i * primes[(i + 3) % primes.length] % 1000) / 1000; // 1.5-2.5s
      const interval = 8 + (i * primes[(i + 7) % primes.length] % 4000) / 1000; // 8-12s
      
      let currentCorner = 0;
      
      // Animate corner rounding
      setTimeout(() => {
        const animateCorner = () => {
          currentCorner = (currentCorner + 1) % 4;
          const radius = currentCorner % 2 === 0 ? moduleSize / 2 : 0;
          
          animate(
            rect,
            { rx: radius, ry: radius },
            { duration, easing: "ease-in-out" }
          );
        };
        
        animateCorner();
        setInterval(animateCorner, interval * 1000);
      }, baseDelay);
      
      // Color animation
      setTimeout(() => {
        if (isFinderPattern) {
          animate(
            rect,
            { fill: ["var(--anu-gold)", "var(--anu-gold-4)", "var(--anu-gold)"] },
            { 
              duration: 8,
              repeat: Infinity,
              easing: "ease-in-out"
            }
          );
        } else {
          animate(
            rect,
            { fill: ["#000000", "var(--anu-grey-4)", "#000000"] },
            { 
              duration: 10,
              repeat: Infinity,
              easing: "ease-in-out"
            }
          );
        }
      }, baseDelay + 1000);
    }
  });
}