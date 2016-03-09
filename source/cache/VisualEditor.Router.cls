/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application entry point for <!-- @echo package.printableName --> WEB application.
Class VisualEditor.Router extends %CSP.REST [ CompileAfter = VisualEditor.REST.StaticContent ] {

XData UrlMap
{
<Routes>
   <Route Url="/" Method="GET" Call="Index"/>
   <Route Url="/index" Method="GET" Call="Index"/>
   <Route Url="/css/index.css" Method="GET" Call="Css"/>
   <Route Url="/js/index.js" Method="GET" Call="Js"/>
   <Map Prefix="/Informer" Forward="VisualEditor.REST.Informer"/>
   <Map Prefix="/Resources" Forward="VisualEditor.REST.Resources"/>
</Routes>
}

ClassMethod PrintData(DataName as %String = "") As %Status [ Private ]
{
    set cTime = ##class(VisualEditor.REST.StaticContent).#CompileTime
	set %response.CharSet = "utf-8"
	set %response.ContentType = ##class(VisualEditor.REST.StaticContent).GetMimeType(DataName)
	do %response.SetHeader("Last-Modified", cTime)
	if (%request.GetCgiEnv("HTTP_IF_MODIFIED_SINCE") = cTime) {
        set %response.Status = "304 Not Modified"
        return $$$OK
    } else {
        if ($$$ISERR(##class(VisualEditor.REST.StaticContent).PrintContent(DataName))) {
            return ..ReportHttpStatusCode(404)
        } else {
            return $$$OK
        }
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