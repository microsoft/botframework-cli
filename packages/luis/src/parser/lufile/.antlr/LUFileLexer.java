// Generated from c:\repos\botframework-cli\packages\luis\src\parser\lufile/LUFileLexer.g4 by ANTLR 4.7.1
import org.antlr.v4.runtime.Lexer;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.Token;
import org.antlr.v4.runtime.TokenStream;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.misc.*;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class LUFileLexer extends Lexer {
	static { RuntimeMetaData.checkVersion("4.7.1", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		MODEL_INFO=1, COMMENT=2, WS=3, NEWLINE=4, QNA=5, HASH=6, DASH=7, DOLLAR=8, 
		AT=9, IMPORT_DESC=10, IMPORT_PATH=11, FILTER_MARK=12, MULTI_LINE_TEXT=13, 
		INVALID_TOKEN_DEFAULT_MODE=14, WS_IN_NEW_ENTITY_IGNORED=15, COMMA=16, 
		NEW_EQUAL=17, HAS_ROLES_LABEL=18, HAS_FEATURES_LABEL=19, NEW_ENTITY_TYPE_IDENTIFIER=20, 
		NEW_ENTITY_IDENTIFIER=21, NEW_ENTITY_IDENTIFIER_WITH_WS=22, NEW_COMPOSITE_ENTITY=23, 
		NEW_REGEX_ENTITY=24, NEW_TEXT=25, WS_IN_NAME_IGNORED=26, IDENTIFIER=27, 
		DOT=28, WS_IN_BODY_IGNORED=29, ESCAPE_CHARACTER=30, EXPRESSION=31, TEXT=32, 
		WS_IN_ENTITY_IGNORED=33, ENTITY_IDENTIFIER=34, COMPOSITE_ENTITY=35, REGEX_ENTITY=36, 
		COLON_MARK=37, SPECIAL_CHAR_MARK=38, WS_IN_QNA_IGNORED=39, QNA_TEXT=40;
	public static final int
		NEW_ENTITY_MODE=1, INTENT_NAME_MODE=2, INTENT_BODY_MODE=3, ENTITY_MODE=4, 
		QNA_MODE=5;
	public static String[] channelNames = {
		"DEFAULT_TOKEN_CHANNEL", "HIDDEN"
	};

	public static String[] modeNames = {
		"DEFAULT_MODE", "NEW_ENTITY_MODE", "INTENT_NAME_MODE", "INTENT_BODY_MODE", 
		"ENTITY_MODE", "QNA_MODE"
	};

	public static final String[] ruleNames = {
		"LETTER", "NUMBER", "WHITESPACE", "UTTERANCE_MARK", "MODEL_INFO", "COMMENT", 
		"WS", "NEWLINE", "QNA", "HASH", "DASH", "DOLLAR", "AT", "IMPORT_DESC", 
		"IMPORT_PATH", "FILTER_MARK", "MULTI_LINE_TEXT", "INVALID_TOKEN_DEFAULT_MODE", 
		"WS_IN_NEW_ENTITY_IGNORED", "WS_IN_NEW_ENTITY", "NEWLINE_IN_NEW_ENTITY", 
		"COMMA", "NEW_EQUAL", "HAS_ROLES_LABEL", "HAS_FEATURES_LABEL", "NEW_ENTITY_TYPE_IDENTIFIER", 
		"NEW_ENTITY_IDENTIFIER", "NEW_ENTITY_IDENTIFIER_WITH_WS", "NEW_COMPOSITE_ENTITY", 
		"NEW_REGEX_ENTITY", "NEW_TEXT", "WS_IN_NAME_IGNORED", "WS_IN_NAME", "NEWLINE_IN_NAME", 
		"IDENTIFIER", "DOT", "WS_IN_BODY_IGNORED", "WS_IN_BODY", "NEWLINE_IN_BODY", 
		"ESCAPE_CHARACTER", "EXPRESSION", "TEXT", "WS_IN_ENTITY_IGNORED", "WS_IN_ENTITY", 
		"NEWLINE_IN_ENTITY", "ENTITY_IDENTIFIER", "COMPOSITE_ENTITY", "REGEX_ENTITY", 
		"COLON_MARK", "SPECIAL_CHAR_MARK", "WS_IN_QNA_IGNORED", "WS_IN_QNA", "NEWLINE_IN_QNA", 
		"QNA_TEXT"
	};

	private static final String[] _LITERAL_NAMES = {
		null, null, null, null, null, null, null, null, null, null, null, null, 
		"'**Filters:**'", null, null, null, "','", "'='", null, null, null, null, 
		null, null, null, null, null, null, "'.'", null, null, null, null, null, 
		null, null, null, "':'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "MODEL_INFO", "COMMENT", "WS", "NEWLINE", "QNA", "HASH", "DASH", 
		"DOLLAR", "AT", "IMPORT_DESC", "IMPORT_PATH", "FILTER_MARK", "MULTI_LINE_TEXT", 
		"INVALID_TOKEN_DEFAULT_MODE", "WS_IN_NEW_ENTITY_IGNORED", "COMMA", "NEW_EQUAL", 
		"HAS_ROLES_LABEL", "HAS_FEATURES_LABEL", "NEW_ENTITY_TYPE_IDENTIFIER", 
		"NEW_ENTITY_IDENTIFIER", "NEW_ENTITY_IDENTIFIER_WITH_WS", "NEW_COMPOSITE_ENTITY", 
		"NEW_REGEX_ENTITY", "NEW_TEXT", "WS_IN_NAME_IGNORED", "IDENTIFIER", "DOT", 
		"WS_IN_BODY_IGNORED", "ESCAPE_CHARACTER", "EXPRESSION", "TEXT", "WS_IN_ENTITY_IGNORED", 
		"ENTITY_IDENTIFIER", "COMPOSITE_ENTITY", "REGEX_ENTITY", "COLON_MARK", 
		"SPECIAL_CHAR_MARK", "WS_IN_QNA_IGNORED", "QNA_TEXT"
	};
	public static final Vocabulary VOCABULARY = new VocabularyImpl(_LITERAL_NAMES, _SYMBOLIC_NAMES);

	/**
	 * @deprecated Use {@link #VOCABULARY} instead.
	 */
	@Deprecated
	public static final String[] tokenNames;
	static {
		tokenNames = new String[_SYMBOLIC_NAMES.length];
		for (int i = 0; i < tokenNames.length; i++) {
			tokenNames[i] = VOCABULARY.getLiteralName(i);
			if (tokenNames[i] == null) {
				tokenNames[i] = VOCABULARY.getSymbolicName(i);
			}

			if (tokenNames[i] == null) {
				tokenNames[i] = "<INVALID>";
			}
		}
	}

	@Override
	@Deprecated
	public String[] getTokenNames() {
		return tokenNames;
	}

	@Override

	public Vocabulary getVocabulary() {
		return VOCABULARY;
	}


	  this.ignoreWS = true;             // usually we ignore whitespace, but inside template, whitespace is significant


	public LUFileLexer(CharStream input) {
		super(input);
		_interp = new LexerATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}

	@Override
	public String getGrammarFileName() { return "LUFileLexer.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public String[] getChannelNames() { return channelNames; }

	@Override
	public String[] getModeNames() { return modeNames; }

	@Override
	public ATN getATN() { return _ATN; }

	@Override
	public void action(RuleContext _localctx, int ruleIndex, int actionIndex) {
		switch (ruleIndex) {
		case 8:
			QNA_action((RuleContext)_localctx, actionIndex);
			break;
		case 9:
			HASH_action((RuleContext)_localctx, actionIndex);
			break;
		case 10:
			DASH_action((RuleContext)_localctx, actionIndex);
			break;
		case 11:
			DOLLAR_action((RuleContext)_localctx, actionIndex);
			break;
		case 12:
			AT_action((RuleContext)_localctx, actionIndex);
			break;
		case 20:
			NEWLINE_IN_NEW_ENTITY_action((RuleContext)_localctx, actionIndex);
			break;
		case 34:
			IDENTIFIER_action((RuleContext)_localctx, actionIndex);
			break;
		case 38:
			NEWLINE_IN_BODY_action((RuleContext)_localctx, actionIndex);
			break;
		case 39:
			ESCAPE_CHARACTER_action((RuleContext)_localctx, actionIndex);
			break;
		case 40:
			EXPRESSION_action((RuleContext)_localctx, actionIndex);
			break;
		case 41:
			TEXT_action((RuleContext)_localctx, actionIndex);
			break;
		case 44:
			NEWLINE_IN_ENTITY_action((RuleContext)_localctx, actionIndex);
			break;
		case 45:
			ENTITY_IDENTIFIER_action((RuleContext)_localctx, actionIndex);
			break;
		case 52:
			NEWLINE_IN_QNA_action((RuleContext)_localctx, actionIndex);
			break;
		case 53:
			QNA_TEXT_action((RuleContext)_localctx, actionIndex);
			break;
		}
	}
	private void QNA_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 0:
			this.ignoreWS = false;
			break;
		}
	}
	private void HASH_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 1:
			this.ignoreWS = true;
			break;
		}
	}
	private void DASH_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 2:
			this.ignoreWS = true;
			break;
		}
	}
	private void DOLLAR_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 3:
			this.ignoreWS = true;
			break;
		}
	}
	private void AT_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 4:
			this.ignoreWS = true;
			break;
		}
	}
	private void NEWLINE_IN_NEW_ENTITY_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 5:
			this.ignoreWS = true;
			break;
		}
	}
	private void IDENTIFIER_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 6:
			 this.ignoreWS = false;
			break;
		}
	}
	private void NEWLINE_IN_BODY_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 7:
			this.ignoreWS = true;
			break;
		}
	}
	private void ESCAPE_CHARACTER_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 8:
			 this.ignoreWS = false;
			break;
		}
	}
	private void EXPRESSION_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 9:
			 this.ignoreWS = false;
			break;
		}
	}
	private void TEXT_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 10:
			 this.ignoreWS = false;
			break;
		}
	}
	private void NEWLINE_IN_ENTITY_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 11:
			this.ignoreWS = true;
			break;
		}
	}
	private void ENTITY_IDENTIFIER_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 12:
			 this.ignoreWS = false;
			break;
		}
	}
	private void NEWLINE_IN_QNA_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 13:
			this.ignoreWS = true;
			break;
		}
	}
	private void QNA_TEXT_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 14:
			 this.ignoreWS = false;
			break;
		}
	}
	@Override
	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 18:
			return WS_IN_NEW_ENTITY_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 31:
			return WS_IN_NAME_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 36:
			return WS_IN_BODY_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 42:
			return WS_IN_ENTITY_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 50:
			return WS_IN_QNA_IGNORED_sempred((RuleContext)_localctx, predIndex);
		}
		return true;
	}
	private boolean WS_IN_NEW_ENTITY_IGNORED_sempred(RuleContext _localctx, int predIndex) {
		switch (predIndex) {
		case 0:
			return this.ignoreWS;
		}
		return true;
	}
	private boolean WS_IN_NAME_IGNORED_sempred(RuleContext _localctx, int predIndex) {
		switch (predIndex) {
		case 1:
			return this.ignoreWS;
		}
		return true;
	}
	private boolean WS_IN_BODY_IGNORED_sempred(RuleContext _localctx, int predIndex) {
		switch (predIndex) {
		case 2:
			return this.ignoreWS;
		}
		return true;
	}
	private boolean WS_IN_ENTITY_IGNORED_sempred(RuleContext _localctx, int predIndex) {
		switch (predIndex) {
		case 3:
			return this.ignoreWS;
		}
		return true;
	}
	private boolean WS_IN_QNA_IGNORED_sempred(RuleContext _localctx, int predIndex) {
		switch (predIndex) {
		case 4:
			return this.ignoreWS;
		}
		return true;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2*\u025e\b\1\b\1\b"+
		"\1\b\1\b\1\b\1\4\2\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b"+
		"\4\t\t\t\4\n\t\n\4\13\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t"+
		"\20\4\21\t\21\4\22\t\22\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t"+
		"\27\4\30\t\30\4\31\t\31\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t"+
		"\36\4\37\t\37\4 \t \4!\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t"+
		"(\4)\t)\4*\t*\4+\t+\4,\t,\4-\t-\4.\t.\4/\t/\4\60\t\60\4\61\t\61\4\62\t"+
		"\62\4\63\t\63\4\64\t\64\4\65\t\65\4\66\t\66\4\67\t\67\3\2\3\2\3\3\3\3"+
		"\3\4\3\4\3\5\3\5\3\6\3\6\7\6\177\n\6\f\6\16\6\u0082\13\6\3\6\3\6\3\6\3"+
		"\6\6\6\u0088\n\6\r\6\16\6\u0089\3\7\3\7\6\7\u008e\n\7\r\7\16\7\u008f\3"+
		"\7\3\7\3\b\6\b\u0095\n\b\r\b\16\b\u0096\3\b\3\b\3\t\5\t\u009c\n\t\3\t"+
		"\3\t\3\t\3\t\3\n\6\n\u00a3\n\n\r\n\16\n\u00a4\3\n\6\n\u00a8\n\n\r\n\16"+
		"\n\u00a9\3\n\3\n\3\n\3\n\3\n\3\13\6\13\u00b2\n\13\r\13\16\13\u00b3\3\13"+
		"\3\13\3\13\3\13\3\f\3\f\3\f\3\f\3\f\3\r\3\r\3\r\3\r\3\r\3\16\3\16\3\16"+
		"\3\16\3\16\3\17\3\17\7\17\u00cb\n\17\f\17\16\17\u00ce\13\17\3\17\3\17"+
		"\3\20\3\20\7\20\u00d4\n\20\f\20\16\20\u00d7\13\20\3\20\3\20\3\21\3\21"+
		"\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\22\3\22\3\22"+
		"\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\7\22\u00f5\n\22\f\22"+
		"\16\22\u00f8\13\22\3\22\3\22\3\22\3\22\3\23\3\23\3\24\6\24\u0101\n\24"+
		"\r\24\16\24\u0102\3\24\3\24\3\24\3\24\3\25\6\25\u010a\n\25\r\25\16\25"+
		"\u010b\3\25\3\25\3\26\5\26\u0111\n\26\3\26\3\26\3\26\3\26\3\26\3\26\3"+
		"\27\3\27\3\30\3\30\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\3\31\5\31\u0126"+
		"\n\31\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\32"+
		"\5\32\u0135\n\32\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33"+
		"\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33"+
		"\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33"+
		"\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33"+
		"\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33\3\33"+
		"\5\33\u017a\n\33\3\34\3\34\3\34\6\34\u017f\n\34\r\34\16\34\u0180\3\35"+
		"\3\35\3\35\3\35\3\35\6\35\u0188\n\35\r\35\16\35\u0189\3\35\3\35\3\36\3"+
		"\36\7\36\u0190\n\36\f\36\16\36\u0193\13\36\3\36\3\36\3\37\3\37\7\37\u0199"+
		"\n\37\f\37\16\37\u019c\13\37\3\37\3\37\3 \6 \u01a1\n \r \16 \u01a2\3!"+
		"\6!\u01a6\n!\r!\16!\u01a7\3!\3!\3!\3!\3\"\6\"\u01af\n\"\r\"\16\"\u01b0"+
		"\3\"\3\"\3#\5#\u01b6\n#\3#\3#\3#\3#\3#\3$\3$\3$\5$\u01c0\n$\3$\3$\3$\7"+
		"$\u01c5\n$\f$\16$\u01c8\13$\3$\3$\3%\3%\3&\6&\u01cf\n&\r&\16&\u01d0\3"+
		"&\3&\3&\3&\3\'\6\'\u01d8\n\'\r\'\16\'\u01d9\3\'\3\'\3(\5(\u01df\n(\3("+
		"\3(\3(\3(\3(\3(\3)\3)\3)\3)\3)\3)\3)\3)\3)\5)\u01f0\n)\3*\3*\3*\3*\7*"+
		"\u01f6\n*\f*\16*\u01f9\13*\3*\7*\u01fc\n*\f*\16*\u01ff\13*\3*\3*\3*\3"+
		"+\6+\u0205\n+\r+\16+\u0206\3+\3+\3,\6,\u020c\n,\r,\16,\u020d\3,\3,\3,"+
		"\3,\3-\6-\u0215\n-\r-\16-\u0216\3-\3-\3.\5.\u021c\n.\3.\3.\3.\3.\3.\3"+
		".\3/\3/\3/\6/\u0227\n/\r/\16/\u0228\3/\3/\3\60\3\60\7\60\u022f\n\60\f"+
		"\60\16\60\u0232\13\60\3\61\3\61\7\61\u0236\n\61\f\61\16\61\u0239\13\61"+
		"\3\62\3\62\3\63\3\63\3\64\6\64\u0240\n\64\r\64\16\64\u0241\3\64\3\64\3"+
		"\64\3\64\3\65\6\65\u0249\n\65\r\65\16\65\u024a\3\65\3\65\3\66\5\66\u0250"+
		"\n\66\3\66\3\66\3\66\3\66\3\66\3\66\3\67\6\67\u0259\n\67\r\67\16\67\u025a"+
		"\3\67\3\67\5\u00cc\u00d5\u00f6\28\b\2\n\2\f\2\16\2\20\3\22\4\24\5\26\6"+
		"\30\7\32\b\34\t\36\n \13\"\f$\r&\16(\17*\20,\21.\2\60\2\62\22\64\23\66"+
		"\248\25:\26<\27>\30@\31B\32D\33F\34H\2J\2L\35N\36P\37R\2T\2V X!Z\"\\#"+
		"^\2`\2b$d%f&h\'j(l)n\2p\2r*\b\2\3\4\5\6\7\20\4\2C\\c|\6\2\13\13\"\"\u00a2"+
		"\u00a2\uff01\uff01\4\2,-//\4\2\f\f\17\17\6\2*+/\60aa~~\4\2$$))\5\2/\60"+
		"aa~~\b\2\f\f\17\17*+]]}}\177\177\t\2\13\f\17\17\"\"..??}}\177\177\4\2"+
		"//aa\7\2__ppttvv\177\177\6\2\f\f\17\17}}\177\177\7\2\13\f\17\17\"\"}}"+
		"\177\177\5\2##..??\2\u0293\2\20\3\2\2\2\2\22\3\2\2\2\2\24\3\2\2\2\2\26"+
		"\3\2\2\2\2\30\3\2\2\2\2\32\3\2\2\2\2\34\3\2\2\2\2\36\3\2\2\2\2 \3\2\2"+
		"\2\2\"\3\2\2\2\2$\3\2\2\2\2&\3\2\2\2\2(\3\2\2\2\2*\3\2\2\2\3,\3\2\2\2"+
		"\3.\3\2\2\2\3\60\3\2\2\2\3\62\3\2\2\2\3\64\3\2\2\2\3\66\3\2\2\2\38\3\2"+
		"\2\2\3:\3\2\2\2\3<\3\2\2\2\3>\3\2\2\2\3@\3\2\2\2\3B\3\2\2\2\3D\3\2\2\2"+
		"\4F\3\2\2\2\4H\3\2\2\2\4J\3\2\2\2\4L\3\2\2\2\4N\3\2\2\2\5P\3\2\2\2\5R"+
		"\3\2\2\2\5T\3\2\2\2\5V\3\2\2\2\5X\3\2\2\2\5Z\3\2\2\2\6\\\3\2\2\2\6^\3"+
		"\2\2\2\6`\3\2\2\2\6b\3\2\2\2\6d\3\2\2\2\6f\3\2\2\2\6h\3\2\2\2\6j\3\2\2"+
		"\2\7l\3\2\2\2\7n\3\2\2\2\7p\3\2\2\2\7r\3\2\2\2\bt\3\2\2\2\nv\3\2\2\2\f"+
		"x\3\2\2\2\16z\3\2\2\2\20|\3\2\2\2\22\u008b\3\2\2\2\24\u0094\3\2\2\2\26"+
		"\u009b\3\2\2\2\30\u00a2\3\2\2\2\32\u00b1\3\2\2\2\34\u00b9\3\2\2\2\36\u00be"+
		"\3\2\2\2 \u00c3\3\2\2\2\"\u00c8\3\2\2\2$\u00d1\3\2\2\2&\u00da\3\2\2\2"+
		"(\u00e7\3\2\2\2*\u00fd\3\2\2\2,\u0100\3\2\2\2.\u0109\3\2\2\2\60\u0110"+
		"\3\2\2\2\62\u0118\3\2\2\2\64\u011a\3\2\2\2\66\u011c\3\2\2\28\u0127\3\2"+
		"\2\2:\u0179\3\2\2\2<\u017e\3\2\2\2>\u0182\3\2\2\2@\u018d\3\2\2\2B\u0196"+
		"\3\2\2\2D\u01a0\3\2\2\2F\u01a5\3\2\2\2H\u01ae\3\2\2\2J\u01b5\3\2\2\2L"+
		"\u01bf\3\2\2\2N\u01cb\3\2\2\2P\u01ce\3\2\2\2R\u01d7\3\2\2\2T\u01de\3\2"+
		"\2\2V\u01ef\3\2\2\2X\u01f1\3\2\2\2Z\u0204\3\2\2\2\\\u020b\3\2\2\2^\u0214"+
		"\3\2\2\2`\u021b\3\2\2\2b\u0226\3\2\2\2d\u022c\3\2\2\2f\u0233\3\2\2\2h"+
		"\u023a\3\2\2\2j\u023c\3\2\2\2l\u023f\3\2\2\2n\u0248\3\2\2\2p\u024f\3\2"+
		"\2\2r\u0258\3\2\2\2tu\t\2\2\2u\t\3\2\2\2vw\4\62;\2w\13\3\2\2\2xy\t\3\2"+
		"\2y\r\3\2\2\2z{\t\4\2\2{\17\3\2\2\2|\u0080\7@\2\2}\177\5\f\4\2~}\3\2\2"+
		"\2\177\u0082\3\2\2\2\u0080~\3\2\2\2\u0080\u0081\3\2\2\2\u0081\u0083\3"+
		"\2\2\2\u0082\u0080\3\2\2\2\u0083\u0084\7#\2\2\u0084\u0085\7%\2\2\u0085"+
		"\u0087\3\2\2\2\u0086\u0088\n\5\2\2\u0087\u0086\3\2\2\2\u0088\u0089\3\2"+
		"\2\2\u0089\u0087\3\2\2\2\u0089\u008a\3\2\2\2\u008a\21\3\2\2\2\u008b\u008d"+
		"\7@\2\2\u008c\u008e\n\5\2\2\u008d\u008c\3\2\2\2\u008e\u008f\3\2\2\2\u008f"+
		"\u008d\3\2\2\2\u008f\u0090\3\2\2\2\u0090\u0091\3\2\2\2\u0091\u0092\b\7"+
		"\2\2\u0092\23\3\2\2\2\u0093\u0095\5\f\4\2\u0094\u0093\3\2\2\2\u0095\u0096"+
		"\3\2\2\2\u0096\u0094\3\2\2\2\u0096\u0097\3\2\2\2\u0097\u0098\3\2\2\2\u0098"+
		"\u0099\b\b\2\2\u0099\25\3\2\2\2\u009a\u009c\7\17\2\2\u009b\u009a\3\2\2"+
		"\2\u009b\u009c\3\2\2\2\u009c\u009d\3\2\2\2\u009d\u009e\7\f\2\2\u009e\u009f"+
		"\3\2\2\2\u009f\u00a0\b\t\2\2\u00a0\27\3\2\2\2\u00a1\u00a3\7%\2\2\u00a2"+
		"\u00a1\3\2\2\2\u00a3\u00a4\3\2\2\2\u00a4\u00a2\3\2\2\2\u00a4\u00a5\3\2"+
		"\2\2\u00a5\u00a7\3\2\2\2\u00a6\u00a8\5\f\4\2\u00a7\u00a6\3\2\2\2\u00a8"+
		"\u00a9\3\2\2\2\u00a9\u00a7\3\2\2\2\u00a9\u00aa\3\2\2\2\u00aa\u00ab\3\2"+
		"\2\2\u00ab\u00ac\7A\2\2\u00ac\u00ad\b\n\3\2\u00ad\u00ae\3\2\2\2\u00ae"+
		"\u00af\b\n\4\2\u00af\31\3\2\2\2\u00b0\u00b2\7%\2\2\u00b1\u00b0\3\2\2\2"+
		"\u00b2\u00b3\3\2\2\2\u00b3\u00b1\3\2\2\2\u00b3\u00b4\3\2\2\2\u00b4\u00b5"+
		"\3\2\2\2\u00b5\u00b6\b\13\5\2\u00b6\u00b7\3\2\2\2\u00b7\u00b8\b\13\6\2"+
		"\u00b8\33\3\2\2\2\u00b9\u00ba\5\16\5\2\u00ba\u00bb\b\f\7\2\u00bb\u00bc"+
		"\3\2\2\2\u00bc\u00bd\b\f\b\2\u00bd\35\3\2\2\2\u00be\u00bf\7&\2\2\u00bf"+
		"\u00c0\b\r\t\2\u00c0\u00c1\3\2\2\2\u00c1\u00c2\b\r\n\2\u00c2\37\3\2\2"+
		"\2\u00c3\u00c4\7B\2\2\u00c4\u00c5\b\16\13\2\u00c5\u00c6\3\2\2\2\u00c6"+
		"\u00c7\b\16\f\2\u00c7!\3\2\2\2\u00c8\u00cc\7]\2\2\u00c9\u00cb\13\2\2\2"+
		"\u00ca\u00c9\3\2\2\2\u00cb\u00ce\3\2\2\2\u00cc\u00cd\3\2\2\2\u00cc\u00ca"+
		"\3\2\2\2\u00cd\u00cf\3\2\2\2\u00ce\u00cc\3\2\2\2\u00cf\u00d0\7_\2\2\u00d0"+
		"#\3\2\2\2\u00d1\u00d5\7*\2\2\u00d2\u00d4\13\2\2\2\u00d3\u00d2\3\2\2\2"+
		"\u00d4\u00d7\3\2\2\2\u00d5\u00d6\3\2\2\2\u00d5\u00d3\3\2\2\2\u00d6\u00d8"+
		"\3\2\2\2\u00d7\u00d5\3\2\2\2\u00d8\u00d9\7+\2\2\u00d9%\3\2\2\2\u00da\u00db"+
		"\7,\2\2\u00db\u00dc\7,\2\2\u00dc\u00dd\7H\2\2\u00dd\u00de\7k\2\2\u00de"+
		"\u00df\7n\2\2\u00df\u00e0\7v\2\2\u00e0\u00e1\7g\2\2\u00e1\u00e2\7t\2\2"+
		"\u00e2\u00e3\7u\2\2\u00e3\u00e4\7<\2\2\u00e4\u00e5\7,\2\2\u00e5\u00e6"+
		"\7,\2\2\u00e6\'\3\2\2\2\u00e7\u00e8\7b\2\2\u00e8\u00e9\7b\2\2\u00e9\u00ea"+
		"\7b\2\2\u00ea\u00eb\7o\2\2\u00eb\u00ec\7c\2\2\u00ec\u00ed\7t\2\2\u00ed"+
		"\u00ee\7m\2\2\u00ee\u00ef\7f\2\2\u00ef\u00f0\7q\2\2\u00f0\u00f1\7y\2\2"+
		"\u00f1\u00f2\7p\2\2\u00f2\u00f6\3\2\2\2\u00f3\u00f5\13\2\2\2\u00f4\u00f3"+
		"\3\2\2\2\u00f5\u00f8\3\2\2\2\u00f6\u00f7\3\2\2\2\u00f6\u00f4\3\2\2\2\u00f7"+
		"\u00f9\3\2\2\2\u00f8\u00f6\3\2\2\2\u00f9\u00fa\7b\2\2\u00fa\u00fb\7b\2"+
		"\2\u00fb\u00fc\7b\2\2\u00fc)\3\2\2\2\u00fd\u00fe\13\2\2\2\u00fe+\3\2\2"+
		"\2\u00ff\u0101\5\f\4\2\u0100\u00ff\3\2\2\2\u0101\u0102\3\2\2\2\u0102\u0100"+
		"\3\2\2\2\u0102\u0103\3\2\2\2\u0103\u0104\3\2\2\2\u0104\u0105\6\24\2\2"+
		"\u0105\u0106\3\2\2\2\u0106\u0107\b\24\2\2\u0107-\3\2\2\2\u0108\u010a\5"+
		"\f\4\2\u0109\u0108\3\2\2\2\u010a\u010b\3\2\2\2\u010b\u0109\3\2\2\2\u010b"+
		"\u010c\3\2\2\2\u010c\u010d\3\2\2\2\u010d\u010e\b\25\r\2\u010e/\3\2\2\2"+
		"\u010f\u0111\7\17\2\2\u0110\u010f\3\2\2\2\u0110\u0111\3\2\2\2\u0111\u0112"+
		"\3\2\2\2\u0112\u0113\7\f\2\2\u0113\u0114\b\26\16\2\u0114\u0115\3\2\2\2"+
		"\u0115\u0116\b\26\17\2\u0116\u0117\b\26\20\2\u0117\61\3\2\2\2\u0118\u0119"+
		"\7.\2\2\u0119\63\3\2\2\2\u011a\u011b\7?\2\2\u011b\65\3\2\2\2\u011c\u011d"+
		"\7j\2\2\u011d\u011e\7c\2\2\u011e\u011f\7u\2\2\u011f\u0120\7T\2\2\u0120"+
		"\u0121\7q\2\2\u0121\u0122\7n\2\2\u0122\u0123\7g\2\2\u0123\u0125\3\2\2"+
		"\2\u0124\u0126\7u\2\2\u0125\u0124\3\2\2\2\u0125\u0126\3\2\2\2\u0126\67"+
		"\3\2\2\2\u0127\u0128\7w\2\2\u0128\u0129\7u\2\2\u0129\u012a\7g\2\2\u012a"+
		"\u012b\7u\2\2\u012b\u012c\7H\2\2\u012c\u012d\7g\2\2\u012d\u012e\7c\2\2"+
		"\u012e\u012f\7v\2\2\u012f\u0130\7w\2\2\u0130\u0131\7t\2\2\u0131\u0132"+
		"\7g\2\2\u0132\u0134\3\2\2\2\u0133\u0135\7u\2\2\u0134\u0133\3\2\2\2\u0134"+
		"\u0135\3\2\2\2\u01359\3\2\2\2\u0136\u0137\7u\2\2\u0137\u0138\7k\2\2\u0138"+
		"\u0139\7o\2\2\u0139\u013a\7r\2\2\u013a\u013b\7n\2\2\u013b\u017a\7g\2\2"+
		"\u013c\u013d\7n\2\2\u013d\u013e\7k\2\2\u013e\u013f\7u\2\2\u013f\u017a"+
		"\7v\2\2\u0140\u0141\7t\2\2\u0141\u0142\7g\2\2\u0142\u0143\7i\2\2\u0143"+
		"\u0144\7g\2\2\u0144\u017a\7z\2\2\u0145\u0146\7r\2\2\u0146\u0147\7t\2\2"+
		"\u0147\u0148\7g\2\2\u0148\u0149\7d\2\2\u0149\u014a\7w\2\2\u014a\u014b"+
		"\7k\2\2\u014b\u014c\7n\2\2\u014c\u017a\7v\2\2\u014d\u014e\7e\2\2\u014e"+
		"\u014f\7q\2\2\u014f\u0150\7o\2\2\u0150\u0151\7r\2\2\u0151\u0152\7q\2\2"+
		"\u0152\u0153\7u\2\2\u0153\u0154\7k\2\2\u0154\u0155\7v\2\2\u0155\u017a"+
		"\7g\2\2\u0156\u0157\7o\2\2\u0157\u0158\7c\2\2\u0158\u0159\7e\2\2\u0159"+
		"\u015a\7j\2\2\u015a\u015b\7k\2\2\u015b\u015c\7p\2\2\u015c\u015d\7g\2\2"+
		"\u015d\u015e\7/\2\2\u015e\u015f\7n\2\2\u015f\u0160\7g\2\2\u0160\u0161"+
		"\7c\2\2\u0161\u0162\7t\2\2\u0162\u0163\7p\2\2\u0163\u0164\7g\2\2\u0164"+
		"\u017a\7f\2\2\u0165\u0166\7r\2\2\u0166\u0167\7c\2\2\u0167\u0168\7v\2\2"+
		"\u0168\u0169\7v\2\2\u0169\u016a\7g\2\2\u016a\u016b\7t\2\2\u016b\u016c"+
		"\7p\2\2\u016c\u016d\7c\2\2\u016d\u016e\7p\2\2\u016e\u017a\7{\2\2\u016f"+
		"\u0170\7r\2\2\u0170\u0171\7j\2\2\u0171\u0172\7t\2\2\u0172\u0173\7c\2\2"+
		"\u0173\u0174\7u\2\2\u0174\u0175\7g\2\2\u0175\u0176\7n\2\2\u0176\u0177"+
		"\7k\2\2\u0177\u0178\7u\2\2\u0178\u017a\7v\2\2\u0179\u0136\3\2\2\2\u0179"+
		"\u013c\3\2\2\2\u0179\u0140\3\2\2\2\u0179\u0145\3\2\2\2\u0179\u014d\3\2"+
		"\2\2\u0179\u0156\3\2\2\2\u0179\u0165\3\2\2\2\u0179\u016f\3\2\2\2\u017a"+
		";\3\2\2\2\u017b\u017f\5\b\2\2\u017c\u017f\5\n\3\2\u017d\u017f\t\6\2\2"+
		"\u017e\u017b\3\2\2\2\u017e\u017c\3\2\2\2\u017e\u017d\3\2\2\2\u017f\u0180"+
		"\3\2\2\2\u0180\u017e\3\2\2\2\u0180\u0181\3\2\2\2\u0181=\3\2\2\2\u0182"+
		"\u0187\t\7\2\2\u0183\u0188\5\b\2\2\u0184\u0188\5\n\3\2\u0185\u0188\t\b"+
		"\2\2\u0186\u0188\5\24\b\2\u0187\u0183\3\2\2\2\u0187\u0184\3\2\2\2\u0187"+
		"\u0185\3\2\2\2\u0187\u0186\3\2\2\2\u0188\u0189\3\2\2\2\u0189\u0187\3\2"+
		"\2\2\u0189\u018a\3\2\2\2\u018a\u018b\3\2\2\2\u018b\u018c\t\7\2\2\u018c"+
		"?\3\2\2\2\u018d\u0191\7]\2\2\u018e\u0190\n\t\2\2\u018f\u018e\3\2\2\2\u0190"+
		"\u0193\3\2\2\2\u0191\u018f\3\2\2\2\u0191\u0192\3\2\2\2\u0192\u0194\3\2"+
		"\2\2\u0193\u0191\3\2\2\2\u0194\u0195\7_\2\2\u0195A\3\2\2\2\u0196\u019a"+
		"\7\61\2\2\u0197\u0199\n\5\2\2\u0198\u0197\3\2\2\2\u0199\u019c\3\2\2\2"+
		"\u019a\u0198\3\2\2\2\u019a\u019b\3\2\2\2\u019b\u019d\3\2\2\2\u019c\u019a"+
		"\3\2\2\2\u019d\u019e\7\61\2\2\u019eC\3\2\2\2\u019f\u01a1\n\n\2\2\u01a0"+
		"\u019f\3\2\2\2\u01a1\u01a2\3\2\2\2\u01a2\u01a0\3\2\2\2\u01a2\u01a3\3\2"+
		"\2\2\u01a3E\3\2\2\2\u01a4\u01a6\5\f\4\2\u01a5\u01a4\3\2\2\2\u01a6\u01a7"+
		"\3\2\2\2\u01a7\u01a5\3\2\2\2\u01a7\u01a8\3\2\2\2\u01a8\u01a9\3\2\2\2\u01a9"+
		"\u01aa\6!\3\2\u01aa\u01ab\3\2\2\2\u01ab\u01ac\b!\2\2\u01acG\3\2\2\2\u01ad"+
		"\u01af\5\f\4\2\u01ae\u01ad\3\2\2\2\u01af\u01b0\3\2\2\2\u01b0\u01ae\3\2"+
		"\2\2\u01b0\u01b1\3\2\2\2\u01b1\u01b2\3\2\2\2\u01b2\u01b3\b\"\r\2\u01b3"+
		"I\3\2\2\2\u01b4\u01b6\7\17\2\2\u01b5\u01b4\3\2\2\2\u01b5\u01b6\3\2\2\2"+
		"\u01b6\u01b7\3\2\2\2\u01b7\u01b8\7\f\2\2\u01b8\u01b9\3\2\2\2\u01b9\u01ba"+
		"\b#\17\2\u01ba\u01bb\b#\20\2\u01bbK\3\2\2\2\u01bc\u01c0\5\b\2\2\u01bd"+
		"\u01c0\5\n\3\2\u01be\u01c0\7a\2\2\u01bf\u01bc\3\2\2\2\u01bf\u01bd\3\2"+
		"\2\2\u01bf\u01be\3\2\2\2\u01c0\u01c6\3\2\2\2\u01c1\u01c5\5\b\2\2\u01c2"+
		"\u01c5\5\n\3\2\u01c3\u01c5\t\13\2\2\u01c4\u01c1\3\2\2\2\u01c4\u01c2\3"+
		"\2\2\2\u01c4\u01c3\3\2\2\2\u01c5\u01c8\3\2\2\2\u01c6\u01c4\3\2\2\2\u01c6"+
		"\u01c7\3\2\2\2\u01c7\u01c9\3\2\2\2\u01c8\u01c6\3\2\2\2\u01c9\u01ca\b$"+
		"\21\2\u01caM\3\2\2\2\u01cb\u01cc\7\60\2\2\u01ccO\3\2\2\2\u01cd\u01cf\5"+
		"\f\4\2\u01ce\u01cd\3\2\2\2\u01cf\u01d0\3\2\2\2\u01d0\u01ce\3\2\2\2\u01d0"+
		"\u01d1\3\2\2\2\u01d1\u01d2\3\2\2\2\u01d2\u01d3\6&\4\2\u01d3\u01d4\3\2"+
		"\2\2\u01d4\u01d5\b&\2\2\u01d5Q\3\2\2\2\u01d6\u01d8\5\f\4\2\u01d7\u01d6"+
		"\3\2\2\2\u01d8\u01d9\3\2\2\2\u01d9\u01d7\3\2\2\2\u01d9\u01da\3\2\2\2\u01da"+
		"\u01db\3\2\2\2\u01db\u01dc\b\'\r\2\u01dcS\3\2\2\2\u01dd\u01df\7\17\2\2"+
		"\u01de\u01dd\3\2\2\2\u01de\u01df\3\2\2\2\u01df\u01e0\3\2\2\2\u01e0\u01e1"+
		"\7\f\2\2\u01e1\u01e2\b(\22\2\u01e2\u01e3\3\2\2\2\u01e3\u01e4\b(\17\2\u01e4"+
		"\u01e5\b(\20\2\u01e5U\3\2\2\2\u01e6\u01e7\7^\2\2\u01e7\u01f0\7}\2\2\u01e8"+
		"\u01e9\7^\2\2\u01e9\u01f0\7]\2\2\u01ea\u01eb\7^\2\2\u01eb\u01f0\7^\2\2"+
		"\u01ec\u01ed\7^\2\2\u01ed\u01ee\t\f\2\2\u01ee\u01f0\b)\23\2\u01ef\u01e6"+
		"\3\2\2\2\u01ef\u01e8\3\2\2\2\u01ef\u01ea\3\2\2\2\u01ef\u01ec\3\2\2\2\u01f0"+
		"W\3\2\2\2\u01f1\u01fd\7}\2\2\u01f2\u01fc\n\r\2\2\u01f3\u01f7\7}\2\2\u01f4"+
		"\u01f6\n\5\2\2\u01f5\u01f4\3\2\2\2\u01f6\u01f9\3\2\2\2\u01f7\u01f5\3\2"+
		"\2\2\u01f7\u01f8\3\2\2\2\u01f8\u01fa\3\2\2\2\u01f9\u01f7\3\2\2\2\u01fa"+
		"\u01fc\7\177\2\2\u01fb\u01f2\3\2\2\2\u01fb\u01f3\3\2\2\2\u01fc\u01ff\3"+
		"\2\2\2\u01fd\u01fb\3\2\2\2\u01fd\u01fe\3\2\2\2\u01fe\u0200\3\2\2\2\u01ff"+
		"\u01fd\3\2\2\2\u0200\u0201\7\177\2\2\u0201\u0202\b*\24\2\u0202Y\3\2\2"+
		"\2\u0203\u0205\n\16\2\2\u0204\u0203\3\2\2\2\u0205\u0206\3\2\2\2\u0206"+
		"\u0204\3\2\2\2\u0206\u0207\3\2\2\2\u0207\u0208\3\2\2\2\u0208\u0209\b+"+
		"\25\2\u0209[\3\2\2\2\u020a\u020c\5\f\4\2\u020b\u020a\3\2\2\2\u020c\u020d"+
		"\3\2\2\2\u020d\u020b\3\2\2\2\u020d\u020e\3\2\2\2\u020e\u020f\3\2\2\2\u020f"+
		"\u0210\6,\5\2\u0210\u0211\3\2\2\2\u0211\u0212\b,\2\2\u0212]\3\2\2\2\u0213"+
		"\u0215\5\f\4\2\u0214\u0213\3\2\2\2\u0215\u0216\3\2\2\2\u0216\u0214\3\2"+
		"\2\2\u0216\u0217\3\2\2\2\u0217\u0218\3\2\2\2\u0218\u0219\b-\r\2\u0219"+
		"_\3\2\2\2\u021a\u021c\7\17\2\2\u021b\u021a\3\2\2\2\u021b\u021c\3\2\2\2"+
		"\u021c\u021d\3\2\2\2\u021d\u021e\7\f\2\2\u021e\u021f\b.\26\2\u021f\u0220"+
		"\3\2\2\2\u0220\u0221\b.\17\2\u0221\u0222\b.\20\2\u0222a\3\2\2\2\u0223"+
		"\u0227\5\b\2\2\u0224\u0227\5\n\3\2\u0225\u0227\t\b\2\2\u0226\u0223\3\2"+
		"\2\2\u0226\u0224\3\2\2\2\u0226\u0225\3\2\2\2\u0227\u0228\3\2\2\2\u0228"+
		"\u0226\3\2\2\2\u0228\u0229\3\2\2\2\u0229\u022a\3\2\2\2\u022a\u022b\b/"+
		"\27\2\u022bc\3\2\2\2\u022c\u0230\7]\2\2\u022d\u022f\n\t\2\2\u022e\u022d"+
		"\3\2\2\2\u022f\u0232\3\2\2\2\u0230\u022e\3\2\2\2\u0230\u0231\3\2\2\2\u0231"+
		"e\3\2\2\2\u0232\u0230\3\2\2\2\u0233\u0237\7\61\2\2\u0234\u0236\n\5\2\2"+
		"\u0235\u0234\3\2\2\2\u0236\u0239\3\2\2\2\u0237\u0235\3\2\2\2\u0237\u0238"+
		"\3\2\2\2\u0238g\3\2\2\2\u0239\u0237\3\2\2\2\u023a\u023b\7<\2\2\u023bi"+
		"\3\2\2\2\u023c\u023d\t\17\2\2\u023dk\3\2\2\2\u023e\u0240\5\f\4\2\u023f"+
		"\u023e\3\2\2\2\u0240\u0241\3\2\2\2\u0241\u023f\3\2\2\2\u0241\u0242\3\2"+
		"\2\2\u0242\u0243\3\2\2\2\u0243\u0244\6\64\6\2\u0244\u0245\3\2\2\2\u0245"+
		"\u0246\b\64\2\2\u0246m\3\2\2\2\u0247\u0249\5\f\4\2\u0248\u0247\3\2\2\2"+
		"\u0249\u024a\3\2\2\2\u024a\u0248\3\2\2\2\u024a\u024b\3\2\2\2\u024b\u024c"+
		"\3\2\2\2\u024c\u024d\b\65\r\2\u024do\3\2\2\2\u024e\u0250\7\17\2\2\u024f"+
		"\u024e\3\2\2\2\u024f\u0250\3\2\2\2\u0250\u0251\3\2\2\2\u0251\u0252\7\f"+
		"\2\2\u0252\u0253\b\66\30\2\u0253\u0254\3\2\2\2\u0254\u0255\b\66\17\2\u0255"+
		"\u0256\b\66\20\2\u0256q\3\2\2\2\u0257\u0259\n\16\2\2\u0258\u0257\3\2\2"+
		"\2\u0259\u025a\3\2\2\2\u025a\u0258\3\2\2\2\u025a\u025b\3\2\2\2\u025b\u025c"+
		"\3\2\2\2\u025c\u025d\b\67\31\2\u025ds\3\2\2\29\2\3\4\5\6\7\u0080\u0089"+
		"\u008f\u0096\u009b\u00a4\u00a9\u00b3\u00cc\u00d5\u00f6\u0102\u010b\u0110"+
		"\u0125\u0134\u0179\u017e\u0180\u0187\u0189\u0191\u019a\u01a2\u01a7\u01b0"+
		"\u01b5\u01bf\u01c4\u01c6\u01d0\u01d9\u01de\u01ef\u01f7\u01fb\u01fd\u0206"+
		"\u020d\u0216\u021b\u0226\u0228\u0230\u0237\u0241\u024a\u024f\u025a\32"+
		"\b\2\2\3\n\2\7\7\2\3\13\3\7\4\2\3\f\4\7\5\2\3\r\5\7\6\2\3\16\6\7\3\2\t"+
		"\5\2\3\26\7\t\6\2\6\2\2\3$\b\3(\t\3)\n\3*\13\3+\f\3.\r\3/\16\3\66\17\3"+
		"\67\20";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}