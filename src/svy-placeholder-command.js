import Command from '@ckeditor/ckeditor5-core/src/command';

export default class SvyPlaceholderCommand extends Command {
    execute( { value, dataProvider } ) {
        const editor = this.editor;

        editor.model.change( writer => {
            // Create a <svy-placeholder> elment with the "name" and "dataprovider" attribute...
            const placeholder = writer.createElement( 'svy-placeholder', { name: value, dataprovider: dataProvider } );

            // ... and insert it into the document.
            editor.model.insertContent( placeholder );

            // Put the selection on the inserted element.
            writer.setSelection( placeholder, 'on' );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const isAllowed = model.schema.checkChild( selection.focus.parent, 'svy-placeholder' );

        this.isEnabled = isAllowed;
    }
}