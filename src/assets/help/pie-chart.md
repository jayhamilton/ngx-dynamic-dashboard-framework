## Pie Chart

Shows how a total splits into proportional slices — best for a small number of categories.

### Configuration

- **Title / Subtitle** — shown in the card header.
- **Show Labels** — prints each slice's name and value next to it.
- **Gradient Fill** — paints each slice with a gradient instead of a flat fill color.
- **Doughnut Style** — renders as a ring with a hollow center instead of a solid disc.
- **Explode Slices** — separates each slice slightly from the center.
- **Show Legend** and **Legend Title** — toggle the slice legend and its heading.

### Chart Data

Edit **Chart Data (JSON)** directly as an array of `{ name, value }` objects, one per slice.

```json
[
  { "name": "Category A", "value": 45 },
  { "name": "Category B", "value": 30 },
  { "name": "Category C", "value": 25 }
]
```
