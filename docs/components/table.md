# Table

**Component ID:** DSP-17  
**Entry point:** `@pranxy/zordon-ui/table`

`ZdTable` applies daisyUI's `table` class and documented size, zebra, pinned-row, and pinned-column candidates to a native `<table>`. Consumers retain captions, `scope`, headers, data, overflow wrappers, actions, and responsive policy.

```html
<div class="overflow-x-auto">
  <table zdTable size="sm" zebra pinRows>
    <caption>
      Monthly deployments
    </caption>
    <thead>
      <tr>
        <th scope="col">Month</th>
        <th scope="col">Count</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">September</th>
        <td>12</td>
      </tr>
    </tbody>
  </table>
</div>
```

It adds no role, sorting, filtering, selection, keyboard model, data source, editing, resizing, or virtualization. A future interactive data grid must use a separately approved Angular Aria Grid contract. Manual review remains required for responsive overflow, long data, contrast, forced colors, zoom/reflow, RTL, and assistive technology.

## Source

- [daisyUI Table documentation](https://daisyui.com/components/table/)
