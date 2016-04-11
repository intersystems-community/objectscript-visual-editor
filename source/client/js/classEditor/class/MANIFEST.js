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
            options: [ "datatype", "index", "persistent", "serial", "stream", "view" ]
        },
        ClassVersion: {
            ignore: true,
            default: 25,
            type: "number"
        },
        ClientDataType: {
            default: "VARCHAR",
            type: "select",
            options: [
                "BIGINT", "BINARY", "BINARYSTREAM", "BOOLEAN", "CHARACTERSTREAM", "CURRENCY",
                "DATE", "DECIMAL", "DOUBLE", "FDATE", "FTIMESTAMP", "HANDLE", "INTEGER", "LIST",
                "LONGVARCHAR", "NUMERIC", "STATUS", "TIME", "TIMESTAMP", "VARCHAR"
            ]
        },
        ClientName: {
            default: "",
            type: "string"
        },
        CompileAfter: {
            default: "",
            type: "string"
        },
        ConstraintClass: {
            default: "",
            type: "string"
        },
        DdlAllowed: {
            default: 0,
            type: "boolean"
        },
        Deployed: {
            default: 0,
            type: "boolean"
        },
        DependsOn: {
            default: "",
            type: "string"
        },
        Deprecated: {
            default: 0,
            type: "boolean"
        },
        Description: {
            ignore: true,
            default: ""
        },
        Dynamic: {
            default: 0,
            type: "boolean"
        },
        EmbeddedClass: {
            default: "",
            type: "string"
        },
        Final: {
            default: 0,
            type: "boolean"
        },
        GeneratedBy: {
            default: "",
            type: "string",
            readOnly: true
        },
        Hidden: {
            default: 0,
            type: "boolean"
        },
        Inheritance: {
            default: "left",
            type: "select",
            options: [ "left", "right" ]
        },
        Import: {
            ignore: true
        },
        IncludeCode: {
            ignore: true
        },
        IncludeGenerator: {
            ignore: true
        },
        IndexClass: {
            default: "",
            type: "string"
        },
        Language: {
            default: "cache",
            type: "select",
            options: [ "cache", "basic", "java", "javascript", "mvbasic", "tsql" ]
        },
        LegacyInstanceContext: {
            default: 0,
            type: "boolean"
        },
        MemberSuper: {
            default: "",
            ignore: true
        },
        ModificationAuxiliary: {
            default: "",
            ignore: true
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
            options: [
                "BIGINT", "BIT", "DATE", "DOUBLE", "INTEGER", "LONGVARBINARY", "LONGVARCHAR",
                "NUMERIC", "RESULTSET", "SMALLINT", "STRUCT", "TIME", "TIMESTAMP", "TINYINT",
                "VARBINARY", "VARCHAR"
            ]
        },
        Owner: {
            default: "",
            type: "string"
        },
        ProcedureBlock : {
            default: 0,
            type: "boolean"
        },
        ProjectionClass: {
            type: "string",
            default: ""
        },
        PropertyClass: {
            type: "string",
            default: ""
        },
        QueryClass: {
            type: "string",
            default: ""
        },
        ServerOnly: {
            type: "boolean",
            default: ""
        },
        SoapBindingStyle : {
            default: "document",
            type: "select",
            options: [ "document", "rpc" ]
        },
        SoapBodyUse: {
            default: "literal",
            type: "select",
            options: [ "literal", "encoded" ]
        },
        SqlCategory: {
            default: "STRING",
            type: "select",
            options: [
                "DATE", "DOUBLE", "FMDATE", "FMTIMESTAMP", "INTEGER", "MVDATE", "NAME", "NUMERIC",
                "STRING", "TIME", "TIMESTAMP"
            ],
            requires: {
                property: "ClassType",
                value: "DataType"
            }
        },
        SqlRoutinePrefix: {
            ignore: true
        },
        SqlRowIdName: {
            default: "",
            type: "string"
        },
        SqlRowIdPrivate: {
            default: 0,
            type: "boolean"
        },
        SqlTableName: {
            default: "",
            type: "string"
        },
        StorageStrategy: {
            type: "string",
            default: ""
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
        TriggerClass: {
            type: "string",
            default: ""
        },
        ViewQuery: {
            type: "string", // SQL
            default: ""
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
        Constraint: {
            default: "",
            type: "string"
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
        Flags: {
            default: "",
            type: "select",
            options: ["ENUM", "LIST"]
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
        Aliases: {
            default: "",
            type: "string",
            pattern: /(?:\w[0-9\w]+,?)+/
        },
        Description: {
            ignore: true,
            default: ""
        },
        Calculated: {
            default: 0,
            type: "boolean"
        },
        Cardinality: {
            default: "",
            type: "select",
            options: [ "one", "many", "parent", "children" ]
        },
        ClientName: {
            default: "",
            type: "string"
        },
        Collection: {
            ignore: true
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
        Inverse: {
            type: "string",
            default: ""
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
        OnDelete: {
            default: "",
            type: "select",
            options: [ "cascade", "noaction", "setdefault", "setnull" ]
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
        ServerOnly: {
            default: "",
            type: "boolean"
        },
        SqlComputed: {
            default: 0,
            type: "boolean"
        },
        SqlCollation: {
            default: "",
            type: "string"
        },
        SqlColumnNumber: {
            type: "number",
            default: ""
        },
        SqlComputeCode: {
            default: "",
            type: "string"
        },
        SqlComputeOnChange: {
            default: "",
            type: "string",
            pattern: /(?:\w[0-9\w]+,?)+/
        },
        SqlFieldName: {
            default: "",
            type: "string"
        },
        SqlListDelimiter: {
            default: "",
            type: "string"
        },
        SqlListType: {
            default: "",
            type: "select",
            options: [ "LIST", "DELIMITED", "SUBNODE" ]
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
        Condition: {
            ignore: true
        },
        Data: {
            default: "",
            type: "string",
            pattern: /(?:\w[0-9\w]+,?)+/
        },
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
        SqlName: {
            type: "string",
            default: ""
        },
        Type: {
            default: "",
            type: "select",
            options: [ "bitmap", "bitslice", "index" /* , "key": deprecated */ ]
        },
        TypeClass: {
            default: "",
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
        ClientName: {
            default: "",
            type: "string"
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
        ExternalProcName: {
            default: "",
            type: "string"
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
        FormalSpec: {
            ignore: true // goes within code editor
        },
        GenerateAfter: {
            type: "string",
            default: "",
            pattern: /(?:\w[0-9\w]+,?)+/
        },
        Hash: {
            ignore: true
        },
        Internal: {
            default: 0,
            type: "boolean"
        },
        Implementation: {
            ignore: true
        },
        Language: {
            default: "",
            type: "select",
            options: [ "cache", "basic", "java", "javascript", "mvbasic", "tsql" ]
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
        PlaceAfter: {
            type: "string",
            default: "",
            pattern: /(?:\w[0-9\w]+,?)+/
        },
        ProcedureBlock: {
            type: "boolean",
            default: ""
        },
        PublicList: {
            type: "string",
            default: "",
            pattern: /(?:\w[0-9\w]+,?)+/
        },
        ReturnResultsets: {
            default: 0,
            type: "boolean"
        },
        ReturnType: {
            default: "",
            type: "string"
        },
        ReturnTypeParams: {
            ignore: true,
            default: ""
        },
        SequenceNumber: {
            ignore: true
        },
        ServerOnly: {
            type: "boolean",
            default: ""
        },
        SoapAction: {
            default: "[default]",
            type: "string"
        },
        SoapBindingStyle: {
            default: "",
            type: "select",
            options: [ "document", "rpc" ]
        },
        SoapBodyUse: {
            default: "",
            type: "select",
            options: [ "literal", "encoded" ]
        },
        SoapMessageName: {
            default: "",
            type: "string"
        },
        SoapNameSpace: {
            default: "",
            type: "string"
        },
        SoapRequestMessage: {
            default: "",
            type: "string"
        },
        SoapTypeNameSpace: {
            default: "",
            type: "string"
        },
        SqlName: {
            default: "",
            type: "string"
        },
        SqlProc: {
            default: 0,
            type: "boolean"
        },
        SqlRoutine: {
            default: "",
            type: "string"
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
        ClientName: {
            default: "",
            type: "string"
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
        FormalSpec: {
            ignore: true // appears in code editor
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
        SoapBindingStyle: {
            default: "",
            type: "select",
            options: [ "document", "rpc" ]
        },
        SoapBodyUse: {
            default: "",
            type: "select",
            options: [ "literal", "encoded" ]
        },
        SoapNameSpace: {
            default: "",
            type: "string"
        },
        SqlName: {
            default: "",
            type: "string"
        },
        SqlProc: {
            default: 0,
            type: "boolean"
        },
        SqlQuery: {
            default: "",
            type: "string"
        },
        SqlView: {
            default: 0,
            type: "boolean"
        },
        SqlViewName: {
            default: "",
            type: "string"
        },
        Type: {
            required: true,
            default: "",
            type: "string"
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
            default: "text/xml",
            type: "string"
        },
        Name: {
            type: "string",
            required: true,
            ignore: true // name cannot be change as it is an IdKey index field.
            // to change the name user must create a new property with the same parameters.
        },
        Object: {
            ignore: true
        },
        SchemaSpec: {
            default: "",
            type: "string",
            placeholder: "schemaNamespaceURL schemaURL"
        },
        SequenceNumber: {
            ignore: true
        },
        XMLNamespace: {
            type: "string",
            default: ""
        }
    }
};