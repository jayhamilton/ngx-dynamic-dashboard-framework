## Area Chart

Visualizes trends over time as a filled, curved line per series — good for showing volume or magnitude changing across a sequence.

### Configuration

- **Title / Subtitle** — shown in the card header.
- **Show X Axis / Y Axis** — toggle the axis lines and ticks.
- **Show X/Y Axis Label** and **X/Y Axis Label** — toggle and set the text for each axis's label.
- **Show Legend** and **Legend Title** — toggle the series legend and its heading.
- **Gradient Fill** — fades each series' fill from solid to transparent.
- **Show Timeline** — adds a mini range-selector strip below the chart for zooming into a time range.
- **Animations** — enables draw-in/transition animations.

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
