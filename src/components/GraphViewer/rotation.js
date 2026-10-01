// The graph view with a rotation: screen = T + R(θ)·(k·p), with T and k
// from d3.zoom and θ kept beside it. Pure math, so the gesture can be tested.

const RAD = Math.PI / 180;

// (-180, 180]
function normalizeAngle(a) {
  let x = ((a + 180) % 360 + 360) % 360 - 180;
  if (x === -180) x = 180;
  return x;
}

// The shortest turn from angle b to angle a, in degrees.
function angleDelta(a, b) {
  return normalizeAngle(a - b);
}

// The translate to draw while two fingers turn the view. d3 has put its own
// translate t where the pinch wants it for the angle the gesture started at
// (theta0); turning by rotation - theta0 about the fingers' midpoint (mx, my)
// keeps the point under them in place.
function rotatedView(t, gesture, rotation) {
  if (!gesture || rotation === gesture.theta0) return { x: t.x, y: t.y, k: t.k };
  const d = (rotation - gesture.theta0) * RAD;
  const c = Math.cos(d), s = Math.sin(d);
  const ux = gesture.mx - t.x, uy = gesture.my - t.y;
  return { x: gesture.mx - (c * ux - s * uy), y: gesture.my - (s * ux + c * uy), k: t.k };
}

function viewToScreen(view, rotation, x, y) {
  const r = rotation * RAD;
  const c = Math.cos(r), s = Math.sin(r);
  const px = x * view.k, py = y * view.k;
  return [view.x + c * px - s * py, view.y + s * px + c * py];
}

function screenToView(view, rotation, sx, sy) {
  const r = -rotation * RAD;
  const c = Math.cos(r), s = Math.sin(r);
  const ux = (sx - view.x) / view.k, uy = (sy - view.y) / view.k;
  return [c * ux - s * uy, s * ux + c * uy];
}

module.exports = { normalizeAngle, angleDelta, rotatedView, viewToScreen, screenToView };
