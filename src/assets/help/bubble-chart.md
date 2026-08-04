## Bubble Chart

Plots three dimensions of data at once: X position, Y position, and bubble size — good for spotting clusters or outliers across two measures.

### Configuration

- **Title / Subtitle** — shown in the card header.
- **Show X Axis / Y Axis** — toggle the axis lines and ticks.
- **Show X/Y Axis Label** and **X/Y Axis Label** — toggle and set the text for each axis's label.
- **Show Legend** and **Legend Title** — toggle the series legend and its heading.
- **Min/Max Bubble Radius** — the smallest and largest a bubble can render, regardless of its underlying size value.

### Chart Data

Edit **Chart Data (JSON)** directly as an array of series, each with a `name` and a `series` array of points with `name`, `x`, `y`, and `r` (radius/size).

```json
[
  {
    "name": "Series 1",
    "series": [
      { "name": "Point A", "x": 10, "y": 45, "r": 12 },
      { "name": "Point B", "x": 25, "y": 20, "r": 20 }
    ]
  }
]
```
