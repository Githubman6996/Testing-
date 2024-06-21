attribute vec2 aVertexPosition;
attribute float aHue;
varying float vHue;
void main(void) {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
  vHue = aHue;
}