import {
  type ZdCarouselAlign,
  type ZdCarouselOrientation,
  ZdCarousel,
  ZdCarouselItem,
} from '@pranxy/zordon-ui/carousel';

const align: ZdCarouselAlign = 'center';
const orientation: ZdCarouselOrientation = 'vertical';
void align;
void orientation;
void ZdCarousel;
void ZdCarouselItem;

// @ts-expect-error Carousel alignment is limited to upstream candidates.
const invalidAlign: ZdCarouselAlign = 'nearest';
// @ts-expect-error Carousel orientation is limited to upstream candidates.
const invalidOrientation: ZdCarouselOrientation = 'diagonal';
void invalidAlign;
void invalidOrientation;
