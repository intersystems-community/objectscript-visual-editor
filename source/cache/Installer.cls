/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class installs and removes <!-- @echo package.printableName -->. Once the class is
/// compiled, the application will be installed into Cache system. Then open the web-application
/// [host]/<!-- @echo config.webApplicationName -->/ (slash at the end is required).
Class VisualEditor.Installer Extends %Projection.AbstractProjection [ Not ProcedureBlock, CompileAfter = (<!-- @echo compileAfter -->) ]
{

Projection Reference As Installer;

Parameter DispatchClass = "VisualEditor.Router";

Parameter RESTAppName = "/<!-- @echo config.webApplicationName -->";

ClassMethod Init()
{
    set installLog = ""
    set errorOccurred = 0
}

/// This method creates a new web application by the given spec.
ClassMethod RegisterWebApplication(name As %String, spec) As %Status
{
    $$$log("Moving to %SYS.")
    new $Namespace
    set $Namespace = "%SYS"
    set st = $$$OK
    if ('##class(Security.Applications).Exists(name)) {
        $$$log("Creating WEB application """_name_"""...")
        set st = ##class(Security.Applications).Create(name, .spec)
        if ($$$ISOK(st)) {
            $$$log("WEB application """_name_""" is created.")
        } else {
            $$$log("Unable to create WEB-application """_name_"""!")
            set st = $$$ERROR()
        }
    } else {
        $$$log("WEB-application """_name_""" already exists, checking it's DispatchClass...")
        do ##class(Security.Applications).Get(name, .props)
        if (props("DispatchClass") '= ..#DispatchClass) && (name = ..#RESTAppName) {
            $$$log("WARNING! WEB application """_name_""" exists but does not refer to " _ ..#DispatchClass _ ". Please, set correct dispatch class for this " _ "application or create the WEB-application manually.")
            set st = $$$ERROR()
        } else {
            $$$log("WEB application """_name_""" already exists, so it should be ready to use.")
        }
    }
    return st
}

/// This method removes web application by app name.
ClassMethod DeleteWebApplication(name As %String) As %Status
{
    $$$log("Moving to %SYS.")
    new $Namespace
    set $Namespace = "%SYS"
    if (##class(Security.Applications).Exists(name)) {
        do ##class(Security.Applications).Get(name, .props)
        if (props("DispatchClass") '= ..#DispatchClass) && (name = ..#RESTAppName) {
            $$$log("Won't delete web-application """_name_""" because it does not refer to " _ "dispatch class anymore.")
        } else {
            $$$log("Deleting WEB application """_name_"""...")
            do ##class(Security.Applications).Delete(name)
            $$$log("WEB application """_name_""" is deleted.")
        }
    } else {
        $$$log("Unable to delete web-application """_name_""" as it does not exists.")
    }
    return $$$OK
}

/// This method is invoked when a class is compiled.
ClassMethod CreateProjection() As %Status
{
    do ..Init()
    #define log(%s) set installLog = installLog _ $case(installLog = "", 1: "", :$C(10)) _ %s write !, %s
    #define testError(%e) if ($$$ISERR(%e)) { set errorOccurred = 1 }

    $$$log("Installing <!-- @echo package.printableName --> to " _ $Namespace)

    set cspProperties("AutheEnabled") = $$$AutheCache
    set cspProperties("NameSpace") = $Namespace
    set cspProperties("Description") = "A web application for <!-- @echo config.webApplicationName -->."
    set cspProperties("IsNameSpaceDefault") = $$$NO
    set cspProperties("DispatchClass") = ..#DispatchClass
    set st = ..RegisterWebApplication(..#RESTAppName, .cspProperties)
    $$$testError(st)
    if ('$$$ISERR(st)) {
        $$$log("Installation is complete!")
    }
    do ..Stats()

    return $$$OK
}

/// This method is invoked when a class is 'uncompiled'.
ClassMethod RemoveProjection() As %Status
{
    do ..Init()
    #define log(%s) set installLog = installLog _ $case(installLog = "", 1: "", :$C(10)) _ %s write !, %s
    #define testError(%e) if ($$$ISERR(%e)) { set errorOccurred = 1 }

    $$$log("Uninstalling <!-- @echo package.printableName --> from " _ $Namespace)

    do ..DeleteWebApplication(..#RESTAppName)

    $$$log("Uninstalling is complete!")

    return $$$OK
}

/// This method sends anonymous statistics about installation process to
/// <!-- @echo package.printableName --> developer.
ClassMethod Stats() As %Status {
    if ($get(installLog) = "") { return $$$OK }

    #define checkErr(%e) if $$$ISERR(%e) { do $SYSTEM.Status.DisplayError(%e) return %e }

    set sid = $ZD($H,3)
    set key = "x8AlP"_$E(sid,1,1)_"tq"

    set body = ##class(%ZEN.proxyObject).%New()
    set body.cacheVersion = $ZVERSION
    set body.version = "<!-- @echo package.version -->"
    set body.success = 'errorOccurred
    set body.sid = sid
    if (errorOccurred) { set body.log = installLog }

    set req = ##class(%Net.HttpRequest).%New()
    set req.ContentType = "application/json"
    set req.Server = "stats.zitros.tk"
    do ##class(%ZEN.Auxiliary.jsonProvider).%WriteJSONStreamFromObject(.jsonStream, body)
    do req.EntityBody.CopyFrom(jsonStream)
    $$$checkErr(req.Post("/?key="_key_"&sid="_sid))

    set content = $case($isobject(req.HttpResponse.Data),
        1: req.HttpResponse.Data.Read($$$MaxStringLength),
        :req.HttpResponse.Data)
    set content = $ZCVT(content, "I", "UTF8")
    $$$checkErr(##class(%ZEN.Auxiliary.jsonProvider).%ConvertJSONToObject(content, , .obj, 1))
    if (obj.error '= "") {
        $$$checkErr($$$ERROR($$$GeneralError, "Unable to collect statistics: " _ obj.error))
    }

    return $$$OK
}

}