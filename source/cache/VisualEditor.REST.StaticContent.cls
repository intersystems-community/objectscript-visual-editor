/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class handles all the static data. Note that this class is generated automatically by
/// performing build from the sources.
Class VisualEditor.REST.StaticContent extends VisualEditor.REST.Content {

/// This block handles HTML markup.
XData HTML [ MimeType = text/html ]
{
<d><![CDATA[<!-- @include ../client/index.html -->]]></d>
}

/// This block handles CSS stylesheets.
XData CSS [ MimeType = text/css ]
{
<d><![CDATA[<!-- @include ../client/css/index.css -->]]></d>
}

/// This block handles JavaScript.
XData JS [ MimeType = text/javascript ]
{
<d><![CDATA[<!-- @include ../client/js/index.js -->]]></d>
}

}