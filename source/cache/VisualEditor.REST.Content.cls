/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class is a base class for classes that serve resources.
Class VisualEditor.REST.Content {

/// Identifies the compilation time, which is used to form "Last-Modified" HTTP header.
Parameter CompileTime = {"""" _ $zd($h, 11) _ ", "_ $zdt($NOW(0), 2,1) _ " GMT"""};

/// This method outputs content from the class XData blocks.
ClassMethod PrintContent(XDataName As %String = "") As %Status
{
	set xdata = ##class(%Dictionary.CompiledXData).%OpenId($ClassName()_"||"_XDataName)
	set pos = 13 // Read the first part "<d><![CDATA[".length = 13
	if (xdata = "") {
	    return $$$ERROR("No "_XDataName_" XData")
	} else {
	    do xdata.Data.MoveTo(pos)
	}
	while (xdata.Data.SizeGet() - pos > 8) { // "]]></d>\n".length = 8
		set toRead = xdata.Data.SizeGet() - pos - 8
		set pos = pos + toRead
		write xdata.Data.Read(toRead)
	}
	return $$$OK
}

/// This method returns MIME type of XData.
ClassMethod GetMimeType(XDataName As %String = "") As %String
{
	set xdata = ##class(%Dictionary.CompiledXData).%OpenId($ClassName()_"||"_XDataName)
	if (xdata = "") {
		return "text/plain"
	} else {
		return xdata.MimeType
	}
}

}