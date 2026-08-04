## Bar Chart

Visualizes categorical data as vertical bars, one series per group.

### Configuration

- **Title / Subtitle** — shown in the card header.
- **Show X Axis / Y Axis** — toggle the axis lines and ticks.
- **Show X/Y Axis Label** and **X/Y Axis Label** — toggle and set the text for each axis's label.
- **Show Legend** and **Legend Title** — toggle the series legend and its heading.
- **Gradient Fill** — paints each bar with a gradient instead of a flat fill color.
- **Round Edges** — rounds the top corners of each bar.
- **Show Data Labels** — prints each bar's value above it.

### Chart Data

Edit **Chart Data (JSON)** directly as an array of series, each with a `name` and a `series` array of `{ name, value }` points — one entry per category on the X axis.

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
