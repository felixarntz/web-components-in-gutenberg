import Tab from './tab.js';
import TabPanel from './tab-panel.js';
import Tabs from './tabs.js';

const elements = [
	Tab,
	TabPanel,
	Tabs
];

elements.forEach( element => {
	customElements.define( element.is(), element );
} );
