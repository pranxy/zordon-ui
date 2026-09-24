/** Public surface of the documentation-site design system. Pages import from here only. */

export { DocsCodeBlockComponent, DocsCodeFrameComponent } from './code/code-block.component';
export { DocsCodeTabsComponent, type DocsCodeFile } from './code/code-tabs.component';
export { DocsCodeComponent } from './code/code.component';
export { DocsCopyButtonComponent } from './code/copy-button.component';
export { DocsExampleComponent } from './code/example.component';
export { highlight, type CodeLanguage, type CodeToken } from './code/highlight';

export { DocsCalloutComponent } from './page/callout.component';
export { DocsFaqComponent, type DocsFaqItem } from './page/faq.component';
export { DocsFeatureGridComponent, type DocsFeature } from './page/feature-grid.component';
export { DocsHeroComponent } from './page/hero.component';
export { DocsInlineCodeComponent } from './page/inline-code.component';
export { DocsLinkCardsComponent, type DocsLinkCard } from './page/link-card.component';
export { DocsMetaGridComponent, type DocsMetaItem } from './page/meta-grid.component';
export { DocsPageHeaderComponent } from './page/page-header.component';
export { DocsSectionComponent } from './page/section.component';
export { DocsStepComponent, DocsStepsComponent } from './page/steps.component';
export {
  DocsApiTableComponent,
  type DocsTableColumn,
  type DocsTableRow,
} from './reference/api-table.component';

export { DocsChipGroupComponent, type DocsChipOption } from './reference/chip-group.component';
export {
  DocsPlaygroundComponent,
  DocsPlaygroundPreviewDirective,
  type PlaygroundControl,
  type PlaygroundSnippet,
  type PlaygroundValues,
} from './reference/playground.component';
export {
  DocsReferencePageComponent,
  type DocsReference,
  type DocsReferenceCode,
  type DocsReferenceTable,
} from './reference/reference-page.component';

export { DocsCatalogueComponent } from './catalogue/catalogue.component';
export { DocsComponentCardComponent } from './catalogue/component-card.component';
export { DocsMaturityBadgeComponent } from './catalogue/maturity-badge.component';
export { DocsMaturityDotComponent } from './catalogue/maturity-dot.component';
export { DocsMaturityLegendComponent } from './catalogue/maturity-legend.component';
