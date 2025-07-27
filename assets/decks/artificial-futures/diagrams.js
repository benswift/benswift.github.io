// Diagram configuration and animation functions for artificial-futures presentation
// Motion is available via window.Motion with animate, inView, stagger
// Note: timeline is not available in the UMD bundle

const diagramConfig = {
  numItems: 8,
  itemWidth: 90,
  itemHeight: 70,
  spacing: 15,
  arrowWidth: 30,
  viewWidth: 1280,
  viewHeight: 720,
  centerY: 360,
  colors: {
    teal: '#0085ad',  // ANU teal
    copper: '#be830e', // ANU gold
    gold: '#be830e',  // ANU gold
    grey: '#888'
  },
  font: {
    size: 14,
    family: '"Public Sans", sans-serif'
  },
  // Spring animation presets for consistent feel
  springs: {
    // Gentle, smooth motion for general transitions
    gentle: 'spring(1, 100, 10, 0)',
    
    // Standard bouncy spring for emphasis
    bouncy: 'spring(1, 80, 10, 0)',
    
    // Quick, snappy response for UI feedback
    snappy: 'spring(1, 150, 12, 0)',
    
    // Playful with more bounce for special effects
    playful: 'spring(1, 60, 8, 0)',
    
    // Smooth with minimal overshoot
    smooth: 'spring(1, 120, 20, 0)',
    
    // Heavy/slow for large group movements
    heavy: 'spring(1, 50, 15, 0)'
  }
};

// Calculate starting X position to center the diagram
diagramConfig.totalWidth = diagramConfig.numItems * diagramConfig.itemWidth +
                           (diagramConfig.numItems - 1) * (diagramConfig.spacing + diagramConfig.arrowWidth);
diagramConfig.startX = (diagramConfig.viewWidth - diagramConfig.totalWidth) / 2;

// Helper function to get item X position
function getItemX(index) {
  return diagramConfig.startX + index * (diagramConfig.itemWidth + diagramConfig.spacing + diagramConfig.arrowWidth);
}

// Helper function to draw an arrow
function drawArrow(draw, x1, y1, x2, y2, color = diagramConfig.colors.grey) {
  const arrowGroup = draw.group();
  
  // Arrow line
  arrowGroup.line(x1, y1, x2 - 8, y2)
    .stroke({ width: 3, color: color });
  
  // Arrow head
  arrowGroup.polygon([[x2-8, y2-5], [x2, y2], [x2-8, y2+5]])
    .fill(color);
    
  return arrowGroup;
}

// Main diagram setup for slide 1 (linear flow)
function setupLinearFlow(containerId) {
  const container = document.getElementById(containerId);
  const draw = SVG().addTo(container).size('100%', '100%').viewbox(0, 0, diagramConfig.viewWidth, diagramConfig.viewHeight);
  
  const items = [];
  const arrows = [];
  
  // Create items
  for (let i = 0; i < diagramConfig.numItems; i++) {
    const x = getItemX(i);
    const y = diagramConfig.centerY - diagramConfig.itemHeight / 2;
    const color = i % 2 === 0 ? diagramConfig.colors.teal : diagramConfig.colors.copper;
    const label = i % 2 === 0 ? (i === 0 ? 'initial\nprompt' : 'caption') : 'image';
    
    const group = draw.group();
    
    // Rectangle
    const rect = group.rect(diagramConfig.itemWidth, diagramConfig.itemHeight)
      .move(x, y)
      .fill(color)
      .stroke({ width: 2, color: color });
    
    // Text
    const text = group.text(label)
      .font({ 
        size: diagramConfig.font.size, 
        family: diagramConfig.font.family,
        fill: '#fff'
      })
      .center(x + diagramConfig.itemWidth / 2, y + diagramConfig.itemHeight / 2);
    
    // Initially hidden
    group.opacity(0);
    items.push(group);
    
    // Create arrow
    if (i < diagramConfig.numItems - 1) {
      const arrow = drawArrow(
        draw,
        x + diagramConfig.itemWidth,
        y + diagramConfig.itemHeight / 2,
        getItemX(i + 1),
        y + diagramConfig.itemHeight / 2
      );
      arrow.opacity(0);
      arrows.push(arrow);
    } else {
      // Add arrow after last item to indicate continuation
      const arrow = drawArrow(
        draw,
        x + diagramConfig.itemWidth,
        y + diagramConfig.itemHeight / 2,
        x + diagramConfig.itemWidth + diagramConfig.spacing + diagramConfig.arrowWidth,
        y + diagramConfig.itemHeight / 2
      );
      arrow.opacity(0);
      arrows.push(arrow);
    }
  }
  
  return { draw, items, arrows };
}

// Diagram setup for slide 2 (with embeddings)
function setupTextToImageEmbeddings(containerId) {
  const container = document.getElementById(containerId);
  const draw = SVG().addTo(container).size('100%', '100%').viewbox(0, 0, diagramConfig.viewWidth, diagramConfig.viewHeight);
  
  // Create a main group for all boxes and arrows
  const mainGroup = draw.group();
  
  const items = [];
  const arrows = [];
  const embeddings = [];
  const embArrows = [];
  
  // Calculate vertical positions to center the entire figure
  // Embeddings will be at centerY + 70, so we need to move boxes up to balance
  const embY = diagramConfig.centerY + 70;
  const embRadius = 35;
  const totalHeight = (embY + embRadius) - (diagramConfig.centerY - 70 - diagramConfig.itemHeight);
  const figureCenter = (embY + embRadius + (diagramConfig.centerY - 70 - diagramConfig.itemHeight)) / 2;
  const offset = diagramConfig.centerY - figureCenter;
  
  // Position boxes above center to balance with embeddings below
  const itemY = diagramConfig.centerY - 70 - diagramConfig.itemHeight + offset;
  
  for (let i = 0; i < diagramConfig.numItems; i++) {
    const x = getItemX(i);
    const color = i % 2 === 0 ? diagramConfig.colors.teal : diagramConfig.colors.copper;
    const label = i % 2 === 0 ? (i === 0 ? 'initial\nprompt' : 'caption') : 'image';
    
    const group = mainGroup.group();
    
    // Rectangle
    const rect = group.rect(diagramConfig.itemWidth, diagramConfig.itemHeight)
      .move(x, itemY)
      .fill(color)
      .stroke({ width: 2, color: color });
    
    // Text
    const text = group.text(label)
      .font({ 
        size: diagramConfig.font.size, 
        family: diagramConfig.font.family,
        fill: '#fff'
      })
      .center(x + diagramConfig.itemWidth / 2, itemY + diagramConfig.itemHeight / 2);
    
    // Make items visible from the start
    group.opacity(1);
    items.push(group);
    
    // Create arrow (except after last item)
    if (i < diagramConfig.numItems - 1) {
      const arrow = drawArrow(
        mainGroup,
        x + diagramConfig.itemWidth,
        itemY + diagramConfig.itemHeight / 2,
        getItemX(i + 1),
        itemY + diagramConfig.itemHeight / 2
      );
      arrow.opacity(1);
      arrows.push(arrow);
    }
    
    // Create embeddings for teal boxes
    if (i % 2 === 0) {
      
      const embGroup = draw.group();
      
      // Circle - start at same position as rectangle
      const circle = embGroup.circle(embRadius * 2)
        .center(x + diagramConfig.itemWidth / 2, itemY + diagramConfig.itemHeight / 2)
        .fill(diagramConfig.colors.teal)
        .stroke({ width: 3, color: diagramConfig.colors.teal });
      
      embGroup.opacity(0);
      embeddings.push({ group: embGroup, circle, finalY: embY });
      
      // Arrow from embedding to next image (except for last embedding)
      if (i < diagramConfig.numItems - 2) {
        const nextImageX = getItemX(i + 2);
        const embArrow = drawArrow(
          draw,
          x + diagramConfig.itemWidth / 2 + embRadius,
          embY,
          nextImageX,
          embY
        );
        embArrow.opacity(0);
        embArrows.push(embArrow);
      } else if (i === diagramConfig.numItems - 2) {
        // Add arrow after last embedding (emb4) to indicate continuation
        // Calculate the same length as other embedding arrows
        const arrowStartX = x + diagramConfig.itemWidth / 2 + embRadius;
        const normalArrowLength = getItemX(2) - (getItemX(0) + diagramConfig.itemWidth / 2 + embRadius);
        const arrowEndX = arrowStartX + normalArrowLength;
        
        const embArrow = drawArrow(
          draw,
          arrowStartX,
          embY,
          arrowEndX,
          embY
        );
        embArrow.opacity(0);
        embArrows.push(embArrow);
      }
    }
  }
  
  return { draw, mainGroup, items, arrows, embeddings, embArrows };
}

// Animation functions
function animateLinearFlow(diagram) {
  const { draw, items, arrows } = diagram;
  const itemDelay = 0.5; // 0.5 second delay between items (2x faster)
  
  let animations = [];
  
  // Use Motion's inView to handle visibility
  const slideElement = draw.node.closest('section');
  if (slideElement) {
    Motion.inView(slideElement, () => {
      // Combine items and arrows in order
      const elements = [];
      items.forEach((item, i) => {
        elements.push(item);
        if (i < arrows.length) {
          elements.push(arrows[i]);
        }
      });
      
      // Calculate total duration for one complete cycle
      const cycleDuration = elements.length * itemDelay;
      
      // Create individual looping animations for each element
      elements.forEach((el, i) => {
        const delay = i * itemDelay;
        
        // Use keyframes to create a looping pattern
        const anim = Motion.animate(
          el.node,
          { 
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1, 1, 0.8]
          },
          {
            duration: cycleDuration,
            delay: delay,
            repeat: Infinity,
            offset: [0, 0.05, 0.95, 1], // Quick fade in/out at start/end
            easing: diagramConfig.springs.bouncy
          }
        );
        
        animations.push(anim);
      });
      
      // Return cleanup function
      return () => {
        // Stop all animations
        animations.forEach(anim => anim.cancel());
        animations = [];
        // Reset elements
        items.forEach(item => item.opacity(0));
        arrows.forEach(arrow => arrow.opacity(0));
      };
    }, { amount: 0.5 });
  }
}

// Animation for diagram 2 - animates embeddings from behind rectangles down to final position
function animateTextToImageEmbeddings(diagram) {
  const { draw, mainGroup, embeddings, embArrows } = diagram;
  const embDuration = 0.6; // 600ms in seconds
  const embDelay = 0.2; // 200ms in seconds
  
  // Calculate initial positions for reset
  const getInitialY = (i) => {
    return diagramConfig.centerY - 70 - diagramConfig.itemHeight + 
           ((diagramConfig.centerY + 70 + 35) - (diagramConfig.centerY - 70 - diagramConfig.itemHeight)) / 2 - diagramConfig.centerY +
           diagramConfig.itemHeight / 2;
  };
  
  // Use Motion's inView to handle visibility
  const slideElement = draw.node.closest('section');
  if (slideElement) {
    Motion.inView(slideElement, () => {
      const animations = [];
      
      // Initial delay of 0.5s, then animate embeddings
      embeddings.forEach((emb, i) => {
        const startDelay = 0.5 + i * embDelay;
        const initialY = getInitialY(i);
        const deltaY = emb.finalY - initialY;
        
        animations.push(
          Motion.animate(emb.group.node, { opacity: 1 }, { 
            duration: embDuration, 
            delay: startDelay,
            ease: diagramConfig.springs.gentle 
          }),
          Motion.animate(emb.circle.node, { cy: emb.finalY }, { 
            duration: embDuration, 
            delay: startDelay,
            ease: diagramConfig.springs.gentle 
          })
        );
      });
      
      // Animate arrows after embeddings
      const arrowStartTime = 0.5 + (embeddings.length - 1) * embDelay + embDuration;
      embArrows.forEach((arrow, i) => {
        animations.push(
          Motion.animate(arrow.node, { opacity: 1 }, { 
            duration: embDuration,
            delay: arrowStartTime + i * embDelay,
            ease: diagramConfig.springs.gentle
          })
        );
      });
      
      // Return cleanup function
      return () => {
        // Cancel all animations
        animations.forEach(anim => anim.cancel());
        
        // Reset embeddings to initial position
        embeddings.forEach((emb, i) => {
          emb.group.opacity(0);
          const rectY = getInitialY(i);
          emb.circle.cy(rectY);
        });
        embArrows.forEach(arrow => arrow.opacity(0));
      };
    }, { amount: 0.5 });
  }
}

// Diagram setup for slide 3 (100 embeddings)
function setupEmbeddingsRow(containerId) {
  const container = document.getElementById(containerId);
  const draw = SVG().addTo(container).size('100%', '100%').viewbox(0, 0, diagramConfig.viewWidth, diagramConfig.viewHeight);
  
  const embeddings = [];
  const totalEmbeddings = 50;
  const initialRadius = 35;
  const finalRadius = 5; // Even smaller
  const initialY = diagramConfig.centerY + 70; // Same as diagram 2
  
  // Calculate initial spacing (same as diagram 2 - every other box)
  const initialSpacing = (diagramConfig.itemWidth + diagramConfig.spacing + diagramConfig.arrowWidth) * 2;
  
  // Calculate final spacing to fit 50 circles
  const finalSpacing = (diagramConfig.viewWidth - 100) / totalEmbeddings;
  
  // Create initial 4 embeddings visible (matching diagram 2 positions)
  for (let i = 0; i < 4; i++) {
    const x = getItemX(i * 2) + diagramConfig.itemWidth / 2;
    
    const embGroup = draw.group();
    
    // Circle
    const circle = embGroup.circle(initialRadius * 2)
      .center(x, initialY)
      .fill(diagramConfig.colors.teal)
      .stroke({ width: 2, color: diagramConfig.colors.teal });
    
    embGroup.opacity(1);
    embeddings.push({ group: embGroup, circle, index: i });
  }
  
  // Create remaining embeddings (initially hidden, positioned off-screen to the right)
  for (let i = 4; i < totalEmbeddings; i++) {
    const embGroup = draw.group();
    
    // Position with same spacing as initial 4, continuing to the right (off-screen)
    // Start after the 4th embedding (which is at position of box 6)
    const lastEmbX = getItemX(6) + diagramConfig.itemWidth / 2;
    const x = lastEmbX + (i - 3) * initialSpacing;
    
    // Circle
    const circle = embGroup.circle(initialRadius * 2)
      .center(x, initialY)
      .fill(diagramConfig.colors.teal)
      .stroke({ width: 2, color: diagramConfig.colors.teal });
    
    embGroup.opacity(0);
    embeddings.push({ group: embGroup, circle, index: i });
  }
  
  return { draw, embeddings, totalEmbeddings, initialRadius, finalRadius, initialY, initialSpacing, finalSpacing };
}

// Animation for diagram 3 - expand to 50 embeddings and reorganize
function animateEmbeddingsRow(diagram) {
  const { draw, embeddings, totalEmbeddings, initialRadius, finalRadius, initialY, initialSpacing, finalSpacing } = diagram;
  
  // Store initial absolute positions for all embeddings
  const initialPositions = embeddings.map((emb, i) => {
    if (i < 4) {
      // First 4 embeddings
      return {
        x: getItemX(i * 2) + diagramConfig.itemWidth / 2,
        y: initialY
      };
    } else {
      // Remaining embeddings
      const lastEmbX = getItemX(6) + diagramConfig.itemWidth / 2;
      return {
        x: lastEmbX + (i - 3) * initialSpacing,
        y: initialY
      };
    }
  });
  
  // Store final absolute positions for all embeddings
  const finalPositions = embeddings.map((emb, i) => ({
    x: 50 + i * finalSpacing,
    y: diagramConfig.centerY
  }));
  
  // Use Motion's inView to handle visibility
  const slideElement = draw.node.closest('section');
  if (slideElement) {
    Motion.inView(slideElement, () => {
      const animations = [];
      
      // Phase 1: Fade in remaining embeddings
      animations.push(
        Motion.animate(embeddings.slice(4).map(emb => emb.group.node), 
          { opacity: 1 }, 
          { duration: 1, delay: Motion.stagger(0.01), ease: diagramConfig.springs.gentle }
        )
      );
      
      // Phase 2: Move all embeddings to compressed positions and shrink (starts at 1.5s)
      embeddings.forEach((emb, i) => {
        animations.push(
          Motion.animate(emb.circle.node, { 
            cx: finalPositions[i].x, 
            cy: finalPositions[i].y,
            r: finalRadius
          }, { duration: 2, delay: 1.5 })
        );
      });
      
      
      // Return cleanup function
      return () => {
        // Cancel animations
        animations.forEach(anim => anim.cancel());
        
        // Reset all embeddings to initial absolute positions
        embeddings.forEach((emb, i) => {
          // Reset circle
          emb.circle.size(initialRadius * 2, initialRadius * 2)
            .center(initialPositions[i].x, initialPositions[i].y);
          
          // Set visibility
          emb.group.opacity(i < 4 ? 1 : 0);
        });
      };
    }, { amount: 0.5 });
  }
}

// Diagram setup for slide 4 (10x50 grid of embeddings)
function setupEmbeddingsGrid(containerId) {
  const container = document.getElementById(containerId);
  const draw = SVG().addTo(container).size('100%', '100%').viewbox(0, 0, diagramConfig.viewWidth, diagramConfig.viewHeight);
  
  const embeddings = [];
  const cols = 50;
  const rows = 10;
  const totalEmbeddings = cols * rows;
  const circleRadius = 5;
  
  // Calculate spacing
  const horizontalSpacing = (diagramConfig.viewWidth - 100) / cols;
  const verticalSpacing = 50; // Space between rows
  const topMargin = 80; // Distance from top of slide
  
  // Create all circles in their final grid positions (all initially hidden)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 50 + col * horizontalSpacing;
      const y = topMargin + row * verticalSpacing;
      
      const embGroup = draw.group();
      
      const circle = embGroup.circle(circleRadius * 2)
        .center(x, y)
        .fill(diagramConfig.colors.teal)
        .stroke({ width: 2, color: diagramConfig.colors.teal });
      
      embGroup.opacity(0);
      embeddings.push({ group: embGroup, circle, row, col });
    }
  }
  
  return { draw, embeddings, cols, rows, horizontalSpacing, verticalSpacing, topMargin, circleRadius };
}

// Animation for diagram 4 - fade in full grid with diagonal stagger
function animateEmbeddingsGrid(diagram) {
  const { draw, embeddings, cols, rows } = diagram;
  
  // Use Motion's inView to handle visibility
  const slideElement = draw.node.closest('section');
  if (slideElement) {
    Motion.inView(slideElement, () => {
      const animations = [];
      
      // Animate all circles with a custom stagger based on row and column
      // This creates a diagonal wave effect from top-left
      embeddings.forEach((emb, i) => {
        const row = emb.row;
        const col = emb.col;
        // Diagonal distance from top-left corner
        const diagonalDelay = (row + col) * 0.015; // 15ms per diagonal step
        
        animations.push(
          Motion.animate(emb.group.node, 
            { opacity: 1 }, 
            { duration: 0.4, delay: 0.5 + diagonalDelay, ease: diagramConfig.springs.bouncy }
          )
        );
      });
      
      // Return cleanup function
      return () => {
        // Cancel animations
        animations.forEach(anim => anim.cancel());
        
        // Hide all circles
        embeddings.forEach((emb) => {
          emb.group.opacity(0);
        });
      };
    }, { amount: 0.5 });
  }
}

// Diagram setup for slide 5 (grid to clustered positions with k-means)
function setupKMeansClustering(containerId) {
  const container = document.getElementById(containerId);
  const draw = SVG().addTo(container).size('100%', '100%').viewbox(0, 0, diagramConfig.viewWidth, diagramConfig.viewHeight);
  
  const embeddings = [];
  const cols = 50;
  const rows = 10;
  const totalEmbeddings = cols * rows;
  const circleRadius = 5;
  const numClusters = 3;
  
  // Calculate spacing (same as diagram 4)
  const horizontalSpacing = (diagramConfig.viewWidth - 100) / cols;
  const verticalSpacing = 50;
  const topMargin = 80;
  
  // Define cluster colors using ANU theme colors
  const clusterColors = [
    'var(--anu-gold-3)',   // gold-3 (more distinct from copper)
    'var(--anu-teal)',     // teal
    'var(--anu-copper)'    // copper
  ];
  
  // Generate cluster centers with better spacing for 3 distinct clusters
  const margin = 0.2; // 20% margin from edges
  const clusterCenters = [];
  
  // Position clusters in a triangular arrangement for better separation
  const centerX = diagramConfig.viewWidth / 2;
  const centerY = diagramConfig.viewHeight / 2;
  const radius = Math.min(diagramConfig.viewWidth, diagramConfig.viewHeight) * 0.3;
  
  for (let i = 0; i < numClusters; i++) {
    const angle = (i * 2 * Math.PI / numClusters) - Math.PI / 2; // Start from top
    clusterCenters.push({
      x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
      y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50
    });
  }
  
  // Create all circles in grid formation (all visible from start)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = 50 + col * horizontalSpacing;
      const y = topMargin + row * verticalSpacing;
      
      const embGroup = draw.group();
      
      const circle = embGroup.circle(circleRadius * 2)
        .center(x, y)
        .fill(diagramConfig.colors.teal)
        .stroke({ width: 3, color: diagramConfig.colors.teal });
      
      embGroup.opacity(1);
      
      // Generate clustered target position
      // 95% chance to belong to a cluster, 5% to be an outlier
      let targetX, targetY;
      
      if (Math.random() < 0.95) {
        // Choose a random cluster
        const cluster = clusterCenters[Math.floor(Math.random() * numClusters)];
        // Position around cluster center with gaussian-like distribution
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.abs(randomGaussian()) * 80 + Math.random() * 40; // Moderate clustering
        targetX = cluster.x + Math.cos(angle) * distance;
        targetY = cluster.y + Math.sin(angle) * distance;
      } else {
        // Outlier - random position
        targetX = margin * diagramConfig.viewWidth + Math.random() * (1 - 2 * margin) * diagramConfig.viewWidth;
        targetY = margin * diagramConfig.viewHeight + Math.random() * (1 - 2 * margin) * diagramConfig.viewHeight;
      }
      
      // Don't clip the points - let them go outside viewport if needed
      
      embeddings.push({ 
        group: embGroup, 
        circle, 
        gridX: x, 
        gridY: y,
        targetX,
        targetY,
        currentX: x, // Start at grid position
        currentY: y,
        cluster: -1 // Will be assigned during k-means
      });
    }
  }
  
  return { draw, embeddings, totalEmbeddings, numClusters, clusterColors, clusterCenters, circleRadius };
}

// Simple gaussian random number generator
function randomGaussian() {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

// K-means clustering implementation
function kMeansStep(embeddings, centroids, numClusters) {
  // Assign points to nearest centroid
  let changed = false;
  embeddings.forEach(emb => {
    let minDist = Infinity;
    let newCluster = -1;
    
    for (let k = 0; k < numClusters; k++) {
      const dist = Math.sqrt(
        Math.pow(emb.currentX - centroids[k].x, 2) + 
        Math.pow(emb.currentY - centroids[k].y, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        newCluster = k;
      }
    }
    
    if (emb.cluster !== newCluster) {
      emb.cluster = newCluster;
      changed = true;
    }
  });
  
  // Update centroids
  const newCentroids = [];
  for (let k = 0; k < numClusters; k++) {
    const clusterPoints = embeddings.filter(emb => emb.cluster === k);
    if (clusterPoints.length > 0) {
      const sumX = clusterPoints.reduce((sum, emb) => sum + emb.currentX, 0);
      const sumY = clusterPoints.reduce((sum, emb) => sum + emb.currentY, 0);
      newCentroids.push({
        x: sumX / clusterPoints.length,
        y: sumY / clusterPoints.length
      });
    } else {
      // Keep old centroid if no points assigned
      newCentroids.push(centroids[k]);
    }
  }
  
  return { centroids: newCentroids, changed };
}

// Animation for diagram 5 - animate from grid to clustered positions with k-means
function animateKMeansClustering(diagram) {
  const { draw, embeddings, numClusters, clusterColors, circleRadius } = diagram;
  
  let kmeansInterval = null;
  let restartTimeout = null;
  let clickHandler = null;
  let hasAnimatedToGrid = false;
  let isAnimating = false;
  
  // Function to animate back to grid
  function animateToGrid() {
    if (hasAnimatedToGrid || isAnimating) return;
    hasAnimatedToGrid = true;
    isAnimating = true;
    
    // Cancel any pending restart
    if (restartTimeout) {
      clearTimeout(restartTimeout);
      restartTimeout = null;
    }
    
    // Animate all circles back to grid positions with stagger
    embeddings.forEach((emb, i) => {
      Motion.animate(emb.circle.node, 
        { cx: emb.gridX, cy: emb.gridY }, 
        { duration: 2, delay: i * 0.002, ease: diagramConfig.springs.gentle }
      );
    });
    
    // Update positions after animation
    setTimeout(() => {
      embeddings.forEach(emb => {
        emb.currentX = emb.gridX;
        emb.currentY = emb.gridY;
      });
      isAnimating = false;
    }, 2000 + embeddings.length * 2);
  }
  
  // Function to run the clustering animation
  function runClustering() {
    if (hasAnimatedToGrid || isAnimating) return;
    
    isAnimating = true;
    const animations = [];
    
    // First fade to grey and fully reset cluster state
    embeddings.forEach(emb => {
      // Stop any ongoing animations on this element
      Motion.animate(emb.circle.node, 
        { fill: 'var(--anu-grey-2)', stroke: 'var(--anu-grey-2)' }, 
        { duration: 0.3, ease: diagramConfig.springs.snappy }
      );
      emb.cluster = -1;
      emb.prevCluster = undefined;
    });
    
    // Wait for grey animation to complete, then scatter to new positions
    setTimeout(() => {
      // Generate new clustered positions (with 3 underlying clusters)
      const centerX = diagramConfig.viewWidth / 2;
      const centerY = diagramConfig.viewHeight / 2;
      const radius = Math.min(diagramConfig.viewWidth, diagramConfig.viewHeight) * 0.3;
      
      // Create 3 cluster centers
      const newClusterCenters = [];
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
        newClusterCenters.push({
          x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
          y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50
        });
      }
      
      embeddings.forEach((emb, idx) => {
        // 95% chance to belong to a cluster
        if (Math.random() < 0.95) {
          const clusterIdx = idx % 3; // Distribute evenly across clusters
          const cluster = newClusterCenters[clusterIdx];
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.abs(randomGaussian()) * 90 + Math.random() * 50;
          emb.targetX = cluster.x + Math.cos(angle) * distance;
          emb.targetY = cluster.y + Math.sin(angle) * distance;
        } else {
          // Outlier
          const edgeMargin = 0.1;
          emb.targetX = edgeMargin * diagramConfig.viewWidth + Math.random() * (1 - 2 * edgeMargin) * diagramConfig.viewWidth;
          emb.targetY = edgeMargin * diagramConfig.viewHeight + Math.random() * (1 - 2 * edgeMargin) * diagramConfig.viewHeight;
        }
        
        // Don't clip the points - let them go outside viewport if needed
      });
      
      // Animate to scattered positions (explicitly keep fill/stroke grey)
      embeddings.forEach((emb, i) => {
        animations.push(
          Motion.animate(emb.circle.node,
            { 
              cx: emb.targetX, 
              cy: emb.targetY,
              fill: 'var(--anu-grey-2)',
              stroke: 'var(--anu-grey-2)'
            },
            { duration: 1.5, delay: i * 0.001 }
          )
        );
      });
      
      // Wait for scatter animation to fully complete before starting k-means
      const scatterDuration = 1500 + embeddings.length * 1; // 1.5s + max delay
      
      setTimeout(() => {
        // Update positions
        embeddings.forEach(emb => {
          emb.currentX = emb.targetX;
          emb.currentY = emb.targetY;
        });
        
        // Add a pause before starting k-means
        setTimeout(() => {
          // Run k-means clustering
          // Initialize random centroids
          let centroids = [];
          for (let k = 0; k < numClusters; k++) {
            const randomEmb = embeddings[Math.floor(Math.random() * embeddings.length)];
            centroids.push({ x: randomEmb.currentX, y: randomEmb.currentY });
          }
          
          let iteration = 0;
          const maxIterations = 20;
          
          // First k-means step
          const firstResult = kMeansStep(embeddings, centroids, numClusters);
          centroids = firstResult.centroids;
          
          // Animate initial colors with pop effect
          embeddings.forEach((emb, i) => {
            if (emb.cluster >= 0) {
              Motion.animate(emb.circle.node,
                { r: [circleRadius, circleRadius * 2, circleRadius], 
                  fill: clusterColors[emb.cluster],
                  stroke: clusterColors[emb.cluster] },
                { duration: 0.4, delay: i * 0.003, ease: diagramConfig.springs.playful }
              );
            }
          });
          
          // Set initial cluster assignments
          setTimeout(() => {
            embeddings.forEach(emb => {
              emb.prevCluster = emb.cluster;
            });
          }, embeddings.length * 3 + 500);
          
          // Continue k-means iterations
          setTimeout(() => {
            kmeansInterval = setInterval(() => {
              iteration++;
              
              const result = kMeansStep(embeddings, centroids, numClusters);
              
              if (result.changed) {
                centroids = result.centroids;
                
                // Update colors for changed clusters
                embeddings.forEach((emb, i) => {
                  if (emb.cluster >= 0 && emb.prevCluster !== emb.cluster) {
                    Motion.animate(emb.circle.node,
                      { r: [circleRadius, circleRadius * 1.75, circleRadius],
                        fill: clusterColors[emb.cluster],
                        stroke: clusterColors[emb.cluster] },
                      { duration: 0.3, delay: i * 0.0005, ease: diagramConfig.springs.snappy }
                    );
                  }
                  emb.prevCluster = emb.cluster;
                });
              } else {
                // K-means converged
                clearInterval(kmeansInterval);
                kmeansInterval = null;
                isAnimating = false;
                
                // Schedule restart after 10 seconds
                restartTimeout = setTimeout(() => {
                  runClustering();
                }, 10000);
              }
              
              if (iteration >= maxIterations) {
                clearInterval(kmeansInterval);
                kmeansInterval = null;
                isAnimating = false;
                
                // Schedule restart after 10 seconds
                restartTimeout = setTimeout(() => {
                  runClustering();
                }, 10000);
              }
            }, 1000);
          }, 2000);
        }, 1000); // 1 second pause after scatter before starting k-means
      }, scatterDuration);
    }, 800); // Wait for grey animation (300ms) + small pause
  }
  
  // Use Motion's inView to handle visibility
  const slideElement = draw.node.closest('section');
  if (slideElement) {
    Motion.inView(slideElement, () => {
      // Set up click handler
      if (!clickHandler) {
        clickHandler = () => {
          animateToGrid();
        };
        slideElement.addEventListener('click', clickHandler);
      }
      
      // Start with points at grid positions (matching diagram 4's final state)
      embeddings.forEach((emb) => {
        emb.circle.center(emb.gridX, emb.gridY);
        emb.circle.fill(diagramConfig.colors.teal).stroke({ color: diagramConfig.colors.teal, width: 3 });
        emb.currentX = emb.gridX;
        emb.currentY = emb.gridY;
        emb.cluster = -1;
        emb.prevCluster = undefined;
      });
      
      // Generate initial cluster positions for scattering
      const centerX = diagramConfig.viewWidth / 2;
      const centerY = diagramConfig.viewHeight / 2;
      const radius = Math.min(diagramConfig.viewWidth, diagramConfig.viewHeight) * 0.3;
      
      // Create 3 initial cluster centers
      const initialClusterCenters = [];
      for (let i = 0; i < 3; i++) {
        const angle = (i * 2 * Math.PI / 3) - Math.PI / 2;
        initialClusterCenters.push({
          x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
          y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50
        });
      }
      
      // Calculate target positions for each embedding
      embeddings.forEach((emb, idx) => {
        let targetX, targetY;
        
        // 95% chance to belong to a cluster
        if (Math.random() < 0.95) {
          const clusterIdx = idx % 3; // Distribute evenly across clusters
          const cluster = initialClusterCenters[clusterIdx];
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.abs(randomGaussian()) * 90 + Math.random() * 50;
          targetX = cluster.x + Math.cos(angle) * distance;
          targetY = cluster.y + Math.sin(angle) * distance;
        } else {
          // Outlier
          const edgeMargin = 0.1;
          targetX = edgeMargin * diagramConfig.viewWidth + Math.random() * (1 - 2 * edgeMargin) * diagramConfig.viewWidth;
          targetY = edgeMargin * diagramConfig.viewHeight + Math.random() * (1 - 2 * edgeMargin) * diagramConfig.viewHeight;
        }
        
        // Don't clip the points - let them go outside viewport if needed
        
        emb.targetX = targetX;
        emb.targetY = targetY;
      });
      
      // Animate from grid to scattered positions
      isAnimating = true;
      const animations = [];
      
      // Animate all circles from grid to scattered positions with diagonal stagger
      embeddings.forEach((emb, i) => {
        const row = Math.floor(i / 50); // 50 columns
        const col = i % 50;
        // Diagonal distance from top-left corner
        const diagonalDelay = (row + col) * 0.01; // 10ms per diagonal step
        
        animations.push(
          Motion.animate(emb.circle.node,
            { 
              cx: emb.targetX, 
              cy: emb.targetY,
              fill: 'var(--anu-grey-2)',
              stroke: 'var(--anu-grey-2)'
            },
            { duration: 2, delay: 0.5 + diagonalDelay, ease: diagramConfig.springs.gentle }
          )
        );
      });
      
      // Wait for scatter animation to complete before starting k-means
      const scatterDuration = 2500 + 58 * 10; // 2s animation + max diagonal delay (9 rows + 49 cols = 58 * 10ms)
      
      setTimeout(() => {
        // Update positions after scatter animation
        embeddings.forEach(emb => {
          emb.currentX = emb.targetX;
          emb.currentY = emb.targetY;
        });
        
        // Initialize random centroids
        let centroids = [];
        for (let k = 0; k < numClusters; k++) {
          const randomEmb = embeddings[Math.floor(Math.random() * embeddings.length)];
          centroids.push({ x: randomEmb.currentX, y: randomEmb.currentY });
        }
        
        let iteration = 0;
        const maxIterations = 20;
        
        // First k-means step
        const firstResult = kMeansStep(embeddings, centroids, numClusters);
        centroids = firstResult.centroids;
        
        // Animate initial colors with pop effect
        embeddings.forEach((emb, i) => {
          if (emb.cluster >= 0) {
            Motion.animate(emb.circle.node,
              { r: [circleRadius, circleRadius * 2, circleRadius], 
                fill: clusterColors[emb.cluster],
                stroke: clusterColors[emb.cluster] },
              { duration: 0.4, delay: i * 0.003, ease: diagramConfig.springs.playful }
            );
          }
        });
        
        // Set initial cluster assignments
        setTimeout(() => {
          embeddings.forEach(emb => {
            emb.prevCluster = emb.cluster;
          });
        }, embeddings.length * 3 + 500);
        
        // Continue k-means iterations
        setTimeout(() => {
          kmeansInterval = setInterval(() => {
          iteration++;
          
          const result = kMeansStep(embeddings, centroids, numClusters);
          
          if (result.changed) {
            centroids = result.centroids;
            
            // Update colors for changed clusters
            embeddings.forEach((emb, i) => {
              if (emb.cluster >= 0 && emb.prevCluster !== emb.cluster) {
                Motion.animate(emb.circle.node,
                  { r: [circleRadius, circleRadius * 1.75, circleRadius],
                    fill: clusterColors[emb.cluster],
                    stroke: clusterColors[emb.cluster] },
                  { duration: 0.3, delay: i * 0.0005, ease: "ease-in-out" }
                );
              }
              emb.prevCluster = emb.cluster;
            });
          } else {
            // K-means converged
            clearInterval(kmeansInterval);
            kmeansInterval = null;
            isAnimating = false;
            
            // Schedule restart after 10 seconds
            restartTimeout = setTimeout(() => {
              runClustering();
            }, 10000);
          }
          
          if (iteration >= maxIterations) {
            clearInterval(kmeansInterval);
            kmeansInterval = null;
            isAnimating = false;
            
            // Schedule restart after 10 seconds
            restartTimeout = setTimeout(() => {
              runClustering();
            }, 10000);
          }
        }, 1000);
      }, 2000);
      }, scatterDuration);
      
      // Return cleanup function
      return () => {
        // Remove click handler
        if (clickHandler) {
          slideElement.removeEventListener('click', clickHandler);
          clickHandler = null;
        }
        
        // Clear restart timeout
        if (restartTimeout) {
          clearTimeout(restartTimeout);
          restartTimeout = null;
        }
        
        // Clear k-means interval
        if (kmeansInterval) {
          clearInterval(kmeansInterval);
          kmeansInterval = null;
        }
        
        // Reset state
        hasAnimatedToGrid = false;
        isAnimating = false;
        
        // Reset all circles to grid
        embeddings.forEach((emb) => {
          emb.circle.center(emb.gridX, emb.gridY);
          emb.circle.fill(diagramConfig.colors.teal).stroke({ color: diagramConfig.colors.teal, width: 3 });
          emb.cluster = -1;
          emb.prevCluster = undefined;
          emb.currentX = emb.gridX;
          emb.currentY = emb.gridY;
        });
      };
    }, { amount: 0.5 });
  }
}

// Diagram setup for slide 6 (persistent homology with growing balls)
function setupPersistentHomology(containerId) {
  const container = document.getElementById(containerId);
  const draw = SVG().addTo(container).size('100%', '100%').viewbox(0, 0, diagramConfig.viewWidth, diagramConfig.viewHeight);
  
  const embeddings = [];
  const numPoints = 20;
  const pointRadius = 8;
  const maxBallRadius = 300;
  
  // Generate positions from 3 underlying clusters (unknown to k-means)
  const positions = [];
  const numLocalClusters = 3;
  const clusterRadius = 100;
  
  // Generate cluster centers with better spacing for 3 clusters
  const clusterCenters = [];
  for (let i = 0; i < numLocalClusters; i++) {
    clusterCenters.push({
      x: 320 + (i * 280) + (Math.random() - 0.5) * 80,
      y: 360 + (i === 1 ? -150 : 150 * (i === 0 ? -1 : 1)) + (Math.random() - 0.5) * 80
    });
  }
  
  // Generate points from clusters
  for (let i = 0; i < numPoints; i++) {
    // Assign each point to a cluster deterministically to ensure balanced distribution
    const clusterIndex = i % numLocalClusters;
    const cluster = clusterCenters[clusterIndex];
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.abs(randomGaussian()) * clusterRadius * 0.5 + Math.random() * clusterRadius * 0.5;
    const x = cluster.x + Math.cos(angle) * distance;
    const y = cluster.y + Math.sin(angle) * distance;
    positions.push({ x, y, sourceCluster: clusterIndex });
  }
  
  // Create embedding circles
  positions.forEach((pos, i) => {
    const embGroup = draw.group();
    
    // Growing ball (initially hidden)
    const ball = embGroup.circle(0)
      .center(pos.x, pos.y)
      .fill('none')
      .stroke({ width: 2, color: diagramConfig.colors.teal, opacity: 0.4 });
    
    // Point circle (on top of ball)
    const point = embGroup.circle(pointRadius * 2)
      .center(pos.x, pos.y)
      .fill(diagramConfig.colors.teal)
      .stroke({ width: 2, color: diagramConfig.colors.teal });
    
    embGroup.opacity(1);
    
    embeddings.push({ 
      group: embGroup, 
      point, 
      ball,
      x: pos.x,
      y: pos.y,
      radius: 0,
      connected: new Set([i]), // Track connected components
      componentId: i, // Initial component ID
      hasBeenConnected: false // Track if point has been connected to another point
    });
  });
  
  // Create connection lines group AFTER all embeddings (so it's on top)
  const connectionsGroup = draw.group();
  
  // Move connections group to front
  connectionsGroup.front();
  
  return { draw, embeddings, connectionsGroup, numPoints, pointRadius, maxBallRadius };
}

// Animation for diagram 6 - growing balls and persistent homology
function animatePersistentHomology(diagram) {
  const { draw, embeddings, connectionsGroup, numPoints, pointRadius, maxBallRadius } = diagram;
  
  // Helper function to generate new positions from 3 underlying clusters
  function generateNewPositions() {
    const positions = [];
    const numLocalClusters = 3;
    const clusterRadius = 100;
    
    // Generate cluster centers with better spacing for 3 clusters
    const clusterCenters = [];
    for (let i = 0; i < numLocalClusters; i++) {
      clusterCenters.push({
        x: 320 + (i * 280) + (Math.random() - 0.5) * 80,
        y: 360 + (i === 1 ? -150 : 150 * (i === 0 ? -1 : 1)) + (Math.random() - 0.5) * 80
      });
    }
    
    // Generate points from clusters
    for (let i = 0; i < numPoints; i++) {
      // Assign each point to a cluster deterministically to ensure balanced distribution
      const clusterIndex = i % numLocalClusters;
      const cluster = clusterCenters[clusterIndex];
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.abs(randomGaussian()) * clusterRadius * 0.5 + Math.random() * clusterRadius * 0.5;
      const x = cluster.x + Math.cos(angle) * distance;
      const y = cluster.y + Math.sin(angle) * distance;
      positions.push({ x, y, sourceCluster: clusterIndex });
    }
    return positions;
  }
  
  // Use Motion's inView to handle visibility
  const slideElement = draw.node.closest('section');
  if (slideElement) {
    Motion.inView(slideElement, () => {
      let restartTimeout = null;
      let growthInterval = null;
      let animations = [];
      let ballAnimations = [];
      let connections = [];
      
      function runAnimation(skipPositionUpdate = false) {
        // Clear previous state
        animations = [];
        connections = [];
        ballAnimations = [];
        const connectedPairs = new Set(); // Track which pairs are already connected
        growthInterval = null;
        let currentRadius = 0;
        const radiusStep = 1;
        const intervalDelay = 100;
        
        // Only generate new positions if not skipping (i.e., not called from restart)
        if (!skipPositionUpdate) {
          const newPositions = generateNewPositions();
          embeddings.forEach((emb, i) => {
            const pos = newPositions[i];
            emb.x = pos.x;
            emb.y = pos.y;
            emb.ball.center(pos.x, pos.y);
            emb.point.center(pos.x, pos.y);
            emb.componentId = i;
            emb.connected = new Set([i]);
          });
        } else {
          // Just reset component tracking without moving positions
          embeddings.forEach((emb, i) => {
            emb.componentId = i;
            emb.connected = new Set([i]);
            emb.hasBeenConnected = false;
          });
        }
      
      // Helper function to check if two balls intersect
      function ballsIntersect(emb1, emb2, radius) {
        const distance = Math.sqrt(
          Math.pow(emb1.x - emb2.x, 2) + 
          Math.pow(emb1.y - emb2.y, 2)
        );
        // Balls intersect when distance is less than sum of their radii
        return distance < 2 * radius;
      }
      
      // Helper function to merge components
      function mergeComponents(comp1, comp2) {
        // Find all embeddings in each component
        const comp1Embeddings = embeddings.filter(e => e.componentId === comp1);
        const comp2Embeddings = embeddings.filter(e => e.componentId === comp2);
        
        // Update component IDs and connected sets
        comp2Embeddings.forEach(emb => {
          emb.componentId = comp1;
          // Merge connected sets
          comp1Embeddings.forEach(e1 => {
            emb.connected.add(embeddings.indexOf(e1));
            e1.connected.add(embeddings.indexOf(emb));
          });
        });
      }
      
      // Start growth animation after a delay
      setTimeout(() => {
        // Animate all balls growing smoothly
        const growthDuration = (maxBallRadius / radiusStep) * intervalDelay / 1000; // Convert to seconds
        embeddings.forEach(emb => {
          const anim = Motion.animate(emb.ball.node,
            { r: [0, maxBallRadius] },
            { duration: growthDuration, ease: "linear" }
          );
          ballAnimations.push(anim);
        });
        
        // Check for intersections at intervals
        growthInterval = setInterval(() => {
          currentRadius += radiusStep;
          
          // Check for new connections
          for (let i = 0; i < numPoints; i++) {
            for (let j = i + 1; j < numPoints; j++) {
              const emb1 = embeddings[i];
              const emb2 = embeddings[j];
              
              // Create a unique key for this pair
              const pairKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
              
              // Skip if already connected
              if (connectedPairs.has(pairKey)) continue;
              
              // Check if balls intersect
              if (ballsIntersect(emb1, emb2, currentRadius)) {
                // Mark as connected
                connectedPairs.add(pairKey);
                // Create connection line
                const line = connectionsGroup.line(emb1.x, emb1.y, emb2.x, emb2.y)
                  .stroke({ width: 2, color: diagramConfig.colors.gold, linecap: 'round' })
                  .opacity(0);
                connections.push(line);
                
                // Animate connection appearance
                Motion.animate(line.node,
                  { opacity: [0, 1], strokeWidth: [4, 2] },
                  { duration: 0.8, ease: diagramConfig.springs.snappy }
                );
                
                // Pop effect only for points that haven't been connected before
                const pointsToPop = [];
                if (!emb1.hasBeenConnected) {
                  pointsToPop.push(emb1.point.node);
                  emb1.hasBeenConnected = true;
                }
                if (!emb2.hasBeenConnected) {
                  pointsToPop.push(emb2.point.node);
                  emb2.hasBeenConnected = true;
                }
                
                if (pointsToPop.length > 0) {
                  Motion.animate(pointsToPop,
                    { 
                      r: [pointRadius, pointRadius * 2.5, pointRadius],
                      fill: [diagramConfig.colors.teal, diagramConfig.colors.gold, diagramConfig.colors.gold]
                    },
                    { duration: 0.6, ease: diagramConfig.springs.playful }
                  );
                  
                  // Reset point color after pop
                  setTimeout(() => {
                    Motion.animate(pointsToPop,
                      { fill: diagramConfig.colors.teal },
                      { duration: 0.4, ease: diagramConfig.springs.smooth }
                    );
                  }, 800);
                }
                
                // Merge components
                const comp1 = emb1.componentId;
                const comp2 = emb2.componentId;
                if (comp1 !== comp2) {
                  mergeComponents(Math.min(comp1, comp2), Math.max(comp1, comp2));
                }
              }
            }
          }
          
          // Check if all points are connected or radius is max
          const allConnected = embeddings.every(e => e.componentId === embeddings[0].componentId);
          if (allConnected || currentRadius >= maxBallRadius) {
            clearInterval(growthInterval);
            
            // Stop all ball animations at current radius
            ballAnimations.forEach(anim => anim.pause());
            
            // Final pulse effect if all connected
            if (allConnected) {
              setTimeout(() => {
                Motion.animate(connections.map(c => c.node),
                  { strokeWidth: [3, 6, 3], opacity: [1, 0.8, 1] },
                  { duration: 0.8, ease: diagramConfig.springs.playful }
                );
              }, 500);
            }
            
            // Schedule restart after 10 seconds
            restartTimeout = setTimeout(() => {
              // Generate new positions before fading out
              const newPositions = generateNewPositions();
              
              // Fade out and remove all connections
              connections.forEach(conn => {
                Motion.animate(conn.node, { opacity: 0 }, { duration: 0.5, ease: diagramConfig.springs.smooth });
                setTimeout(() => conn.remove(), 500);
              });
              connections.length = 0;
              connectedPairs.clear();
              
              // Reset ball radii and animate points to new positions
              embeddings.forEach((emb, i) => {
                // Animate ball radius to 0
                Motion.animate(emb.ball.node, { r: 0 }, { duration: 0.5, ease: diagramConfig.springs.smooth });
                
                // Animate point to new position
                const pos = newPositions[i];
                Motion.animate(emb.point.node, 
                  { cx: pos.x, cy: pos.y },
                  { duration: 1.5, delay: i * 0.01, ease: diagramConfig.springs.gentle }
                );
                
                // Update the embedding's stored position to match where we're animating to
                emb.x = pos.x;
                emb.y = pos.y;
                
                // Animate ball center to new position too
                Motion.animate(emb.ball.node,
                  { cx: pos.x, cy: pos.y },
                  { duration: 1.5, delay: i * 0.01, ease: diagramConfig.springs.gentle }
                );
                
                // Reset color
                Motion.animate(emb.point.node, { fill: diagramConfig.colors.teal }, { duration: 0.5 });
              });
              
              // Start new animation after points have moved
              setTimeout(() => {
                runAnimation(true); // Skip position update since we already moved them
              }, 2000);
            }, 10000);
          }
        }, intervalDelay);
      }, 2000);
      }
      
      // Start the first animation
      runAnimation();
      
      // Return cleanup function
      return () => {
        // Clear any restart timeout
        if (restartTimeout) {
          clearTimeout(restartTimeout);
        }
        
        // Clear growth interval
        if (growthInterval) {
          clearInterval(growthInterval);
        }
        
        // Cancel animations
        animations.forEach(anim => anim.cancel());
        ballAnimations.forEach(anim => anim.cancel());
        
        // Reset all elements
        embeddings.forEach((emb, i) => {
          emb.ball.radius(0);
          emb.point.fill(diagramConfig.colors.teal).radius(pointRadius);
          emb.componentId = i;
          emb.connected = new Set([i]);
          emb.hasBeenConnected = false;
        });
        
        // Remove all connections
        connections.forEach(conn => conn.remove());
        connections.length = 0;
      };
    }, { amount: 0.5 });
  }
}

// Diagram setup for slide 7 (colored dots returning to grid with patterns)
function setupGridPattern(containerId) {
  const container = document.getElementById(containerId);
  const draw = SVG().addTo(container).size('100%', '100%').viewbox(0, 0, diagramConfig.viewWidth, diagramConfig.viewHeight);
  
  const embeddings = [];
  const cols = 50;
  const rows = 10;
  const totalEmbeddings = cols * rows;
  const circleRadius = 5;
  const numClusters = 3;
  
  // Calculate spacing (same as diagram 4/5)
  const horizontalSpacing = (diagramConfig.viewWidth - 100) / cols;
  const verticalSpacing = 50;
  const topMargin = 80;
  
  // Define cluster colors using ANU theme colors
  const clusterColors = [
    'var(--anu-gold-3)',   // gold-3 (more distinct from copper)
    'var(--anu-teal)',     // teal
    'var(--anu-copper)'    // copper
  ];
  
  // Generate pattern for grid - create runs of varying lengths
  const clusterPattern = [];
  let currentCluster = 0;
  let i = 0;
  
  while (i < totalEmbeddings) {
    // Generate run length with some randomness (between 5 and 40 for 3 clusters)
    const runLength = Math.floor(Math.random() * 36) + 5;
    const actualRunLength = Math.min(runLength, totalEmbeddings - i);
    
    for (let j = 0; j < actualRunLength; j++) {
      clusterPattern.push(currentCluster);
    }
    
    i += actualRunLength;
    currentCluster = (currentCluster + 1) % numClusters;
  }
  
  // Shuffle some elements to add noise (10% chance)
  for (let i = 0; i < totalEmbeddings; i++) {
    if (Math.random() < 0.1) {
      clusterPattern[i] = Math.floor(Math.random() * numClusters);
    }
  }
  
  // Generate 3 cluster centers for starting positions
  const centerX = diagramConfig.viewWidth / 2;
  const centerY = diagramConfig.viewHeight / 2;
  const radius = Math.min(diagramConfig.viewWidth, diagramConfig.viewHeight) * 0.3;
  
  const clusterCenters = [];
  for (let i = 0; i < numClusters; i++) {
    const angle = (i * 2 * Math.PI / numClusters) - Math.PI / 2;
    clusterCenters.push({
      x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 50,
      y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 50
    });
  }
  
  // Create all circles at clustered positions
  for (let idx = 0; idx < totalEmbeddings; idx++) {
    const row = Math.floor(idx / cols);
    const col = idx % cols;
    
    // Grid position
    const gridX = 50 + col * horizontalSpacing;
    const gridY = topMargin + row * verticalSpacing;
    
    // Clustered starting position based on assigned cluster
    const assignedCluster = clusterPattern[idx];
    const cluster = clusterCenters[assignedCluster];
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.abs(randomGaussian()) * 80 + Math.random() * 40;
    const startX = cluster.x + Math.cos(angle) * distance;
    const startY = cluster.y + Math.sin(angle) * distance;
    
    const embGroup = draw.group();
    
    const circle = embGroup.circle(circleRadius * 2)
      .center(startX, startY) // Start at clustered position
      .fill(clusterColors[clusterPattern[idx]])
      .stroke({ width: 3, color: clusterColors[clusterPattern[idx]] });
    
    embGroup.opacity(0); // Start invisible
    
    embeddings.push({ 
      group: embGroup, 
      circle, 
      gridX, 
      gridY,
      cluster: clusterPattern[idx]
    });
  }
  
  return { draw, embeddings, cols, rows, circleRadius };
}

// Animation for diagram 7 - animate from scattered to grid
function animateGridPattern(diagram) {
  const { draw, embeddings, circleRadius } = diagram;
  
  // Use Motion's inView to handle visibility
  const slideElement = draw.node.closest('section');
  if (slideElement) {
    Motion.inView(slideElement, () => {
      const animations = [];
      
      // Make circles visible
      embeddings.forEach((emb) => {
        emb.group.opacity(1);
      });
      
      // Wait a moment, then animate all circles to grid positions
      setTimeout(() => {
        embeddings.forEach((emb, i) => {
          // Add some organic feel with easing and slight delays
          const delay = i * 0.002 + Math.random() * 0.001;
          
          animations.push(
            Motion.animate(emb.circle.node,
              { 
                cx: emb.gridX, 
                cy: emb.gridY,
                r: [circleRadius, circleRadius * 1.2, circleRadius] // Slight pulse
              },
              { 
                duration: 2.5, 
                delay: delay,
                ease: diagramConfig.springs.gentle // Spring for organic feel
              }
            )
          );
        });
      }, 1000);
      
      // Return cleanup function
      return () => {
        // Cancel animations
        animations.forEach(anim => anim.cancel());
      };
    }, { amount: 0.5 });
  }
}

// Export functions for use in slide scripts
window.diagramUtils = {
  config: diagramConfig,
  getItemX,
  drawArrow,
  setupLinearFlow,
  setupTextToImageEmbeddings,
  setupEmbeddingsRow,
  setupEmbeddingsGrid,
  setupKMeansClustering,
  setupPersistentHomology,
  setupGridPattern,
  animateLinearFlow,
  animateTextToImageEmbeddings,
  animateEmbeddingsRow,
  animateEmbeddingsGrid,
  animateKMeansClustering,
  animatePersistentHomology,
  animateGridPattern
};