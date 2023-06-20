/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application that serves different information for the client.
Class VisualEditor.REST.Informer extends %CSP.REST {

XData UrlMap
{
<Routes>
   <Route Url="/list" Method="GET" Call="List"/>
   <Route Url="/init" Method="GET" Call="Init"/>
</Routes>
}

/// Returns all available namespaces for the current instance.
ClassMethod getAllNamespacesList() As %DynamicObject
{
    set namespaces = {}
    set result = ##class(%ResultSet).%New("%SYS.Namespace:List")
    do result.Execute()
    while (result.Next()) {
        set ns = {}
        set ns.remote = result.Get("Remote")
        set ns.status = result.Get("Status")
        do namespaces.%Set(result.Get("Nsp"), ns)
    }
    return namespaces
}

///
ClassMethod Init() As %Status
{
    set data = {}
    set data.namespace = $Namespace
    set data.namespaces = ..getAllNamespacesList()
    write data.%ToJSON()
    return $$$OK
}

/// Returns the object containing member data.
ClassMethod GetMemberData(class As %Dictionary.ClassDefinition, memberName As %String) As %DynamicObject [ Private ]
{
    set obj = {}
    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary."_memberName_"Definition")
    set propName = $case(memberName, "Parameter": "Parameters", "Property": "Properties",
        "Index": "Indices", "Query": "Queries", "Method": "Methods", "XData": "XDatas", :"Duck")
    for i=1:1:$PROPERTY(class, propName).Count() {
        set op = {}
        set p = $PROPERTY(class, propName).GetAt(i)
        for j=1:1:props.Properties.Count() {
            set pname = props.Properties.GetAt(j).Name
	    try {
            set val = $PROPERTY(p, pname)
            if ('$IsObject(val)) {
                do op.%Set(pname, val)
            } elseif ($$$classIsStream($ClassName(val))) {
                set v = val.Read()
                while ('val.AtEnd) {
                    set v = v _ val.Read()
                }
                do op.%Set(pname, v)
            }
	    } catch e {}
        }
        do obj.%Set(p.Name, op)
    }
    return obj
}

/// This method returns all available data about the class.
ClassMethod GetClassData(className As %String) As %DynamicObject
{
    set class = ##class(%Dictionary.ClassDefinition).%OpenId(className)
    set cClass = ##class(%Dictionary.CompiledClass).%OpenId(className)
    set oClass = {}
    if (class = "") { return oClass }

    do oClass.%Set("_type", "class")
    do oClass.%Set("_fullName", className)
    do oClass.%Set("_name", $PIECE(className, ".", *))
    do oClass.%Set("_isDataType", class.ClientDataTypeIsDefined())
    do oClass.%Set("_isOdbcType", class.OdbcTypeIsDefined())
    do oClass.%Set("_isSoapBindingStyle", class.SoapBindingStyleIsDefined())
    do oClass.%Set("_isSoapBodyUse", class.SoapBodyUseIsDefined())
    do oClass.%Set("_isSqlCategory", class.SqlCategoryIsDefined())

    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.ClassDefinition")
    for j=1:1:props.Properties.Count() {
        set pname = props.Properties.GetAt(j).Name
        if ((pname '= "parent") && ('props.Properties.GetAt(j).Private) && ('$IsObject($PROPERTY(class, pname)))) {
             do oClass.%Set(pname, $PROPERTY(class, pname))
        }
    }
    if (oClass.TimeChanged) { set oClass.TimeChanged = $zdatetime(oClass.TimeChanged) }
    if (oClass.TimeCreated) { set oClass.TimeCreated = $zdatetime(oClass.TimeCreated) }
    if ((cClass '= "") && (cClass.ClassType '= "")) {
        do oClass.%Set("_compiledClassType", cClass.ClassType)
    } else {
        do oClass.%Set("_compiledClassType", "registered") // default
    }

    set oClass.Parameters = ..GetMemberData(class, "Parameter")
    set oClass.Properties = ..GetMemberData(class, "Property")
    set oClass.Indices = ..GetMemberData(class, "Index")
    set oClass.Queries = ..GetMemberData(class, "Query")
    set oClass.Methods = ..GetMemberData(class, "Method")
    set oClass.XDatas = ..GetMemberData(class, "XData")

    return oClass
}

/// This method lists all the classes on the current level.
ClassMethod List() As %Status
{
    set ns = %request.Get("ns")
    if (##class(%SYS.Namespace).Exists(ns)) {
        znspace ns
    }
    set baseLevel = $case(%request.Get("level"), "":"", :%request.Get("level") _ ".")
    set classes = ##class(%ResultSet).%New("%Dictionary.ClassDefinition:ClassIndex")
    do classes.Execute()
    #dim folders as %Numeric
    set data = {}
    set skipSystem = $case($Namespace = "%SYS", 1: "", :"%")
    while (classes.Next()) {
        set clsName = classes.Data("ClassName")
        if ($EXTRACT(clsName, 1) = skipSystem) { continue }
        // skip if doesn't match baseLevel
        if ($FIND(clsName, baseLevel) '= ($LENGTH(baseLevel) + 1)) { continue }
        // turn to folder and skip if exists
        if ($LENGTH(clsName, ".") > $LENGTH(baseLevel, ".")) {
            set folderName = $PIECE(clsName, ".", $LENGTH(baseLevel, "."))
            if ($data(folders(folderName))) { continue }
            set folders(folderName) = 1
            set oFolder = {}
            do oFolder.%Set("_type", "package")
            do oFolder.%Set("_fullName", baseLevel _ folderName)
            do oFolder.%Set("_name", folderName)
            do data.%Set(folderName, oFolder)
        } elseif ($LENGTH(clsName, ".") = $LENGTH(baseLevel, ".")) {
            set className = $PIECE(clsName, ".", $LENGTH(baseLevel, "."))
            set oClass = ..GetClassData(clsName)
            do data.%Set(className, oClass)
        } else {
            continue
        }
    }

    write "" // fixes the strange $toJSON() issue: it does not output content properly without this string
    do data.%ToJSON()

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
