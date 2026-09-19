import {
  ZdAccordion,
  ZdAccordionTrigger,
  ZdAccordionPanel,
  type ZdAccordionIndicator,
} from '@pranxy/zordon-ui/accordion';
declare const group: ZdAccordion;
declare const trigger: ZdAccordionTrigger;
declare const panel: ZdAccordionPanel;
group.expandAll();
group.collapseAll();
trigger.toggle();
const visible: boolean = panel.visible();
const expanded: boolean = trigger.expanded();
const indicator: ZdAccordionIndicator = 'custom';
// @ts-expect-error Only supported indicator names are accepted.
const invalid: ZdAccordionIndicator = 'chevron';
void visible;
void expanded;
void indicator;
void invalid;
