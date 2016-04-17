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

/// Saves keywords of class members and a class itself.
ClassMethod SaveKeywords(memberKind As %String, definitionObj, assignObj As %Object) As %String [ Private ]
{
    set errors = ""
    #define logError(%e) if (%e '= "") { set errors = errors _ %e _ $Char(10) }
    set propDefinition =
        ##class(%Dictionary.ClassDefinition).%OpenId("%Dictionary."_memberKind_"Definition").Properties

    set iterator = assignObj.$getIterator()
    while (iterator.$getNext(.pName, .data)) {
        if (pName = "$add") { continue }
        set propPos = propDefinition.FindObjectId("%Dictionary."_memberKind_"Definition||"_pName)
        if (propPos > 0) {
            set val = assignObj.$get(pName)
            if ($IsObject(val)) { continue }
            if (propDefinition.GetAt(propPos).Type = "%Stream.TmpCharacter") {
	            #dim stream As %Stream.TmpCharacter = $PROPERTY(definitionObj, pName)
	            do stream.Clear()
	            do stream.Write(val)
            } else {
                set $PROPERTY(definitionObj, pName) = val
            }
        } else {
            $$$logError("Unable to set """_pName_""" property of """_memberKind_""" in "_definitionObj.Name)
        }
    }
    $$$logError($System.Status.GetErrorText(definitionObj.%Save()))

    return errors
}

/// Saves properties of class properties.
ClassMethod SaveClassMember(memberKind As %String, classDef As %Dictionary.ClassDefinition, prps As %Object) As %String [ Private ]
{
    set errors = ""

    if (prps = "") {
        return ""
    }

    #define logError(%e) if (%e '= "") { set errors = errors _ %e _ $Char(10) }

    set iterator = prps.$getIterator()
    while (iterator.$getNext(.memberName, .props)) {

        if (props.$get("$add") '= "") {
            set pDef = $System.OBJ.New("%Dictionary."_memberKind_"Definition")
            set pDef.parent = classDef
        } else {
            set pDef = $System.OBJ.OpenId("%Dictionary."_memberKind_"Definition", classDef.Name_"||"_memberName)
        }
        if (pDef = "") {
            $$$logError("Member """_memberKind_""" named """_memberName_""" not found in "_classDef.Name)
            continue
        }

        if (props.$get("$delete") '= "") {
            set error = $System.Status.GetErrorText(pDef.%Delete(pDef.%Oid()))
            continue
        }

        do ..SaveKeywords(memberKind, pDef, props)

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

    set classes = %request.Content
    set response = {}
    set response.error = ""
    set response.modified = 0

    #define logError(%e) if (%e '= "") { set response.error = response.error _ %e _ $Char(10) }

    set iterator = classes.$getIterator()
    while (iterator.$getNext(.className, .classData)) {

        if (classData.$get("$add") '= "") {
            set classDef = ##class(%Dictionary.ClassDefinition).%New()
            set classDef.Name = className
        } else {
            set classDef = ##class(%Dictionary.ClassDefinition).%OpenId(className)
        }
        if (classDef = "") {
            $$$logError("Class " _ className _ " does not exists.")
            continue
        }

        if (classData.$get("$delete") '= "") {
            $$$logError($System.Status.GetErrorText(classDef.%Delete(classDef.%Oid())))
            set response.modified = response.modified + 1
            continue
        }

        $$$logError(..SaveClassMember("Parameter", classDef, classData.$get("Parameters")))
        $$$logError(..SaveClassMember("Property", classDef, classData.$get("Properties")))
        $$$logError(..SaveClassMember("Index", classDef, classData.$get("Indices")))
        $$$logError(..SaveClassMember("Method", classDef, classData.$get("Methods")))
        $$$logError(..SaveClassMember("Query", classDef, classData.$get("Queries")))
        $$$logError(..SaveClassMember("XData", classDef, classData.$get("XDatas")))
        $$$logError(..SaveKeywords("Class", classDef, classData))

        $$$logError($System.Status.GetErrorText(classDef.%Save()))

        do $system.OBJ.Compile(className, "cuk-d", .errorLog)

        if (errorLog '= 0) {
            $$$logError(errorLog(1))
            continue
        }

        set response.modified = response.modified + 1

    }

    write response.$toJSON()

    return $$$OK
}

/// This method is a handler that is executed before each request.
ClassMethod OnPreDispatch() As %Status
{
	set %response.CharSet = "utf-8"
	set %response.ContentType="application/json"

    return:'$isobject(%request.Content) $$$OK

    set %request.Content = ##class(%AbstractObject).$fromJSON(%request.Content)

    return $$$OK
}

}