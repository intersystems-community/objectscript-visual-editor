/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application that serves different information for the client.
Class VisualBuilder.REST.Informer extends %CSP.REST {

XData UrlMap
{
<Routes>
   <Route Url="/list" Method="GET" Call="List"/>
</Routes>
}

ClassMethod List() As %Status
{
    set basePath = %request.Get("path")

    set classes = ##class(%ResultSet).%New("%Dictionary.ClassDefinition:Summary")
    do classes.Execute()
    while (classes.Next()) {
        if (($FIND(classes.Data("Name"), basePath) '= $LENGTH(basePath) + 1) || ()) { continue }
        // todo: filter sub-packages: [basePath].ClassName or [basePath].Package.ClassName
    }

    write "test list"
    return $$$OK
}

}