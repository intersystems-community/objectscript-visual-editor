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
    set baseLevel = $case(%request.Get("level"), "":"", :%request.Get("level") _ ".")
    set classes = ##class(%ResultSet).%New("%Dictionary.ClassDefinition:Summary")
    do classes.Execute()
    #dim folders as %Numeric
    set data = ##class(%ZEN.proxyObject).%New()
    while (classes.Next()) {
        set clsName = classes.Data("Name")
        // skip if doesn't match baseLevel
        if ($FIND(clsName, baseLevel) '= ($LENGTH(baseLevel) + 1)) { continue }
        // turn to folder and skip if exists
        if ($LENGTH(clsName, ".") > $LENGTH(baseLevel, ".")) {
            set folderName = $PIECE(clsName, ".", $LENGTH(baseLevel, "."))
            if ($data(folders(folderName))) { continue }
            set folders(folderName) = 1
            set oFolder = ##class(%ZEN.proxyObject).%New()
            set $PROPERTY(oFolder, "_type") = "package"
            set $PROPERTY(oFolder, "fullName") = baseLevel _ folderName
            set $PROPERTY(oFolder, "name") = folderName
            set $PROPERTY(data, folderName) = oFolder
        } elseif ($LENGTH(clsName, ".") = $LENGTH(baseLevel, ".")) {
            set className = $PIECE(clsName, ".", $LENGTH(baseLevel, "."))
            set oClass = ##class(%ZEN.proxyObject).%New()
            set $PROPERTY(oClass, "_type") = "class"
            set $PROPERTY(oClass, "fullName") = clsName
            set $PROPERTY(oClass, "name") = className
            set $PROPERTY(data, className) = oClass
        } else {
            continue
        }
    }
    do data.%ToJSON(, "o")

    return $$$OK
}

/// This method is a handler that is executed before each request.
ClassMethod OnPreDispatch() As %Status
{
	set %response.CharSet = "utf-8"
	set %response.ContentType="application/json"
    return $$$OK
}

}