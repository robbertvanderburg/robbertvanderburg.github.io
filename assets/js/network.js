(function() {
  const canvas = document.getElementById('network-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, nodes, animId;
  const NUM_NODES = 69;
  const CONNECT_DIST = 120;
  const DRIFT_SPEED = 0.15;
  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      node: isDark ? 'rgba(196, 107, 122, 0.6)' : 'rgba(123, 45, 59, 0.45)',
      nodeCenter: isDark ? 'rgba(196, 107, 122, 0.9)' : 'rgba(123, 45, 59, 0.7)',
      edge: isDark ? 'rgba(196, 107, 122, 0.35)' : 'rgba(123, 45, 59, 0.2)',
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
    ctx.strokeStyle = colors.edge;
    ctx.lineWidth = 1.2;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = 1 - dist / CONNECT_DIST;
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
