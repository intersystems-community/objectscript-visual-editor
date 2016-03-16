/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class installs and removes <!-- @echo package.printableName -->. Once the class is
/// compiled, the application will be installed into Caché system. Then open the web-application
/// [host]/<!-- @echo config.webApplicationName -->/ (slash at the end is required).
Class VisualEditor.Installer Extends %Projection.AbstractProjection [ CompileAfter = (<!-- @echo compileAfter -->) ]
{

Projection Reference As Installer;

Parameter DispatchClass = "VisualEditor.Router";

Parameter RESTAppName = "/<!-- @echo config.webApplicationName -->";

/// This method creates a new web application by the given spec.
ClassMethod RegisterWebApplication(name As %String, spec) As %Status
{
    new $Namespace
    set $Namespace = "%SYS"
    set st = $$$OK
    if ('##class(Security.Applications).Exists(name)) {
        write !, "Creating WEB application """_name_"""..."
        set st = ##class(Security.Applications).Create(name, .spec)
        if ($$$ISOK(st)) {
            write !, "WEB application """_name_""" is created."
        }
    } else {
        do ##class(Security.Applications).Get(name, .props)
        if (props("DispatchClass") '= ..#DispatchClass) && (name = ..#RESTAppName) {
            write !, "WARNING! WEB application """_name_""" exists but does not refer to ",
                ..#DispatchClass, ".", !, "Please, set correct dispatch class for this ",
                "application or create a terminal WEB-application manually."
        } else {
            write !, "WEB application """_name_""" already exists, so it should be ready to use."
        }
    }
    return st
}

/// This method removes web application by app name.
ClassMethod DeleteWebApplication(name As %String)
{
    new $Namespace
    set $Namespace = "%SYS"
    if (##class(Security.Applications).Exists(name)) {
        do ##class(Security.Applications).Get(name, .props)
        if (props("DispatchClass") '= ..#DispatchClass) && (name = ..#RESTAppName) {
            write !, "Won't delete web-application """_name_""" because it does not refer to ",
                "dispatch class anymore."
        } else {
            write !, "Deleting WEB application """_name_"""..."
            do ##class(Security.Applications).Delete(name)
            write !, "WEB application """_name_""" is deleted."
        }
    } else {
        write !, "Unable to remove web-application """_name_""" as it does not exists."
    }
    return $$$OK
}

/// This method is invoked when a class is compiled.
ClassMethod CreateProjection(cls As %String, ByRef params) As %Status
{
    write !, "Installing <!-- @echo package.printableName --> to " _ $Namespace

    set cspProperties("AutheEnabled") = $$$AutheCache
    set cspProperties("NameSpace") = $Namespace
    set cspProperties("Description") = "A web application for <!-- @echo config.webApplicationName -->."
    set cspProperties("IsNameSpaceDefault") = $$$NO
    set cspProperties("DispatchClass") = ..#DispatchClass
    set st = ..RegisterWebApplication(..#RESTAppName, .cspProperties)
    if ($$$ISERR(st)) {
        return st
    }

    write !, "Installation is complete!"

    return $$$OK
}

/// This method is invoked when a class is 'uncompiled'.
ClassMethod RemoveProjection(cls As %String, ByRef params, recompile As %Boolean) As %Status
{
    write !, "Uninstalling <!-- @echo package.printableName --> from " _ $Namespace

    do ..DeleteWebApplication(..#RESTAppName)

    write !, "Uninstalling is complete!"

    return $$$OK
}

}