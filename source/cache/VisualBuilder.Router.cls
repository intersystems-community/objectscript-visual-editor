/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application entry point for Caché Visual Builder WEB application.
Class VisualBuilder.Router extends %CSP.REST [ CompileAfter = StaticContent ] {

XData UrlMap
{
<Routes>
   <Route Url="/" Method="GET" Call="Index"/>
   <Route Url="/index" Method="GET" Call="Index"/>
   <Route Url="/css/index.css" Method="GET" Call="Css"/>
   <Route Url="/js/index.js" Method="GET" Call="Js"/>
   <Map Prefix="/Informer" Forward="VisualBuilder.REST.Informer"/>
   <Map Prefix="/Resources" Forward="VisualBuilder.REST.Resources"/>
</Routes>
}

ClassMethod PrintData(DataName as %String = "") As %Status [ Private ]
{
	set %response.CharSet = "utf-8"
	set %response.ContentType = ##class(StaticContent).GetMimeType(DataName)
	do %response.SetHeader("Last-Modified", ##class(StaticContent).#CompileTime)
	if (%request.GetCgiEnv("HTTP_IF_MODIFIED_SINCE") = ##class(StaticContent).#CompileTime) {
        set %response.Status = "304 Not Modified"
        return $$$OK
    } else {
        return ##class(StaticContent).PrintContent(DataName)
    }
}

/// This method outputs HTML.
ClassMethod Index() As %Status
{
	return ..PrintData("HTML")
}

/// This method outputs JavaScript.
ClassMethod Js() As %Status
{
	return ..PrintData("JS")
}

/// This method outputs CSS.
ClassMethod Css() As %Status
{
	return ..PrintData("CSS")
}

}