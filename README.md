# leafer-unified

A union entrypoint of [Leafer](https://www.leaferjs.com/) for both browser and Node.js.

## Install

```
npm install leafer-unified
npm install leafer
npm install @leafer/node
```

## Start

### Browser

```html
<script type="module">
    import { Leafer } from 'leafer-unified';
    // ...
</script>
```

### Node.js

`npm install skia-canvas`

```js
import { Leafer, Rect, useCanvas } from 'leafer-unified';
import skia from 'skia-canvas';
import http from 'http';

useCanvas('skia', skia); // must

http.createServer(function (req, res) {
  const leafer = new Leafer({ width: 800, height: 600 })
  leafer.add(Rect.one({ fill: '#32cd79' }, 100, 100))

  leafer.export('png').then(function (result) {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.write(`<img src="${result.data}" />`)
    res.end()
  })
}).listen(3000, function () {
  console.log('\x1B[36m%s\x1B[0m', 'server is running at http://localhost:3000')
})
```
