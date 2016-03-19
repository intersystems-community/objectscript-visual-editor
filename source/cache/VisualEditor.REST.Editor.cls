/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application that allows user to edit class definitions.
/// The POST method here processes the %request.Content to a JSON %proxyObject.
Class VisualEditor.REST.Editor extends %CSP.REST {

XData UrlMap
{
<Routes>
   <Route Url="/save" Method="POST" Call="Save"/>
</Routes>
}

/// GET parameter "ns" get parameter - namespace to modify classes in.
/// POST JSON body is like
/// { "TestPack.TestClass": { "properties": { "TestInt": { "Description": "Test desc!" } } } }
ClassMethod Save() As %Status
{

    set ns = %request.Get("ns")
    if (##class(%SYS.Namespace).Exists(ns)) {
        znspace ns
    }

    set propDefs =
        ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.PropertyDefinition").Properties

    do %request.Content.%CopyToArray(.classes)
    set response = ##class(%ZEN.proxyObject).%New()
    set response.error = ""
    set response.modified = 0
    set className = $order(classes(""))
    while (className '= "") {

        set errorLog = ""
        set changes = 0

        set properties = ""
        if ($ClassName(classes(className).Properties) = "%ZEN.proxyObject") {
            do classes(className).Properties.%CopyToArray(.properties)
        }
        set propertyName = $order(properties(""))
        while (propertyName '= "") {
            set pDef = ##class(%Dictionary.PropertyDefinition).%OpenId(className_"||"_propertyName)
            if (pDef = "") {
                set errorLog = errorLog _ "Property " _ propertyName _ " not found in "
                    _ className _ $Char(10)
                set propertyName = $order(properties(propertyName))
                continue
            }

            // iterate over properties defined
            set props = properties(propertyName)
            for j=1:1:propDefs.Count() {
                set pname = propDefs.GetAt(j).Name
                if ($data(props.%data(pname))) {
                    set $PROPERTY(pDef, pname) = $PROPERTY(props, pname)
                }
            }

            set error = $System.Status.GetErrorText(pDef.%Save())
            if (error '= "") {
                set errorLog = errorLog _ error _ $Char(10)
            } else {
                set changes = changes + 1
            }

            set propertyName = $order(properties(propertyName))
        }

        if (errorLog '= "") {
            set response.error = response.error _ errorLog
            set className = $order(classes(className))
            continue
        }

        set st = $system.OBJ.Compile(className, "cuk-d", .errorLog)

        if (errorLog '= 0) {
            set response.error = response.error _ $CHAR(10) _ errorLog
            set className = $order(classes(className))
            continue
        }

        set response.modified = response.modified + changes

        set className = $order(classes(className))

    }

    do response.%ToJSON(, "o")
    return $$$OK

}

/// This method is a handler that is executed before each request.
ClassMethod OnPreDispatch() As %Status
{
	set %response.CharSet = "utf-8"
	set %response.ContentType="application/json"

    // Parsing POST request body
    #dim obj As %ZEN.proxyObject
    return:'$isobject(%request.Content) $$$OK
    set content = %request.Content.Read($$$MaxStringLength)
    set content = $ZCVT(content, "I", "UTF8")
    set st = ##class(%ZEN.Auxiliary.jsonProvider).%ConvertJSONToObject(content, , .obj, 1)
    return:$$$ISERR(st) st
    return:'$IsObject(obj) $$$ERROR("Unable to parse request body")
    set %request.Content = obj

    return $$$OK
}

}