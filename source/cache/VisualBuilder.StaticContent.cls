/// [ <!-- @echo package.printableName --> v<!-- @echo package.version --> ]
/// This class handles all the static data. Note that this class is generated automatically by
/// performing build from the sources.
Class VisualBuilder.StaticContent {

/// Identifies the compilation time, which is used to form "Last-Modified" HTTP header.
Parameter CompileTime = {"""" _ $zd($h, 11) _ ", "_ $zdt($NOW(0), 2,1) _ " GMT"""};

/// This method outputs content from the class XData blocks.
ClassMethod PrintContent(XDataName as %String = "") As %Status
{
	set xdata = ##class(%Dictionary.CompiledXData).%OpenId("VisualBuilder.StaticContent||"_XDataName)
	set pos = 13 // Read the first part "<d><![CDATA[".length = 13
	if (xdata = "") { return $$$ERROR("No "_XDataName_" XData") } else { do xdata.Data.MoveTo(pos) }
	while (xdata.Data.SizeGet() - pos > 8) { // "]]></d>\n".length = 8
		set toRead = xdata.Data.SizeGet() - pos - 8
		set pos = pos + toRead
		write xdata.Data.Read(toRead)
	}
	return $$$OK
}

/// This method returns MIME type of XData.
ClassMethod GetMimeType(XDataName as %String = "") As %String
{
	set xdata = ##class(%Dictionary.CompiledXData).%OpenId("VisualBuilder.StaticContent||"_XDataName)
	if (xdata = "") {
		return "text/plain"
	} else {
		return xdata.MimeType
	}
}

/// This block handles HTML markup.
XData HTML [ MimeType = text/html ]
{
<d><![CDATA[<!-- @include ../client/index.html -->]]></d>
}

/// This block handles CSS stylesheets.
XData CSS [ MimeType = text/css ]
{
<d><![CDATA[<!-- @include ../client/css/index.css -->]]></d>
}

/// This block handles JavaScript.
XData JS [ MimeType = text/javascript ]
{
<d><![CDATA[<!-- @include ../client/js/index.js -->]]></d>
}

}