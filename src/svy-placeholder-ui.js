/**
 * @module SvyPlaceholder/SvyPlaceholderUi
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';

export default class SvyPlaceholderUi extends Plugin {

    /**
     * @inheritDoc
     */
	init() {
        console.log( 'SvyPlaceholderUi#init() got called' );

        const editor = this.editor;
        const t = editor.t;

        this.placeholderConfig = this.editor.config.get('svyPlaceholderConfig');
        this.placeholderItems = this.editor.config.get('svyPlaceholderItems');
        console.log(this.placeholderConfig);

        this.dropdownView = null;

        if (this.placeholderConfig && this.placeholderItems.length > 0) {
            // The "placeholder" dropdown must be registered among the UI components of the editor
            // to be displayed in the toolbar.
            editor.ui.componentFactory.add( 'servoyPlaceholder', locale => {
                const dropdownView = createDropdown( locale );

                // Populate the list in the dropdown with items.
                addListToDropdown( dropdownView, this.getDropdownItemsDefinitions( this.placeholderItems ) );

                dropdownView.buttonView.set( {
                    label: this.placeholderConfig.name,
                    tooltip: this.placeholderConfig.withTooltip,
                    withText: this.placeholderConfig.withText,
                    icon: this.placeholderConfig.icon,
                    isEnabled: this.placeholderConfig.isEnabled
                } );

                // Disable the placeholder button when the command is disabled.
                const command = editor.commands.get( 'servoyPlaceholder' );
                dropdownView.bind( 'isEnabled' ).to( command );

                // Execute the command when the dropdown item is clicked (executed).
                this.listenTo( dropdownView, 'execute', evt => {
                    editor.execute( 'servoyPlaceholder', { name: evt.source.name, dataProvider: evt.source.dataProvider, format: evt.source.format } );
                    editor.editing.view.focus();
                } );

                this.dropdownView = dropdownView;

                return dropdownView;
            });

            //sync disabled state of editor and toolbar items
            this.editor.on('change:isReadOnly', () => {
                this.dropdownView.isEnabled = !this.editor.isReadOnly;
            });
        }
	}
	
	getDropdownItemsDefinitions( placeholderItems ) {
        const itemDefinitions = new Collection();

        if (placeholderItems && placeholderItems.length) {
            placeholderItems.forEach(element => {
                const definition = {
                    type: 'button',
                    model: new Model( {
                        name: element.displayName,
                        label: element.displayName,
                        dataProvider: element.dataProvider,
                        format: element.format,
                        withText: true
                    } )
                };

                // Add the item definition to the collection.
                itemDefinitions.add( definition );
            });
        }

        return itemDefinitions;
	}
}