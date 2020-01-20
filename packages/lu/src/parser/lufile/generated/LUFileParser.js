// Generated from ../LUFileParser.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var LUFileParserListener = require('./LUFileParserListener').LUFileParserListener;
var LUFileParserVisitor = require('./LUFileParserVisitor').LUFileParserVisitor;

var grammarFileName = "LUFileParser.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003*\u01fb\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004",
    "\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004",
    "\r\t\r\u0004\u000e\t\u000e\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004",
    "\u0011\t\u0011\u0004\u0012\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t",
    "\u0014\u0004\u0015\t\u0015\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0004",
    "\u0018\t\u0018\u0004\u0019\t\u0019\u0004\u001a\t\u001a\u0004\u001b\t",
    "\u001b\u0004\u001c\t\u001c\u0004\u001d\t\u001d\u0004\u001e\t\u001e\u0004",
    "\u001f\t\u001f\u0004 \t \u0004!\t!\u0004\"\t\"\u0004#\t#\u0004$\t$\u0004",
    "%\t%\u0004&\t&\u0004\'\t\'\u0004(\t(\u0004)\t)\u0004*\t*\u0004+\t+\u0004",
    ",\t,\u0004-\t-\u0004.\t.\u0004/\t/\u00040\t0\u00041\t1\u00042\t2\u0004",
    "3\t3\u00044\t4\u00045\t5\u00046\t6\u00047\t7\u00048\t8\u00049\t9\u0003",
    "\u0002\u0006\u0002t\n\u0002\r\u0002\u000e\u0002u\u0003\u0002\u0003\u0002",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0005\u0003\u0082\n\u0003\u0003\u0004\u0007",
    "\u0004\u0085\n\u0004\f\u0004\u000e\u0004\u0088\u000b\u0004\u0003\u0004",
    "\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0005\u0003\u0006\u0007\u0006",
    "\u0090\n\u0006\f\u0006\u000e\u0006\u0093\u000b\u0006\u0003\u0006\u0003",
    "\u0006\u0007\u0006\u0097\n\u0006\f\u0006\u000e\u0006\u009a\u000b\u0006",
    "\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\u0007\u0007\u0007",
    "\u00a1\n\u0007\f\u0007\u000e\u0007\u00a4\u000b\u0007\u0003\b\u0003\b",
    "\u0003\b\u0007\b\u00a9\n\b\f\b\u000e\b\u00ac\u000b\b\u0003\t\u0006\t",
    "\u00af\n\t\r\t\u000e\t\u00b0\u0003\n\u0007\n\u00b4\n\n\f\n\u000e\n\u00b7",
    "\u000b\n\u0003\n\u0003\n\u0003\n\u0003\u000b\u0003\u000b\u0003\u000b",
    "\u0007\u000b\u00bf\n\u000b\f\u000b\u000e\u000b\u00c2\u000b\u000b\u0003",
    "\f\u0003\f\u0005\f\u00c6\n\f\u0003\r\u0007\r\u00c9\n\r\f\r\u000e\r\u00cc",
    "\u000b\r\u0003\r\u0003\r\u0005\r\u00d0\n\r\u0003\r\u0007\r\u00d3\n\r",
    "\f\r\u000e\r\u00d6\u000b\r\u0003\r\u0003\r\u0003\u000e\u0003\u000e\u0003",
    "\u000e\u0007\u000e\u00dd\n\u000e\f\u000e\u000e\u000e\u00e0\u000b\u000e",
    "\u0003\u000f\u0007\u000f\u00e3\n\u000f\f\u000f\u000e\u000f\u00e6\u000b",
    "\u000f\u0003\u000f\u0003\u000f\u0003\u0010\u0007\u0010\u00eb\n\u0010",
    "\f\u0010\u000e\u0010\u00ee\u000b\u0010\u0003\u0010\u0003\u0010\u0003",
    "\u0010\u0003\u0010\u0006\u0010\u00f4\n\u0010\r\u0010\u000e\u0010\u00f5",
    "\u0003\u0011\u0007\u0011\u00f9\n\u0011\f\u0011\u000e\u0011\u00fc\u000b",
    "\u0011\u0003\u0011\u0003\u0011\u0007\u0011\u0100\n\u0011\f\u0011\u000e",
    "\u0011\u0103\u000b\u0011\u0003\u0012\u0006\u0012\u0106\n\u0012\r\u0012",
    "\u000e\u0012\u0107\u0003\u0013\u0003\u0013\u0003\u0014\u0003\u0014\u0005",
    "\u0014\u010e\n\u0014\u0003\u0015\u0003\u0015\u0003\u0015\u0003\u0015",
    "\u0006\u0015\u0114\n\u0015\r\u0015\u000e\u0015\u0115\u0003\u0016\u0007",
    "\u0016\u0119\n\u0016\f\u0016\u000e\u0016\u011c\u000b\u0016\u0003\u0016",
    "\u0003\u0016\u0005\u0016\u0120\n\u0016\u0003\u0016\u0003\u0016\u0005",
    "\u0016\u0124\n\u0016\u0003\u0016\u0005\u0016\u0127\n\u0016\u0003\u0016",
    "\u0005\u0016\u012a\n\u0016\u0003\u0016\u0005\u0016\u012d\n\u0016\u0003",
    "\u0016\u0003\u0016\u0005\u0016\u0131\n\u0016\u0003\u0017\u0003\u0017",
    "\u0003\u0018\u0003\u0018\u0003\u0019\u0003\u0019\u0003\u001a\u0005\u001a",
    "\u013a\n\u001a\u0003\u001a\u0003\u001a\u0003\u001b\u0003\u001b\u0003",
    "\u001b\u0003\u001c\u0003\u001c\u0003\u001c\u0007\u001c\u0144\n\u001c",
    "\f\u001c\u000e\u001c\u0147\u000b\u001c\u0003\u001d\u0003\u001d\u0003",
    "\u001e\u0003\u001e\u0003\u001f\u0003\u001f\u0003 \u0003 \u0003!\u0003",
    "!\u0005!\u0153\n!\u0003\"\u0007\"\u0156\n\"\f\"\u000e\"\u0159\u000b",
    "\"\u0003\"\u0003\"\u0003\"\u0003\"\u0003\"\u0003#\u0007#\u0161\n#\f",
    "#\u000e#\u0164\u000b#\u0003$\u0003$\u0003$\u0003$\u0003$\u0007$\u016b",
    "\n$\f$\u000e$\u016e\u000b$\u0003%\u0003%\u0003&\u0003&\u0003\'\u0003",
    "\'\u0003\'\u0003\'\u0006\'\u0178\n\'\r\'\u000e\'\u0179\u0003(\u0007",
    "(\u017d\n(\f(\u000e(\u0180\u000b(\u0003(\u0003(\u0007(\u0184\n(\f(\u000e",
    "(\u0187\u000b(\u0003)\u0006)\u018a\n)\r)\u000e)\u018b\u0003*\u0003*",
    "\u0003+\u0003+\u0003+\u0003,\u0003,\u0003-\u0003-\u0003-\u0003-\u0003",
    ".\u0007.\u019a\n.\f.\u000e.\u019d\u000b.\u0003.\u0003.\u0003.\u0003",
    "/\u0007/\u01a3\n/\f/\u000e/\u01a6\u000b/\u00030\u00070\u01a9\n0\f0\u000e",
    "0\u01ac\u000b0\u00030\u00030\u00030\u00030\u00070\u01b2\n0\f0\u000e",
    "0\u01b5\u000b0\u00031\u00031\u00071\u01b9\n1\f1\u000e1\u01bc\u000b1",
    "\u00032\u00062\u01bf\n2\r2\u000e2\u01c0\u00033\u00053\u01c4\n3\u0003",
    "3\u00033\u00034\u00074\u01c9\n4\f4\u000e4\u01cc\u000b4\u00034\u0003",
    "4\u00034\u00064\u01d1\n4\r4\u000e4\u01d2\u00035\u00075\u01d6\n5\f5\u000e",
    "5\u01d9\u000b5\u00035\u00035\u00075\u01dd\n5\f5\u000e5\u01e0\u000b5",
    "\u00035\u00035\u00036\u00066\u01e5\n6\r6\u000e6\u01e6\u00037\u00077",
    "\u01ea\n7\f7\u000e7\u01ed\u000b7\u00037\u00037\u00038\u00038\u00039",
    "\u00079\u01f4\n9\f9\u000e9\u01f7\u000b9\u00039\u00039\u00039\u0003u",
    "\u0002:\u0002\u0004\u0006\b\n\f\u000e\u0010\u0012\u0014\u0016\u0018",
    "\u001a\u001c\u001e \"$&(*,.02468:<>@BDFHJLNPRTVXZ\\^`bdfhjlnp\u0002",
    "\t\u0003\u0003\u0004\u0004\u0004\u0002\u0003\u0003 \"\u0004\u0002\u0003",
    "\u0003\u0010\u0010\u0004\u0002\u0018\u0018\u001c\u001c\u0003\u0002\u0017",
    "\u0018\u0004\u0002\u0003\u0003\'\'\u0004\u0002\u0003\u0003\"\"\u0002",
    "\u020b\u0002s\u0003\u0002\u0002\u0002\u0004\u0081\u0003\u0002\u0002",
    "\u0002\u0006\u0086\u0003\u0002\u0002\u0002\b\u008b\u0003\u0002\u0002",
    "\u0002\n\u0091\u0003\u0002\u0002\u0002\f\u009d\u0003\u0002\u0002\u0002",
    "\u000e\u00a5\u0003\u0002\u0002\u0002\u0010\u00ae\u0003\u0002\u0002\u0002",
    "\u0012\u00b5\u0003\u0002\u0002\u0002\u0014\u00bb\u0003\u0002\u0002\u0002",
    "\u0016\u00c3\u0003\u0002\u0002\u0002\u0018\u00ca\u0003\u0002\u0002\u0002",
    "\u001a\u00d9\u0003\u0002\u0002\u0002\u001c\u00e4\u0003\u0002\u0002\u0002",
    "\u001e\u00ec\u0003\u0002\u0002\u0002 \u00fa\u0003\u0002\u0002\u0002",
    "\"\u0105\u0003\u0002\u0002\u0002$\u0109\u0003\u0002\u0002\u0002&\u010b",
    "\u0003\u0002\u0002\u0002(\u0113\u0003\u0002\u0002\u0002*\u011a\u0003",
    "\u0002\u0002\u0002,\u0132\u0003\u0002\u0002\u0002.\u0134\u0003\u0002",
    "\u0002\u00020\u0136\u0003\u0002\u0002\u00022\u0139\u0003\u0002\u0002",
    "\u00024\u013d\u0003\u0002\u0002\u00026\u0140\u0003\u0002\u0002\u0002",
    "8\u0148\u0003\u0002\u0002\u0002:\u014a\u0003\u0002\u0002\u0002<\u014c",
    "\u0003\u0002\u0002\u0002>\u014e\u0003\u0002\u0002\u0002@\u0150\u0003",
    "\u0002\u0002\u0002B\u0157\u0003\u0002\u0002\u0002D\u0162\u0003\u0002",
    "\u0002\u0002F\u016c\u0003\u0002\u0002\u0002H\u016f\u0003\u0002\u0002",
    "\u0002J\u0171\u0003\u0002\u0002\u0002L\u0177\u0003\u0002\u0002\u0002",
    "N\u017e\u0003\u0002\u0002\u0002P\u0189\u0003\u0002\u0002\u0002R\u018d",
    "\u0003\u0002\u0002\u0002T\u018f\u0003\u0002\u0002\u0002V\u0192\u0003",
    "\u0002\u0002\u0002X\u0194\u0003\u0002\u0002\u0002Z\u019b\u0003\u0002",
    "\u0002\u0002\\\u01a4\u0003\u0002\u0002\u0002^\u01aa\u0003\u0002\u0002",
    "\u0002`\u01b6\u0003\u0002\u0002\u0002b\u01be\u0003\u0002\u0002\u0002",
    "d\u01c3\u0003\u0002\u0002\u0002f\u01ca\u0003\u0002\u0002\u0002h\u01d7",
    "\u0003\u0002\u0002\u0002j\u01e4\u0003\u0002\u0002\u0002l\u01eb\u0003",
    "\u0002\u0002\u0002n\u01f0\u0003\u0002\u0002\u0002p\u01f5\u0003\u0002",
    "\u0002\u0002rt\u0005\u0004\u0003\u0002sr\u0003\u0002\u0002\u0002tu\u0003",
    "\u0002\u0002\u0002uv\u0003\u0002\u0002\u0002us\u0003\u0002\u0002\u0002",
    "vw\u0003\u0002\u0002\u0002wx\u0007\u0002\u0002\u0003x\u0003\u0003\u0002",
    "\u0002\u0002y\u0082\u0005\u0006\u0004\u0002z\u0082\u0005\b\u0005\u0002",
    "{\u0082\u0005\u0014\u000b\u0002|\u0082\u0005> \u0002}\u0082\u0005$\u0013",
    "\u0002~\u0082\u0005R*\u0002\u007f\u0082\u0005V,\u0002\u0080\u0082\u0005",
    "n8\u0002\u0081y\u0003\u0002\u0002\u0002\u0081z\u0003\u0002\u0002\u0002",
    "\u0081{\u0003\u0002\u0002\u0002\u0081|\u0003\u0002\u0002\u0002\u0081",
    "}\u0003\u0002\u0002\u0002\u0081~\u0003\u0002\u0002\u0002\u0081\u007f",
    "\u0003\u0002\u0002\u0002\u0081\u0080\u0003\u0002\u0002\u0002\u0082\u0005",
    "\u0003\u0002\u0002\u0002\u0083\u0085\u0007\u0003\u0002\u0002\u0084\u0083",
    "\u0003\u0002\u0002\u0002\u0085\u0088\u0003\u0002\u0002\u0002\u0086\u0084",
    "\u0003\u0002\u0002\u0002\u0086\u0087\u0003\u0002\u0002\u0002\u0087\u0089",
    "\u0003\u0002\u0002\u0002\u0088\u0086\u0003\u0002\u0002\u0002\u0089\u008a",
    "\t\u0002\u0002\u0002\u008a\u0007\u0003\u0002\u0002\u0002\u008b\u008c",
    "\u0005\n\u0006\u0002\u008c\u008d\u0005\u0010\t\u0002\u008d\t\u0003\u0002",
    "\u0002\u0002\u008e\u0090\u0007\u0003\u0002\u0002\u008f\u008e\u0003\u0002",
    "\u0002\u0002\u0090\u0093\u0003\u0002\u0002\u0002\u0091\u008f\u0003\u0002",
    "\u0002\u0002\u0091\u0092\u0003\u0002\u0002\u0002\u0092\u0094\u0003\u0002",
    "\u0002\u0002\u0093\u0091\u0003\u0002\u0002\u0002\u0094\u0098\u0007\b",
    "\u0002\u0002\u0095\u0097\u0007\u0003\u0002\u0002\u0096\u0095\u0003\u0002",
    "\u0002\u0002\u0097\u009a\u0003\u0002\u0002\u0002\u0098\u0096\u0003\u0002",
    "\u0002\u0002\u0098\u0099\u0003\u0002\u0002\u0002\u0099\u009b\u0003\u0002",
    "\u0002\u0002\u009a\u0098\u0003\u0002\u0002\u0002\u009b\u009c\u0005\f",
    "\u0007\u0002\u009c\u000b\u0003\u0002\u0002\u0002\u009d\u00a2\u0005\u000e",
    "\b\u0002\u009e\u00a1\u0007\u0003\u0002\u0002\u009f\u00a1\u0005\u000e",
    "\b\u0002\u00a0\u009e\u0003\u0002\u0002\u0002\u00a0\u009f\u0003\u0002",
    "\u0002\u0002\u00a1\u00a4\u0003\u0002\u0002\u0002\u00a2\u00a0\u0003\u0002",
    "\u0002\u0002\u00a2\u00a3\u0003\u0002\u0002\u0002\u00a3\r\u0003\u0002",
    "\u0002\u0002\u00a4\u00a2\u0003\u0002\u0002\u0002\u00a5\u00aa\u0007\u001e",
    "\u0002\u0002\u00a6\u00a7\u0007\u001f\u0002\u0002\u00a7\u00a9\u0007\u001e",
    "\u0002\u0002\u00a8\u00a6\u0003\u0002\u0002\u0002\u00a9\u00ac\u0003\u0002",
    "\u0002\u0002\u00aa\u00a8\u0003\u0002\u0002\u0002\u00aa\u00ab\u0003\u0002",
    "\u0002\u0002\u00ab\u000f\u0003\u0002\u0002\u0002\u00ac\u00aa\u0003\u0002",
    "\u0002\u0002\u00ad\u00af\u0005\u0012\n\u0002\u00ae\u00ad\u0003\u0002",
    "\u0002\u0002\u00af\u00b0\u0003\u0002\u0002\u0002\u00b0\u00ae\u0003\u0002",
    "\u0002\u0002\u00b0\u00b1\u0003\u0002\u0002\u0002\u00b1\u0011\u0003\u0002",
    "\u0002\u0002\u00b2\u00b4\u0007\u0003\u0002\u0002\u00b3\u00b2\u0003\u0002",
    "\u0002\u0002\u00b4\u00b7\u0003\u0002\u0002\u0002\u00b5\u00b3\u0003\u0002",
    "\u0002\u0002\u00b5\u00b6\u0003\u0002\u0002\u0002\u00b6\u00b8\u0003\u0002",
    "\u0002\u0002\u00b7\u00b5\u0003\u0002\u0002\u0002\u00b8\u00b9\u0007\b",
    "\u0002\u0002\u00b9\u00ba\u0005\u0014\u000b\u0002\u00ba\u0013\u0003\u0002",
    "\u0002\u0002\u00bb\u00c0\u0005\u0016\f\u0002\u00bc\u00bf\u0005> \u0002",
    "\u00bd\u00bf\u0005$\u0013\u0002\u00be\u00bc\u0003\u0002\u0002\u0002",
    "\u00be\u00bd\u0003\u0002\u0002\u0002\u00bf\u00c2\u0003\u0002\u0002\u0002",
    "\u00c0\u00be\u0003\u0002\u0002\u0002\u00c0\u00c1\u0003\u0002\u0002\u0002",
    "\u00c1\u0015\u0003\u0002\u0002\u0002\u00c2\u00c0\u0003\u0002\u0002\u0002",
    "\u00c3\u00c5\u0005\u0018\r\u0002\u00c4\u00c6\u0005\u001c\u000f\u0002",
    "\u00c5\u00c4\u0003\u0002\u0002\u0002\u00c5\u00c6\u0003\u0002\u0002\u0002",
    "\u00c6\u0017\u0003\u0002\u0002\u0002\u00c7\u00c9\u0007\u0003\u0002\u0002",
    "\u00c8\u00c7\u0003\u0002\u0002\u0002\u00c9\u00cc\u0003\u0002\u0002\u0002",
    "\u00ca\u00c8\u0003\u0002\u0002\u0002\u00ca\u00cb\u0003\u0002\u0002\u0002",
    "\u00cb\u00cd\u0003\u0002\u0002\u0002\u00cc\u00ca\u0003\u0002\u0002\u0002",
    "\u00cd\u00cf\u0007\b\u0002\u0002\u00ce\u00d0\u0007\b\u0002\u0002\u00cf",
    "\u00ce\u0003\u0002\u0002\u0002\u00cf\u00d0\u0003\u0002\u0002\u0002\u00d0",
    "\u00d4\u0003\u0002\u0002\u0002\u00d1\u00d3\u0007\u0003\u0002\u0002\u00d2",
    "\u00d1\u0003\u0002\u0002\u0002\u00d3\u00d6\u0003\u0002\u0002\u0002\u00d4",
    "\u00d2\u0003\u0002\u0002\u0002\u00d4\u00d5\u0003\u0002\u0002\u0002\u00d5",
    "\u00d7\u0003\u0002\u0002\u0002\u00d6\u00d4\u0003\u0002\u0002\u0002\u00d7",
    "\u00d8\u0005\u001a\u000e\u0002\u00d8\u0019\u0003\u0002\u0002\u0002\u00d9",
    "\u00de\u0005\u000e\b\u0002\u00da\u00dd\u0007\u0003\u0002\u0002\u00db",
    "\u00dd\u0005\u000e\b\u0002\u00dc\u00da\u0003\u0002\u0002\u0002\u00dc",
    "\u00db\u0003\u0002\u0002\u0002\u00dd\u00e0\u0003\u0002\u0002\u0002\u00de",
    "\u00dc\u0003\u0002\u0002\u0002\u00de\u00df\u0003\u0002\u0002\u0002\u00df",
    "\u001b\u0003\u0002\u0002\u0002\u00e0\u00de\u0003\u0002\u0002\u0002\u00e1",
    "\u00e3\u0007\u0003\u0002\u0002\u00e2\u00e1\u0003\u0002\u0002\u0002\u00e3",
    "\u00e6\u0003\u0002\u0002\u0002\u00e4\u00e2\u0003\u0002\u0002\u0002\u00e4",
    "\u00e5\u0003\u0002\u0002\u0002\u00e5\u00e7\u0003\u0002\u0002\u0002\u00e6",
    "\u00e4\u0003\u0002\u0002\u0002\u00e7\u00e8\u0005\u001e\u0010\u0002\u00e8",
    "\u001d\u0003\u0002\u0002\u0002\u00e9\u00eb\u0007\u0003\u0002\u0002\u00ea",
    "\u00e9\u0003\u0002\u0002\u0002\u00eb\u00ee\u0003\u0002\u0002\u0002\u00ec",
    "\u00ea\u0003\u0002\u0002\u0002\u00ec\u00ed\u0003\u0002\u0002\u0002\u00ed",
    "\u00f3\u0003\u0002\u0002\u0002\u00ee\u00ec\u0003\u0002\u0002\u0002\u00ef",
    "\u00f0\u0005 \u0011\u0002\u00f0\u00f1\u0005\u0006\u0004\u0002\u00f1",
    "\u00f4\u0003\u0002\u0002\u0002\u00f2\u00f4\u0005\"\u0012\u0002\u00f3",
    "\u00ef\u0003\u0002\u0002\u0002\u00f3\u00f2\u0003\u0002\u0002\u0002\u00f4",
    "\u00f5\u0003\u0002\u0002\u0002\u00f5\u00f3\u0003\u0002\u0002\u0002\u00f5",
    "\u00f6\u0003\u0002\u0002\u0002\u00f6\u001f\u0003\u0002\u0002\u0002\u00f7",
    "\u00f9\u0007\u0003\u0002\u0002\u00f8\u00f7\u0003\u0002\u0002\u0002\u00f9",
    "\u00fc\u0003\u0002\u0002\u0002\u00fa\u00f8\u0003\u0002\u0002\u0002\u00fa",
    "\u00fb\u0003\u0002\u0002\u0002\u00fb\u00fd\u0003\u0002\u0002\u0002\u00fc",
    "\u00fa\u0003\u0002\u0002\u0002\u00fd\u0101\u0007\t\u0002\u0002\u00fe",
    "\u0100\t\u0003\u0002\u0002\u00ff\u00fe\u0003\u0002\u0002\u0002\u0100",
    "\u0103\u0003\u0002\u0002\u0002\u0101\u00ff\u0003\u0002\u0002\u0002\u0101",
    "\u0102\u0003\u0002\u0002\u0002\u0102!\u0003\u0002\u0002\u0002\u0103",
    "\u0101\u0003\u0002\u0002\u0002\u0104\u0106\t\u0004\u0002\u0002\u0105",
    "\u0104\u0003\u0002\u0002\u0002\u0106\u0107\u0003\u0002\u0002\u0002\u0107",
    "\u0105\u0003\u0002\u0002\u0002\u0107\u0108\u0003\u0002\u0002\u0002\u0108",
    "#\u0003\u0002\u0002\u0002\u0109\u010a\u0005&\u0014\u0002\u010a%\u0003",
    "\u0002\u0002\u0002\u010b\u010d\u0005*\u0016\u0002\u010c\u010e\u0005",
    "(\u0015\u0002\u010d\u010c\u0003\u0002\u0002\u0002\u010d\u010e\u0003",
    "\u0002\u0002\u0002\u010e\'\u0003\u0002\u0002\u0002\u010f\u0110\u0005",
    "N(\u0002\u0110\u0111\u0005\u0006\u0004\u0002\u0111\u0114\u0003\u0002",
    "\u0002\u0002\u0112\u0114\u0005P)\u0002\u0113\u010f\u0003\u0002\u0002",
    "\u0002\u0113\u0112\u0003\u0002\u0002\u0002\u0114\u0115\u0003\u0002\u0002",
    "\u0002\u0115\u0113\u0003\u0002\u0002\u0002\u0115\u0116\u0003\u0002\u0002",
    "\u0002\u0116)\u0003\u0002\u0002\u0002\u0117\u0119\u0007\u0003\u0002",
    "\u0002\u0118\u0117\u0003\u0002\u0002\u0002\u0119\u011c\u0003\u0002\u0002",
    "\u0002\u011a\u0118\u0003\u0002\u0002\u0002\u011a\u011b\u0003\u0002\u0002",
    "\u0002\u011b\u011d\u0003\u0002\u0002\u0002\u011c\u011a\u0003\u0002\u0002",
    "\u0002\u011d\u011f\u0007\u000b\u0002\u0002\u011e\u0120\u00050\u0019",
    "\u0002\u011f\u011e\u0003\u0002\u0002\u0002\u011f\u0120\u0003\u0002\u0002",
    "\u0002\u0120\u0123\u0003\u0002\u0002\u0002\u0121\u0124\u0005:\u001e",
    "\u0002\u0122\u0124\u0005<\u001f\u0002\u0123\u0121\u0003\u0002\u0002",
    "\u0002\u0123\u0122\u0003\u0002\u0002\u0002\u0124\u0126\u0003\u0002\u0002",
    "\u0002\u0125\u0127\u00052\u001a\u0002\u0126\u0125\u0003\u0002\u0002",
    "\u0002\u0126\u0127\u0003\u0002\u0002\u0002\u0127\u0129\u0003\u0002\u0002",
    "\u0002\u0128\u012a\u00054\u001b\u0002\u0129\u0128\u0003\u0002\u0002",
    "\u0002\u0129\u012a\u0003\u0002\u0002\u0002\u012a\u012c\u0003\u0002\u0002",
    "\u0002\u012b\u012d\u0007\u0014\u0002\u0002\u012c\u012b\u0003\u0002\u0002",
    "\u0002\u012c\u012d\u0003\u0002\u0002\u0002\u012d\u0130\u0003\u0002\u0002",
    "\u0002\u012e\u0131\u0005,\u0017\u0002\u012f\u0131\u0005.\u0018\u0002",
    "\u0130\u012e\u0003\u0002\u0002\u0002\u0130\u012f\u0003\u0002\u0002\u0002",
    "\u0130\u0131\u0003\u0002\u0002\u0002\u0131+\u0003\u0002\u0002\u0002",
    "\u0132\u0133\u0007\u001a\u0002\u0002\u0133-\u0003\u0002\u0002\u0002",
    "\u0134\u0135\u0007\u001b\u0002\u0002\u0135/\u0003\u0002\u0002\u0002",
    "\u0136\u0137\u0007\u0017\u0002\u0002\u01371\u0003\u0002\u0002\u0002",
    "\u0138\u013a\u0007\u0015\u0002\u0002\u0139\u0138\u0003\u0002\u0002\u0002",
    "\u0139\u013a\u0003\u0002\u0002\u0002\u013a\u013b\u0003\u0002\u0002\u0002",
    "\u013b\u013c\u00056\u001c\u0002\u013c3\u0003\u0002\u0002\u0002\u013d",
    "\u013e\u0007\u0016\u0002\u0002\u013e\u013f\u00056\u001c\u0002\u013f",
    "5\u0003\u0002\u0002\u0002\u0140\u0145\u00058\u001d\u0002\u0141\u0142",
    "\u0007\u0013\u0002\u0002\u0142\u0144\u00058\u001d\u0002\u0143\u0141",
    "\u0003\u0002\u0002\u0002\u0144\u0147\u0003\u0002\u0002\u0002\u0145\u0143",
    "\u0003\u0002\u0002\u0002\u0145\u0146\u0003\u0002\u0002\u0002\u01467",
    "\u0003\u0002\u0002\u0002\u0147\u0145\u0003\u0002\u0002\u0002\u0148\u0149",
    "\t\u0005\u0002\u0002\u01499\u0003\u0002\u0002\u0002\u014a\u014b\t\u0006",
    "\u0002\u0002\u014b;\u0003\u0002\u0002\u0002\u014c\u014d\u0007\u0019",
    "\u0002\u0002\u014d=\u0003\u0002\u0002\u0002\u014e\u014f\u0005@!\u0002",
    "\u014f?\u0003\u0002\u0002\u0002\u0150\u0152\u0005B\"\u0002\u0151\u0153",
    "\u0005L\'\u0002\u0152\u0151\u0003\u0002\u0002\u0002\u0152\u0153\u0003",
    "\u0002\u0002\u0002\u0153A\u0003\u0002\u0002\u0002\u0154\u0156\u0007",
    "\u0003\u0002\u0002\u0155\u0154\u0003\u0002\u0002\u0002\u0156\u0159\u0003",
    "\u0002\u0002\u0002\u0157\u0155\u0003\u0002\u0002\u0002\u0157\u0158\u0003",
    "\u0002\u0002\u0002\u0158\u015a\u0003\u0002\u0002\u0002\u0159\u0157\u0003",
    "\u0002\u0002\u0002\u015a\u015b\u0007\n\u0002\u0002\u015b\u015c\u0005",
    "D#\u0002\u015c\u015d\u0007(\u0002\u0002\u015d\u015e\u0005F$\u0002\u015e",
    "C\u0003\u0002\u0002\u0002\u015f\u0161\t\u0007\u0002\u0002\u0160\u015f",
    "\u0003\u0002\u0002\u0002\u0161\u0164\u0003\u0002\u0002\u0002\u0162\u0160",
    "\u0003\u0002\u0002\u0002\u0162\u0163\u0003\u0002\u0002\u0002\u0163E",
    "\u0003\u0002\u0002\u0002\u0164\u0162\u0003\u0002\u0002\u0002\u0165\u016b",
    "\u0005H%\u0002\u0166\u016b\u0005J&\u0002\u0167\u016b\u0007\'\u0002\u0002",
    "\u0168\u016b\u0007(\u0002\u0002\u0169\u016b\u0007\u0003\u0002\u0002",
    "\u016a\u0165\u0003\u0002\u0002\u0002\u016a\u0166\u0003\u0002\u0002\u0002",
    "\u016a\u0167\u0003\u0002\u0002\u0002\u016a\u0168\u0003\u0002\u0002\u0002",
    "\u016a\u0169\u0003\u0002\u0002\u0002\u016b\u016e\u0003\u0002\u0002\u0002",
    "\u016c\u016a\u0003\u0002\u0002\u0002\u016c\u016d\u0003\u0002\u0002\u0002",
    "\u016dG\u0003\u0002\u0002\u0002\u016e\u016c\u0003\u0002\u0002\u0002",
    "\u016f\u0170\u0007%\u0002\u0002\u0170I\u0003\u0002\u0002\u0002\u0171",
    "\u0172\u0007&\u0002\u0002\u0172K\u0003\u0002\u0002\u0002\u0173\u0174",
    "\u0005N(\u0002\u0174\u0175\u0005\u0006\u0004\u0002\u0175\u0178\u0003",
    "\u0002\u0002\u0002\u0176\u0178\u0005P)\u0002\u0177\u0173\u0003\u0002",
    "\u0002\u0002\u0177\u0176\u0003\u0002\u0002\u0002\u0178\u0179\u0003\u0002",
    "\u0002\u0002\u0179\u0177\u0003\u0002\u0002\u0002\u0179\u017a\u0003\u0002",
    "\u0002\u0002\u017aM\u0003\u0002\u0002\u0002\u017b\u017d\u0007\u0003",
    "\u0002\u0002\u017c\u017b\u0003\u0002\u0002\u0002\u017d\u0180\u0003\u0002",
    "\u0002\u0002\u017e\u017c\u0003\u0002\u0002\u0002\u017e\u017f\u0003\u0002",
    "\u0002\u0002\u017f\u0181\u0003\u0002\u0002\u0002\u0180\u017e\u0003\u0002",
    "\u0002\u0002\u0181\u0185\u0007\t\u0002\u0002\u0182\u0184\t\u0003\u0002",
    "\u0002\u0183\u0182\u0003\u0002\u0002\u0002\u0184\u0187\u0003\u0002\u0002",
    "\u0002\u0185\u0183\u0003\u0002\u0002\u0002\u0185\u0186\u0003\u0002\u0002",
    "\u0002\u0186O\u0003\u0002\u0002\u0002\u0187\u0185\u0003\u0002\u0002",
    "\u0002\u0188\u018a\t\u0004\u0002\u0002\u0189\u0188\u0003\u0002\u0002",
    "\u0002\u018a\u018b\u0003\u0002\u0002\u0002\u018b\u0189\u0003\u0002\u0002",
    "\u0002\u018b\u018c\u0003\u0002\u0002\u0002\u018cQ\u0003\u0002\u0002",
    "\u0002\u018d\u018e\u0005T+\u0002\u018eS\u0003\u0002\u0002\u0002\u018f",
    "\u0190\u0007\f\u0002\u0002\u0190\u0191\u0007\r\u0002\u0002\u0191U\u0003",
    "\u0002\u0002\u0002\u0192\u0193\u0005X-\u0002\u0193W\u0003\u0002\u0002",
    "\u0002\u0194\u0195\u0005Z.\u0002\u0195\u0196\u0005^0\u0002\u0196\u0197",
    "\u0005d3\u0002\u0197Y\u0003\u0002\u0002\u0002\u0198\u019a\u0007\u0003",
    "\u0002\u0002\u0199\u0198\u0003\u0002\u0002\u0002\u019a\u019d\u0003\u0002",
    "\u0002\u0002\u019b\u0199\u0003\u0002\u0002\u0002\u019b\u019c\u0003\u0002",
    "\u0002\u0002\u019c\u019e\u0003\u0002\u0002\u0002\u019d\u019b\u0003\u0002",
    "\u0002\u0002\u019e\u019f\u0007\u0007\u0002\u0002\u019f\u01a0\u0005\\",
    "/\u0002\u01a0[\u0003\u0002\u0002\u0002\u01a1\u01a3\u0007*\u0002\u0002",
    "\u01a2\u01a1\u0003\u0002\u0002\u0002\u01a3\u01a6\u0003\u0002\u0002\u0002",
    "\u01a4\u01a2\u0003\u0002\u0002\u0002\u01a4\u01a5\u0003\u0002\u0002\u0002",
    "\u01a5]\u0003\u0002\u0002\u0002\u01a6\u01a4\u0003\u0002\u0002\u0002",
    "\u01a7\u01a9\u0007\u0003\u0002\u0002\u01a8\u01a7\u0003\u0002\u0002\u0002",
    "\u01a9\u01ac\u0003\u0002\u0002\u0002\u01aa\u01a8\u0003\u0002\u0002\u0002",
    "\u01aa\u01ab\u0003\u0002\u0002\u0002\u01ab\u01b3\u0003\u0002\u0002\u0002",
    "\u01ac\u01aa\u0003\u0002\u0002\u0002\u01ad\u01ae\u0005`1\u0002\u01ae",
    "\u01af\u0005\u0006\u0004\u0002\u01af\u01b2\u0003\u0002\u0002\u0002\u01b0",
    "\u01b2\u0005b2\u0002\u01b1\u01ad\u0003\u0002\u0002\u0002\u01b1\u01b0",
    "\u0003\u0002\u0002\u0002\u01b2\u01b5\u0003\u0002\u0002\u0002\u01b3\u01b1",
    "\u0003\u0002\u0002\u0002\u01b3\u01b4\u0003\u0002\u0002\u0002\u01b4_",
    "\u0003\u0002\u0002\u0002\u01b5\u01b3\u0003\u0002\u0002\u0002\u01b6\u01ba",
    "\u0007\t\u0002\u0002\u01b7\u01b9\t\b\u0002\u0002\u01b8\u01b7\u0003\u0002",
    "\u0002\u0002\u01b9\u01bc\u0003\u0002\u0002\u0002\u01ba\u01b8\u0003\u0002",
    "\u0002\u0002\u01ba\u01bb\u0003\u0002\u0002\u0002\u01bba\u0003\u0002",
    "\u0002\u0002\u01bc\u01ba\u0003\u0002\u0002\u0002\u01bd\u01bf\t\u0004",
    "\u0002\u0002\u01be\u01bd\u0003\u0002\u0002\u0002\u01bf\u01c0\u0003\u0002",
    "\u0002\u0002\u01c0\u01be\u0003\u0002\u0002\u0002\u01c0\u01c1\u0003\u0002",
    "\u0002\u0002\u01c1c\u0003\u0002\u0002\u0002\u01c2\u01c4\u0005f4\u0002",
    "\u01c3\u01c2\u0003\u0002\u0002\u0002\u01c3\u01c4\u0003\u0002\u0002\u0002",
    "\u01c4\u01c5\u0003\u0002\u0002\u0002\u01c5\u01c6\u0005l7\u0002\u01c6",
    "e\u0003\u0002\u0002\u0002\u01c7\u01c9\u0007\u0003\u0002\u0002\u01c8",
    "\u01c7\u0003\u0002\u0002\u0002\u01c9\u01cc\u0003\u0002\u0002\u0002\u01ca",
    "\u01c8\u0003\u0002\u0002\u0002\u01ca\u01cb\u0003\u0002\u0002\u0002\u01cb",
    "\u01cd\u0003\u0002\u0002\u0002\u01cc\u01ca\u0003\u0002\u0002\u0002\u01cd",
    "\u01d0\u0007\u000e\u0002\u0002\u01ce\u01d1\u0005h5\u0002\u01cf\u01d1",
    "\u0005j6\u0002\u01d0\u01ce\u0003\u0002\u0002\u0002\u01d0\u01cf\u0003",
    "\u0002\u0002\u0002\u01d1\u01d2\u0003\u0002\u0002\u0002\u01d2\u01d0\u0003",
    "\u0002\u0002\u0002\u01d2\u01d3\u0003\u0002\u0002\u0002\u01d3g\u0003",
    "\u0002\u0002\u0002\u01d4\u01d6\u0007\u0003\u0002\u0002\u01d5\u01d4\u0003",
    "\u0002\u0002\u0002\u01d6\u01d9\u0003\u0002\u0002\u0002\u01d7\u01d5\u0003",
    "\u0002\u0002\u0002\u01d7\u01d8\u0003\u0002\u0002\u0002\u01d8\u01da\u0003",
    "\u0002\u0002\u0002\u01d9\u01d7\u0003\u0002\u0002\u0002\u01da\u01de\u0007",
    "\t\u0002\u0002\u01db\u01dd\t\b\u0002\u0002\u01dc\u01db\u0003\u0002\u0002",
    "\u0002\u01dd\u01e0\u0003\u0002\u0002\u0002\u01de\u01dc\u0003\u0002\u0002",
    "\u0002\u01de\u01df\u0003\u0002\u0002\u0002\u01df\u01e1\u0003\u0002\u0002",
    "\u0002\u01e0\u01de\u0003\u0002\u0002\u0002\u01e1\u01e2\u0005\u0006\u0004",
    "\u0002\u01e2i\u0003\u0002\u0002\u0002\u01e3\u01e5\t\u0004\u0002\u0002",
    "\u01e4\u01e3\u0003\u0002\u0002\u0002\u01e5\u01e6\u0003\u0002\u0002\u0002",
    "\u01e6\u01e4\u0003\u0002\u0002\u0002\u01e6\u01e7\u0003\u0002\u0002\u0002",
    "\u01e7k\u0003\u0002\u0002\u0002\u01e8\u01ea\u0007\u0003\u0002\u0002",
    "\u01e9\u01e8\u0003\u0002\u0002\u0002\u01ea\u01ed\u0003\u0002\u0002\u0002",
    "\u01eb\u01e9\u0003\u0002\u0002\u0002\u01eb\u01ec\u0003\u0002\u0002\u0002",
    "\u01ec\u01ee\u0003\u0002\u0002\u0002\u01ed\u01eb\u0003\u0002\u0002\u0002",
    "\u01ee\u01ef\u0007\u000f\u0002\u0002\u01efm\u0003\u0002\u0002\u0002",
    "\u01f0\u01f1\u0005p9\u0002\u01f1o\u0003\u0002\u0002\u0002\u01f2\u01f4",
    "\u0007\u0003\u0002\u0002\u01f3\u01f2\u0003\u0002\u0002\u0002\u01f4\u01f7",
    "\u0003\u0002\u0002\u0002\u01f5\u01f3\u0003\u0002\u0002\u0002\u01f5\u01f6",
    "\u0003\u0002\u0002\u0002\u01f6\u01f8\u0003\u0002\u0002\u0002\u01f7\u01f5",
    "\u0003\u0002\u0002\u0002\u01f8\u01f9\u0007\u0005\u0002\u0002\u01f9q",
    "\u0003\u0002\u0002\u0002Au\u0081\u0086\u0091\u0098\u00a0\u00a2\u00aa",
    "\u00b0\u00b5\u00be\u00c0\u00c5\u00ca\u00cf\u00d4\u00dc\u00de\u00e4\u00ec",
    "\u00f3\u00f5\u00fa\u0101\u0107\u010d\u0113\u0115\u011a\u011f\u0123\u0126",
    "\u0129\u012c\u0130\u0139\u0145\u0152\u0157\u0162\u016a\u016c\u0177\u0179",
    "\u017e\u0185\u018b\u019b\u01a4\u01aa\u01b1\u01b3\u01ba\u01c0\u01c3\u01ca",
    "\u01d0\u01d2\u01d7\u01de\u01e6\u01eb\u01f5"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, null, null, null, null, null, null, null, null, 
                     null, null, null, null, null, null, null, null, "','", 
                     "'='", null, null, null, null, null, null, null, null, 
                     null, null, "'.'", null, null, null, null, null, null, 
                     null, null, "':'" ];

var symbolicNames = [ null, "WS", "NEWLINE", "MODEL_INFO", "COMMENT", "QNA", 
                      "HASH", "DASH", "DOLLAR", "AT", "IMPORT_DESC", "IMPORT_PATH", 
                      "FILTER_MARK", "MULTI_LINE_TEXT", "INVALID_TOKEN_DEFAULT_MODE", 
                      "WS_IN_NEW_ENTITY_IGNORED", "NEWLINE_IN_NEW_ENTITY", 
                      "COMMA", "NEW_EQUAL", "HAS_ROLES_LABEL", "HAS_FEATURES_LABEL", 
                      "NEW_ENTITY_TYPE_IDENTIFIER", "NEW_ENTITY_IDENTIFIER", 
                      "NEW_ENTITY_IDENTIFIER_WITH_WS", "NEW_COMPOSITE_ENTITY", 
                      "NEW_REGEX_ENTITY", "NEW_TEXT", "NEWLINE_IN_NAME", 
                      "IDENTIFIER", "DOT", "ESCAPE_CHARACTER", "EXPRESSION", 
                      "TEXT", "WS_IN_ENTITY_IGNORED", "NEWLINE_IN_ENTITY", 
                      "COMPOSITE_ENTITY", "REGEX_ENTITY", "ENTITY_TEXT", 
                      "COLON_MARK", "NEWLINE_IN_QNA", "QNA_TEXT" ];

var ruleNames =  [ "file", "paragraph", "newline", "nestedIntentSection", 
                   "nestedIntentNameLine", "nestedIntentName", "nameIdentifier", 
                   "nestedIntentBodyDefinition", "subIntentDefinition", 
                   "simpleIntentSection", "intentDefinition", "intentNameLine", 
                   "intentName", "intentBody", "normalIntentBody", "normalIntentString", 
                   "errorIntentString", "newEntitySection", "newEntityDefinition", 
                   "newEntityListbody", "newEntityLine", "newCompositeDefinition", 
                   "newRegexDefinition", "newEntityType", "newEntityRoles", 
                   "newEntityUsesFeatures", "newEntityRoleOrFeatures", "text", 
                   "newEntityName", "newEntityNameWithWS", "entitySection", 
                   "entityDefinition", "entityLine", "entityName", "entityType", 
                   "compositeEntityIdentifier", "regexEntityIdentifier", 
                   "entityListBody", "normalItemString", "errorItemString", 
                   "importSection", "importDefinition", "qnaSection", "qnaDefinition", 
                   "qnaQuestion", "questionText", "moreQuestionsBody", "moreQuestion", 
                   "errorQuestionString", "qnaAnswerBody", "filterSection", 
                   "filterLine", "errorFilterLine", "multiLineAnswer", "modelInfoSection", 
                   "modelInfoDefinition" ];

function LUFileParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

LUFileParser.prototype = Object.create(antlr4.Parser.prototype);
LUFileParser.prototype.constructor = LUFileParser;

Object.defineProperty(LUFileParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

LUFileParser.EOF = antlr4.Token.EOF;
LUFileParser.WS = 1;
LUFileParser.NEWLINE = 2;
LUFileParser.MODEL_INFO = 3;
LUFileParser.COMMENT = 4;
LUFileParser.QNA = 5;
LUFileParser.HASH = 6;
LUFileParser.DASH = 7;
LUFileParser.DOLLAR = 8;
LUFileParser.AT = 9;
LUFileParser.IMPORT_DESC = 10;
LUFileParser.IMPORT_PATH = 11;
LUFileParser.FILTER_MARK = 12;
LUFileParser.MULTI_LINE_TEXT = 13;
LUFileParser.INVALID_TOKEN_DEFAULT_MODE = 14;
LUFileParser.WS_IN_NEW_ENTITY_IGNORED = 15;
LUFileParser.NEWLINE_IN_NEW_ENTITY = 16;
LUFileParser.COMMA = 17;
LUFileParser.NEW_EQUAL = 18;
LUFileParser.HAS_ROLES_LABEL = 19;
LUFileParser.HAS_FEATURES_LABEL = 20;
LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER = 21;
LUFileParser.NEW_ENTITY_IDENTIFIER = 22;
LUFileParser.NEW_ENTITY_IDENTIFIER_WITH_WS = 23;
LUFileParser.NEW_COMPOSITE_ENTITY = 24;
LUFileParser.NEW_REGEX_ENTITY = 25;
LUFileParser.NEW_TEXT = 26;
LUFileParser.NEWLINE_IN_NAME = 27;
LUFileParser.IDENTIFIER = 28;
LUFileParser.DOT = 29;
LUFileParser.ESCAPE_CHARACTER = 30;
LUFileParser.EXPRESSION = 31;
LUFileParser.TEXT = 32;
LUFileParser.WS_IN_ENTITY_IGNORED = 33;
LUFileParser.NEWLINE_IN_ENTITY = 34;
LUFileParser.COMPOSITE_ENTITY = 35;
LUFileParser.REGEX_ENTITY = 36;
LUFileParser.ENTITY_TEXT = 37;
LUFileParser.COLON_MARK = 38;
LUFileParser.NEWLINE_IN_QNA = 39;
LUFileParser.QNA_TEXT = 40;

LUFileParser.RULE_file = 0;
LUFileParser.RULE_paragraph = 1;
LUFileParser.RULE_newline = 2;
LUFileParser.RULE_nestedIntentSection = 3;
LUFileParser.RULE_nestedIntentNameLine = 4;
LUFileParser.RULE_nestedIntentName = 5;
LUFileParser.RULE_nameIdentifier = 6;
LUFileParser.RULE_nestedIntentBodyDefinition = 7;
LUFileParser.RULE_subIntentDefinition = 8;
LUFileParser.RULE_simpleIntentSection = 9;
LUFileParser.RULE_intentDefinition = 10;
LUFileParser.RULE_intentNameLine = 11;
LUFileParser.RULE_intentName = 12;
LUFileParser.RULE_intentBody = 13;
LUFileParser.RULE_normalIntentBody = 14;
LUFileParser.RULE_normalIntentString = 15;
LUFileParser.RULE_errorIntentString = 16;
LUFileParser.RULE_newEntitySection = 17;
LUFileParser.RULE_newEntityDefinition = 18;
LUFileParser.RULE_newEntityListbody = 19;
LUFileParser.RULE_newEntityLine = 20;
LUFileParser.RULE_newCompositeDefinition = 21;
LUFileParser.RULE_newRegexDefinition = 22;
LUFileParser.RULE_newEntityType = 23;
LUFileParser.RULE_newEntityRoles = 24;
LUFileParser.RULE_newEntityUsesFeatures = 25;
LUFileParser.RULE_newEntityRoleOrFeatures = 26;
LUFileParser.RULE_text = 27;
LUFileParser.RULE_newEntityName = 28;
LUFileParser.RULE_newEntityNameWithWS = 29;
LUFileParser.RULE_entitySection = 30;
LUFileParser.RULE_entityDefinition = 31;
LUFileParser.RULE_entityLine = 32;
LUFileParser.RULE_entityName = 33;
LUFileParser.RULE_entityType = 34;
LUFileParser.RULE_compositeEntityIdentifier = 35;
LUFileParser.RULE_regexEntityIdentifier = 36;
LUFileParser.RULE_entityListBody = 37;
LUFileParser.RULE_normalItemString = 38;
LUFileParser.RULE_errorItemString = 39;
LUFileParser.RULE_importSection = 40;
LUFileParser.RULE_importDefinition = 41;
LUFileParser.RULE_qnaSection = 42;
LUFileParser.RULE_qnaDefinition = 43;
LUFileParser.RULE_qnaQuestion = 44;
LUFileParser.RULE_questionText = 45;
LUFileParser.RULE_moreQuestionsBody = 46;
LUFileParser.RULE_moreQuestion = 47;
LUFileParser.RULE_errorQuestionString = 48;
LUFileParser.RULE_qnaAnswerBody = 49;
LUFileParser.RULE_filterSection = 50;
LUFileParser.RULE_filterLine = 51;
LUFileParser.RULE_errorFilterLine = 52;
LUFileParser.RULE_multiLineAnswer = 53;
LUFileParser.RULE_modelInfoSection = 54;
LUFileParser.RULE_modelInfoDefinition = 55;


function FileContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_file;
    return this;
}

FileContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FileContext.prototype.constructor = FileContext;

FileContext.prototype.EOF = function() {
    return this.getToken(LUFileParser.EOF, 0);
};

FileContext.prototype.paragraph = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ParagraphContext);
    } else {
        return this.getTypedRuleContext(ParagraphContext,i);
    }
};

FileContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterFile(this);
	}
};

FileContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitFile(this);
	}
};

FileContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitFile(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.FileContext = FileContext;

LUFileParser.prototype.file = function() {

    var localctx = new FileContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, LUFileParser.RULE_file);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 113; 
        this._errHandler.sync(this);
        var _alt = 1+1;
        do {
        	switch (_alt) {
        	case 1+1:
        		this.state = 112;
        		this.paragraph();
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 115; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,0, this._ctx);
        } while ( _alt!=1 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
        this.state = 117;
        this.match(LUFileParser.EOF);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ParagraphContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_paragraph;
    return this;
}

ParagraphContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ParagraphContext.prototype.constructor = ParagraphContext;

ParagraphContext.prototype.newline = function() {
    return this.getTypedRuleContext(NewlineContext,0);
};

ParagraphContext.prototype.nestedIntentSection = function() {
    return this.getTypedRuleContext(NestedIntentSectionContext,0);
};

ParagraphContext.prototype.simpleIntentSection = function() {
    return this.getTypedRuleContext(SimpleIntentSectionContext,0);
};

ParagraphContext.prototype.entitySection = function() {
    return this.getTypedRuleContext(EntitySectionContext,0);
};

ParagraphContext.prototype.newEntitySection = function() {
    return this.getTypedRuleContext(NewEntitySectionContext,0);
};

ParagraphContext.prototype.importSection = function() {
    return this.getTypedRuleContext(ImportSectionContext,0);
};

ParagraphContext.prototype.qnaSection = function() {
    return this.getTypedRuleContext(QnaSectionContext,0);
};

ParagraphContext.prototype.modelInfoSection = function() {
    return this.getTypedRuleContext(ModelInfoSectionContext,0);
};

ParagraphContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterParagraph(this);
	}
};

ParagraphContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitParagraph(this);
	}
};

ParagraphContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitParagraph(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ParagraphContext = ParagraphContext;

LUFileParser.prototype.paragraph = function() {

    var localctx = new ParagraphContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, LUFileParser.RULE_paragraph);
    try {
        this.state = 127;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
        switch(la_) {
        case 1:
            this.enterOuterAlt(localctx, 1);
            this.state = 119;
            this.newline();
            break;

        case 2:
            this.enterOuterAlt(localctx, 2);
            this.state = 120;
            this.nestedIntentSection();
            break;

        case 3:
            this.enterOuterAlt(localctx, 3);
            this.state = 121;
            this.simpleIntentSection();
            break;

        case 4:
            this.enterOuterAlt(localctx, 4);
            this.state = 122;
            this.entitySection();
            break;

        case 5:
            this.enterOuterAlt(localctx, 5);
            this.state = 123;
            this.newEntitySection();
            break;

        case 6:
            this.enterOuterAlt(localctx, 6);
            this.state = 124;
            this.importSection();
            break;

        case 7:
            this.enterOuterAlt(localctx, 7);
            this.state = 125;
            this.qnaSection();
            break;

        case 8:
            this.enterOuterAlt(localctx, 8);
            this.state = 126;
            this.modelInfoSection();
            break;

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewlineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newline;
    return this;
}

NewlineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewlineContext.prototype.constructor = NewlineContext;

NewlineContext.prototype.NEWLINE = function() {
    return this.getToken(LUFileParser.NEWLINE, 0);
};

NewlineContext.prototype.EOF = function() {
    return this.getToken(LUFileParser.EOF, 0);
};

NewlineContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


NewlineContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewline(this);
	}
};

NewlineContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewline(this);
	}
};

NewlineContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewline(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewlineContext = NewlineContext;

LUFileParser.prototype.newline = function() {

    var localctx = new NewlineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, LUFileParser.RULE_newline);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 132;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 129;
            this.match(LUFileParser.WS);
            this.state = 134;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 135;
        _la = this._input.LA(1);
        if(!(_la===LUFileParser.EOF || _la===LUFileParser.NEWLINE)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NestedIntentSectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_nestedIntentSection;
    return this;
}

NestedIntentSectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NestedIntentSectionContext.prototype.constructor = NestedIntentSectionContext;

NestedIntentSectionContext.prototype.nestedIntentNameLine = function() {
    return this.getTypedRuleContext(NestedIntentNameLineContext,0);
};

NestedIntentSectionContext.prototype.nestedIntentBodyDefinition = function() {
    return this.getTypedRuleContext(NestedIntentBodyDefinitionContext,0);
};

NestedIntentSectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNestedIntentSection(this);
	}
};

NestedIntentSectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNestedIntentSection(this);
	}
};

NestedIntentSectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNestedIntentSection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NestedIntentSectionContext = NestedIntentSectionContext;

LUFileParser.prototype.nestedIntentSection = function() {

    var localctx = new NestedIntentSectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 6, LUFileParser.RULE_nestedIntentSection);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 137;
        this.nestedIntentNameLine();
        this.state = 138;
        this.nestedIntentBodyDefinition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NestedIntentNameLineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_nestedIntentNameLine;
    return this;
}

NestedIntentNameLineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NestedIntentNameLineContext.prototype.constructor = NestedIntentNameLineContext;

NestedIntentNameLineContext.prototype.HASH = function() {
    return this.getToken(LUFileParser.HASH, 0);
};

NestedIntentNameLineContext.prototype.nestedIntentName = function() {
    return this.getTypedRuleContext(NestedIntentNameContext,0);
};

NestedIntentNameLineContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


NestedIntentNameLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNestedIntentNameLine(this);
	}
};

NestedIntentNameLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNestedIntentNameLine(this);
	}
};

NestedIntentNameLineContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNestedIntentNameLine(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NestedIntentNameLineContext = NestedIntentNameLineContext;

LUFileParser.prototype.nestedIntentNameLine = function() {

    var localctx = new NestedIntentNameLineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 8, LUFileParser.RULE_nestedIntentNameLine);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 143;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 140;
            this.match(LUFileParser.WS);
            this.state = 145;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 146;
        this.match(LUFileParser.HASH);
        this.state = 150;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 147;
            this.match(LUFileParser.WS);
            this.state = 152;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 153;
        this.nestedIntentName();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NestedIntentNameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_nestedIntentName;
    return this;
}

NestedIntentNameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NestedIntentNameContext.prototype.constructor = NestedIntentNameContext;

NestedIntentNameContext.prototype.nameIdentifier = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NameIdentifierContext);
    } else {
        return this.getTypedRuleContext(NameIdentifierContext,i);
    }
};

NestedIntentNameContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


NestedIntentNameContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNestedIntentName(this);
	}
};

NestedIntentNameContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNestedIntentName(this);
	}
};

NestedIntentNameContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNestedIntentName(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NestedIntentNameContext = NestedIntentNameContext;

LUFileParser.prototype.nestedIntentName = function() {

    var localctx = new NestedIntentNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 10, LUFileParser.RULE_nestedIntentName);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 155;
        this.nameIdentifier();
        this.state = 160;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,6,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 158;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case LUFileParser.WS:
                    this.state = 156;
                    this.match(LUFileParser.WS);
                    break;
                case LUFileParser.IDENTIFIER:
                    this.state = 157;
                    this.nameIdentifier();
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                } 
            }
            this.state = 162;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,6,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NameIdentifierContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_nameIdentifier;
    return this;
}

NameIdentifierContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NameIdentifierContext.prototype.constructor = NameIdentifierContext;

NameIdentifierContext.prototype.IDENTIFIER = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.IDENTIFIER);
    } else {
        return this.getToken(LUFileParser.IDENTIFIER, i);
    }
};


NameIdentifierContext.prototype.DOT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.DOT);
    } else {
        return this.getToken(LUFileParser.DOT, i);
    }
};


NameIdentifierContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNameIdentifier(this);
	}
};

NameIdentifierContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNameIdentifier(this);
	}
};

NameIdentifierContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNameIdentifier(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NameIdentifierContext = NameIdentifierContext;

LUFileParser.prototype.nameIdentifier = function() {

    var localctx = new NameIdentifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 12, LUFileParser.RULE_nameIdentifier);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 163;
        this.match(LUFileParser.IDENTIFIER);
        this.state = 168;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.DOT) {
            this.state = 164;
            this.match(LUFileParser.DOT);
            this.state = 165;
            this.match(LUFileParser.IDENTIFIER);
            this.state = 170;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NestedIntentBodyDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_nestedIntentBodyDefinition;
    return this;
}

NestedIntentBodyDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NestedIntentBodyDefinitionContext.prototype.constructor = NestedIntentBodyDefinitionContext;

NestedIntentBodyDefinitionContext.prototype.subIntentDefinition = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(SubIntentDefinitionContext);
    } else {
        return this.getTypedRuleContext(SubIntentDefinitionContext,i);
    }
};

NestedIntentBodyDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNestedIntentBodyDefinition(this);
	}
};

NestedIntentBodyDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNestedIntentBodyDefinition(this);
	}
};

NestedIntentBodyDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNestedIntentBodyDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NestedIntentBodyDefinitionContext = NestedIntentBodyDefinitionContext;

LUFileParser.prototype.nestedIntentBodyDefinition = function() {

    var localctx = new NestedIntentBodyDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 14, LUFileParser.RULE_nestedIntentBodyDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 172; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 171;
        		this.subIntentDefinition();
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 174; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,8, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function SubIntentDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_subIntentDefinition;
    return this;
}

SubIntentDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SubIntentDefinitionContext.prototype.constructor = SubIntentDefinitionContext;

SubIntentDefinitionContext.prototype.HASH = function() {
    return this.getToken(LUFileParser.HASH, 0);
};

SubIntentDefinitionContext.prototype.simpleIntentSection = function() {
    return this.getTypedRuleContext(SimpleIntentSectionContext,0);
};

SubIntentDefinitionContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


SubIntentDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterSubIntentDefinition(this);
	}
};

SubIntentDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitSubIntentDefinition(this);
	}
};

SubIntentDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitSubIntentDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.SubIntentDefinitionContext = SubIntentDefinitionContext;

LUFileParser.prototype.subIntentDefinition = function() {

    var localctx = new SubIntentDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 16, LUFileParser.RULE_subIntentDefinition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 179;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 176;
            this.match(LUFileParser.WS);
            this.state = 181;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 182;
        this.match(LUFileParser.HASH);
        this.state = 183;
        this.simpleIntentSection();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function SimpleIntentSectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_simpleIntentSection;
    return this;
}

SimpleIntentSectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
SimpleIntentSectionContext.prototype.constructor = SimpleIntentSectionContext;

SimpleIntentSectionContext.prototype.intentDefinition = function() {
    return this.getTypedRuleContext(IntentDefinitionContext,0);
};

SimpleIntentSectionContext.prototype.entitySection = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(EntitySectionContext);
    } else {
        return this.getTypedRuleContext(EntitySectionContext,i);
    }
};

SimpleIntentSectionContext.prototype.newEntitySection = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NewEntitySectionContext);
    } else {
        return this.getTypedRuleContext(NewEntitySectionContext,i);
    }
};

SimpleIntentSectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterSimpleIntentSection(this);
	}
};

SimpleIntentSectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitSimpleIntentSection(this);
	}
};

SimpleIntentSectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitSimpleIntentSection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.SimpleIntentSectionContext = SimpleIntentSectionContext;

LUFileParser.prototype.simpleIntentSection = function() {

    var localctx = new SimpleIntentSectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 18, LUFileParser.RULE_simpleIntentSection);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 185;
        this.intentDefinition();
        this.state = 190;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,11,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 188;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,10,this._ctx);
                switch(la_) {
                case 1:
                    this.state = 186;
                    this.entitySection();
                    break;

                case 2:
                    this.state = 187;
                    this.newEntitySection();
                    break;

                } 
            }
            this.state = 192;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,11,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function IntentDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_intentDefinition;
    return this;
}

IntentDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntentDefinitionContext.prototype.constructor = IntentDefinitionContext;

IntentDefinitionContext.prototype.intentNameLine = function() {
    return this.getTypedRuleContext(IntentNameLineContext,0);
};

IntentDefinitionContext.prototype.intentBody = function() {
    return this.getTypedRuleContext(IntentBodyContext,0);
};

IntentDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterIntentDefinition(this);
	}
};

IntentDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitIntentDefinition(this);
	}
};

IntentDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitIntentDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.IntentDefinitionContext = IntentDefinitionContext;

LUFileParser.prototype.intentDefinition = function() {

    var localctx = new IntentDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 20, LUFileParser.RULE_intentDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 193;
        this.intentNameLine();
        this.state = 195;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,12,this._ctx);
        if(la_===1) {
            this.state = 194;
            this.intentBody();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function IntentNameLineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_intentNameLine;
    return this;
}

IntentNameLineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntentNameLineContext.prototype.constructor = IntentNameLineContext;

IntentNameLineContext.prototype.HASH = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.HASH);
    } else {
        return this.getToken(LUFileParser.HASH, i);
    }
};


IntentNameLineContext.prototype.intentName = function() {
    return this.getTypedRuleContext(IntentNameContext,0);
};

IntentNameLineContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


IntentNameLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterIntentNameLine(this);
	}
};

IntentNameLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitIntentNameLine(this);
	}
};

IntentNameLineContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitIntentNameLine(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.IntentNameLineContext = IntentNameLineContext;

LUFileParser.prototype.intentNameLine = function() {

    var localctx = new IntentNameLineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 22, LUFileParser.RULE_intentNameLine);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 200;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 197;
            this.match(LUFileParser.WS);
            this.state = 202;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 203;
        this.match(LUFileParser.HASH);
        this.state = 205;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===LUFileParser.HASH) {
            this.state = 204;
            this.match(LUFileParser.HASH);
        }

        this.state = 210;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 207;
            this.match(LUFileParser.WS);
            this.state = 212;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 213;
        this.intentName();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function IntentNameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_intentName;
    return this;
}

IntentNameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntentNameContext.prototype.constructor = IntentNameContext;

IntentNameContext.prototype.nameIdentifier = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NameIdentifierContext);
    } else {
        return this.getTypedRuleContext(NameIdentifierContext,i);
    }
};

IntentNameContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


IntentNameContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterIntentName(this);
	}
};

IntentNameContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitIntentName(this);
	}
};

IntentNameContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitIntentName(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.IntentNameContext = IntentNameContext;

LUFileParser.prototype.intentName = function() {

    var localctx = new IntentNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 24, LUFileParser.RULE_intentName);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 215;
        this.nameIdentifier();
        this.state = 220;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,17,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 218;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case LUFileParser.WS:
                    this.state = 216;
                    this.match(LUFileParser.WS);
                    break;
                case LUFileParser.IDENTIFIER:
                    this.state = 217;
                    this.nameIdentifier();
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                } 
            }
            this.state = 222;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,17,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function IntentBodyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_intentBody;
    return this;
}

IntentBodyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
IntentBodyContext.prototype.constructor = IntentBodyContext;

IntentBodyContext.prototype.normalIntentBody = function() {
    return this.getTypedRuleContext(NormalIntentBodyContext,0);
};

IntentBodyContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


IntentBodyContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterIntentBody(this);
	}
};

IntentBodyContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitIntentBody(this);
	}
};

IntentBodyContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitIntentBody(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.IntentBodyContext = IntentBodyContext;

LUFileParser.prototype.intentBody = function() {

    var localctx = new IntentBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 26, LUFileParser.RULE_intentBody);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 226;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,18,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 223;
                this.match(LUFileParser.WS); 
            }
            this.state = 228;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,18,this._ctx);
        }

        this.state = 229;
        this.normalIntentBody();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NormalIntentBodyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_normalIntentBody;
    return this;
}

NormalIntentBodyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NormalIntentBodyContext.prototype.constructor = NormalIntentBodyContext;

NormalIntentBodyContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


NormalIntentBodyContext.prototype.errorIntentString = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ErrorIntentStringContext);
    } else {
        return this.getTypedRuleContext(ErrorIntentStringContext,i);
    }
};

NormalIntentBodyContext.prototype.normalIntentString = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NormalIntentStringContext);
    } else {
        return this.getTypedRuleContext(NormalIntentStringContext,i);
    }
};

NormalIntentBodyContext.prototype.newline = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NewlineContext);
    } else {
        return this.getTypedRuleContext(NewlineContext,i);
    }
};

NormalIntentBodyContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNormalIntentBody(this);
	}
};

NormalIntentBodyContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNormalIntentBody(this);
	}
};

NormalIntentBodyContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNormalIntentBody(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NormalIntentBodyContext = NormalIntentBodyContext;

LUFileParser.prototype.normalIntentBody = function() {

    var localctx = new NormalIntentBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 28, LUFileParser.RULE_normalIntentBody);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 234;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,19,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 231;
                this.match(LUFileParser.WS); 
            }
            this.state = 236;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,19,this._ctx);
        }

        this.state = 241; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 241;
        		this._errHandler.sync(this);
        		var la_ = this._interp.adaptivePredict(this._input,20,this._ctx);
        		switch(la_) {
        		case 1:
        		    this.state = 237;
        		    this.normalIntentString();
        		    this.state = 238;
        		    this.newline();
        		    break;

        		case 2:
        		    this.state = 240;
        		    this.errorIntentString();
        		    break;

        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 243; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,21, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NormalIntentStringContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_normalIntentString;
    return this;
}

NormalIntentStringContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NormalIntentStringContext.prototype.constructor = NormalIntentStringContext;

NormalIntentStringContext.prototype.DASH = function() {
    return this.getToken(LUFileParser.DASH, 0);
};

NormalIntentStringContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


NormalIntentStringContext.prototype.TEXT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.TEXT);
    } else {
        return this.getToken(LUFileParser.TEXT, i);
    }
};


NormalIntentStringContext.prototype.EXPRESSION = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.EXPRESSION);
    } else {
        return this.getToken(LUFileParser.EXPRESSION, i);
    }
};


NormalIntentStringContext.prototype.ESCAPE_CHARACTER = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.ESCAPE_CHARACTER);
    } else {
        return this.getToken(LUFileParser.ESCAPE_CHARACTER, i);
    }
};


NormalIntentStringContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNormalIntentString(this);
	}
};

NormalIntentStringContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNormalIntentString(this);
	}
};

NormalIntentStringContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNormalIntentString(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NormalIntentStringContext = NormalIntentStringContext;

LUFileParser.prototype.normalIntentString = function() {

    var localctx = new NormalIntentStringContext(this, this._ctx, this.state);
    this.enterRule(localctx, 30, LUFileParser.RULE_normalIntentString);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 248;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 245;
            this.match(LUFileParser.WS);
            this.state = 250;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 251;
        this.match(LUFileParser.DASH);
        this.state = 255;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,23,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 252;
                _la = this._input.LA(1);
                if(!(((((_la - 1)) & ~0x1f) == 0 && ((1 << (_la - 1)) & ((1 << (LUFileParser.WS - 1)) | (1 << (LUFileParser.ESCAPE_CHARACTER - 1)) | (1 << (LUFileParser.EXPRESSION - 1)) | (1 << (LUFileParser.TEXT - 1)))) !== 0))) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                } 
            }
            this.state = 257;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,23,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ErrorIntentStringContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_errorIntentString;
    return this;
}

ErrorIntentStringContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ErrorIntentStringContext.prototype.constructor = ErrorIntentStringContext;

ErrorIntentStringContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


ErrorIntentStringContext.prototype.INVALID_TOKEN_DEFAULT_MODE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.INVALID_TOKEN_DEFAULT_MODE);
    } else {
        return this.getToken(LUFileParser.INVALID_TOKEN_DEFAULT_MODE, i);
    }
};


ErrorIntentStringContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterErrorIntentString(this);
	}
};

ErrorIntentStringContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitErrorIntentString(this);
	}
};

ErrorIntentStringContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitErrorIntentString(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ErrorIntentStringContext = ErrorIntentStringContext;

LUFileParser.prototype.errorIntentString = function() {

    var localctx = new ErrorIntentStringContext(this, this._ctx, this.state);
    this.enterRule(localctx, 32, LUFileParser.RULE_errorIntentString);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 259; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 258;
        		_la = this._input.LA(1);
        		if(!(_la===LUFileParser.WS || _la===LUFileParser.INVALID_TOKEN_DEFAULT_MODE)) {
        		this._errHandler.recoverInline(this);
        		}
        		else {
        			this._errHandler.reportMatch(this);
        		    this.consume();
        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 261; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,24, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntitySectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntitySection;
    return this;
}

NewEntitySectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntitySectionContext.prototype.constructor = NewEntitySectionContext;

NewEntitySectionContext.prototype.newEntityDefinition = function() {
    return this.getTypedRuleContext(NewEntityDefinitionContext,0);
};

NewEntitySectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntitySection(this);
	}
};

NewEntitySectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntitySection(this);
	}
};

NewEntitySectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntitySection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntitySectionContext = NewEntitySectionContext;

LUFileParser.prototype.newEntitySection = function() {

    var localctx = new NewEntitySectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 34, LUFileParser.RULE_newEntitySection);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 263;
        this.newEntityDefinition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityDefinition;
    return this;
}

NewEntityDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityDefinitionContext.prototype.constructor = NewEntityDefinitionContext;

NewEntityDefinitionContext.prototype.newEntityLine = function() {
    return this.getTypedRuleContext(NewEntityLineContext,0);
};

NewEntityDefinitionContext.prototype.newEntityListbody = function() {
    return this.getTypedRuleContext(NewEntityListbodyContext,0);
};

NewEntityDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityDefinition(this);
	}
};

NewEntityDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityDefinition(this);
	}
};

NewEntityDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityDefinitionContext = NewEntityDefinitionContext;

LUFileParser.prototype.newEntityDefinition = function() {

    var localctx = new NewEntityDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 36, LUFileParser.RULE_newEntityDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 265;
        this.newEntityLine();
        this.state = 267;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,25,this._ctx);
        if(la_===1) {
            this.state = 266;
            this.newEntityListbody();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityListbodyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityListbody;
    return this;
}

NewEntityListbodyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityListbodyContext.prototype.constructor = NewEntityListbodyContext;

NewEntityListbodyContext.prototype.errorItemString = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ErrorItemStringContext);
    } else {
        return this.getTypedRuleContext(ErrorItemStringContext,i);
    }
};

NewEntityListbodyContext.prototype.normalItemString = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NormalItemStringContext);
    } else {
        return this.getTypedRuleContext(NormalItemStringContext,i);
    }
};

NewEntityListbodyContext.prototype.newline = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NewlineContext);
    } else {
        return this.getTypedRuleContext(NewlineContext,i);
    }
};

NewEntityListbodyContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityListbody(this);
	}
};

NewEntityListbodyContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityListbody(this);
	}
};

NewEntityListbodyContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityListbody(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityListbodyContext = NewEntityListbodyContext;

LUFileParser.prototype.newEntityListbody = function() {

    var localctx = new NewEntityListbodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 38, LUFileParser.RULE_newEntityListbody);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 273; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 273;
        		this._errHandler.sync(this);
        		var la_ = this._interp.adaptivePredict(this._input,26,this._ctx);
        		switch(la_) {
        		case 1:
        		    this.state = 269;
        		    this.normalItemString();
        		    this.state = 270;
        		    this.newline();
        		    break;

        		case 2:
        		    this.state = 272;
        		    this.errorItemString();
        		    break;

        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 275; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,27, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityLineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityLine;
    return this;
}

NewEntityLineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityLineContext.prototype.constructor = NewEntityLineContext;

NewEntityLineContext.prototype.AT = function() {
    return this.getToken(LUFileParser.AT, 0);
};

NewEntityLineContext.prototype.newEntityName = function() {
    return this.getTypedRuleContext(NewEntityNameContext,0);
};

NewEntityLineContext.prototype.newEntityNameWithWS = function() {
    return this.getTypedRuleContext(NewEntityNameWithWSContext,0);
};

NewEntityLineContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


NewEntityLineContext.prototype.newEntityType = function() {
    return this.getTypedRuleContext(NewEntityTypeContext,0);
};

NewEntityLineContext.prototype.newEntityRoles = function() {
    return this.getTypedRuleContext(NewEntityRolesContext,0);
};

NewEntityLineContext.prototype.newEntityUsesFeatures = function() {
    return this.getTypedRuleContext(NewEntityUsesFeaturesContext,0);
};

NewEntityLineContext.prototype.NEW_EQUAL = function() {
    return this.getToken(LUFileParser.NEW_EQUAL, 0);
};

NewEntityLineContext.prototype.newCompositeDefinition = function() {
    return this.getTypedRuleContext(NewCompositeDefinitionContext,0);
};

NewEntityLineContext.prototype.newRegexDefinition = function() {
    return this.getTypedRuleContext(NewRegexDefinitionContext,0);
};

NewEntityLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityLine(this);
	}
};

NewEntityLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityLine(this);
	}
};

NewEntityLineContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityLine(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityLineContext = NewEntityLineContext;

LUFileParser.prototype.newEntityLine = function() {

    var localctx = new NewEntityLineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 40, LUFileParser.RULE_newEntityLine);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 280;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 277;
            this.match(LUFileParser.WS);
            this.state = 282;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 283;
        this.match(LUFileParser.AT);
        this.state = 285;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,29,this._ctx);
        if(la_===1) {
            this.state = 284;
            this.newEntityType();

        }
        this.state = 289;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER:
        case LUFileParser.NEW_ENTITY_IDENTIFIER:
            this.state = 287;
            this.newEntityName();
            break;
        case LUFileParser.NEW_ENTITY_IDENTIFIER_WITH_WS:
            this.state = 288;
            this.newEntityNameWithWS();
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this.state = 292;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if((((_la) & ~0x1f) == 0 && ((1 << _la) & ((1 << LUFileParser.HAS_ROLES_LABEL) | (1 << LUFileParser.NEW_ENTITY_IDENTIFIER) | (1 << LUFileParser.NEW_TEXT))) !== 0)) {
            this.state = 291;
            this.newEntityRoles();
        }

        this.state = 295;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===LUFileParser.HAS_FEATURES_LABEL) {
            this.state = 294;
            this.newEntityUsesFeatures();
        }

        this.state = 298;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===LUFileParser.NEW_EQUAL) {
            this.state = 297;
            this.match(LUFileParser.NEW_EQUAL);
        }

        this.state = 302;
        this._errHandler.sync(this);
        switch (this._input.LA(1)) {
        case LUFileParser.NEW_COMPOSITE_ENTITY:
        	this.state = 300;
        	this.newCompositeDefinition();
        	break;
        case LUFileParser.NEW_REGEX_ENTITY:
        	this.state = 301;
        	this.newRegexDefinition();
        	break;
        case LUFileParser.EOF:
        case LUFileParser.WS:
        case LUFileParser.NEWLINE:
        case LUFileParser.MODEL_INFO:
        case LUFileParser.QNA:
        case LUFileParser.HASH:
        case LUFileParser.DASH:
        case LUFileParser.DOLLAR:
        case LUFileParser.AT:
        case LUFileParser.IMPORT_DESC:
        case LUFileParser.INVALID_TOKEN_DEFAULT_MODE:
        	break;
        default:
        	break;
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewCompositeDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newCompositeDefinition;
    return this;
}

NewCompositeDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewCompositeDefinitionContext.prototype.constructor = NewCompositeDefinitionContext;

NewCompositeDefinitionContext.prototype.NEW_COMPOSITE_ENTITY = function() {
    return this.getToken(LUFileParser.NEW_COMPOSITE_ENTITY, 0);
};

NewCompositeDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewCompositeDefinition(this);
	}
};

NewCompositeDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewCompositeDefinition(this);
	}
};

NewCompositeDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewCompositeDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewCompositeDefinitionContext = NewCompositeDefinitionContext;

LUFileParser.prototype.newCompositeDefinition = function() {

    var localctx = new NewCompositeDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 42, LUFileParser.RULE_newCompositeDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 304;
        this.match(LUFileParser.NEW_COMPOSITE_ENTITY);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewRegexDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newRegexDefinition;
    return this;
}

NewRegexDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewRegexDefinitionContext.prototype.constructor = NewRegexDefinitionContext;

NewRegexDefinitionContext.prototype.NEW_REGEX_ENTITY = function() {
    return this.getToken(LUFileParser.NEW_REGEX_ENTITY, 0);
};

NewRegexDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewRegexDefinition(this);
	}
};

NewRegexDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewRegexDefinition(this);
	}
};

NewRegexDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewRegexDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewRegexDefinitionContext = NewRegexDefinitionContext;

LUFileParser.prototype.newRegexDefinition = function() {

    var localctx = new NewRegexDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 44, LUFileParser.RULE_newRegexDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 306;
        this.match(LUFileParser.NEW_REGEX_ENTITY);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityTypeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityType;
    return this;
}

NewEntityTypeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityTypeContext.prototype.constructor = NewEntityTypeContext;

NewEntityTypeContext.prototype.NEW_ENTITY_TYPE_IDENTIFIER = function() {
    return this.getToken(LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER, 0);
};

NewEntityTypeContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityType(this);
	}
};

NewEntityTypeContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityType(this);
	}
};

NewEntityTypeContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityType(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityTypeContext = NewEntityTypeContext;

LUFileParser.prototype.newEntityType = function() {

    var localctx = new NewEntityTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 46, LUFileParser.RULE_newEntityType);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 308;
        this.match(LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityRolesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityRoles;
    return this;
}

NewEntityRolesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityRolesContext.prototype.constructor = NewEntityRolesContext;

NewEntityRolesContext.prototype.newEntityRoleOrFeatures = function() {
    return this.getTypedRuleContext(NewEntityRoleOrFeaturesContext,0);
};

NewEntityRolesContext.prototype.HAS_ROLES_LABEL = function() {
    return this.getToken(LUFileParser.HAS_ROLES_LABEL, 0);
};

NewEntityRolesContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityRoles(this);
	}
};

NewEntityRolesContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityRoles(this);
	}
};

NewEntityRolesContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityRoles(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityRolesContext = NewEntityRolesContext;

LUFileParser.prototype.newEntityRoles = function() {

    var localctx = new NewEntityRolesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 48, LUFileParser.RULE_newEntityRoles);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 311;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        if(_la===LUFileParser.HAS_ROLES_LABEL) {
            this.state = 310;
            this.match(LUFileParser.HAS_ROLES_LABEL);
        }

        this.state = 313;
        this.newEntityRoleOrFeatures();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityUsesFeaturesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityUsesFeatures;
    return this;
}

NewEntityUsesFeaturesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityUsesFeaturesContext.prototype.constructor = NewEntityUsesFeaturesContext;

NewEntityUsesFeaturesContext.prototype.HAS_FEATURES_LABEL = function() {
    return this.getToken(LUFileParser.HAS_FEATURES_LABEL, 0);
};

NewEntityUsesFeaturesContext.prototype.newEntityRoleOrFeatures = function() {
    return this.getTypedRuleContext(NewEntityRoleOrFeaturesContext,0);
};

NewEntityUsesFeaturesContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityUsesFeatures(this);
	}
};

NewEntityUsesFeaturesContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityUsesFeatures(this);
	}
};

NewEntityUsesFeaturesContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityUsesFeatures(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityUsesFeaturesContext = NewEntityUsesFeaturesContext;

LUFileParser.prototype.newEntityUsesFeatures = function() {

    var localctx = new NewEntityUsesFeaturesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 50, LUFileParser.RULE_newEntityUsesFeatures);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 315;
        this.match(LUFileParser.HAS_FEATURES_LABEL);
        this.state = 316;
        this.newEntityRoleOrFeatures();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityRoleOrFeaturesContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityRoleOrFeatures;
    return this;
}

NewEntityRoleOrFeaturesContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityRoleOrFeaturesContext.prototype.constructor = NewEntityRoleOrFeaturesContext;

NewEntityRoleOrFeaturesContext.prototype.text = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(TextContext);
    } else {
        return this.getTypedRuleContext(TextContext,i);
    }
};

NewEntityRoleOrFeaturesContext.prototype.COMMA = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.COMMA);
    } else {
        return this.getToken(LUFileParser.COMMA, i);
    }
};


NewEntityRoleOrFeaturesContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityRoleOrFeatures(this);
	}
};

NewEntityRoleOrFeaturesContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityRoleOrFeatures(this);
	}
};

NewEntityRoleOrFeaturesContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityRoleOrFeatures(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityRoleOrFeaturesContext = NewEntityRoleOrFeaturesContext;

LUFileParser.prototype.newEntityRoleOrFeatures = function() {

    var localctx = new NewEntityRoleOrFeaturesContext(this, this._ctx, this.state);
    this.enterRule(localctx, 52, LUFileParser.RULE_newEntityRoleOrFeatures);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 318;
        this.text();
        this.state = 323;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.COMMA) {
            this.state = 319;
            this.match(LUFileParser.COMMA);
            this.state = 320;
            this.text();
            this.state = 325;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function TextContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_text;
    return this;
}

TextContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
TextContext.prototype.constructor = TextContext;

TextContext.prototype.NEW_TEXT = function() {
    return this.getToken(LUFileParser.NEW_TEXT, 0);
};

TextContext.prototype.NEW_ENTITY_IDENTIFIER = function() {
    return this.getToken(LUFileParser.NEW_ENTITY_IDENTIFIER, 0);
};

TextContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterText(this);
	}
};

TextContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitText(this);
	}
};

TextContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitText(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.TextContext = TextContext;

LUFileParser.prototype.text = function() {

    var localctx = new TextContext(this, this._ctx, this.state);
    this.enterRule(localctx, 54, LUFileParser.RULE_text);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 326;
        _la = this._input.LA(1);
        if(!(_la===LUFileParser.NEW_ENTITY_IDENTIFIER || _la===LUFileParser.NEW_TEXT)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityNameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityName;
    return this;
}

NewEntityNameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityNameContext.prototype.constructor = NewEntityNameContext;

NewEntityNameContext.prototype.NEW_ENTITY_TYPE_IDENTIFIER = function() {
    return this.getToken(LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER, 0);
};

NewEntityNameContext.prototype.NEW_ENTITY_IDENTIFIER = function() {
    return this.getToken(LUFileParser.NEW_ENTITY_IDENTIFIER, 0);
};

NewEntityNameContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityName(this);
	}
};

NewEntityNameContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityName(this);
	}
};

NewEntityNameContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityName(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityNameContext = NewEntityNameContext;

LUFileParser.prototype.newEntityName = function() {

    var localctx = new NewEntityNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 56, LUFileParser.RULE_newEntityName);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 328;
        _la = this._input.LA(1);
        if(!(_la===LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER || _la===LUFileParser.NEW_ENTITY_IDENTIFIER)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NewEntityNameWithWSContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_newEntityNameWithWS;
    return this;
}

NewEntityNameWithWSContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NewEntityNameWithWSContext.prototype.constructor = NewEntityNameWithWSContext;

NewEntityNameWithWSContext.prototype.NEW_ENTITY_IDENTIFIER_WITH_WS = function() {
    return this.getToken(LUFileParser.NEW_ENTITY_IDENTIFIER_WITH_WS, 0);
};

NewEntityNameWithWSContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNewEntityNameWithWS(this);
	}
};

NewEntityNameWithWSContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNewEntityNameWithWS(this);
	}
};

NewEntityNameWithWSContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNewEntityNameWithWS(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NewEntityNameWithWSContext = NewEntityNameWithWSContext;

LUFileParser.prototype.newEntityNameWithWS = function() {

    var localctx = new NewEntityNameWithWSContext(this, this._ctx, this.state);
    this.enterRule(localctx, 58, LUFileParser.RULE_newEntityNameWithWS);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 330;
        this.match(LUFileParser.NEW_ENTITY_IDENTIFIER_WITH_WS);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function EntitySectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_entitySection;
    return this;
}

EntitySectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntitySectionContext.prototype.constructor = EntitySectionContext;

EntitySectionContext.prototype.entityDefinition = function() {
    return this.getTypedRuleContext(EntityDefinitionContext,0);
};

EntitySectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterEntitySection(this);
	}
};

EntitySectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitEntitySection(this);
	}
};

EntitySectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitEntitySection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.EntitySectionContext = EntitySectionContext;

LUFileParser.prototype.entitySection = function() {

    var localctx = new EntitySectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 60, LUFileParser.RULE_entitySection);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 332;
        this.entityDefinition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function EntityDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_entityDefinition;
    return this;
}

EntityDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityDefinitionContext.prototype.constructor = EntityDefinitionContext;

EntityDefinitionContext.prototype.entityLine = function() {
    return this.getTypedRuleContext(EntityLineContext,0);
};

EntityDefinitionContext.prototype.entityListBody = function() {
    return this.getTypedRuleContext(EntityListBodyContext,0);
};

EntityDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterEntityDefinition(this);
	}
};

EntityDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitEntityDefinition(this);
	}
};

EntityDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitEntityDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.EntityDefinitionContext = EntityDefinitionContext;

LUFileParser.prototype.entityDefinition = function() {

    var localctx = new EntityDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 62, LUFileParser.RULE_entityDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 334;
        this.entityLine();
        this.state = 336;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,37,this._ctx);
        if(la_===1) {
            this.state = 335;
            this.entityListBody();

        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function EntityLineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_entityLine;
    return this;
}

EntityLineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityLineContext.prototype.constructor = EntityLineContext;

EntityLineContext.prototype.DOLLAR = function() {
    return this.getToken(LUFileParser.DOLLAR, 0);
};

EntityLineContext.prototype.entityName = function() {
    return this.getTypedRuleContext(EntityNameContext,0);
};

EntityLineContext.prototype.COLON_MARK = function() {
    return this.getToken(LUFileParser.COLON_MARK, 0);
};

EntityLineContext.prototype.entityType = function() {
    return this.getTypedRuleContext(EntityTypeContext,0);
};

EntityLineContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


EntityLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterEntityLine(this);
	}
};

EntityLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitEntityLine(this);
	}
};

EntityLineContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitEntityLine(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.EntityLineContext = EntityLineContext;

LUFileParser.prototype.entityLine = function() {

    var localctx = new EntityLineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 64, LUFileParser.RULE_entityLine);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 341;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 338;
            this.match(LUFileParser.WS);
            this.state = 343;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 344;
        this.match(LUFileParser.DOLLAR);
        this.state = 345;
        this.entityName();
        this.state = 346;
        this.match(LUFileParser.COLON_MARK);
        this.state = 347;
        this.entityType();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function EntityNameContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_entityName;
    return this;
}

EntityNameContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityNameContext.prototype.constructor = EntityNameContext;

EntityNameContext.prototype.ENTITY_TEXT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.ENTITY_TEXT);
    } else {
        return this.getToken(LUFileParser.ENTITY_TEXT, i);
    }
};


EntityNameContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


EntityNameContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterEntityName(this);
	}
};

EntityNameContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitEntityName(this);
	}
};

EntityNameContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitEntityName(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.EntityNameContext = EntityNameContext;

LUFileParser.prototype.entityName = function() {

    var localctx = new EntityNameContext(this, this._ctx, this.state);
    this.enterRule(localctx, 66, LUFileParser.RULE_entityName);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 352;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS || _la===LUFileParser.ENTITY_TEXT) {
            this.state = 349;
            _la = this._input.LA(1);
            if(!(_la===LUFileParser.WS || _la===LUFileParser.ENTITY_TEXT)) {
            this._errHandler.recoverInline(this);
            }
            else {
            	this._errHandler.reportMatch(this);
                this.consume();
            }
            this.state = 354;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function EntityTypeContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_entityType;
    return this;
}

EntityTypeContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityTypeContext.prototype.constructor = EntityTypeContext;

EntityTypeContext.prototype.compositeEntityIdentifier = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(CompositeEntityIdentifierContext);
    } else {
        return this.getTypedRuleContext(CompositeEntityIdentifierContext,i);
    }
};

EntityTypeContext.prototype.regexEntityIdentifier = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(RegexEntityIdentifierContext);
    } else {
        return this.getTypedRuleContext(RegexEntityIdentifierContext,i);
    }
};

EntityTypeContext.prototype.ENTITY_TEXT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.ENTITY_TEXT);
    } else {
        return this.getToken(LUFileParser.ENTITY_TEXT, i);
    }
};


EntityTypeContext.prototype.COLON_MARK = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.COLON_MARK);
    } else {
        return this.getToken(LUFileParser.COLON_MARK, i);
    }
};


EntityTypeContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


EntityTypeContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterEntityType(this);
	}
};

EntityTypeContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitEntityType(this);
	}
};

EntityTypeContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitEntityType(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.EntityTypeContext = EntityTypeContext;

LUFileParser.prototype.entityType = function() {

    var localctx = new EntityTypeContext(this, this._ctx, this.state);
    this.enterRule(localctx, 68, LUFileParser.RULE_entityType);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 362;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,41,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 360;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case LUFileParser.COMPOSITE_ENTITY:
                    this.state = 355;
                    this.compositeEntityIdentifier();
                    break;
                case LUFileParser.REGEX_ENTITY:
                    this.state = 356;
                    this.regexEntityIdentifier();
                    break;
                case LUFileParser.ENTITY_TEXT:
                    this.state = 357;
                    this.match(LUFileParser.ENTITY_TEXT);
                    break;
                case LUFileParser.COLON_MARK:
                    this.state = 358;
                    this.match(LUFileParser.COLON_MARK);
                    break;
                case LUFileParser.WS:
                    this.state = 359;
                    this.match(LUFileParser.WS);
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                } 
            }
            this.state = 364;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,41,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function CompositeEntityIdentifierContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_compositeEntityIdentifier;
    return this;
}

CompositeEntityIdentifierContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
CompositeEntityIdentifierContext.prototype.constructor = CompositeEntityIdentifierContext;

CompositeEntityIdentifierContext.prototype.COMPOSITE_ENTITY = function() {
    return this.getToken(LUFileParser.COMPOSITE_ENTITY, 0);
};

CompositeEntityIdentifierContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterCompositeEntityIdentifier(this);
	}
};

CompositeEntityIdentifierContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitCompositeEntityIdentifier(this);
	}
};

CompositeEntityIdentifierContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitCompositeEntityIdentifier(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.CompositeEntityIdentifierContext = CompositeEntityIdentifierContext;

LUFileParser.prototype.compositeEntityIdentifier = function() {

    var localctx = new CompositeEntityIdentifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 70, LUFileParser.RULE_compositeEntityIdentifier);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 365;
        this.match(LUFileParser.COMPOSITE_ENTITY);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function RegexEntityIdentifierContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_regexEntityIdentifier;
    return this;
}

RegexEntityIdentifierContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
RegexEntityIdentifierContext.prototype.constructor = RegexEntityIdentifierContext;

RegexEntityIdentifierContext.prototype.REGEX_ENTITY = function() {
    return this.getToken(LUFileParser.REGEX_ENTITY, 0);
};

RegexEntityIdentifierContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterRegexEntityIdentifier(this);
	}
};

RegexEntityIdentifierContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitRegexEntityIdentifier(this);
	}
};

RegexEntityIdentifierContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitRegexEntityIdentifier(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.RegexEntityIdentifierContext = RegexEntityIdentifierContext;

LUFileParser.prototype.regexEntityIdentifier = function() {

    var localctx = new RegexEntityIdentifierContext(this, this._ctx, this.state);
    this.enterRule(localctx, 72, LUFileParser.RULE_regexEntityIdentifier);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 367;
        this.match(LUFileParser.REGEX_ENTITY);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function EntityListBodyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_entityListBody;
    return this;
}

EntityListBodyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
EntityListBodyContext.prototype.constructor = EntityListBodyContext;

EntityListBodyContext.prototype.errorItemString = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ErrorItemStringContext);
    } else {
        return this.getTypedRuleContext(ErrorItemStringContext,i);
    }
};

EntityListBodyContext.prototype.normalItemString = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NormalItemStringContext);
    } else {
        return this.getTypedRuleContext(NormalItemStringContext,i);
    }
};

EntityListBodyContext.prototype.newline = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NewlineContext);
    } else {
        return this.getTypedRuleContext(NewlineContext,i);
    }
};

EntityListBodyContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterEntityListBody(this);
	}
};

EntityListBodyContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitEntityListBody(this);
	}
};

EntityListBodyContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitEntityListBody(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.EntityListBodyContext = EntityListBodyContext;

LUFileParser.prototype.entityListBody = function() {

    var localctx = new EntityListBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 74, LUFileParser.RULE_entityListBody);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 373; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 373;
        		this._errHandler.sync(this);
        		var la_ = this._interp.adaptivePredict(this._input,42,this._ctx);
        		switch(la_) {
        		case 1:
        		    this.state = 369;
        		    this.normalItemString();
        		    this.state = 370;
        		    this.newline();
        		    break;

        		case 2:
        		    this.state = 372;
        		    this.errorItemString();
        		    break;

        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 375; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,43, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function NormalItemStringContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_normalItemString;
    return this;
}

NormalItemStringContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
NormalItemStringContext.prototype.constructor = NormalItemStringContext;

NormalItemStringContext.prototype.DASH = function() {
    return this.getToken(LUFileParser.DASH, 0);
};

NormalItemStringContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


NormalItemStringContext.prototype.TEXT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.TEXT);
    } else {
        return this.getToken(LUFileParser.TEXT, i);
    }
};


NormalItemStringContext.prototype.EXPRESSION = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.EXPRESSION);
    } else {
        return this.getToken(LUFileParser.EXPRESSION, i);
    }
};


NormalItemStringContext.prototype.ESCAPE_CHARACTER = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.ESCAPE_CHARACTER);
    } else {
        return this.getToken(LUFileParser.ESCAPE_CHARACTER, i);
    }
};


NormalItemStringContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterNormalItemString(this);
	}
};

NormalItemStringContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitNormalItemString(this);
	}
};

NormalItemStringContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitNormalItemString(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.NormalItemStringContext = NormalItemStringContext;

LUFileParser.prototype.normalItemString = function() {

    var localctx = new NormalItemStringContext(this, this._ctx, this.state);
    this.enterRule(localctx, 76, LUFileParser.RULE_normalItemString);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 380;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 377;
            this.match(LUFileParser.WS);
            this.state = 382;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 383;
        this.match(LUFileParser.DASH);
        this.state = 387;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,45,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 384;
                _la = this._input.LA(1);
                if(!(((((_la - 1)) & ~0x1f) == 0 && ((1 << (_la - 1)) & ((1 << (LUFileParser.WS - 1)) | (1 << (LUFileParser.ESCAPE_CHARACTER - 1)) | (1 << (LUFileParser.EXPRESSION - 1)) | (1 << (LUFileParser.TEXT - 1)))) !== 0))) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                } 
            }
            this.state = 389;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,45,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ErrorItemStringContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_errorItemString;
    return this;
}

ErrorItemStringContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ErrorItemStringContext.prototype.constructor = ErrorItemStringContext;

ErrorItemStringContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


ErrorItemStringContext.prototype.INVALID_TOKEN_DEFAULT_MODE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.INVALID_TOKEN_DEFAULT_MODE);
    } else {
        return this.getToken(LUFileParser.INVALID_TOKEN_DEFAULT_MODE, i);
    }
};


ErrorItemStringContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterErrorItemString(this);
	}
};

ErrorItemStringContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitErrorItemString(this);
	}
};

ErrorItemStringContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitErrorItemString(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ErrorItemStringContext = ErrorItemStringContext;

LUFileParser.prototype.errorItemString = function() {

    var localctx = new ErrorItemStringContext(this, this._ctx, this.state);
    this.enterRule(localctx, 78, LUFileParser.RULE_errorItemString);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 391; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 390;
        		_la = this._input.LA(1);
        		if(!(_la===LUFileParser.WS || _la===LUFileParser.INVALID_TOKEN_DEFAULT_MODE)) {
        		this._errHandler.recoverInline(this);
        		}
        		else {
        			this._errHandler.reportMatch(this);
        		    this.consume();
        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 393; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,46, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ImportSectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_importSection;
    return this;
}

ImportSectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ImportSectionContext.prototype.constructor = ImportSectionContext;

ImportSectionContext.prototype.importDefinition = function() {
    return this.getTypedRuleContext(ImportDefinitionContext,0);
};

ImportSectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterImportSection(this);
	}
};

ImportSectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitImportSection(this);
	}
};

ImportSectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitImportSection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ImportSectionContext = ImportSectionContext;

LUFileParser.prototype.importSection = function() {

    var localctx = new ImportSectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 80, LUFileParser.RULE_importSection);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 395;
        this.importDefinition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ImportDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_importDefinition;
    return this;
}

ImportDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ImportDefinitionContext.prototype.constructor = ImportDefinitionContext;

ImportDefinitionContext.prototype.IMPORT_DESC = function() {
    return this.getToken(LUFileParser.IMPORT_DESC, 0);
};

ImportDefinitionContext.prototype.IMPORT_PATH = function() {
    return this.getToken(LUFileParser.IMPORT_PATH, 0);
};

ImportDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterImportDefinition(this);
	}
};

ImportDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitImportDefinition(this);
	}
};

ImportDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitImportDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ImportDefinitionContext = ImportDefinitionContext;

LUFileParser.prototype.importDefinition = function() {

    var localctx = new ImportDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 82, LUFileParser.RULE_importDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 397;
        this.match(LUFileParser.IMPORT_DESC);
        this.state = 398;
        this.match(LUFileParser.IMPORT_PATH);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function QnaSectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_qnaSection;
    return this;
}

QnaSectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
QnaSectionContext.prototype.constructor = QnaSectionContext;

QnaSectionContext.prototype.qnaDefinition = function() {
    return this.getTypedRuleContext(QnaDefinitionContext,0);
};

QnaSectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterQnaSection(this);
	}
};

QnaSectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitQnaSection(this);
	}
};

QnaSectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitQnaSection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.QnaSectionContext = QnaSectionContext;

LUFileParser.prototype.qnaSection = function() {

    var localctx = new QnaSectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 84, LUFileParser.RULE_qnaSection);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 400;
        this.qnaDefinition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function QnaDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_qnaDefinition;
    return this;
}

QnaDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
QnaDefinitionContext.prototype.constructor = QnaDefinitionContext;

QnaDefinitionContext.prototype.qnaQuestion = function() {
    return this.getTypedRuleContext(QnaQuestionContext,0);
};

QnaDefinitionContext.prototype.moreQuestionsBody = function() {
    return this.getTypedRuleContext(MoreQuestionsBodyContext,0);
};

QnaDefinitionContext.prototype.qnaAnswerBody = function() {
    return this.getTypedRuleContext(QnaAnswerBodyContext,0);
};

QnaDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterQnaDefinition(this);
	}
};

QnaDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitQnaDefinition(this);
	}
};

QnaDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitQnaDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.QnaDefinitionContext = QnaDefinitionContext;

LUFileParser.prototype.qnaDefinition = function() {

    var localctx = new QnaDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 86, LUFileParser.RULE_qnaDefinition);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 402;
        this.qnaQuestion();
        this.state = 403;
        this.moreQuestionsBody();
        this.state = 404;
        this.qnaAnswerBody();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function QnaQuestionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_qnaQuestion;
    return this;
}

QnaQuestionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
QnaQuestionContext.prototype.constructor = QnaQuestionContext;

QnaQuestionContext.prototype.QNA = function() {
    return this.getToken(LUFileParser.QNA, 0);
};

QnaQuestionContext.prototype.questionText = function() {
    return this.getTypedRuleContext(QuestionTextContext,0);
};

QnaQuestionContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


QnaQuestionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterQnaQuestion(this);
	}
};

QnaQuestionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitQnaQuestion(this);
	}
};

QnaQuestionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitQnaQuestion(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.QnaQuestionContext = QnaQuestionContext;

LUFileParser.prototype.qnaQuestion = function() {

    var localctx = new QnaQuestionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 88, LUFileParser.RULE_qnaQuestion);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 409;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 406;
            this.match(LUFileParser.WS);
            this.state = 411;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 412;
        this.match(LUFileParser.QNA);
        this.state = 413;
        this.questionText();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function QuestionTextContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_questionText;
    return this;
}

QuestionTextContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
QuestionTextContext.prototype.constructor = QuestionTextContext;

QuestionTextContext.prototype.QNA_TEXT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.QNA_TEXT);
    } else {
        return this.getToken(LUFileParser.QNA_TEXT, i);
    }
};


QuestionTextContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterQuestionText(this);
	}
};

QuestionTextContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitQuestionText(this);
	}
};

QuestionTextContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitQuestionText(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.QuestionTextContext = QuestionTextContext;

LUFileParser.prototype.questionText = function() {

    var localctx = new QuestionTextContext(this, this._ctx, this.state);
    this.enterRule(localctx, 90, LUFileParser.RULE_questionText);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 418;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.QNA_TEXT) {
            this.state = 415;
            this.match(LUFileParser.QNA_TEXT);
            this.state = 420;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function MoreQuestionsBodyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_moreQuestionsBody;
    return this;
}

MoreQuestionsBodyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MoreQuestionsBodyContext.prototype.constructor = MoreQuestionsBodyContext;

MoreQuestionsBodyContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


MoreQuestionsBodyContext.prototype.errorQuestionString = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ErrorQuestionStringContext);
    } else {
        return this.getTypedRuleContext(ErrorQuestionStringContext,i);
    }
};

MoreQuestionsBodyContext.prototype.moreQuestion = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(MoreQuestionContext);
    } else {
        return this.getTypedRuleContext(MoreQuestionContext,i);
    }
};

MoreQuestionsBodyContext.prototype.newline = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(NewlineContext);
    } else {
        return this.getTypedRuleContext(NewlineContext,i);
    }
};

MoreQuestionsBodyContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterMoreQuestionsBody(this);
	}
};

MoreQuestionsBodyContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitMoreQuestionsBody(this);
	}
};

MoreQuestionsBodyContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitMoreQuestionsBody(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.MoreQuestionsBodyContext = MoreQuestionsBodyContext;

LUFileParser.prototype.moreQuestionsBody = function() {

    var localctx = new MoreQuestionsBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 92, LUFileParser.RULE_moreQuestionsBody);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 424;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,49,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 421;
                this.match(LUFileParser.WS); 
            }
            this.state = 426;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,49,this._ctx);
        }

        this.state = 433;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,51,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 431;
                this._errHandler.sync(this);
                switch(this._input.LA(1)) {
                case LUFileParser.DASH:
                    this.state = 427;
                    this.moreQuestion();
                    this.state = 428;
                    this.newline();
                    break;
                case LUFileParser.WS:
                case LUFileParser.INVALID_TOKEN_DEFAULT_MODE:
                    this.state = 430;
                    this.errorQuestionString();
                    break;
                default:
                    throw new antlr4.error.NoViableAltException(this);
                } 
            }
            this.state = 435;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,51,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function MoreQuestionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_moreQuestion;
    return this;
}

MoreQuestionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MoreQuestionContext.prototype.constructor = MoreQuestionContext;

MoreQuestionContext.prototype.DASH = function() {
    return this.getToken(LUFileParser.DASH, 0);
};

MoreQuestionContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


MoreQuestionContext.prototype.TEXT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.TEXT);
    } else {
        return this.getToken(LUFileParser.TEXT, i);
    }
};


MoreQuestionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterMoreQuestion(this);
	}
};

MoreQuestionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitMoreQuestion(this);
	}
};

MoreQuestionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitMoreQuestion(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.MoreQuestionContext = MoreQuestionContext;

LUFileParser.prototype.moreQuestion = function() {

    var localctx = new MoreQuestionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 94, LUFileParser.RULE_moreQuestion);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 436;
        this.match(LUFileParser.DASH);
        this.state = 440;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,52,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 437;
                _la = this._input.LA(1);
                if(!(_la===LUFileParser.WS || _la===LUFileParser.TEXT)) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                } 
            }
            this.state = 442;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,52,this._ctx);
        }

    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ErrorQuestionStringContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_errorQuestionString;
    return this;
}

ErrorQuestionStringContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ErrorQuestionStringContext.prototype.constructor = ErrorQuestionStringContext;

ErrorQuestionStringContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


ErrorQuestionStringContext.prototype.INVALID_TOKEN_DEFAULT_MODE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.INVALID_TOKEN_DEFAULT_MODE);
    } else {
        return this.getToken(LUFileParser.INVALID_TOKEN_DEFAULT_MODE, i);
    }
};


ErrorQuestionStringContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterErrorQuestionString(this);
	}
};

ErrorQuestionStringContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitErrorQuestionString(this);
	}
};

ErrorQuestionStringContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitErrorQuestionString(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ErrorQuestionStringContext = ErrorQuestionStringContext;

LUFileParser.prototype.errorQuestionString = function() {

    var localctx = new ErrorQuestionStringContext(this, this._ctx, this.state);
    this.enterRule(localctx, 96, LUFileParser.RULE_errorQuestionString);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 444; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 443;
        		_la = this._input.LA(1);
        		if(!(_la===LUFileParser.WS || _la===LUFileParser.INVALID_TOKEN_DEFAULT_MODE)) {
        		this._errHandler.recoverInline(this);
        		}
        		else {
        			this._errHandler.reportMatch(this);
        		    this.consume();
        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 446; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,53, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function QnaAnswerBodyContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_qnaAnswerBody;
    return this;
}

QnaAnswerBodyContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
QnaAnswerBodyContext.prototype.constructor = QnaAnswerBodyContext;

QnaAnswerBodyContext.prototype.multiLineAnswer = function() {
    return this.getTypedRuleContext(MultiLineAnswerContext,0);
};

QnaAnswerBodyContext.prototype.filterSection = function() {
    return this.getTypedRuleContext(FilterSectionContext,0);
};

QnaAnswerBodyContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterQnaAnswerBody(this);
	}
};

QnaAnswerBodyContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitQnaAnswerBody(this);
	}
};

QnaAnswerBodyContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitQnaAnswerBody(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.QnaAnswerBodyContext = QnaAnswerBodyContext;

LUFileParser.prototype.qnaAnswerBody = function() {

    var localctx = new QnaAnswerBodyContext(this, this._ctx, this.state);
    this.enterRule(localctx, 98, LUFileParser.RULE_qnaAnswerBody);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 449;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,54,this._ctx);
        if(la_===1) {
            this.state = 448;
            this.filterSection();

        }
        this.state = 451;
        this.multiLineAnswer();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function FilterSectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_filterSection;
    return this;
}

FilterSectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FilterSectionContext.prototype.constructor = FilterSectionContext;

FilterSectionContext.prototype.FILTER_MARK = function() {
    return this.getToken(LUFileParser.FILTER_MARK, 0);
};

FilterSectionContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


FilterSectionContext.prototype.filterLine = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(FilterLineContext);
    } else {
        return this.getTypedRuleContext(FilterLineContext,i);
    }
};

FilterSectionContext.prototype.errorFilterLine = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ErrorFilterLineContext);
    } else {
        return this.getTypedRuleContext(ErrorFilterLineContext,i);
    }
};

FilterSectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterFilterSection(this);
	}
};

FilterSectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitFilterSection(this);
	}
};

FilterSectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitFilterSection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.FilterSectionContext = FilterSectionContext;

LUFileParser.prototype.filterSection = function() {

    var localctx = new FilterSectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 100, LUFileParser.RULE_filterSection);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 456;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 453;
            this.match(LUFileParser.WS);
            this.state = 458;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 459;
        this.match(LUFileParser.FILTER_MARK);
        this.state = 462; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 462;
        		this._errHandler.sync(this);
        		var la_ = this._interp.adaptivePredict(this._input,56,this._ctx);
        		switch(la_) {
        		case 1:
        		    this.state = 460;
        		    this.filterLine();
        		    break;

        		case 2:
        		    this.state = 461;
        		    this.errorFilterLine();
        		    break;

        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 464; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,57, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function FilterLineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_filterLine;
    return this;
}

FilterLineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
FilterLineContext.prototype.constructor = FilterLineContext;

FilterLineContext.prototype.DASH = function() {
    return this.getToken(LUFileParser.DASH, 0);
};

FilterLineContext.prototype.newline = function() {
    return this.getTypedRuleContext(NewlineContext,0);
};

FilterLineContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


FilterLineContext.prototype.TEXT = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.TEXT);
    } else {
        return this.getToken(LUFileParser.TEXT, i);
    }
};


FilterLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterFilterLine(this);
	}
};

FilterLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitFilterLine(this);
	}
};

FilterLineContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitFilterLine(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.FilterLineContext = FilterLineContext;

LUFileParser.prototype.filterLine = function() {

    var localctx = new FilterLineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 102, LUFileParser.RULE_filterLine);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 469;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 466;
            this.match(LUFileParser.WS);
            this.state = 471;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 472;
        this.match(LUFileParser.DASH);
        this.state = 476;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,59,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                this.state = 473;
                _la = this._input.LA(1);
                if(!(_la===LUFileParser.WS || _la===LUFileParser.TEXT)) {
                this._errHandler.recoverInline(this);
                }
                else {
                	this._errHandler.reportMatch(this);
                    this.consume();
                } 
            }
            this.state = 478;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,59,this._ctx);
        }

        this.state = 479;
        this.newline();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ErrorFilterLineContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_errorFilterLine;
    return this;
}

ErrorFilterLineContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ErrorFilterLineContext.prototype.constructor = ErrorFilterLineContext;

ErrorFilterLineContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


ErrorFilterLineContext.prototype.INVALID_TOKEN_DEFAULT_MODE = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.INVALID_TOKEN_DEFAULT_MODE);
    } else {
        return this.getToken(LUFileParser.INVALID_TOKEN_DEFAULT_MODE, i);
    }
};


ErrorFilterLineContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterErrorFilterLine(this);
	}
};

ErrorFilterLineContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitErrorFilterLine(this);
	}
};

ErrorFilterLineContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitErrorFilterLine(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ErrorFilterLineContext = ErrorFilterLineContext;

LUFileParser.prototype.errorFilterLine = function() {

    var localctx = new ErrorFilterLineContext(this, this._ctx, this.state);
    this.enterRule(localctx, 104, LUFileParser.RULE_errorFilterLine);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 482; 
        this._errHandler.sync(this);
        var _alt = 1;
        do {
        	switch (_alt) {
        	case 1:
        		this.state = 481;
        		_la = this._input.LA(1);
        		if(!(_la===LUFileParser.WS || _la===LUFileParser.INVALID_TOKEN_DEFAULT_MODE)) {
        		this._errHandler.recoverInline(this);
        		}
        		else {
        			this._errHandler.reportMatch(this);
        		    this.consume();
        		}
        		break;
        	default:
        		throw new antlr4.error.NoViableAltException(this);
        	}
        	this.state = 484; 
        	this._errHandler.sync(this);
        	_alt = this._interp.adaptivePredict(this._input,60, this._ctx);
        } while ( _alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER );
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function MultiLineAnswerContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_multiLineAnswer;
    return this;
}

MultiLineAnswerContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MultiLineAnswerContext.prototype.constructor = MultiLineAnswerContext;

MultiLineAnswerContext.prototype.MULTI_LINE_TEXT = function() {
    return this.getToken(LUFileParser.MULTI_LINE_TEXT, 0);
};

MultiLineAnswerContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


MultiLineAnswerContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterMultiLineAnswer(this);
	}
};

MultiLineAnswerContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitMultiLineAnswer(this);
	}
};

MultiLineAnswerContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitMultiLineAnswer(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.MultiLineAnswerContext = MultiLineAnswerContext;

LUFileParser.prototype.multiLineAnswer = function() {

    var localctx = new MultiLineAnswerContext(this, this._ctx, this.state);
    this.enterRule(localctx, 106, LUFileParser.RULE_multiLineAnswer);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 489;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 486;
            this.match(LUFileParser.WS);
            this.state = 491;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 492;
        this.match(LUFileParser.MULTI_LINE_TEXT);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ModelInfoSectionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_modelInfoSection;
    return this;
}

ModelInfoSectionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ModelInfoSectionContext.prototype.constructor = ModelInfoSectionContext;

ModelInfoSectionContext.prototype.modelInfoDefinition = function() {
    return this.getTypedRuleContext(ModelInfoDefinitionContext,0);
};

ModelInfoSectionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterModelInfoSection(this);
	}
};

ModelInfoSectionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitModelInfoSection(this);
	}
};

ModelInfoSectionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitModelInfoSection(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ModelInfoSectionContext = ModelInfoSectionContext;

LUFileParser.prototype.modelInfoSection = function() {

    var localctx = new ModelInfoSectionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 108, LUFileParser.RULE_modelInfoSection);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 494;
        this.modelInfoDefinition();
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


function ModelInfoDefinitionContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = LUFileParser.RULE_modelInfoDefinition;
    return this;
}

ModelInfoDefinitionContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ModelInfoDefinitionContext.prototype.constructor = ModelInfoDefinitionContext;

ModelInfoDefinitionContext.prototype.MODEL_INFO = function() {
    return this.getToken(LUFileParser.MODEL_INFO, 0);
};

ModelInfoDefinitionContext.prototype.WS = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(LUFileParser.WS);
    } else {
        return this.getToken(LUFileParser.WS, i);
    }
};


ModelInfoDefinitionContext.prototype.enterRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.enterModelInfoDefinition(this);
	}
};

ModelInfoDefinitionContext.prototype.exitRule = function(listener) {
    if(listener instanceof LUFileParserListener ) {
        listener.exitModelInfoDefinition(this);
	}
};

ModelInfoDefinitionContext.prototype.accept = function(visitor) {
    if ( visitor instanceof LUFileParserVisitor ) {
        return visitor.visitModelInfoDefinition(this);
    } else {
        return visitor.visitChildren(this);
    }
};




LUFileParser.ModelInfoDefinitionContext = ModelInfoDefinitionContext;

LUFileParser.prototype.modelInfoDefinition = function() {

    var localctx = new ModelInfoDefinitionContext(this, this._ctx, this.state);
    this.enterRule(localctx, 110, LUFileParser.RULE_modelInfoDefinition);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 499;
        this._errHandler.sync(this);
        _la = this._input.LA(1);
        while(_la===LUFileParser.WS) {
            this.state = 496;
            this.match(LUFileParser.WS);
            this.state = 501;
            this._errHandler.sync(this);
            _la = this._input.LA(1);
        }
        this.state = 502;
        this.match(LUFileParser.MODEL_INFO);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};


exports.LUFileParser = LUFileParser;
