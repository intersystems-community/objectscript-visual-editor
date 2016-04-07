/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class handles all the static data. Note that this class is generated automatically by
/// performing build from the sources.
Class VisualEditor.REST.StaticContent extends VisualEditor.REST.Content {

/// This block handles HTML markup.
XData html
{
<d><![CDATA[<!-- @include ../client/index.html -->]]></d>
}

/// This block handles CSS stylesheets.
XData css
{
<d><![CDATA[<!-- @include ../client/css/index.css -->]]></d>
}

/// This block handles JavaScript.
XData javascript
{
<d><![CDATA[<!-- @include ../client/js/index.js -->]]></d>
}

}