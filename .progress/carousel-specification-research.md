# Carousel specification research

**Component:** DSP-06 Carousel  
**Pinned local evidence:** daisyUI 5.7.16

- daisyUI supplies only `carousel`, `carousel-item`, `carousel-horizontal`, `carousel-vertical`, and
  `carousel-start`/`carousel-center`/`carousel-end` scroll-snap styling. It enables smooth scrolling
  only when reduced motion is not requested.
- Controls, current index, looping, autoplay, keyboard behavior, virtualization, lazy loading,
  thumbnails, and ARIA semantics are not supplied by daisyUI and must not be inferred by the base
  directive.
