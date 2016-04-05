/**
 * This object describes the behavior of class keywords, class members and their keywords and
 * parameters.
 */
export default {
    Class: {
        Abstract: {
            default: 0,
            type: "boolean"
        },
        ClassDefinitionError: {
            default: 0,
            type: "boolean"
        },
        ClassType: {
            default: "",
            type: "select",
            values: [ "datatype", "index", "persistent", "serial", "stream", "view" ]
        },
        ClassVersion: {
            ignore: true,
            default: 25,
            type: "number"
        },
        ClientDataType: {
            default: "VARCHAR",
            type: "select",
            values: [
                "BIGINT", "BINARY", "BINARYSTREAM", "BOOLEAN", "CHARACTERSTREAM", "CURRENCY",
                "DATE", "DECIMAL", "DOUBLE", "FDATE", "FTIMESTAMP", "HANDLE", "INTEGER", "LIST",
                "LONGVARCHAR", "NUMERIC", "STATUS", "TIME", "TIMESTAMP", "VARCHAR"
            ]
        },
        DdlAllowed: {
            default: 0,
            type: "boolean"
        },
        Deployed: {
            default: 0,
            type: "boolean"
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Dynamic: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        Hidden: {
            default: 0,
            type: "boolean"
        },
        Inheritance: {
            default: "left",
            type: "select",
            values: [ "left", "right" ]
        },
        Language: {
            default: "cache",
            type: "select",
            values: [ "cache", "basic", "java", "javascript", "mvbasic", "tsql" ]
        },
        LegacyInstanceContext: {
            default: 0,
            type: "boolean"
        },
        ModificationLevel: {
            ignore: true,
            default: 9,
            type: "number"
        },
        Modified: {
            ignore: true,
            default: 3,
            type: "number"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new class with the same parameters.
        },
        NoContext : {
            default: 0,
            type: "boolean"
        },
        NoExtent : {
            default: 0,
            type: "boolean"
        },
        OdbcType: {
            default: "VARCHAR",
            type: "select",
            values: [
                "BIGINT", "BIT", "DATE", "DOUBLE", "INTEGER", "LONGVARBINARY", "LONGVARCHAR",
                "NUMERIC", "RESULTSET", "SMALLINT", "STRUCT", "TIME", "TIMESTAMP", "TINYINT",
                "VARBINARY", "VARCHAR"
            ]
        },
        ProcedureBlock : {
            default: 0,
            type: "boolean"
        },
        SoapBindingStyle : {
            default: "document",
            type: "select",
            values: [ "document", "rpc" ]
        },
        SoapBodyUse: {
            default: "literal",
            type: "select",
            values: [ "literal", "encoded" ]
        },
        SqlCategory: {
            default: "STRING",
            type: "select",
            values: [
                "DATE", "DOUBLE", "FMDATE", "FMTIMESTAMP", "INTEGER", "MVDATE", "NAME", "NUMERIC",
                "STRING", "TIME", "TIMESTAMP"
            ],
            requires: {
                property: "ClassType",
                value: "DataType"
            }
        },
        SqlRowIdPrivate: {
            default: 0,
            type: "boolean"
        },
        System: {
            default: 0,
            type: "boolean"
        },
        Super: {
            type: "string",
            default: ""
        },
        TimeChanged: {
            ignore: true
        },
        TimeCreated: {
            ignore: true
        },
        _type: {
            ignore: true
        },
        _name: {
            ignore: true
        },
        _compiledClassType: {
            ignore: true
        },
        _fullName: {
            ignore: true
        },
        _isDataType: {
            ignore: true
        },
        _isOdbcType: {
            ignore: true
        },
        _isSoapBindingStyle: {
            ignore: true
        },
        _isSoapBodyUse: {
            ignore: true
        },
        _isSqlCategory: {
            ignore: true
        }
    },
    Parameters: {
        Abstract: {
            default: 0,
            type: "boolean"
        },
        Default: {
            default: "",
            type: "string",
            incompatible: {
                property: "Expression"
            }
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Description: {
            ignore: true,
            default: ""
        },
        Expression: {
            default: "",
            type: "string",
            incompatible: {
                property: "Default"
            }
        },
        Encoded: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        Name: {
            required: true,
            type: "string",
            ignore: true
        },
        SequenceNumber: {
            ignore: true
        },
        Type: {
            default: "",
            type: "string"
        }
    },
    Properties: {
        Description: {
            ignore: true,
            default: ""
        },
        Calculated: {
            default: 0,
            type: "boolean"
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        Identity: {
            default: 0,
            type: "boolean",
            classTypes: ["persistent"]
        },
        InitialExpression: {
            type: "string",
            default: "\"\""
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        MultiDimensional: {
            default: 0,
            type: "boolean"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        NoModBit: {
            default: 0,
            type: "boolean"
        },
        NotInheritable: {
            default: 0,
            type: "boolean"
        },
        Private: {
            default: 0,
            type: "boolean"
        },
        ReadOnly: {
            default: 0,
            type: "boolean"
        },
        Relationship: {
            default: 0
        },
        Required: {
            default: 0,
            type: "boolean"
        },
        SequenceNumber: {
            ignore: true
        },
        SqlComputed: {
            default: 0,
            type: "boolean"
        },
        Transient: {
            default: 0,
            type: "boolean"
        },
        Type: {
            type: "string",
            default: ""
        }
    },
    Indices: {
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Description: {
            ignore: true,
            default: ""
        },
        Extent: {
            default: 0,
            type: "boolean"
        },
        IdKey: {
            default: 0,
            type: "boolean"
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        PrimaryKey: {
            default: 0,
            type: "boolean"
        },
        Properties: {
            required: true,
            default: "",
            type: "string"
        },
        SequenceNumber: {
            ignore: true
        },
        Unique: {
            default: 0,
            type: "boolean"
        }
    },
    Methods: {
        Abstract: {
            default: 0,
            type: "boolean"
        },
        ClassMethod: {
            type: "boolean"
        },
        ClientMethod: {
            default: 0,
            type: "boolean"
        },
        CodeMode: {
            default: "code",
            type: "select",
            options: ["Call", "Code", "Expression", "ObjectGenerator"] // test if lowercase
        },
        Description: {
            ignore: true,
            default: ""
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        ForceGenerate: {
            default: 0,
            type: "boolean",
            requires: {
                property: "CodeMode",
                value: "ObjectGenerator"
            }
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        NoContext: {
            default: 0,
            type: "boolean"
        },
        NotForProperty: {
            default: 0,
            type: "boolean"
        },
        NotInheritable: {
            default: 0,
            type: "boolean"
        },
        Private: {
            default: 0,
            type: "boolean"
        },
        ReturnResultsets: {
            default: 0,
            type: "boolean"
        },
        ReturnType: {
            default: "",
            type: "string"
        },
        SequenceNumber: {
            ignore: true
        },
        SoapAction: {
            default: "[default]",
            type: "string"
        },
        SqlProc: {
            default: 0,
            type: "boolean"
        },
        WebMethod: {
            default: 0,
            type: "boolean"
        },
        ZenMethod: {
            default: 0,
            type: "boolean"
        }
    },
    Queries: {
        Description: {
            ignore: true,
            default: ""
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        NotInheritable: {
            default: 0,
            type: "boolean"
        },
        Private: {
            default: 0,
            type: "boolean"
        },
        SequenceNumber: {
            ignore: true
        },
        SqlProc: {
            default: 0,
            type: "boolean"
        },
        SqlView: {
            default: 0,
            type: "boolean"
        },
        WebMethod: {
            default: 0,
            type: "boolean"
        }
    },
    XDatas: {
        Data: {
            ignore: true, // xData data edit has special controls
            default: ""
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Description: {
            ignore: true,
            default: ""
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        MimeType: {
            type: "string"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        SequenceNumber: {
            ignore: true
        }
    }
};