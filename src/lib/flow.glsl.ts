export const FLOW_GLSL = /* glsl */ `
const vec3 GRADIENTS[16] = vec3[16](
  vec3( 1.0,  1.0,  0.0), vec3(-1.0,  1.0,  0.0), vec3( 1.0, -1.0,  0.0), vec3(-1.0, -1.0,  0.0),
  vec3( 1.0,  0.0,  1.0), vec3(-1.0,  0.0,  1.0), vec3( 1.0,  0.0, -1.0), vec3(-1.0,  0.0, -1.0),
  vec3( 0.0,  1.0,  1.0), vec3( 0.0, -1.0,  1.0), vec3( 0.0,  1.0, -1.0), vec3( 0.0, -1.0, -1.0),
  vec3( 1.0,  1.0,  0.0), vec3( 0.0, -1.0,  1.0), vec3(-1.0,  1.0,  0.0), vec3( 0.0, -1.0, -1.0)
);

uint flowHash(ivec3 cell) {
  uint mixed = uint(cell.x) * 374761393u ^ uint(cell.y) * 668265263u ^ uint(cell.z) * 1274126177u;
  uint spread = (mixed ^ (mixed >> 13)) * 1274126177u;
  return spread ^ (spread >> 16);
}

float flowFade(float t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }

float flowCorner(ivec3 cell, vec3 frac, ivec3 offset) {
  vec3 gradient = GRADIENTS[int(flowHash(cell + offset) & 15u)];
  return dot(gradient, frac - vec3(offset));
}

float noise3(vec3 p) {
  vec3 floored = floor(p);
  ivec3 cell = ivec3(floored);
  vec3 frac = p - floored;
  vec3 u = vec3(flowFade(frac.x), flowFade(frac.y), flowFade(frac.z));
  float near = mix(
    mix(flowCorner(cell, frac, ivec3(0, 0, 0)), flowCorner(cell, frac, ivec3(1, 0, 0)), u.x),
    mix(flowCorner(cell, frac, ivec3(0, 1, 0)), flowCorner(cell, frac, ivec3(1, 1, 0)), u.x),
    u.y);
  float far = mix(
    mix(flowCorner(cell, frac, ivec3(0, 0, 1)), flowCorner(cell, frac, ivec3(1, 0, 1)), u.x),
    mix(flowCorner(cell, frac, ivec3(0, 1, 1)), flowCorner(cell, frac, ivec3(1, 1, 1)), u.x),
    u.y);
  return mix(near, far, u.z) * 1.4;
}

const float FLOW_EPS = 0.2;

vec2 curl2(vec3 p) {
  float scale = 1.0 / (2.0 * FLOW_EPS);
  return vec2(
    (noise3(p + vec3(0.0, FLOW_EPS, 0.0)) - noise3(p - vec3(0.0, FLOW_EPS, 0.0))) * scale,
    (noise3(p - vec3(FLOW_EPS, 0.0, 0.0)) - noise3(p + vec3(FLOW_EPS, 0.0, 0.0))) * scale
  );
}
`
