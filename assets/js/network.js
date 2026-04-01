(function() {
  const canvas = document.getElementById('network-bg');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height, nodes, animId;

  const NUM_NODES = 69;
  const CONNECT_DIST = 100;
  const DRIFT_SPEED = 0.15;

function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      // Increased opacity for nodes
      nodeCenter: isDark ? 'rgba(196, 107, 122, 1)' : 'rgba(123, 45, 59, 0.9)',
      // Higher base opacity for edges
      edge: isDark ? 'rgba(196, 107, 122, 0.4)' : 'rgba(123, 45, 59, 0.3)',
    };
  }

function resize() {
  const dpr = window.devicePixelRatio || 1;
  width = window.innerWidth;
  height = canvas.parentElement.getBoundingClientRect().height;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

  function initNodes() {
    nodes = [];
    for (let i = 0; i < NUM_NODES; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * DRIFT_SPEED,
        vy: (Math.random() - 0.5) * DRIFT_SPEED,
        r: 1.5 + Math.random() * 2,
      });
    }
  }

  function update() {
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;

      // Soft wrap around edges
      if (n.x < -20) n.x = width + 20;
      if (n.x > width + 20) n.x = -20;
      if (n.y < -20) n.y = height + 20;
      if (n.y > height + 20) n.y = -20;
    }
  }
function draw() {
    const colors = getColors();
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    ctx.lineWidth = 1.0; // Slightly thicker lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distSq = dx * dx + dy * dy; // Use squared distance for performance
        const maxDistSq = CONNECT_DIST * CONNECT_DIST;

        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          // Changed logic: ensure alpha doesn't drop to 0 too quickly
          const alpha = (1 - dist / CONNECT_DIST) * 0.8; 
          
          ctx.strokeStyle = colors.edge;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    ctx.globalAlpha = 1;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = colors.nodeCenter;
      ctx.fill();
      
      // Optional: Add a small glow/ring to nodes to make them feel more solid
      ctx.strokeStyle = colors.edge;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }

    // Draw nodes
    ctx.globalAlpha = 1;
    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = colors.nodeCenter;
      ctx.fill();
    }
  }

  function loop() {
    update();
    draw();
    animId = requestAnimationFrame(loop);
  }

  // Pause when tab not visible
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      animId = requestAnimationFrame(loop);
    }
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
      resize();
      initNodes();
    }, 200);
  });

  resize();
  initNodes();
  loop();
})();
