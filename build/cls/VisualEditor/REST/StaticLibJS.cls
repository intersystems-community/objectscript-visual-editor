/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class holds static JavaScript libraries in the project.
Class VisualEditor.REST.StaticLibJS extends VisualEditor.REST.Content [ GeneratedBy = Gulp ] {

XData UrlMap
{
<Routes>
   <Route Url="/ace/ace.js" Method="GET" Call="AceJS"/>
   <Route Url="/ace/mode-xml.js" Method="GET" Call="AceXML"/>
</Routes>
}

/// Outputs ace.js code
ClassMethod AceJS() As %Status
{
	return ..PrintXData("acejs")
}

/// Outputs ace.js code
ClassMethod AceXML() As %Status
{
	return ..PrintXData("acexml")
}

/// This block handles HTML markup.
XData acejs [ MimeType = text/javascript ]
{
<d><![CDATA[<!-- @include ../client/js/lib/ace/ace.js -->]]></d>
}

/// This block handles HTML markup.
XData acexml [ MimeType = text/javascript ]
{
<d><![CDATA[<!-- @include ../client/js/lib/ace/mode-xml.js -->]]></d>
}

}