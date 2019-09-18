// Generated from ../LUFileLexer.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');



var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\u001f\u019c\b\u0001\b\u0001\b\u0001\b\u0001\b\u0001\u0004\u0002",
    "\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t\u0004\u0004\u0005\t\u0005",
    "\u0004\u0006\t\u0006\u0004\u0007\t\u0007\u0004\b\t\b\u0004\t\t\t\u0004",
    "\n\t\n\u0004\u000b\t\u000b\u0004\f\t\f\u0004\r\t\r\u0004\u000e\t\u000e",
    "\u0004\u000f\t\u000f\u0004\u0010\t\u0010\u0004\u0011\t\u0011\u0004\u0012",
    "\t\u0012\u0004\u0013\t\u0013\u0004\u0014\t\u0014\u0004\u0015\t\u0015",
    "\u0004\u0016\t\u0016\u0004\u0017\t\u0017\u0004\u0018\t\u0018\u0004\u0019",
    "\t\u0019\u0004\u001a\t\u001a\u0004\u001b\t\u001b\u0004\u001c\t\u001c",
    "\u0004\u001d\t\u001d\u0004\u001e\t\u001e\u0004\u001f\t\u001f\u0004 ",
    "\t \u0004!\t!\u0004\"\t\"\u0004#\t#\u0004$\t$\u0004%\t%\u0004&\t&\u0004",
    "\'\t\'\u0004(\t(\u0004)\t)\u0004*\t*\u0003\u0002\u0003\u0002\u0003\u0003",
    "\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005\u0003\u0005\u0003\u0006",
    "\u0003\u0006\u0007\u0006d\n\u0006\f\u0006\u000e\u0006g\u000b\u0006\u0003",
    "\u0006\u0003\u0006\u0003\u0006\u0003\u0006\u0006\u0006m\n\u0006\r\u0006",
    "\u000e\u0006n\u0003\u0007\u0003\u0007\u0006\u0007s\n\u0007\r\u0007\u000e",
    "\u0007t\u0003\u0007\u0003\u0007\u0003\b\u0006\bz\n\b\r\b\u000e\b{\u0003",
    "\b\u0003\b\u0003\t\u0005\t\u0081\n\t\u0003\t\u0003\t\u0003\t\u0003\t",
    "\u0003\n\u0006\n\u0088\n\n\r\n\u000e\n\u0089\u0003\n\u0006\n\u008d\n",
    "\n\r\n\u000e\n\u008e\u0003\n\u0003\n\u0003\n\u0003\n\u0003\n\u0003\u000b",
    "\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b\u0003\u000b",
    "\u0003\f\u0003\f\u0003\f\u0003\f\u0003\f\u0003\r\u0003\r\u0003\r\u0003",
    "\r\u0003\r\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e\u0003\u000e",
    "\u0003\u000f\u0003\u000f\u0007\u000f\u00ae\n\u000f\f\u000f\u000e\u000f",
    "\u00b1\u000b\u000f\u0003\u000f\u0003\u000f\u0003\u0010\u0003\u0010\u0007",
    "\u0010\u00b7\n\u0010\f\u0010\u000e\u0010\u00ba\u000b\u0010\u0003\u0010",
    "\u0003\u0010\u0003\u0011\u0003\u0011\u0003\u0011\u0003\u0011\u0003\u0011",
    "\u0003\u0011\u0003\u0011\u0003\u0011\u0003\u0011\u0003\u0011\u0003\u0011",
    "\u0003\u0011\u0003\u0011\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012",
    "\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003\u0012",
    "\u0003\u0012\u0003\u0012\u0003\u0012\u0007\u0012\u00d8\n\u0012\f\u0012",
    "\u000e\u0012\u00db\u000b\u0012\u0003\u0012\u0003\u0012\u0003\u0012\u0003",
    "\u0012\u0003\u0013\u0003\u0013\u0003\u0014\u0006\u0014\u00e4\n\u0014",
    "\r\u0014\u000e\u0014\u00e5\u0003\u0014\u0003\u0014\u0003\u0014\u0003",
    "\u0014\u0003\u0015\u0006\u0015\u00ed\n\u0015\r\u0015\u000e\u0015\u00ee",
    "\u0003\u0015\u0003\u0015\u0003\u0016\u0005\u0016\u00f4\n\u0016\u0003",
    "\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0016\u0003\u0017\u0003",
    "\u0017\u0003\u0017\u0005\u0017\u00fe\n\u0017\u0003\u0017\u0003\u0017",
    "\u0003\u0017\u0007\u0017\u0103\n\u0017\f\u0017\u000e\u0017\u0106\u000b",
    "\u0017\u0003\u0017\u0003\u0017\u0003\u0018\u0003\u0018\u0003\u0019\u0006",
    "\u0019\u010d\n\u0019\r\u0019\u000e\u0019\u010e\u0003\u0019\u0003\u0019",
    "\u0003\u0019\u0003\u0019\u0003\u001a\u0006\u001a\u0116\n\u001a\r\u001a",
    "\u000e\u001a\u0117\u0003\u001a\u0003\u001a\u0003\u001b\u0005\u001b\u011d",
    "\n\u001b\u0003\u001b\u0003\u001b\u0003\u001b\u0003\u001b\u0003\u001b",
    "\u0003\u001b\u0003\u001c\u0003\u001c\u0003\u001c\u0003\u001c\u0003\u001c",
    "\u0003\u001c\u0003\u001c\u0003\u001c\u0003\u001c\u0005\u001c\u012e\n",
    "\u001c\u0003\u001d\u0003\u001d\u0003\u001d\u0003\u001d\u0007\u001d\u0134",
    "\n\u001d\f\u001d\u000e\u001d\u0137\u000b\u001d\u0003\u001d\u0007\u001d",
    "\u013a\n\u001d\f\u001d\u000e\u001d\u013d\u000b\u001d\u0003\u001d\u0003",
    "\u001d\u0003\u001d\u0003\u001e\u0006\u001e\u0143\n\u001e\r\u001e\u000e",
    "\u001e\u0144\u0003\u001e\u0003\u001e\u0003\u001f\u0006\u001f\u014a\n",
    "\u001f\r\u001f\u000e\u001f\u014b\u0003\u001f\u0003\u001f\u0003\u001f",
    "\u0003\u001f\u0003 \u0006 \u0153\n \r \u000e \u0154\u0003 \u0003 \u0003",
    "!\u0005!\u015a\n!\u0003!\u0003!\u0003!\u0003!\u0003!\u0003!\u0003\"",
    "\u0003\"\u0003\"\u0006\"\u0165\n\"\r\"\u000e\"\u0166\u0003\"\u0003\"",
    "\u0003#\u0003#\u0007#\u016d\n#\f#\u000e#\u0170\u000b#\u0003$\u0003$",
    "\u0007$\u0174\n$\f$\u000e$\u0177\u000b$\u0003%\u0003%\u0003&\u0003&",
    "\u0003\'\u0006\'\u017e\n\'\r\'\u000e\'\u017f\u0003\'\u0003\'\u0003\'",
    "\u0003\'\u0003(\u0006(\u0187\n(\r(\u000e(\u0188\u0003(\u0003(\u0003",
    ")\u0005)\u018e\n)\u0003)\u0003)\u0003)\u0003)\u0003)\u0003)\u0003*\u0006",
    "*\u0197\n*\r*\u000e*\u0198\u0003*\u0003*\u0005\u00af\u00b8\u00d9\u0002",
    "+\u0007\u0002\t\u0002\u000b\u0002\r\u0002\u000f\u0003\u0011\u0004\u0013",
    "\u0005\u0015\u0006\u0017\u0007\u0019\b\u001b\t\u001d\n\u001f\u000b!",
    "\f#\r%\u000e\'\u000f)\u0010+\u0011-\u0002/\u00021\u00123\u00135\u0014",
    "7\u00029\u0002;\u0015=\u0016?\u0017A\u0018C\u0002E\u0002G\u0019I\u001a",
    "K\u001bM\u001cO\u001dQ\u001eS\u0002U\u0002W\u001f\u0007\u0002\u0003",
    "\u0004\u0005\u0006\r\u0004\u0002C\\c|\u0006\u0002\u000b\u000b\"\"\u00a2",
    "\u00a2\uff01\uff01\u0004\u0002,-//\u0004\u0002\f\f\u000f\u000f\u0004",
    "\u0002//aa\u0007\u0002__ppttvv\u007f\u007f\u0006\u0002\f\f\u000f\u000f",
    "}}\u007f\u007f\u0007\u0002\u000b\f\u000f\u000f\"\"}}\u007f\u007f\u0005",
    "\u0002/0aa~~\b\u0002\f\f\u000f\u000f*+]]}}\u007f\u007f\u0005\u0002#",
    "#..??\u0002\u01bb\u0002\u000f\u0003\u0002\u0002\u0002\u0002\u0011\u0003",
    "\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002\u0015\u0003",
    "\u0002\u0002\u0002\u0002\u0017\u0003\u0002\u0002\u0002\u0002\u0019\u0003",
    "\u0002\u0002\u0002\u0002\u001b\u0003\u0002\u0002\u0002\u0002\u001d\u0003",
    "\u0002\u0002\u0002\u0002\u001f\u0003\u0002\u0002\u0002\u0002!\u0003",
    "\u0002\u0002\u0002\u0002#\u0003\u0002\u0002\u0002\u0002%\u0003\u0002",
    "\u0002\u0002\u0002\'\u0003\u0002\u0002\u0002\u0002)\u0003\u0002\u0002",
    "\u0002\u0003+\u0003\u0002\u0002\u0002\u0003-\u0003\u0002\u0002\u0002",
    "\u0003/\u0003\u0002\u0002\u0002\u00031\u0003\u0002\u0002\u0002\u0003",
    "3\u0003\u0002\u0002\u0002\u00045\u0003\u0002\u0002\u0002\u00047\u0003",
    "\u0002\u0002\u0002\u00049\u0003\u0002\u0002\u0002\u0004;\u0003\u0002",
    "\u0002\u0002\u0004=\u0003\u0002\u0002\u0002\u0004?\u0003\u0002\u0002",
    "\u0002\u0005A\u0003\u0002\u0002\u0002\u0005C\u0003\u0002\u0002\u0002",
    "\u0005E\u0003\u0002\u0002\u0002\u0005G\u0003\u0002\u0002\u0002\u0005",
    "I\u0003\u0002\u0002\u0002\u0005K\u0003\u0002\u0002\u0002\u0005M\u0003",
    "\u0002\u0002\u0002\u0005O\u0003\u0002\u0002\u0002\u0006Q\u0003\u0002",
    "\u0002\u0002\u0006S\u0003\u0002\u0002\u0002\u0006U\u0003\u0002\u0002",
    "\u0002\u0006W\u0003\u0002\u0002\u0002\u0007Y\u0003\u0002\u0002\u0002",
    "\t[\u0003\u0002\u0002\u0002\u000b]\u0003\u0002\u0002\u0002\r_\u0003",
    "\u0002\u0002\u0002\u000fa\u0003\u0002\u0002\u0002\u0011p\u0003\u0002",
    "\u0002\u0002\u0013y\u0003\u0002\u0002\u0002\u0015\u0080\u0003\u0002",
    "\u0002\u0002\u0017\u0087\u0003\u0002\u0002\u0002\u0019\u0095\u0003\u0002",
    "\u0002\u0002\u001b\u009c\u0003\u0002\u0002\u0002\u001d\u00a1\u0003\u0002",
    "\u0002\u0002\u001f\u00a6\u0003\u0002\u0002\u0002!\u00ab\u0003\u0002",
    "\u0002\u0002#\u00b4\u0003\u0002\u0002\u0002%\u00bd\u0003\u0002\u0002",
    "\u0002\'\u00ca\u0003\u0002\u0002\u0002)\u00e0\u0003\u0002\u0002\u0002",
    "+\u00e3\u0003\u0002\u0002\u0002-\u00ec\u0003\u0002\u0002\u0002/\u00f3",
    "\u0003\u0002\u0002\u00021\u00fd\u0003\u0002\u0002\u00023\u0109\u0003",
    "\u0002\u0002\u00025\u010c\u0003\u0002\u0002\u00027\u0115\u0003\u0002",
    "\u0002\u00029\u011c\u0003\u0002\u0002\u0002;\u012d\u0003\u0002\u0002",
    "\u0002=\u012f\u0003\u0002\u0002\u0002?\u0142\u0003\u0002\u0002\u0002",
    "A\u0149\u0003\u0002\u0002\u0002C\u0152\u0003\u0002\u0002\u0002E\u0159",
    "\u0003\u0002\u0002\u0002G\u0164\u0003\u0002\u0002\u0002I\u016a\u0003",
    "\u0002\u0002\u0002K\u0171\u0003\u0002\u0002\u0002M\u0178\u0003\u0002",
    "\u0002\u0002O\u017a\u0003\u0002\u0002\u0002Q\u017d\u0003\u0002\u0002",
    "\u0002S\u0186\u0003\u0002\u0002\u0002U\u018d\u0003\u0002\u0002\u0002",
    "W\u0196\u0003\u0002\u0002\u0002YZ\t\u0002\u0002\u0002Z\b\u0003\u0002",
    "\u0002\u0002[\\\u00042;\u0002\\\n\u0003\u0002\u0002\u0002]^\t\u0003",
    "\u0002\u0002^\f\u0003\u0002\u0002\u0002_`\t\u0004\u0002\u0002`\u000e",
    "\u0003\u0002\u0002\u0002ae\u0007@\u0002\u0002bd\u0005\u000b\u0004\u0002",
    "cb\u0003\u0002\u0002\u0002dg\u0003\u0002\u0002\u0002ec\u0003\u0002\u0002",
    "\u0002ef\u0003\u0002\u0002\u0002fh\u0003\u0002\u0002\u0002ge\u0003\u0002",
    "\u0002\u0002hi\u0007#\u0002\u0002ij\u0007%\u0002\u0002jl\u0003\u0002",
    "\u0002\u0002km\n\u0005\u0002\u0002lk\u0003\u0002\u0002\u0002mn\u0003",
    "\u0002\u0002\u0002nl\u0003\u0002\u0002\u0002no\u0003\u0002\u0002\u0002",
    "o\u0010\u0003\u0002\u0002\u0002pr\u0007@\u0002\u0002qs\n\u0005\u0002",
    "\u0002rq\u0003\u0002\u0002\u0002st\u0003\u0002\u0002\u0002tr\u0003\u0002",
    "\u0002\u0002tu\u0003\u0002\u0002\u0002uv\u0003\u0002\u0002\u0002vw\b",
    "\u0007\u0002\u0002w\u0012\u0003\u0002\u0002\u0002xz\u0005\u000b\u0004",
    "\u0002yx\u0003\u0002\u0002\u0002z{\u0003\u0002\u0002\u0002{y\u0003\u0002",
    "\u0002\u0002{|\u0003\u0002\u0002\u0002|}\u0003\u0002\u0002\u0002}~\b",
    "\b\u0002\u0002~\u0014\u0003\u0002\u0002\u0002\u007f\u0081\u0007\u000f",
    "\u0002\u0002\u0080\u007f\u0003\u0002\u0002\u0002\u0080\u0081\u0003\u0002",
    "\u0002\u0002\u0081\u0082\u0003\u0002\u0002\u0002\u0082\u0083\u0007\f",
    "\u0002\u0002\u0083\u0084\u0003\u0002\u0002\u0002\u0084\u0085\b\t\u0002",
    "\u0002\u0085\u0016\u0003\u0002\u0002\u0002\u0086\u0088\u0007%\u0002",
    "\u0002\u0087\u0086\u0003\u0002\u0002\u0002\u0088\u0089\u0003\u0002\u0002",
    "\u0002\u0089\u0087\u0003\u0002\u0002\u0002\u0089\u008a\u0003\u0002\u0002",
    "\u0002\u008a\u008c\u0003\u0002\u0002\u0002\u008b\u008d\u0005\u000b\u0004",
    "\u0002\u008c\u008b\u0003\u0002\u0002\u0002\u008d\u008e\u0003\u0002\u0002",
    "\u0002\u008e\u008c\u0003\u0002\u0002\u0002\u008e\u008f\u0003\u0002\u0002",
    "\u0002\u008f\u0090\u0003\u0002\u0002\u0002\u0090\u0091\u0007A\u0002",
    "\u0002\u0091\u0092\b\n\u0003\u0002\u0092\u0093\u0003\u0002\u0002\u0002",
    "\u0093\u0094\b\n\u0004\u0002\u0094\u0018\u0003\u0002\u0002\u0002\u0095",
    "\u0096\u0007%\u0002\u0002\u0096\u0097\u0007%\u0002\u0002\u0097\u0098",
    "\u0003\u0002\u0002\u0002\u0098\u0099\b\u000b\u0005\u0002\u0099\u009a",
    "\u0003\u0002\u0002\u0002\u009a\u009b\b\u000b\u0006\u0002\u009b\u001a",
    "\u0003\u0002\u0002\u0002\u009c\u009d\u0007%\u0002\u0002\u009d\u009e",
    "\b\f\u0007\u0002\u009e\u009f\u0003\u0002\u0002\u0002\u009f\u00a0\b\f",
    "\u0006\u0002\u00a0\u001c\u0003\u0002\u0002\u0002\u00a1\u00a2\u0005\r",
    "\u0005\u0002\u00a2\u00a3\b\r\b\u0002\u00a3\u00a4\u0003\u0002\u0002\u0002",
    "\u00a4\u00a5\b\r\t\u0002\u00a5\u001e\u0003\u0002\u0002\u0002\u00a6\u00a7",
    "\u0007&\u0002\u0002\u00a7\u00a8\b\u000e\n\u0002\u00a8\u00a9\u0003\u0002",
    "\u0002\u0002\u00a9\u00aa\b\u000e\u000b\u0002\u00aa \u0003\u0002\u0002",
    "\u0002\u00ab\u00af\u0007]\u0002\u0002\u00ac\u00ae\u000b\u0002\u0002",
    "\u0002\u00ad\u00ac\u0003\u0002\u0002\u0002\u00ae\u00b1\u0003\u0002\u0002",
    "\u0002\u00af\u00b0\u0003\u0002\u0002\u0002\u00af\u00ad\u0003\u0002\u0002",
    "\u0002\u00b0\u00b2\u0003\u0002\u0002\u0002\u00b1\u00af\u0003\u0002\u0002",
    "\u0002\u00b2\u00b3\u0007_\u0002\u0002\u00b3\"\u0003\u0002\u0002\u0002",
    "\u00b4\u00b8\u0007*\u0002\u0002\u00b5\u00b7\u000b\u0002\u0002\u0002",
    "\u00b6\u00b5\u0003\u0002\u0002\u0002\u00b7\u00ba\u0003\u0002\u0002\u0002",
    "\u00b8\u00b9\u0003\u0002\u0002\u0002\u00b8\u00b6\u0003\u0002\u0002\u0002",
    "\u00b9\u00bb\u0003\u0002\u0002\u0002\u00ba\u00b8\u0003\u0002\u0002\u0002",
    "\u00bb\u00bc\u0007+\u0002\u0002\u00bc$\u0003\u0002\u0002\u0002\u00bd",
    "\u00be\u0007,\u0002\u0002\u00be\u00bf\u0007,\u0002\u0002\u00bf\u00c0",
    "\u0007H\u0002\u0002\u00c0\u00c1\u0007k\u0002\u0002\u00c1\u00c2\u0007",
    "n\u0002\u0002\u00c2\u00c3\u0007v\u0002\u0002\u00c3\u00c4\u0007g\u0002",
    "\u0002\u00c4\u00c5\u0007t\u0002\u0002\u00c5\u00c6\u0007u\u0002\u0002",
    "\u00c6\u00c7\u0007<\u0002\u0002\u00c7\u00c8\u0007,\u0002\u0002\u00c8",
    "\u00c9\u0007,\u0002\u0002\u00c9&\u0003\u0002\u0002\u0002\u00ca\u00cb",
    "\u0007b\u0002\u0002\u00cb\u00cc\u0007b\u0002\u0002\u00cc\u00cd\u0007",
    "b\u0002\u0002\u00cd\u00ce\u0007o\u0002\u0002\u00ce\u00cf\u0007c\u0002",
    "\u0002\u00cf\u00d0\u0007t\u0002\u0002\u00d0\u00d1\u0007m\u0002\u0002",
    "\u00d1\u00d2\u0007f\u0002\u0002\u00d2\u00d3\u0007q\u0002\u0002\u00d3",
    "\u00d4\u0007y\u0002\u0002\u00d4\u00d5\u0007p\u0002\u0002\u00d5\u00d9",
    "\u0003\u0002\u0002\u0002\u00d6\u00d8\u000b\u0002\u0002\u0002\u00d7\u00d6",
    "\u0003\u0002\u0002\u0002\u00d8\u00db\u0003\u0002\u0002\u0002\u00d9\u00da",
    "\u0003\u0002\u0002\u0002\u00d9\u00d7\u0003\u0002\u0002\u0002\u00da\u00dc",
    "\u0003\u0002\u0002\u0002\u00db\u00d9\u0003\u0002\u0002\u0002\u00dc\u00dd",
    "\u0007b\u0002\u0002\u00dd\u00de\u0007b\u0002\u0002\u00de\u00df\u0007",
    "b\u0002\u0002\u00df(\u0003\u0002\u0002\u0002\u00e0\u00e1\u000b\u0002",
    "\u0002\u0002\u00e1*\u0003\u0002\u0002\u0002\u00e2\u00e4\u0005\u000b",
    "\u0004\u0002\u00e3\u00e2\u0003\u0002\u0002\u0002\u00e4\u00e5\u0003\u0002",
    "\u0002\u0002\u00e5\u00e3\u0003\u0002\u0002\u0002\u00e5\u00e6\u0003\u0002",
    "\u0002\u0002\u00e6\u00e7\u0003\u0002\u0002\u0002\u00e7\u00e8\u0006\u0014",
    "\u0002\u0002\u00e8\u00e9\u0003\u0002\u0002\u0002\u00e9\u00ea\b\u0014",
    "\u0002\u0002\u00ea,\u0003\u0002\u0002\u0002\u00eb\u00ed\u0005\u000b",
    "\u0004\u0002\u00ec\u00eb\u0003\u0002\u0002\u0002\u00ed\u00ee\u0003\u0002",
    "\u0002\u0002\u00ee\u00ec\u0003\u0002\u0002\u0002\u00ee\u00ef\u0003\u0002",
    "\u0002\u0002\u00ef\u00f0\u0003\u0002\u0002\u0002\u00f0\u00f1\b\u0015",
    "\f\u0002\u00f1.\u0003\u0002\u0002\u0002\u00f2\u00f4\u0007\u000f\u0002",
    "\u0002\u00f3\u00f2\u0003\u0002\u0002\u0002\u00f3\u00f4\u0003\u0002\u0002",
    "\u0002\u00f4\u00f5\u0003\u0002\u0002\u0002\u00f5\u00f6\u0007\f\u0002",
    "\u0002\u00f6\u00f7\u0003\u0002\u0002\u0002\u00f7\u00f8\b\u0016\r\u0002",
    "\u00f8\u00f9\b\u0016\u000e\u0002\u00f90\u0003\u0002\u0002\u0002\u00fa",
    "\u00fe\u0005\u0007\u0002\u0002\u00fb\u00fe\u0005\t\u0003\u0002\u00fc",
    "\u00fe\u0007a\u0002\u0002\u00fd\u00fa\u0003\u0002\u0002\u0002\u00fd",
    "\u00fb\u0003\u0002\u0002\u0002\u00fd\u00fc\u0003\u0002\u0002\u0002\u00fe",
    "\u0104\u0003\u0002\u0002\u0002\u00ff\u0103\u0005\u0007\u0002\u0002\u0100",
    "\u0103\u0005\t\u0003\u0002\u0101\u0103\t\u0006\u0002\u0002\u0102\u00ff",
    "\u0003\u0002\u0002\u0002\u0102\u0100\u0003\u0002\u0002\u0002\u0102\u0101",
    "\u0003\u0002\u0002\u0002\u0103\u0106\u0003\u0002\u0002\u0002\u0104\u0102",
    "\u0003\u0002\u0002\u0002\u0104\u0105\u0003\u0002\u0002\u0002\u0105\u0107",
    "\u0003\u0002\u0002\u0002\u0106\u0104\u0003\u0002\u0002\u0002\u0107\u0108",
    "\b\u0017\u000f\u0002\u01082\u0003\u0002\u0002\u0002\u0109\u010a\u0007",
    "0\u0002\u0002\u010a4\u0003\u0002\u0002\u0002\u010b\u010d\u0005\u000b",
    "\u0004\u0002\u010c\u010b\u0003\u0002\u0002\u0002\u010d\u010e\u0003\u0002",
    "\u0002\u0002\u010e\u010c\u0003\u0002\u0002\u0002\u010e\u010f\u0003\u0002",
    "\u0002\u0002\u010f\u0110\u0003\u0002\u0002\u0002\u0110\u0111\u0006\u0019",
    "\u0003\u0002\u0111\u0112\u0003\u0002\u0002\u0002\u0112\u0113\b\u0019",
    "\u0002\u0002\u01136\u0003\u0002\u0002\u0002\u0114\u0116\u0005\u000b",
    "\u0004\u0002\u0115\u0114\u0003\u0002\u0002\u0002\u0116\u0117\u0003\u0002",
    "\u0002\u0002\u0117\u0115\u0003\u0002\u0002\u0002\u0117\u0118\u0003\u0002",
    "\u0002\u0002\u0118\u0119\u0003\u0002\u0002\u0002\u0119\u011a\b\u001a",
    "\f\u0002\u011a8\u0003\u0002\u0002\u0002\u011b\u011d\u0007\u000f\u0002",
    "\u0002\u011c\u011b\u0003\u0002\u0002\u0002\u011c\u011d\u0003\u0002\u0002",
    "\u0002\u011d\u011e\u0003\u0002\u0002\u0002\u011e\u011f\u0007\f\u0002",
    "\u0002\u011f\u0120\b\u001b\u0010\u0002\u0120\u0121\u0003\u0002\u0002",
    "\u0002\u0121\u0122\b\u001b\r\u0002\u0122\u0123\b\u001b\u000e\u0002\u0123",
    ":\u0003\u0002\u0002\u0002\u0124\u0125\u0007^\u0002\u0002\u0125\u012e",
    "\u0007}\u0002\u0002\u0126\u0127\u0007^\u0002\u0002\u0127\u012e\u0007",
    "]\u0002\u0002\u0128\u0129\u0007^\u0002\u0002\u0129\u012e\u0007^\u0002",
    "\u0002\u012a\u012b\u0007^\u0002\u0002\u012b\u012c\t\u0007\u0002\u0002",
    "\u012c\u012e\b\u001c\u0011\u0002\u012d\u0124\u0003\u0002\u0002\u0002",
    "\u012d\u0126\u0003\u0002\u0002\u0002\u012d\u0128\u0003\u0002\u0002\u0002",
    "\u012d\u012a\u0003\u0002\u0002\u0002\u012e<\u0003\u0002\u0002\u0002",
    "\u012f\u013b\u0007}\u0002\u0002\u0130\u013a\n\b\u0002\u0002\u0131\u0135",
    "\u0007}\u0002\u0002\u0132\u0134\n\u0005\u0002\u0002\u0133\u0132\u0003",
    "\u0002\u0002\u0002\u0134\u0137\u0003\u0002\u0002\u0002\u0135\u0133\u0003",
    "\u0002\u0002\u0002\u0135\u0136\u0003\u0002\u0002\u0002\u0136\u0138\u0003",
    "\u0002\u0002\u0002\u0137\u0135\u0003\u0002\u0002\u0002\u0138\u013a\u0007",
    "\u007f\u0002\u0002\u0139\u0130\u0003\u0002\u0002\u0002\u0139\u0131\u0003",
    "\u0002\u0002\u0002\u013a\u013d\u0003\u0002\u0002\u0002\u013b\u0139\u0003",
    "\u0002\u0002\u0002\u013b\u013c\u0003\u0002\u0002\u0002\u013c\u013e\u0003",
    "\u0002\u0002\u0002\u013d\u013b\u0003\u0002\u0002\u0002\u013e\u013f\u0007",
    "\u007f\u0002\u0002\u013f\u0140\b\u001d\u0012\u0002\u0140>\u0003\u0002",
    "\u0002\u0002\u0141\u0143\n\t\u0002\u0002\u0142\u0141\u0003\u0002\u0002",
    "\u0002\u0143\u0144\u0003\u0002\u0002\u0002\u0144\u0142\u0003\u0002\u0002",
    "\u0002\u0144\u0145\u0003\u0002\u0002\u0002\u0145\u0146\u0003\u0002\u0002",
    "\u0002\u0146\u0147\b\u001e\u0013\u0002\u0147@\u0003\u0002\u0002\u0002",
    "\u0148\u014a\u0005\u000b\u0004\u0002\u0149\u0148\u0003\u0002\u0002\u0002",
    "\u014a\u014b\u0003\u0002\u0002\u0002\u014b\u0149\u0003\u0002\u0002\u0002",
    "\u014b\u014c\u0003\u0002\u0002\u0002\u014c\u014d\u0003\u0002\u0002\u0002",
    "\u014d\u014e\u0006\u001f\u0004\u0002\u014e\u014f\u0003\u0002\u0002\u0002",
    "\u014f\u0150\b\u001f\u0002\u0002\u0150B\u0003\u0002\u0002\u0002\u0151",
    "\u0153\u0005\u000b\u0004\u0002\u0152\u0151\u0003\u0002\u0002\u0002\u0153",
    "\u0154\u0003\u0002\u0002\u0002\u0154\u0152\u0003\u0002\u0002\u0002\u0154",
    "\u0155\u0003\u0002\u0002\u0002\u0155\u0156\u0003\u0002\u0002\u0002\u0156",
    "\u0157\b \f\u0002\u0157D\u0003\u0002\u0002\u0002\u0158\u015a\u0007\u000f",
    "\u0002\u0002\u0159\u0158\u0003\u0002\u0002\u0002\u0159\u015a\u0003\u0002",
    "\u0002\u0002\u015a\u015b\u0003\u0002\u0002\u0002\u015b\u015c\u0007\f",
    "\u0002\u0002\u015c\u015d\b!\u0014\u0002\u015d\u015e\u0003\u0002\u0002",
    "\u0002\u015e\u015f\b!\r\u0002\u015f\u0160\b!\u000e\u0002\u0160F\u0003",
    "\u0002\u0002\u0002\u0161\u0165\u0005\u0007\u0002\u0002\u0162\u0165\u0005",
    "\t\u0003\u0002\u0163\u0165\t\n\u0002\u0002\u0164\u0161\u0003\u0002\u0002",
    "\u0002\u0164\u0162\u0003\u0002\u0002\u0002\u0164\u0163\u0003\u0002\u0002",
    "\u0002\u0165\u0166\u0003\u0002\u0002\u0002\u0166\u0164\u0003\u0002\u0002",
    "\u0002\u0166\u0167\u0003\u0002\u0002\u0002\u0167\u0168\u0003\u0002\u0002",
    "\u0002\u0168\u0169\b\"\u0015\u0002\u0169H\u0003\u0002\u0002\u0002\u016a",
    "\u016e\u0007]\u0002\u0002\u016b\u016d\n\u000b\u0002\u0002\u016c\u016b",
    "\u0003\u0002\u0002\u0002\u016d\u0170\u0003\u0002\u0002\u0002\u016e\u016c",
    "\u0003\u0002\u0002\u0002\u016e\u016f\u0003\u0002\u0002\u0002\u016fJ",
    "\u0003\u0002\u0002\u0002\u0170\u016e\u0003\u0002\u0002\u0002\u0171\u0175",
    "\u00071\u0002\u0002\u0172\u0174\n\u0005\u0002\u0002\u0173\u0172\u0003",
    "\u0002\u0002\u0002\u0174\u0177\u0003\u0002\u0002\u0002\u0175\u0173\u0003",
    "\u0002\u0002\u0002\u0175\u0176\u0003\u0002\u0002\u0002\u0176L\u0003",
    "\u0002\u0002\u0002\u0177\u0175\u0003\u0002\u0002\u0002\u0178\u0179\u0007",
    "<\u0002\u0002\u0179N\u0003\u0002\u0002\u0002\u017a\u017b\t\f\u0002\u0002",
    "\u017bP\u0003\u0002\u0002\u0002\u017c\u017e\u0005\u000b\u0004\u0002",
    "\u017d\u017c\u0003\u0002\u0002\u0002\u017e\u017f\u0003\u0002\u0002\u0002",
    "\u017f\u017d\u0003\u0002\u0002\u0002\u017f\u0180\u0003\u0002\u0002\u0002",
    "\u0180\u0181\u0003\u0002\u0002\u0002\u0181\u0182\u0006\'\u0005\u0002",
    "\u0182\u0183\u0003\u0002\u0002\u0002\u0183\u0184\b\'\u0002\u0002\u0184",
    "R\u0003\u0002\u0002\u0002\u0185\u0187\u0005\u000b\u0004\u0002\u0186",
    "\u0185\u0003\u0002\u0002\u0002\u0187\u0188\u0003\u0002\u0002\u0002\u0188",
    "\u0186\u0003\u0002\u0002\u0002\u0188\u0189\u0003\u0002\u0002\u0002\u0189",
    "\u018a\u0003\u0002\u0002\u0002\u018a\u018b\b(\f\u0002\u018bT\u0003\u0002",
    "\u0002\u0002\u018c\u018e\u0007\u000f\u0002\u0002\u018d\u018c\u0003\u0002",
    "\u0002\u0002\u018d\u018e\u0003\u0002\u0002\u0002\u018e\u018f\u0003\u0002",
    "\u0002\u0002\u018f\u0190\u0007\f\u0002\u0002\u0190\u0191\b)\u0016\u0002",
    "\u0191\u0192\u0003\u0002\u0002\u0002\u0192\u0193\b)\r\u0002\u0193\u0194",
    "\b)\u000e\u0002\u0194V\u0003\u0002\u0002\u0002\u0195\u0197\n\t\u0002",
    "\u0002\u0196\u0195\u0003\u0002\u0002\u0002\u0197\u0198\u0003\u0002\u0002",
    "\u0002\u0198\u0196\u0003\u0002\u0002\u0002\u0198\u0199\u0003\u0002\u0002",
    "\u0002\u0199\u019a\u0003\u0002\u0002\u0002\u019a\u019b\b*\u0017\u0002",
    "\u019bX\u0003\u0002\u0002\u0002*\u0002\u0003\u0004\u0005\u0006ent{\u0080",
    "\u0089\u008e\u00af\u00b8\u00d9\u00e5\u00ee\u00f3\u00fd\u0102\u0104\u010e",
    "\u0117\u011c\u012d\u0135\u0139\u013b\u0144\u014b\u0154\u0159\u0164\u0166",
    "\u016e\u0175\u017f\u0188\u018d\u0198\u0018\b\u0002\u0002\u0003\n\u0002",
    "\u0007\u0006\u0002\u0003\u000b\u0003\u0007\u0003\u0002\u0003\f\u0004",
    "\u0003\r\u0005\u0007\u0004\u0002\u0003\u000e\u0006\u0007\u0005\u0002",
    "\t\u0005\u0002\t\u0006\u0002\u0006\u0002\u0002\u0003\u0017\u0007\u0003",
    "\u001b\b\u0003\u001c\t\u0003\u001d\n\u0003\u001e\u000b\u0003!\f\u0003",
    "\"\r\u0003)\u000e\u0003*\u000f"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function LUFileLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

LUFileLexer.prototype = Object.create(antlr4.Lexer.prototype);
LUFileLexer.prototype.constructor = LUFileLexer;

Object.defineProperty(LUFileLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

LUFileLexer.EOF = antlr4.Token.EOF;
LUFileLexer.MODEL_INFO = 1;
LUFileLexer.COMMENT = 2;
LUFileLexer.WS = 3;
LUFileLexer.NEWLINE = 4;
LUFileLexer.QNA = 5;
LUFileLexer.DOUBLE_HASH = 6;
LUFileLexer.HASH = 7;
LUFileLexer.DASH = 8;
LUFileLexer.DOLLAR = 9;
LUFileLexer.IMPORT_DESC = 10;
LUFileLexer.IMPORT_PATH = 11;
LUFileLexer.FILTER_MARK = 12;
LUFileLexer.MULTI_LINE_TEXT = 13;
LUFileLexer.INVALID_TOKEN_DEFAULT_MODE = 14;
LUFileLexer.WS_IN_NAME_IGNORED = 15;
LUFileLexer.IDENTIFIER = 16;
LUFileLexer.DOT = 17;
LUFileLexer.WS_IN_BODY_IGNORED = 18;
LUFileLexer.ESCAPE_CHARACTER = 19;
LUFileLexer.EXPRESSION = 20;
LUFileLexer.TEXT = 21;
LUFileLexer.WS_IN_ENTITY_IGNORED = 22;
LUFileLexer.ENTITY_IDENTIFIER = 23;
LUFileLexer.COMPOSITE_ENTITY = 24;
LUFileLexer.REGEX_ENTITY = 25;
LUFileLexer.COLON_MARK = 26;
LUFileLexer.SPECIAL_CHAR_MARK = 27;
LUFileLexer.WS_IN_QNA_IGNORED = 28;
LUFileLexer.QNA_TEXT = 29;

LUFileLexer.INTENT_NAME_MODE = 1;
LUFileLexer.INTENT_BODY_MODE = 2;
LUFileLexer.ENTITY_MODE = 3;
LUFileLexer.QNA_MODE = 4;

LUFileLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

LUFileLexer.prototype.modeNames = [ "DEFAULT_MODE", "INTENT_NAME_MODE", 
                                    "INTENT_BODY_MODE", "ENTITY_MODE", "QNA_MODE" ];

LUFileLexer.prototype.literalNames = [ null, null, null, null, null, null, 
                                       null, null, null, null, null, null, 
                                       "'**Filters:**'", null, null, null, 
                                       null, "'.'", null, null, null, null, 
                                       null, null, null, null, "':'" ];

LUFileLexer.prototype.symbolicNames = [ null, "MODEL_INFO", "COMMENT", "WS", 
                                        "NEWLINE", "QNA", "DOUBLE_HASH", 
                                        "HASH", "DASH", "DOLLAR", "IMPORT_DESC", 
                                        "IMPORT_PATH", "FILTER_MARK", "MULTI_LINE_TEXT", 
                                        "INVALID_TOKEN_DEFAULT_MODE", "WS_IN_NAME_IGNORED", 
                                        "IDENTIFIER", "DOT", "WS_IN_BODY_IGNORED", 
                                        "ESCAPE_CHARACTER", "EXPRESSION", 
                                        "TEXT", "WS_IN_ENTITY_IGNORED", 
                                        "ENTITY_IDENTIFIER", "COMPOSITE_ENTITY", 
                                        "REGEX_ENTITY", "COLON_MARK", "SPECIAL_CHAR_MARK", 
                                        "WS_IN_QNA_IGNORED", "QNA_TEXT" ];

LUFileLexer.prototype.ruleNames = [ "LETTER", "NUMBER", "WHITESPACE", "UTTERANCE_MARK", 
                                    "MODEL_INFO", "COMMENT", "WS", "NEWLINE", 
                                    "QNA", "DOUBLE_HASH", "HASH", "DASH", 
                                    "DOLLAR", "IMPORT_DESC", "IMPORT_PATH", 
                                    "FILTER_MARK", "MULTI_LINE_TEXT", "INVALID_TOKEN_DEFAULT_MODE", 
                                    "WS_IN_NAME_IGNORED", "WS_IN_NAME", 
                                    "NEWLINE_IN_NAME", "IDENTIFIER", "DOT", 
                                    "WS_IN_BODY_IGNORED", "WS_IN_BODY", 
                                    "NEWLINE_IN_BODY", "ESCAPE_CHARACTER", 
                                    "EXPRESSION", "TEXT", "WS_IN_ENTITY_IGNORED", 
                                    "WS_IN_ENTITY", "NEWLINE_IN_ENTITY", 
                                    "ENTITY_IDENTIFIER", "COMPOSITE_ENTITY", 
                                    "REGEX_ENTITY", "COLON_MARK", "SPECIAL_CHAR_MARK", 
                                    "WS_IN_QNA_IGNORED", "WS_IN_QNA", "NEWLINE_IN_QNA", 
                                    "QNA_TEXT" ];

LUFileLexer.prototype.grammarFileName = "LUFileLexer.g4";


  ignoreWS = true;             // usually we ignore whitespace, but inside template, whitespace is significant


LUFileLexer.prototype.action = function(localctx, ruleIndex, actionIndex) {
	switch (ruleIndex) {
	case 8:
		this.QNA_action(localctx, actionIndex);
		break;
	case 9:
		this.DOUBLE_HASH_action(localctx, actionIndex);
		break;
	case 10:
		this.HASH_action(localctx, actionIndex);
		break;
	case 11:
		this.DASH_action(localctx, actionIndex);
		break;
	case 12:
		this.DOLLAR_action(localctx, actionIndex);
		break;
	case 21:
		this.IDENTIFIER_action(localctx, actionIndex);
		break;
	case 25:
		this.NEWLINE_IN_BODY_action(localctx, actionIndex);
		break;
	case 26:
		this.ESCAPE_CHARACTER_action(localctx, actionIndex);
		break;
	case 27:
		this.EXPRESSION_action(localctx, actionIndex);
		break;
	case 28:
		this.TEXT_action(localctx, actionIndex);
		break;
	case 31:
		this.NEWLINE_IN_ENTITY_action(localctx, actionIndex);
		break;
	case 32:
		this.ENTITY_IDENTIFIER_action(localctx, actionIndex);
		break;
	case 39:
		this.NEWLINE_IN_QNA_action(localctx, actionIndex);
		break;
	case 40:
		this.QNA_TEXT_action(localctx, actionIndex);
		break;
	default:
		throw "No registered action for:" + ruleIndex;
	}
};


LUFileLexer.prototype.QNA_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 0:
		this.ignoreWS = false;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.DOUBLE_HASH_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 1:
		this.ignoreWS = true;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.HASH_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 2:
		this.ignoreWS = true;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.DASH_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 3:
		this.ignoreWS = true;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.DOLLAR_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 4:
		this.ignoreWS = true;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.IDENTIFIER_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 5:
		 this.ignoreWS = false;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.NEWLINE_IN_BODY_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 6:
		this.ignoreWS = true;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.ESCAPE_CHARACTER_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 7:
		 this.ignoreWS = false;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.EXPRESSION_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 8:
		 this.ignoreWS = false;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.TEXT_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 9:
		 this.ignoreWS = false;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.NEWLINE_IN_ENTITY_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 10:
		this.ignoreWS = true;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.ENTITY_IDENTIFIER_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 11:
		 this.ignoreWS = false;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.NEWLINE_IN_QNA_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 12:
		this.ignoreWS = true;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};

LUFileLexer.prototype.QNA_TEXT_action = function(localctx , actionIndex) {
	switch (actionIndex) {
	case 13:
		 this.ignoreWS = false;
		break;
	default:
		throw "No registered action for:" + actionIndex;
	}
};
LUFileLexer.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch (ruleIndex) {
		case 18:
			return this.WS_IN_NAME_IGNORED_sempred(localctx, predIndex);
		case 23:
			return this.WS_IN_BODY_IGNORED_sempred(localctx, predIndex);
		case 29:
			return this.WS_IN_ENTITY_IGNORED_sempred(localctx, predIndex);
		case 37:
			return this.WS_IN_QNA_IGNORED_sempred(localctx, predIndex);
    	default:
    		throw "No registered predicate for:" + ruleIndex;
    }
};

LUFileLexer.prototype.WS_IN_NAME_IGNORED_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.ignoreWS;
		default:
			throw "No predicate with index:" + predIndex;
	}
};

LUFileLexer.prototype.WS_IN_BODY_IGNORED_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 1:
			return this.ignoreWS;
		default:
			throw "No predicate with index:" + predIndex;
	}
};

LUFileLexer.prototype.WS_IN_ENTITY_IGNORED_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 2:
			return this.ignoreWS;
		default:
			throw "No predicate with index:" + predIndex;
	}
};

LUFileLexer.prototype.WS_IN_QNA_IGNORED_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 3:
			return this.ignoreWS;
		default:
			throw "No predicate with index:" + predIndex;
	}
};



exports.LUFileLexer = LUFileLexer;

