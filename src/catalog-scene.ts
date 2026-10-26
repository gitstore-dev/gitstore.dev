import shader from './catalog.wgsl?raw';

/** A decorative, progressively enhanced scene. All content and controls remain HTML. */
export async function initCatalogScene() {
  const host = document.getElementById('catalog-scene')!;
  const canvas = document.getElementById('catalog-canvas') as HTMLCanvasElement;
  const motion = document.getElementById('scene-motion') as HTMLButtonElement;
  if (!navigator.gpu) return;
  let device: GPUDevice | undefined;
  let frame = 0;
  let stopped = false;
  let visible = false;
  let paused = false;
  let clock = 0;
  let lastTime = 0;
  let lastDraw = 0;
  let step = 0;
  let targetStep = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  let dirty = true;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const stop = (reason = 'stopped') => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frame);
    host.dataset.renderer = 'poster';
    host.dataset.gpuState = reason;
    console.warn('Catalog scene stopped:', reason);
    motion.hidden = true;
    device?.destroy();
  };
  try {
    host.dataset.gpuState = 'requesting-adapter';
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
    if (!adapter) {
      host.dataset.gpuState = 'no-adapter';
      return;
    }
    host.dataset.gpuState = 'requesting-device';
    const softwareRenderer =
      adapter.info.isFallbackAdapter ||
      /swiftshader|llvmpipe|software/i.test(`${adapter.info.description} ${adapter.info.device}`);
    device = await adapter.requestDevice();
    const gpu = device;
    const context = canvas.getContext('webgpu');
    if (!context) {
      console.warn('Catalog scene WebGPU canvas unavailable; keeping the static illustration.');
      stop('no-canvas-context');
      return;
    }
    const format = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device: gpu, format, alphaMode: 'opaque' });
    gpu.addEventListener('uncapturederror', (event) => {
      console.warn('Catalog scene GPU error:', event.error.message);
      stop('gpu-validation-error');
    });
    const module = gpu.createShaderModule({ code: shader });
    host.dataset.gpuState = 'compiling';
    const pipeline = await gpu.createRenderPipelineAsync({
      layout: 'auto',
      vertex: { module, entryPoint: 'vertex' },
      fragment: { module, entryPoint: 'fragment', targets: [{ format }] },
      primitive: { topology: 'triangle-list' },
    });
    host.dataset.gpuState = 'ready';
    const selected = document.querySelector<HTMLButtonElement>('[data-demo][aria-selected="true"]')
      ?.dataset.demo;
    targetStep = selected === 'review' ? 1 : selected === 'recover' ? 2 : 0;
    step = targetStep;
    const buffer = gpu.createBuffer({
      size: 32,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const binding = gpu.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer } }],
    });
    const uniforms = new Float32Array(8);
    const resize = new ResizeObserver(() => {
      dirty = true;
      requestFrame();
    });
    resize.observe(host);
    const intersection = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        lastTime = 0;
        if (visible) requestFrame();
        else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      { threshold: 0.01 }
    );
    intersection.observe(host);
    const theme = new MutationObserver(() => {
      dirty = true;
      requestFrame();
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    function requestFrame() {
      if (!frame && !stopped && visible && !document.hidden) frame = requestAnimationFrame(draw);
    }
    function draw(now: number) {
      frame = 0;
      if (stopped || !visible || document.hidden) return;
      const animated = !paused && !reducedMotion.matches;
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.1) : 0;
      lastTime = now;
      if (animated) clock += delta;
      const moving =
        Math.abs(step - targetStep) > 0.005 ||
        Math.abs(currentX - pointerX) > 0.005 ||
        Math.abs(currentY - pointerY) > 0.005;
      if (
        (animated || moving || dirty) &&
        (now - lastDraw > (softwareRenderer ? 100 : 32) || dirty)
      ) {
        const ratio = Math.min(
          devicePixelRatio || 1,
          softwareRenderer ? 0.45 : 1.25,
          900 / Math.max(host.clientWidth, 1)
        );
        const width = Math.max(1, Math.round(host.clientWidth * ratio));
        const height = Math.max(1, Math.round(host.clientHeight * ratio));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        step = reducedMotion.matches ? targetStep : step + (targetStep - step) * 0.12;
        currentX += (pointerX - currentX) * 0.1;
        currentY += (pointerY - currentY) * 0.1;
        uniforms.set([
          width,
          height,
          clock,
          document.documentElement.dataset.theme === 'dark' ? 1 : 0,
          step,
          currentX,
          currentY,
          0,
        ]);
        gpu.queue.writeBuffer(buffer, 0, uniforms);
        const encoder = gpu.createCommandEncoder();
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: context!.getCurrentTexture().createView(),
              clearValue: { r: 0, g: 0, b: 0, a: 1 },
              loadOp: 'clear',
              storeOp: 'store',
            },
          ],
        });
        pass.setPipeline(pipeline);
        pass.setBindGroup(0, binding);
        pass.draw(3);
        pass.end();
        gpu.queue.submit([encoder.finish()]);
        host.dataset.renderer = 'webgpu';
        host.dataset.sceneStep = String(targetStep);
        dirty = false;
        lastDraw = now;
      }
      if (animated || moving) requestFrame();
    }
    host.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || event.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      pointerX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      requestFrame();
    });
    host.addEventListener('pointerleave', () => {
      pointerX = 0;
      pointerY = 0;
      requestFrame();
    });
    document.addEventListener('catalog-step', (event) => {
      const detail = (event as CustomEvent<string>).detail;
      targetStep = detail === 'review' ? 1 : detail === 'recover' ? 2 : 0;
      dirty = true;
      requestFrame();
    });
    const updateMotion = () => {
      motion.hidden = reducedMotion.matches;
      dirty = true;
      lastTime = 0;
      requestFrame();
    };
    motion.addEventListener('click', () => {
      paused = !paused;
      motion.textContent = paused ? '▷' : 'Ⅱ';
      motion.setAttribute('aria-label', paused ? 'Play scene animation' : 'Pause scene animation');
      motion.setAttribute('aria-pressed', String(paused));
      lastTime = 0;
      dirty = true;
      requestFrame();
    });
    reducedMotion.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', () => {
      lastTime = 0;
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else requestFrame();
    });
    void gpu.lost.then((info) => {
      if (info.reason !== 'destroyed') console.warn('Catalog scene device lost:', info.message);
      resize.disconnect();
      intersection.disconnect();
      theme.disconnect();
      stop(`device-lost:${info.reason}`);
    });
    window.addEventListener('pagehide', () => stop('pagehide'), { once: true });
    updateMotion();
  } catch (error) {
    console.warn('Catalog scene unavailable; keeping the static illustration.', error);
    stop('exception');
  }
}
