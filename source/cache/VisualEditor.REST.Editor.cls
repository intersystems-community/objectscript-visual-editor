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

    #define nextClass set className = $order(classes(className)) continue

    set className = $order(classes(""))
    while (className '= "") {

        set classData = classes(className)

        if ($data(classData.%data("$add"))) {
            set classDef = ##class(%Dictionary.ClassDefinition).%New()
            set classDef.Name = className
        } else {
            set classDef = ##class(%Dictionary.ClassDefinition).%OpenId(className)
        }
        if (classDef = "") {
            set response.error = response.error _ "Class " _ className _ " does not exists." _ $Char(10)
            $$$nextClass
        }

        if ($data(classData.%data("$delete"))) {
            set error = $System.Status.GetErrorText(classDef.%Delete(classDef.%Oid()))
            if (error '= "") { set response.error = response.error _ error _ $CHAR(10) }
            set response.modified = response.modified + 1
            $$$nextClass
        }

        set errorLog = ""
        set changes = 0

        set properties = ""
        if ($ClassName(classData.Properties) = "%ZEN.proxyObject") {
            do classes(className).Properties.%CopyToArray(.properties)
        }

        #define nextProperty set propertyName = $order(properties(propertyName)) continue

        set propertyName = $order(properties(""))
        while (propertyName '= "") {
            set props = properties(propertyName)

            if ($data(props.%data("$add"))) {
                set pDef = ##class(%Dictionary.PropertyDefinition).%New()
                set pDef.parent = classDef
            } else {
                set pDef = ##class(%Dictionary.PropertyDefinition).%OpenId(className_"||"_propertyName)
            }
            if (pDef = "") {
                set errorLog = errorLog _ "Property " _ propertyName _ " not found in "
                    _ className _ $Char(10)
                $$$nextProperty
            }

            set deleted = 0
            if ($data(props.%data("$delete"))) {
                set error = $System.Status.GetErrorText(pDef.%Delete(pDef.%Oid()))
                set deleted = 1
            } else { // iterate over properties defined
                for j=1:1:propDefs.Count() {
                    set pname = propDefs.GetAt(j).Name
                    if ($data(props.%data(pname))) {
                        set $PROPERTY(pDef, pname) = $PROPERTY(props, pname)
                    }
                }
            }

            if ('deleted) {
                set error = $System.Status.GetErrorText(pDef.%Save())
            }
            if (error '= "") {
                set errorLog = errorLog _ error _ $Char(10)
            } else {
                set changes = changes + 1
            }

            $$$nextProperty
        }

        if (errorLog '= "") {
            set response.error = response.error _ errorLog
            $$$nextClass
        }

        set st = $system.OBJ.Compile(className, "cuk-d", .errorLog)

        if (errorLog '= 0) {
            set response.error = response.error _ errorLog(1) _ $CHAR(10)
            $$$nextClass
        }

        set response.modified = response.modified + changes

        $$$nextClass
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