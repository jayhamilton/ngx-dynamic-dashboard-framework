## Line Chart

Visualizes trends across multiple series as smooth connected lines — good for comparing several sequences over the same range.

### Configuration

- **Title / Subtitle** — shown in the card header.
- **Show X Axis / Y Axis** — toggle the axis lines and ticks.
- **Show X/Y Axis Label** and **X/Y Axis Label** — toggle and set the text for each axis's label.
- **Show Legend** and **Legend Title** — toggle the series legend and its heading.
- **Show Timeline** — adds a mini range-selector strip below the chart for zooming into a time range.
- **Animations** — enables draw-in/transition animations.

> **Note:** unlike Area/Bar charts, this chart has no Gradient Fill option — a line has no filled shape for a gradient to paint, so ngx-charts doesn't support it here.

### Chart Data

Edit **Chart Data (JSON)** directly as an array of series, each with a `name` and a `series` array of `{ name, value }` points along the X axis.

```json
[
  {
    "name": "Series 1",
    "series": [
      { "name": "Mon", "value": 320 },
      { "name": "Tue", "value": 730 }
    ]
  }
]
```
