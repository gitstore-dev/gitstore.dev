struct Scene { size: vec2f, time: f32, dark: f32, step: f32, pointerX: f32, pointerY: f32, padding: f32 }
@group(0) @binding(0) var<uniform> u: Scene;

@vertex fn vertex(@builtin(vertex_index) index: u32) -> @builtin(position) vec4f {
  let x = f32((index << 1u) & 2u);
  let y = f32(index & 2u);
  return vec4f(x * 2.0 - 1.0, y * 2.0 - 1.0, 0.0, 1.0);
}
fn box(p: vec3f, b: vec3f) -> f32 {
  let q = abs(p) - b;
  return length(max(q, vec3f(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0);
}
fn slab(p: vec3f, center: vec3f, extent: vec3f) -> f32 {
  let q = p - center;
  var d = box(q, extent) - 0.025;
  // A channel through the catalog editions carries the orange change path.
  d = max(d, -box(vec3f(q.x, q.y, p.z), vec3f(2.0, 0.4, 0.15)));
  for (var i = 0; i < 3; i++) {
    let z = -extent.z + 0.19 + f32(i) * 0.11;
    d = max(d, -box(q - vec3f(-0.05, extent.y + 0.015, z), vec3f(extent.x * 0.62, 0.035, 0.011)));
  }
  return d;
}
fn scene(p: vec3f) -> vec2f {
  let spread = 0.12 * sin(clamp(u.step, 0.0, 1.0) * 1.5708);
  var d = p.y + 0.63;
  var material = 0.0;
  let a = slab(p, vec3f(-1.25-spread, 0.0, -0.30), vec3f(0.65, 0.16, 0.77));
  let b = slab(p, vec3f(0.15, 0.17*spread, 0.78+spread), vec3f(0.68, 0.16, 0.68));
  let c = slab(p, vec3f(1.45+spread, 0.0, -0.55-spread), vec3f(0.60, 0.16, 0.66));
  let blocks = min(a, min(b, c));
  if (blocks < d) { d = blocks; material = 1.0; }
  var route = box(p - vec3f(0.0, 0.03, 0.0), vec3f(2.75, 0.085, 0.105));
  route = min(route, box(p - vec3f(0.04, 0.03, -0.95), vec3f(0.105, 0.085, 0.95)));
  route = min(route, box(p - vec3f(1.25, 0.03, 1.15), vec3f(0.105, 0.085, 1.15)));
  if (route < d) { d = route; material = 2.0; }
  // The moving marker changes direction for recovery.
  let direction = select(1.0, -1.0, u.step > 1.5);
  let travel = fract(u.time * 0.14 * direction + 0.5) * 4.8 - 2.4;
  let node = box(p - vec3f(travel, 0.20, 0.0), vec3f(0.13, 0.095, 0.14)) - 0.018;
  if (node < d) { d = node; material = 3.0; }
  return vec2f(d, material);
}
fn normal(p: vec3f) -> vec3f {
  let e = 0.002;
  return normalize(vec3f(scene(p+vec3f(e,0,0)).x-scene(p-vec3f(e,0,0)).x,
    scene(p+vec3f(0,e,0)).x-scene(p-vec3f(0,e,0)).x,
    scene(p+vec3f(0,0,e)).x-scene(p-vec3f(0,0,e)).x));
}
fn shadow(p: vec3f, light: vec3f) -> f32 {
  var shade = 1.0;
  var t = 0.04;
  for (var i=0; i<24; i++) {
    let h = scene(p+light*t).x;
    shade = min(shade, 9.0*h/t);
    t += clamp(h, 0.035, 0.3);
    if (h < 0.001 || t > 5.0) { break; }
  }
  return clamp(shade, 0.18, 1.0);
}
@fragment fn fragment(@builtin(position) pixel: vec4f) -> @location(0) vec4f {
  var uv = (pixel.xy / u.size * 2.0 - 1.0);
  uv.x *= u.size.x / u.size.y;
  uv.y = -uv.y;
  let background = mix(vec3f(0.953,0.949,0.917), vec3f(0.063,0.106,0.094), u.dark);
  let camera = vec3f(4.2 + u.pointerX*0.65, 5.0 + u.pointerY*0.4, 5.8);
  let forward = normalize(vec3f(0.0,0.0,0.1)-camera);
  let right = normalize(cross(forward,vec3f(0.0,1.0,0.0)));
  let up = cross(right,forward);
  let origin = camera + (right*uv.x + up*uv.y)*2.20;
  var t = 0.0;
  var hit = vec2f(0.0);
  for (var i=0; i<72; i++) {
    hit = scene(origin+forward*t);
    if (hit.x < 0.002 || t > 18.0) { break; }
    t += hit.x * 0.85;
  }
  var color = background;
  if (t < 18.0) {
    let p = origin + forward*t;
    let n = normal(p);
    let light = normalize(vec3f(-3.5,7.0,4.0));
    var base = background;
    if (hit.y > 0.5) { base = mix(vec3f(0.91,0.90,0.85), vec3f(0.23,0.31,0.27), u.dark); }
    if (hit.y > 1.5) { base = vec3f(0.93,0.24,0.075); }
    if (hit.y > 2.5) { base = vec3f(0.62,0.73,0.41); }
    let shade = shadow(p+n*0.008,light);
    let diffuse = max(dot(n,light),0.0);
    let ao = clamp(scene(p+n*0.16).x / 0.16,0.45,1.0);
    let speckle = sin(p.x*182.0)*sin(p.z*207.0)*0.014;
    color = base*(0.48 + diffuse*0.60*shade)*ao + speckle;
    if (hit.y < 0.5) {
      color = background * (0.78+shade*0.22);
      let grid = min(abs(fract(p.x*1.5)-0.5),abs(fract(p.z*1.5)-0.5));
      color = mix(color,color*0.92,1.0-smoothstep(0.0,0.014,grid));
      color = mix(color,background,smoothstep(2.5,6.0,length(p.xz)));
    }
    color = mix(color,background,smoothstep(13.0,18.0,t));
  }
  return vec4f(clamp(color,vec3f(0.0),vec3f(1.0)),1.0);
}
