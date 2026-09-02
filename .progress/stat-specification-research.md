# Stat specification research

**Component:** DSP-15 Stat  
**Installed daisyUI:** 5.7.16  
**Research date:** 2026-09-02

## Evidence

- Official [daisyUI Stat documentation](https://daisyui.com/components/stat/) currently lists
  `stats`; `stat`, `stat-title`, `stat-value`, `stat-desc`, `stat-figure`, `stat-actions`; and
  `stats-horizontal`/`stats-vertical` direction candidates.
- Installed `node_modules/daisyui/components/stat/object.js` and `stat.css` (5.7.16) have the same
  inventory. Base `stats` uses horizontal grid flow; `stats-vertical` changes it to row flow.

## Decisions

| Area                              | Zordon contract                                                                                                         |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Container                         | Native `[zdStats]` directive                                                                                            |
| Direction                         | Validated optional `'horizontal' \| 'vertical'` input; omitted preserves upstream base layout                           |
| Item/anatomy                      | Native `[zdStat]`, `[zdStatTitle]`, `[zdStatValue]`, `[zdStatDesc]`, `[zdStatFigure]`, and `[zdStatActions]` directives |
| Responsive direction              | Consumer-owned Tailwind classes, including `lg:stats-horizontal`                                                        |
| Colors, border, shadow, centering | Consumer-owned ordinary Tailwind utilities                                                                              |

Number/date/currency formatting, locale, time zone, polling, counting animation, trend/delta
calculation, loading/error state, charts, and live-region announcement are not daisyUI Stat
candidates. Angular Aria and CDK do not apply because Stat owns no interaction, selection,
navigation, focus, or overlay behavior. Installed CSS variables are upstream implementation details.
