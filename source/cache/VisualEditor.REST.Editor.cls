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

/// Saves properties of class properties.
ClassMethod SaveProperties(classDef As %Dictionary.ClassDefinition, prps As %ZEN.proxyObject) As %String
{
    set errors = ""

    if ($ClassName(prps) = "%ZEN.proxyObject") {
        do prps.%CopyToArray(.properties)
    } else {
        return ""
    }

    #define nextProperty set propertyName = $order(properties(propertyName)) continue
    #define logError(%e) if (%e '= "") { set errors = errors _ %e _ $Char(10) }
    #define hasErrors errors '= ""
    set propDefs =
        ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary.PropertyDefinition").Properties

    set propertyName = $order(properties(""))
    while (propertyName '= "") {

        set props = properties(propertyName)

        if ($data(props.%data("$add"))) {
            set pDef = ##class(%Dictionary.PropertyDefinition).%New()
            set pDef.parent = classDef
        } else {
            set pDef = ##class(%Dictionary.PropertyDefinition).%OpenId(classDef.Name_"||"_propertyName)
        }
        if (pDef = "") {
            $$$logError("Property " _ propertyName _ " not found in " _ className)
            $$$nextProperty
        }

        if ($data(props.%data("$delete"))) {
            set error = $System.Status.GetErrorText(pDef.%Delete(pDef.%Oid()))
        } else { // iterate over properties defined in props and save
            set pName = $order(props.%data(""))
            while (pName '= "") {
                if (pName = "$add") { set pName = $order(props.%data(pName)) continue }
                if (propDefs.FindObjectId("%Dictionary.PropertyDefinition||"_pName) > 0) {
                    set $PROPERTY(pDef, pName) = $PROPERTY(props, pName)
                } else {
                    $$$logError("Unable to set """_pName_""" property of """_propertyName_""" in class "_classDef.Name)
                }
                set pName = $order(props.%data(pName))
            }
            $$$logError($System.Status.GetErrorText(pDef.%Save()))
        }

        $$$nextProperty

    }

    return errors
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

    do %request.Content.%CopyToArray(.classes)
    set response = ##class(%ZEN.proxyObject).%New()
    set response.error = ""
    set response.modified = 0

    #define nextClass set className = $order(classes(className)) if (errors '= "") { set response.error = response.error _ errors } continue
    #define logError(%e) if (%e '= "") { set errors = errors _ %e _ $Char(10) }
    #define hasErrors errors '= ""

    set className = $order(classes(""))
    while (className '= "") {

        set errors = ""
        set classData = classes(className)

        if ($data(classData.%data("$add"))) {
            set classDef = ##class(%Dictionary.ClassDefinition).%New()
            set classDef.Name = className
        } else {
            set classDef = ##class(%Dictionary.ClassDefinition).%OpenId(className)
        }
        if (classDef = "") {
            $$$logError("Class " _ className _ " does not exists.")
            $$$nextClass
        }

        if ($data(classData.%data("$delete"))) {
            $$$logError($System.Status.GetErrorText(classDef.%Delete(classDef.%Oid())))
            set response.modified = response.modified + 1
            $$$nextClass
        } else {
            $$$logError($System.Status.GetErrorText(classDef.%Save()))
            if ($$$hasErrors) { $$$nextClass }
        }

        $$$logError(..SaveProperties(classDef, classData.Properties))

        if ($$$hasErrors) { $$$nextClass }

        set st = $system.OBJ.Compile(className, "cuk-d", .errorLog)

        if (errorLog '= 0) {
            $$$logError(errorLog(1))
            $$$nextClass
        }

        set response.modified = response.modified + 1

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
    return:'$IsObject(obj) $$$ERROR($$$GeneralError, "Unable to parse request body")
    set %request.Content = obj

    return $$$OK
}

}