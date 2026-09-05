import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ZdHero, ZdHeroContent, ZdHeroOverlay } from './hero';
@Component({
  imports: [ZdHero, ZdHeroContent, ZdHeroOverlay],
  template: `<section zdHero>
    <div zdHeroOverlay></div>
    <div zdHeroContent><h1>Launch</h1></div>
  </section>`,
})
class Host {}
describe('ZdHero', () => {
  it('preserves consumer-owned section semantics while applying documented parts', () => {
    TestBed.configureTestingModule({ imports: [Host] });
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const hero = fixture.nativeElement.querySelector('[zdHero]') as HTMLElement;
    expect(hero.tagName).toBe('SECTION');
    expect(hero.classList.contains('hero')).toBe(true);
    expect(
      (hero.querySelector('[zdHeroContent]') as HTMLElement).classList.contains('hero-content'),
    ).toBe(true);
    expect(
      (hero.querySelector('[zdHeroOverlay]') as HTMLElement).classList.contains('hero-overlay'),
    ).toBe(true);
    expect(hero.hasAttribute('role')).toBe(false);
  });
});
