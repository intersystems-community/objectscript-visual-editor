/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This is a REST WEB application that allows user to edit class definitions.
/// The POST method here processes the %request.Content to a JSON %proxyObject.
Class VisualEditor.REST.Editor extends %CSP.REST {

XData UrlMap
{
<Routes>
   <Route Url="/save" Method="POST" Call="Save"/>
   <Route Url="/test" Method="POST" Call="Test"/>
</Routes>
}

/// Saves keywords of class members and a class itself.
ClassMethod SaveKeywords(memberKind As %String, definitionObj, assignObj As %ZEN.proxyObject) As %String [ Private ]
{
    set errors = ""
    #define logError(%e) if (%e '= "") { set errors = errors _ %e _ $Char(10) }
    set propDefinition =
        ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary."_memberKind_"Definition").Properties

    set pName = $order(assignObj.%data(""))
    while (pName '= "") {
        if (pName = "$add") { set pName = $order(assignObj.%data(pName)) continue }
        if (propDefinition.FindObjectId("%Dictionary."_memberKind_"Definition||"_pName) > 0) {
            if (('$IsObject($PROPERTY(assignObj, pName)))) {
                set $PROPERTY(definitionObj, pName) = $PROPERTY(assignObj, pName)
            }
        } else {
            $$$logError("Unable to set """_pName_""" property of """_memberKind_""" in "_definitionObj.Name)
        }
        set pName = $order(assignObj.%data(pName))
    }
    $$$logError($System.Status.GetErrorText(definitionObj.%Save()))

    return errors
}

/// Saves properties of class properties.
ClassMethod SaveClassMember(memberKind As %String, classDef As %Dictionary.ClassDefinition, prps As %ZEN.proxyObject) As %String [ Private ]
{
    set errors = ""

    if ($ClassName(prps) = "%ZEN.proxyObject") {
        do prps.%CopyToArray(.properties)
    } else {
        return ""
    }

    #define nextProperty set memberName = $order(properties(memberName)) continue
    #define logError(%e) if (%e '= "") { set errors = errors _ %e _ $Char(10) }
    #define hasErrors errors '= ""

    set memberName = $order(properties(""))
    while (memberName '= "") {

        set props = properties(memberName)

        if ($data(props.%data("$add"))) {
            set pDef = $System.OBJ.New("%Dictionary."_memberKind_"Definition")
            set pDef.parent = classDef
        } else {
            set pDef = $System.OBJ.OpenId("%Dictionary."_memberKind_"Definition", classDef.Name_"||"_memberName)
        }
        if (pDef = "") {
            $$$logError("Member """_memberKind_""" named """_memberName_""" not found in "_classDef.Name)
            $$$nextProperty
        }

        if ($data(props.%data("$delete"))) {
            set error = $System.Status.GetErrorText(pDef.%Delete(pDef.%Oid()))
        } else { // iterate over properties defined in props and save
            do ..SaveKeywords(memberKind, pDef, props)
        }

        $$$nextProperty

    }

    return errors
}

/// GET parameter "ns" - namespace to modify classes in.
/// POST JSON body is like:
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

        $$$logError(..SaveClassMember("Parameter", classDef, $PROPERTY(classData, "Parameters")))
        $$$logError(..SaveClassMember("Property", classDef, $PROPERTY(classData, "Properties")))
        $$$logError(..SaveClassMember("Index", classDef, $PROPERTY(classData, "Indices")))
        $$$logError(..SaveClassMember("Method", classDef, $PROPERTY(classData, "Methods")))
        $$$logError(..SaveClassMember("Query", classDef, $PROPERTY(classData, "Queries")))
        $$$logError(..SaveClassMember("XData", classDef, $PROPERTY(classData, "XDatas")))
        $$$logError(..SaveKeywords("Class", classDef, classData))

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

ClassMethod Test() As %Status
{
    write %request.Content
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