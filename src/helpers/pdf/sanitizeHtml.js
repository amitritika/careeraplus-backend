const sanitizeHtml = require('sanitize-html');

function sanitize(html) {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'svg',
      'path',
      'circle',
      'rect',
      'line',
      'polyline',
      'polygon',
      'ellipse',
      'text',
      'tspan',
      'g',
      'defs',
      'use',
      'symbol',
      'image',
      'foreignObject',
      'clipPath',
      'mask',
      'linearGradient',
      'radialGradient',
      'stop',
      'animate',
      'animateTransform',
      'title',
      'desc'
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['style', 'class', 'id', 'data-*', 'aria-*', 'role'],
      svg: [
        'width', 'height', 'viewBox', 'xmlns', 'xmlns:xlink', 'version',
        'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
        'fill-rule', 'clip-rule', 'color', 'preserveAspectRatio',
        'aria-hidden', 'focusable', 'x', 'y'
      ],
      path: [
        'd',  // ✅ CRITICAL: This is the path data
        'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
        'fill-rule', 'clip-rule', 'opacity', 'fill-opacity', 'stroke-opacity',
        'transform', 'pathLength'
      ],
      circle: [
        'cx', 'cy', 'r',
        'fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'transform'
      ],
      rect: [
        'x', 'y', 'width', 'height', 'rx', 'ry',
        'fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'transform'
      ],
      polygon: ['points', 'fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'transform'],
      polyline: ['points', 'fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'transform'],
      line: [
        'x1', 'y1', 'x2', 'y2',
        'stroke', 'stroke-width', 'stroke-linecap', 'opacity', 'transform'
      ],
      ellipse: [
        'cx', 'cy', 'rx', 'ry',
        'fill', 'stroke', 'stroke-width', 'opacity', 'fill-opacity', 'transform'
      ],
      text: [
        'x', 'y', 'dx', 'dy', 'text-anchor',
        'fill', 'stroke', 'font-size', 'font-weight', 'font-family', 'opacity', 'transform'
      ],
      tspan: [
        'x', 'y', 'dx', 'dy', 'text-anchor',
        'fill', 'stroke', 'font-size', 'font-weight', 'opacity'
      ],
      g: [
        'id', 'fill', 'stroke', 'opacity', 'transform',
        'clip-path', 'mask', 'class'
      ],
      defs: ['id'],
      clipPath: ['id', 'clipPathUnits'],
      use: ['href', 'xlink:href', 'x', 'y', 'width', 'height', 'transform'],
      symbol: ['id', 'viewBox', 'width', 'height', 'preserveAspectRatio'],
      image: [
        'href', 'xlink:href', 'x', 'y', 'width', 'height', 'preserveAspectRatio'
      ],
      foreignObject: ['x', 'y', 'width', 'height'],
      linearGradient: ['id', 'x1', 'y1', 'x2', 'y2', 'gradientUnits', 'gradientTransform'],
      radialGradient: ['id', 'cx', 'cy', 'r', 'fx', 'fy', 'gradientUnits'],
      stop: ['offset', 'stop-color', 'stop-opacity']
    },
    // ✅ CRITICAL: Allow all attribute values (don't truncate long path data)
    allowedSchemesByTag: {
      '*': ['http', 'https', 'data', 'mailto'],
    },
    allowedClasses: {
      '*': ['*']
    },
    // ✅ CRITICAL: Don't discard tags, convert to text instead for debugging
    disallowedTagsMode: 'discard',
    // ✅ CRITICAL: Allow long attributes (path d can be very long)
    textFilter: function(text) {
      return text;
    }
  });
}

module.exports = { sanitize };
