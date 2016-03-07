/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class is a base class for classes that serve resources.
Class VisualBuilder.REST.Content {

/// Identifies the compilation time, which is used to form "Last-Modified" HTTP header.
Parameter CompileTime = {"""" _ $zd($h, 11) _ ", "_ $zdt($NOW(0), 2,1) _ " GMT"""};

/// This method outputs content from the class XData blocks.
ClassMethod PrintContent(XDataName As %String = "", asBase64 As %Boolean = 0) As %Status
{
	set xdata = ##class(%Dictionary.CompiledXData).%OpenId($ClassName()_"||"_XDataName)
	set pos = 0, end = 0
	if (xdata = "") {
	    return $$$ERROR("No "_XDataName_" XData")
	} elseif ('asBase64) {
	    set pos = 13 // Read the first part "<d><![CDATA[".length = 13
	    set end = 8 // The last part "]]></d>".length + 1 = 8
	    do xdata.Data.MoveTo(pos)
	}
	while (xdata.Data.SizeGet() - pos > end) { // "]]></d>\n".length = 8
		set toRead = xdata.Data.SizeGet() - pos - end
		if (toRead > 32000) { set toRead = 32000 }
		set pos = pos + toRead
		if (asBase64) {
            write $System.Encryption.Base64Decode(xdata.Data.Read(toRead))
		} else {
		    write xdata.Data.Read(toRead)
		}
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