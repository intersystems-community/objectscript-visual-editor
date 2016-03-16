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

ClassMethod Init() As %Status
{
    set data = ##class(%ZEN.proxyObject).%New()
    set data.namespace = $Namespace
    do data.%ToJSON(, "o")
    quit $$$OK
}

/// This method returns all available data about the class.
ClassMethod GetClassData(className As %String) As %ZEN.proxyObject
{
    set class = ##class(%Dictionary.ClassDefinition).%OpenId(className)
    set cClass = ##class(%Dictionary.CompiledClass).%OpenId(className)
    set oClass = ##class(%ZEN.proxyObject).%New()
    if ((class = "") || (cClass = "")) return oClass

    set oParameters = ##class(%ZEN.proxyObject).%New()
    set oProperties = ##class(%ZEN.proxyObject).%New()
    set oMethods = ##class(%ZEN.proxyObject).%New()
    set oQueries = ##class(%ZEN.proxyObject).%New()
    set oIndices = ##class(%ZEN.proxyObject).%New()
    set oXDatas = ##class(%ZEN.proxyObject).%New()

    set oClass.isDataType = class.ClientDataTypeIsDefined()
    set oClass.isOdbcType = class.OdbcTypeIsDefined()
    set oClass.isSoapBindingStyle = class.SoapBindingStyleIsDefined()
    set oClass.isSoapBodyUse = class.SoapBodyUseIsDefined()
    set oClass.isSqlCategory = class.SqlCategoryIsDefined()

    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.ClassDefinition")
    for j=1:1:props.Properties.Count() {
        set pname = props.Properties.GetAt(j).Name
        set:((pname '= "parent")
             && ('props.Properties.GetAt(j).Private)
             && ('$IsObject($PROPERTY(class, pname)))) $PROPERTY(oClass, pname) = $PROPERTY(class, pname)
    }
    if (oClass.TimeChanged) { set oClass.TimeChanged = $zdatetime(oClass.TimeChanged) }
    if (oClass.TimeCreated) { set oClass.TimeCreated = $zdatetime(oClass.TimeCreated) }
    if ((cClass.ClassType '= "")) {
        set oClass.ClassType = cClass.ClassType // set class type from all inherited classes
    } else {
        set oClass.ClassType = "registered"
    }

    set oClass.Parameters = oParameters
    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.ParameterDefinition")
    for i=1:1:class.Parameters.Count() {
        set oPar = ##class(%ZEN.proxyObject).%New()
        set p = class.Parameters.GetAt(i)
        for j=1:1:props.Properties.Count() {
            set pname = props.Properties.GetAt(j).Name
            set:(pname '= "parent") $PROPERTY(oPar, pname) = $PROPERTY(p, pname)
        }
        do oParameters.%DispatchSetProperty(p.Name, oPar)
    }

    set oClass.Properties = oProperties
    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.PropertyDefinition")
    for i=1:1:class.Properties.Count() {
        set oProp = ##class(%ZEN.proxyObject).%New()
        set p = class.Properties.GetAt(i)
        for j=1:1:props.Properties.Count() {
            set pname = props.Properties.GetAt(j).Name
            set:(pname '= "parent") $PROPERTY(oProp, pname) = $PROPERTY(p, pname)
        }
        do oProperties.%DispatchSetProperty(p.Name, oProp)
    }

    set oClass.Methods = oMethods
    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.MethodDefinition")
    for i=1:1:class.Methods.Count() {
        set oMeth = ##class(%ZEN.proxyObject).%New()
        set met = class.Methods.GetAt(i)
        for j=1:1:props.Properties.Count() {
            set pname = props.Properties.GetAt(j).Name
            set:((pname '= "parent") && (pname '= "Implementation")) $PROPERTY(oMeth, pname) = $PROPERTY(met, pname)
        }
        do oMethods.%DispatchSetProperty(met.Name, oMeth)
    }

    set oClass.Queries = oQueries
    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.QueryDefinition")
    for i=1:1:class.Queries.Count() {
        set oProp = ##class(%ZEN.proxyObject).%New()
        set q = class.Queries.GetAt(i)
        for j=1:1:props.Properties.Count() {
            set pname = props.Properties.GetAt(j).Name
            set:(pname '= "parent") $PROPERTY(oProp, pname) = $PROPERTY(q, pname)
        }
        do oQueries.%DispatchSetProperty(q.Name, oProp)
    }

    set oClass.XDatas = oXDatas
    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.XDataDefinition")
    for i=1:1:class.XDatas.Count() {
        set oProp = ##class(%ZEN.proxyObject).%New()
        set xd = class.XDatas.GetAt(i)
        for j=1:1:props.Properties.Count() {
            set pname = props.Properties.GetAt(j).Name
            set:((pname '= "parent") && (pname '= "Object")) $PROPERTY(oProp, pname) = $PROPERTY(xd, pname)
        }
        do oXDatas.%DispatchSetProperty(xd.Name, oProp)
    }

    set oClass.Indices = oIndices
    set props = ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.IndexDefinition")
    for i=1:1:class.Indices.Count() {
        set oProp = ##class(%ZEN.proxyObject).%New()
        set ind = class.Indices.GetAt(i)
        for j=1:1:props.Properties.Count() {
            set pname = props.Properties.GetAt(j).Name
            set:(pname '= "parent") $PROPERTY(oProp, pname) = $PROPERTY(ind, pname)
        }
        do oIndices.%DispatchSetProperty(ind.Name, oProp)
    }

    return oClass
}

/// This method lists all the classes on the current level.
ClassMethod List() As %Status
{
    set baseLevel = $case(%request.Get("level"), "":"", :%request.Get("level") _ ".")
    set classes = ##class(%ResultSet).%New("%Dictionary.ClassDefinition:ClassIndex")
    do classes.Execute()
    #dim folders as %Numeric
    set data = ##class(%ZEN.proxyObject).%New()
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
            set oFolder = ##class(%ZEN.proxyObject).%New()
            set $PROPERTY(oFolder, "_type") = "package"
            set $PROPERTY(oFolder, "fullName") = baseLevel _ folderName
            set $PROPERTY(oFolder, "name") = folderName
            set $PROPERTY(data, folderName) = oFolder
        } elseif ($LENGTH(clsName, ".") = $LENGTH(baseLevel, ".")) {
            set className = $PIECE(clsName, ".", $LENGTH(baseLevel, "."))
            set oClass = ..GetClassData(clsName)
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