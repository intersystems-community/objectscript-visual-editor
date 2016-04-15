/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class holds static JavaScript libraries in the project.
Class VisualEditor.REST.StaticLibJS extends VisualEditor.REST.Content [ GeneratedBy = Gulp ] {

XData UrlMap
{
<Routes>
   <Route Url="/ace.js" Method="GET" Call="AceJS"/>
</Routes>
}

/// Outputs ace.js code
ClassMethod AceJS() As %Status
{
	return ..PrintXData("acejs")
}

/// This block handles HTML markup.
XData acejs [ MimeType = text/javascript ]
{
<d><![CDATA[<!-- @include ../client/js/lib/ace.js -->]]></d>
}

}