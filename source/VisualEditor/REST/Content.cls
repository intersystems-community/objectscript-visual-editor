/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class is a base class for classes that serve static resources.
Class VisualEditor.REST.Content Extends %CSP.REST {

/// Identifies the compilation time, which is used to form "Last-Modified" HTTP header.
Parameter CompileTime = {"""" _ $zd($h, 11) _ ", "_ $zdt($NOW(0), 2,1) _ " GMT"""};

/// This method makes a HTTP GET response with the XData content by XData given name in current class.
ClassMethod PrintXData(XDataName as %String = "") As %Status [ Private ]
{
    set xdata = ##class(%Dictionary.CompiledXData).%OpenId($ClassName()_"||"_XDataName)
    if (xdata = "") {
        return $$$ERROR($$$GeneralError, "No "_XDataName_" XData")
    }

	set %response.CharSet = "utf-8"
	set %response.ContentType = xdata.MimeType

	set cTime = $PARAMETER($ClassName(), "CompileTime")
	do %response.SetHeader("Last-Modified", cTime)
	if (%request.GetCgiEnv("HTTP_IF_MODIFIED_SINCE") = cTime) {
        set %response.Status = "304 Not Modified"
        return $$$OK
    }

    do ..PrintContent(xdata)
    return $$$OK
}

/// This method outputs content from the given class XData block.
ClassMethod PrintContent(XDataDef As %Dictionary.CompiledXData) As %Status [ Private ]
{
	set pos = 13 // Read the first part "<d><![CDATA[".length = 13
    do XDataDef.Data.MoveTo(pos)
	while (XDataDef.Data.SizeGet() - pos > 8) { // "]]></d>\n".length = 8
		set toRead = XDataDef.Data.SizeGet() - pos - 8
		set pos = pos + toRead
		write XDataDef.Data.Read(toRead)
	}
	return $$$OK
}

}