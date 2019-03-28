/*
 * Tabbed admin page module.
 *
 * Web Components in Gutenberg, Copyright 2019 Google LLC
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 */

import Tab from './custom-elements/tab.js';
import TabPanel from './custom-elements/tab-panel.js';
import Tabs from './custom-elements/tabs.js';

const elements = [
	Tab,
	TabPanel,
	Tabs
];

elements.forEach( element => {
	customElements.define( element.is, element );
} );
