import { Page } from '@playwright/test';
import { ElementActions } from '../core/actions/element.actions';
import { NavigationActions } from '../core/actions/navigation.actions';

/**
 * Abstract base page — all Page Objects extend this.
 * Provides Layer 1 action wrappers to every POM automatically.
 */
export abstract class BasePage {
    protected readonly action: ElementActions;
    protected readonly nav: NavigationActions;

    constructor(public readonly page: Page) {
        this.action = new ElementActions(page);
        this.nav = new NavigationActions(page);
    }
}
