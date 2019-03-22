import Tab from './tab.js';
import TabList from './tab-list.js';
import TabPanel from './tab-panel.js';
import Tabs from './tabs.js';

const elements = [
	Tab,
	TabList,
	TabPanel,
	Tabs
];

elements.forEach( element => {
	customElements.define( element.is(), element );
} );
