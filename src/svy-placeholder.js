/**
 * @module SvyPlaceholder/SvyPlaceholder
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SvyPlaceholderUi from './svy-placeholder-ui';

/**
 * Servoy Placeholder plugin
 *
 * @extends module:core/plugin~Plugin
 */
export default class SvyPlaceholder extends Plugin {

    /**
     * @inheritDoc
     */
	static get requires() {
		return [SvyPlaceholderUi];
	}

    /**
     * @inheritDoc
     */
	static get pluginName() {
		return 'svyPlaceholder';
	}

}
