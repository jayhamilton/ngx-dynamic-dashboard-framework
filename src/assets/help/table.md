## Table

Displays rows of tabular data.

### Configuration

- **Title / Subtitle** — shown in the card header.
- **Columns** — comma-separated list of column keys to show, in order. Leave blank to show every column found in the data.
- **Max Rows** — limits how many rows render (0 = show all).
- **Striped Rows** — alternates row background color for readability.
- **Dense Rows** — reduces row height/padding to fit more rows on screen.
- **Show Row Numbers** — adds a leading row-index column.

### Table Data

Edit **Table Data (JSON array of row objects)** as an array of plain objects — each object's keys become the table's columns.

```json
[
  { "name": "Widget A", "units": 120, "region": "West" },
  { "name": "Widget B", "units": 85, "region": "East" }
]
```
