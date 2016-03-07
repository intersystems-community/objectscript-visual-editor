/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application part that contains resources like images.
Class VisualBuilder.REST.Resources extends (%CSP.REST, VisualBuilder.REST.Content) {

XData UrlMap
{
<Routes>
    <Route Url="/([^\x00]+)" Method="GET" Call="GetFile"/>
</Routes>
}

ClassMethod GetFile(fileName As %String) As %Status
{
    set DataName = $REPLACE($REPLACE(fileName, "/", ""), ".", "")
    set %response.CharSet = "utf-8"
    set %response.ContentType = ..GetMimeType(DataName)
    do %response.SetHeader("Last-Modified", ..#CompileTime)
    if (%request.GetCgiEnv("HTTP_IF_MODIFIED_SINCE") = ..#CompileTime) {
        set %response.Status = "304 Not Modified"
        return $$$OK
    } else {
        return ..PrintContent(DataName, 1)
    }
}

<!-- @exec getStaticFilesXDatas() -->

}