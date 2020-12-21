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

        this.placeholderConfig = this.editor.config.get('svyPlaceholderConfig') || {name: 'Placeholder', values: []};
        console.log(this.placeholderConfig);

        this.dropdownView = null;

        // The "placeholder" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'servoyPlaceholder', locale => {
            const dropdownView = createDropdown( locale );

            // Populate the list in the dropdown with items.
            addListToDropdown( dropdownView, this.getDropdownItemsDefinitions( this.placeholderConfig ) );

            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Placeholder' ),
                tooltip: true,
                withText: true
            } );

            // Disable the placeholder button when the command is disabled.
            const command = editor.commands.get( 'servoyPlaceholder' );
            dropdownView.bind( 'isEnabled' ).to( command );

            // // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( 'servoyPlaceholder', { value: evt.source.commandParam } );
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
	
	getDropdownItemsDefinitions( placeholderConfig ) {
        const itemDefinitions = new Collection();

        if (placeholderConfig && placeholderConfig.values) {
            placeholderConfig.values.forEach(element => {
                const definition = {
                    type: 'button',
                    model: new Model( {
                        commandParam: element.displayValue,
                        label: element.displayValue,
                        dataProvider: element.dataProvider,
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