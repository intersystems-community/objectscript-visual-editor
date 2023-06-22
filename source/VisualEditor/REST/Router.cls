/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application entry point for <!-- @echo package.printableName --> WEB application.
Class VisualEditor.REST.Router Extends VisualEditor.REST.Content [ CompileAfter = VisualEditor.REST.StaticLibJS ] {

XData UrlMap
{
<Routes>
    <Map Prefix="/js/lib" Forward="VisualEditor.REST.StaticLibJS"/>
    <Map Prefix="/Informer" Forward="VisualEditor.REST.Informer"/>
    <Map Prefix="/Resources" Forward="VisualEditor.REST.Resources"/>
    <Map Prefix="/Editor" Forward="VisualEditor.REST.Editor"/>
    <Route Url="/" Method="GET" Call="Index"/>
    <Route Url="/index" Method="GET" Call="Index"/>
    <Route Url="/css/index.css" Method="GET" Call="Css"/>
    <Route Url="/js/index.js" Method="GET" Call="Js"/>
</Routes>
}

/// This method outputs HTML.
ClassMethod Index() As %Status
{
	return ..PrintXData("html")
}

/// This method outputs JavaScript.
ClassMethod Js() As %Status
{
	return ..PrintXData("javascript")
}

/// This method outputs CSS.
ClassMethod Css() As %Status
{
	return ..PrintXData("css")
}

/// This block handles HTML markup.
XData html [ MimeType = text/html ]
{
<d><![CDATA[<!-- @include ../client/index.html -->]]></d>
}

/// This block handles CSS stylesheets.
XData css [ MimeType = text/css ]
{
<d><![CDATA[<!-- @include ../client/css/index.css -->]]></d>
}

/// This block handles JavaScript.
XData javascript [ MimeType = text/javascript ]
{
<d><![CDATA[<!-- @include ../client/js/index.js -->]]></d>
}

}