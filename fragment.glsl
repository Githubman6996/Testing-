precision mediump float;

uniform int u_type;
varying float vHue;

float hue2rgb(float hue) {
    if (hue < 0.0) hue += 1.0;
    else if (hue > 1.0) hue -= 1.0;
    float res;
    if ((6.0 * hue) < 1.0) res = 6.0 * hue;
    else if ((2.0 * hue) < 1.0) res = 1.0;
    else if ((3.0 * hue) < 2.0) res = ((2.0 / 3.0) - hue) * 6.0;
    else res = 0.0;
    return res;
}

vec3 hsl2rgb(float hue) {
    vec3 rgb;

    rgb.r = hue2rgb(hue + (1.0/3.0));
    rgb.g = hue2rgb(hue);
    rgb.b = hue2rgb(hue - (1.0/3.0));

    return rgb;
}

void main() {
    // if (u_type == 1) gl_FragColor = vec4(vec3(0.0), 1);
    // else if (vHue == 2) gl_FragColor = vec4(vec3(1.0), 1);
    // else gl_FragColor = vec4(hsl2rgb(vHue), 1);
    gl_FragColor = vec4(u_type == 1 ? vec3(0) : vHue == 2.0 ? vec3(1) : hsl2rgb(vHue), 1);
}