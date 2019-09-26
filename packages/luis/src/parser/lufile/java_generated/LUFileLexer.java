// Generated from LUFileLexer.g4 by ANTLR 4.7.2
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
	static { RuntimeMetaData.checkVersion("4.7.2", RuntimeMetaData.VERSION); }

	protected static final DFA[] _decisionToDFA;
	protected static final PredictionContextCache _sharedContextCache =
		new PredictionContextCache();
	public static final int
		MODEL_INFO=1, COMMENT=2, WS=3, NEWLINE=4, QNA=5, HASH=6, DASH=7, DOLLAR=8, 
		AT=9, IMPORT_DESC=10, IMPORT_PATH=11, FILTER_MARK=12, MULTI_LINE_TEXT=13, 
		INVALID_TOKEN_DEFAULT_MODE=14, NEW_EQUAL=15, NEW_COMPOSITE_DECORATION_LEFT=16, 
		NEW_COMPOSITE_DECORATION_RIGHT=17, NEW_REGEX_DECORATION=18, SINGLE_QUOTE=19, 
		DOUBLE_QUOTE=20, HAS_ROLES_LABEL=21, HAS_FEATURES_LABEL=22, WS_IN_NEW_ENTITY_IGNORED=23, 
		NEW_ENTITY_IDENTIFIER=24, NEW_COMPOSITE_ENTITY=25, NEW_REGEX_ENTITY=26, 
		NEW_SPECIAL_CHAR_MARK=27, NEW_ENTITY_TYPE_IDENTIFIER=28, NEW_TEXT=29, 
		WS_IN_NAME_IGNORED=30, IDENTIFIER=31, DOT=32, WS_IN_BODY_IGNORED=33, ESCAPE_CHARACTER=34, 
		EXPRESSION=35, TEXT=36, WS_IN_ENTITY_IGNORED=37, ENTITY_IDENTIFIER=38, 
		COMPOSITE_ENTITY=39, REGEX_ENTITY=40, COLON_MARK=41, SPECIAL_CHAR_MARK=42, 
		WS_IN_QNA_IGNORED=43, QNA_TEXT=44;
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

	private static String[] makeRuleNames() {
		return new String[] {
			"LETTER", "NUMBER", "WHITESPACE", "UTTERANCE_MARK", "MODEL_INFO", "COMMENT", 
			"WS", "NEWLINE", "QNA", "HASH", "DASH", "DOLLAR", "AT", "IMPORT_DESC", 
			"IMPORT_PATH", "FILTER_MARK", "MULTI_LINE_TEXT", "INVALID_TOKEN_DEFAULT_MODE", 
			"NEW_EQUAL", "NEW_COMPOSITE_DECORATION_LEFT", "NEW_COMPOSITE_DECORATION_RIGHT", 
			"NEW_REGEX_DECORATION", "SINGLE_QUOTE", "DOUBLE_QUOTE", "HAS_ROLES_LABEL", 
			"HAS_FEATURES_LABEL", "WS_IN_NEW_ENTITY_IGNORED", "WS_IN_NEW_ENTITY", 
			"NEWLINE_IN_NEW_ENTITY", "NEW_ENTITY_IDENTIFIER", "NEW_COMPOSITE_ENTITY", 
			"NEW_REGEX_ENTITY", "NEW_SPECIAL_CHAR_MARK", "NEW_ENTITY_TYPE_IDENTIFIER", 
			"NEW_TEXT", "WS_IN_NAME_IGNORED", "WS_IN_NAME", "NEWLINE_IN_NAME", "IDENTIFIER", 
			"DOT", "WS_IN_BODY_IGNORED", "WS_IN_BODY", "NEWLINE_IN_BODY", "ESCAPE_CHARACTER", 
			"EXPRESSION", "TEXT", "WS_IN_ENTITY_IGNORED", "WS_IN_ENTITY", "NEWLINE_IN_ENTITY", 
			"ENTITY_IDENTIFIER", "COMPOSITE_ENTITY", "REGEX_ENTITY", "COLON_MARK", 
			"SPECIAL_CHAR_MARK", "WS_IN_QNA_IGNORED", "WS_IN_QNA", "NEWLINE_IN_QNA", 
			"QNA_TEXT"
		};
	}
	public static final String[] ruleNames = makeRuleNames();

	private static String[] makeLiteralNames() {
		return new String[] {
			null, null, null, null, null, null, null, null, null, null, null, null, 
			"'**Filters:**'", null, null, "'='", "'['", "']'", "'/'", "'''", "'\"'", 
			"'hasRoles'", null, null, null, null, null, null, null, null, null, null, 
			"'.'", null, null, null, null, null, null, null, null, "':'"
		};
	}
	private static final String[] _LITERAL_NAMES = makeLiteralNames();
	private static String[] makeSymbolicNames() {
		return new String[] {
			null, "MODEL_INFO", "COMMENT", "WS", "NEWLINE", "QNA", "HASH", "DASH", 
			"DOLLAR", "AT", "IMPORT_DESC", "IMPORT_PATH", "FILTER_MARK", "MULTI_LINE_TEXT", 
			"INVALID_TOKEN_DEFAULT_MODE", "NEW_EQUAL", "NEW_COMPOSITE_DECORATION_LEFT", 
			"NEW_COMPOSITE_DECORATION_RIGHT", "NEW_REGEX_DECORATION", "SINGLE_QUOTE", 
			"DOUBLE_QUOTE", "HAS_ROLES_LABEL", "HAS_FEATURES_LABEL", "WS_IN_NEW_ENTITY_IGNORED", 
			"NEW_ENTITY_IDENTIFIER", "NEW_COMPOSITE_ENTITY", "NEW_REGEX_ENTITY", 
			"NEW_SPECIAL_CHAR_MARK", "NEW_ENTITY_TYPE_IDENTIFIER", "NEW_TEXT", "WS_IN_NAME_IGNORED", 
			"IDENTIFIER", "DOT", "WS_IN_BODY_IGNORED", "ESCAPE_CHARACTER", "EXPRESSION", 
			"TEXT", "WS_IN_ENTITY_IGNORED", "ENTITY_IDENTIFIER", "COMPOSITE_ENTITY", 
			"REGEX_ENTITY", "COLON_MARK", "SPECIAL_CHAR_MARK", "WS_IN_QNA_IGNORED", 
			"QNA_TEXT"
		};
	}
	private static final String[] _SYMBOLIC_NAMES = makeSymbolicNames();
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
		case 28:
			NEWLINE_IN_NEW_ENTITY_action((RuleContext)_localctx, actionIndex);
			break;
		case 29:
			NEW_ENTITY_IDENTIFIER_action((RuleContext)_localctx, actionIndex);
			break;
		case 34:
			NEW_TEXT_action((RuleContext)_localctx, actionIndex);
			break;
		case 38:
			IDENTIFIER_action((RuleContext)_localctx, actionIndex);
			break;
		case 42:
			NEWLINE_IN_BODY_action((RuleContext)_localctx, actionIndex);
			break;
		case 43:
			ESCAPE_CHARACTER_action((RuleContext)_localctx, actionIndex);
			break;
		case 44:
			EXPRESSION_action((RuleContext)_localctx, actionIndex);
			break;
		case 45:
			TEXT_action((RuleContext)_localctx, actionIndex);
			break;
		case 48:
			NEWLINE_IN_ENTITY_action((RuleContext)_localctx, actionIndex);
			break;
		case 49:
			ENTITY_IDENTIFIER_action((RuleContext)_localctx, actionIndex);
			break;
		case 56:
			NEWLINE_IN_QNA_action((RuleContext)_localctx, actionIndex);
			break;
		case 57:
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
	private void NEW_ENTITY_IDENTIFIER_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 6:
			 this.ignoreWS = false;
			break;
		}
	}
	private void NEW_TEXT_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 7:
			 this.ignoreWS = false;
			break;
		}
	}
	private void IDENTIFIER_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 8:
			 this.ignoreWS = false;
			break;
		}
	}
	private void NEWLINE_IN_BODY_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 9:
			this.ignoreWS = true;
			break;
		}
	}
	private void ESCAPE_CHARACTER_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 10:
			 this.ignoreWS = false;
			break;
		}
	}
	private void EXPRESSION_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 11:
			 this.ignoreWS = false;
			break;
		}
	}
	private void TEXT_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 12:
			 this.ignoreWS = false;
			break;
		}
	}
	private void NEWLINE_IN_ENTITY_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 13:
			this.ignoreWS = true;
			break;
		}
	}
	private void ENTITY_IDENTIFIER_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 14:
			 this.ignoreWS = false;
			break;
		}
	}
	private void NEWLINE_IN_QNA_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 15:
			this.ignoreWS = true;
			break;
		}
	}
	private void QNA_TEXT_action(RuleContext _localctx, int actionIndex) {
		switch (actionIndex) {
		case 16:
			 this.ignoreWS = false;
			break;
		}
	}
	@Override
	public boolean sempred(RuleContext _localctx, int ruleIndex, int predIndex) {
		switch (ruleIndex) {
		case 26:
			return WS_IN_NEW_ENTITY_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 35:
			return WS_IN_NAME_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 40:
			return WS_IN_BODY_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 46:
			return WS_IN_ENTITY_IGNORED_sempred((RuleContext)_localctx, predIndex);
		case 54:
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
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\2.\u0246\b\1\b\1\b"+
		"\1\b\1\b\1\b\1\4\2\t\2\4\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b"+
		"\4\t\t\t\4\n\t\n\4\13\t\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t"+
		"\20\4\21\t\21\4\22\t\22\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t"+
		"\27\4\30\t\30\4\31\t\31\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t"+
		"\36\4\37\t\37\4 \t \4!\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t"+
		"(\4)\t)\4*\t*\4+\t+\4,\t,\4-\t-\4.\t.\4/\t/\4\60\t\60\4\61\t\61\4\62\t"+
		"\62\4\63\t\63\4\64\t\64\4\65\t\65\4\66\t\66\4\67\t\67\48\t8\49\t9\4:\t"+
		":\4;\t;\3\2\3\2\3\3\3\3\3\4\3\4\3\5\3\5\3\6\3\6\7\6\u0087\n\6\f\6\16\6"+
		"\u008a\13\6\3\6\3\6\3\6\3\6\6\6\u0090\n\6\r\6\16\6\u0091\3\7\3\7\6\7\u0096"+
		"\n\7\r\7\16\7\u0097\3\7\3\7\3\b\6\b\u009d\n\b\r\b\16\b\u009e\3\b\3\b\3"+
		"\t\5\t\u00a4\n\t\3\t\3\t\3\t\3\t\3\n\6\n\u00ab\n\n\r\n\16\n\u00ac\3\n"+
		"\6\n\u00b0\n\n\r\n\16\n\u00b1\3\n\3\n\3\n\3\n\3\n\3\13\6\13\u00ba\n\13"+
		"\r\13\16\13\u00bb\3\13\3\13\3\13\3\13\3\f\3\f\3\f\3\f\3\f\3\r\3\r\3\r"+
		"\3\r\3\r\3\16\3\16\3\16\3\16\3\16\3\17\3\17\7\17\u00d3\n\17\f\17\16\17"+
		"\u00d6\13\17\3\17\3\17\3\20\3\20\7\20\u00dc\n\20\f\20\16\20\u00df\13\20"+
		"\3\20\3\20\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21\3\21"+
		"\3\21\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22\3\22"+
		"\7\22\u00fd\n\22\f\22\16\22\u0100\13\22\3\22\3\22\3\22\3\22\3\23\3\23"+
		"\3\24\3\24\3\25\3\25\3\26\3\26\3\27\3\27\3\30\3\30\3\31\3\31\3\32\3\32"+
		"\3\32\3\32\3\32\3\32\3\32\3\32\3\32\3\33\3\33\3\33\3\33\3\33\3\33\3\33"+
		"\3\33\3\33\3\33\3\33\3\33\3\33\5\33\u012a\n\33\3\34\6\34\u012d\n\34\r"+
		"\34\16\34\u012e\3\34\3\34\3\34\3\34\3\35\6\35\u0136\n\35\r\35\16\35\u0137"+
		"\3\35\3\35\3\36\5\36\u013d\n\36\3\36\3\36\3\36\3\36\3\36\3\36\3\37\3\37"+
		"\3\37\6\37\u0148\n\37\r\37\16\37\u0149\3\37\3\37\3 \3 \7 \u0150\n \f "+
		"\16 \u0153\13 \3!\3!\7!\u0157\n!\f!\16!\u015a\13!\3\"\3\"\3#\3#\3#\3#"+
		"\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#"+
		"\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\3#\5#\u0184\n#\3$\6$\u0187\n$\r$\16$\u0188"+
		"\3$\3$\3%\6%\u018e\n%\r%\16%\u018f\3%\3%\3%\3%\3&\6&\u0197\n&\r&\16&\u0198"+
		"\3&\3&\3\'\5\'\u019e\n\'\3\'\3\'\3\'\3\'\3\'\3(\3(\3(\5(\u01a8\n(\3(\3"+
		"(\3(\7(\u01ad\n(\f(\16(\u01b0\13(\3(\3(\3)\3)\3*\6*\u01b7\n*\r*\16*\u01b8"+
		"\3*\3*\3*\3*\3+\6+\u01c0\n+\r+\16+\u01c1\3+\3+\3,\5,\u01c7\n,\3,\3,\3"+
		",\3,\3,\3,\3-\3-\3-\3-\3-\3-\3-\3-\3-\5-\u01d8\n-\3.\3.\3.\3.\7.\u01de"+
		"\n.\f.\16.\u01e1\13.\3.\7.\u01e4\n.\f.\16.\u01e7\13.\3.\3.\3.\3/\6/\u01ed"+
		"\n/\r/\16/\u01ee\3/\3/\3\60\6\60\u01f4\n\60\r\60\16\60\u01f5\3\60\3\60"+
		"\3\60\3\60\3\61\6\61\u01fd\n\61\r\61\16\61\u01fe\3\61\3\61\3\62\5\62\u0204"+
		"\n\62\3\62\3\62\3\62\3\62\3\62\3\62\3\63\3\63\3\63\6\63\u020f\n\63\r\63"+
		"\16\63\u0210\3\63\3\63\3\64\3\64\7\64\u0217\n\64\f\64\16\64\u021a\13\64"+
		"\3\65\3\65\7\65\u021e\n\65\f\65\16\65\u0221\13\65\3\66\3\66\3\67\3\67"+
		"\38\68\u0228\n8\r8\168\u0229\38\38\38\38\39\69\u0231\n9\r9\169\u0232\3"+
		"9\39\3:\5:\u0238\n:\3:\3:\3:\3:\3:\3:\3;\6;\u0241\n;\r;\16;\u0242\3;\3"+
		";\5\u00d4\u00dd\u00fe\2<\b\2\n\2\f\2\16\2\20\3\22\4\24\5\26\6\30\7\32"+
		"\b\34\t\36\n \13\"\f$\r&\16(\17*\20,\21.\22\60\23\62\24\64\25\66\268\27"+
		":\30<\31>\2@\2B\32D\33F\34H\35J\36L\37N P\2R\2T!V\"X#Z\2\\\2^$`%b&d\'"+
		"f\2h\2j(l)n*p+r,t-v\2x\2z.\b\2\3\4\5\6\7\16\4\2C\\c|\6\2\13\13\"\"\u00a2"+
		"\u00a2\uff01\uff01\4\2,-//\4\2\f\f\17\17\5\2/\60aa~~\b\2\f\f\17\17*+]"+
		"]}}\177\177\5\2##..??\b\2\13\f\17\17\"\"??}}\177\177\4\2//aa\7\2__ppt"+
		"tvv\177\177\6\2\f\f\17\17}}\177\177\7\2\13\f\17\17\"\"}}\177\177\2\u0274"+
		"\2\20\3\2\2\2\2\22\3\2\2\2\2\24\3\2\2\2\2\26\3\2\2\2\2\30\3\2\2\2\2\32"+
		"\3\2\2\2\2\34\3\2\2\2\2\36\3\2\2\2\2 \3\2\2\2\2\"\3\2\2\2\2$\3\2\2\2\2"+
		"&\3\2\2\2\2(\3\2\2\2\2*\3\2\2\2\3,\3\2\2\2\3.\3\2\2\2\3\60\3\2\2\2\3\62"+
		"\3\2\2\2\3\64\3\2\2\2\3\66\3\2\2\2\38\3\2\2\2\3:\3\2\2\2\3<\3\2\2\2\3"+
		">\3\2\2\2\3@\3\2\2\2\3B\3\2\2\2\3D\3\2\2\2\3F\3\2\2\2\3H\3\2\2\2\3J\3"+
		"\2\2\2\3L\3\2\2\2\4N\3\2\2\2\4P\3\2\2\2\4R\3\2\2\2\4T\3\2\2\2\4V\3\2\2"+
		"\2\5X\3\2\2\2\5Z\3\2\2\2\5\\\3\2\2\2\5^\3\2\2\2\5`\3\2\2\2\5b\3\2\2\2"+
		"\6d\3\2\2\2\6f\3\2\2\2\6h\3\2\2\2\6j\3\2\2\2\6l\3\2\2\2\6n\3\2\2\2\6p"+
		"\3\2\2\2\6r\3\2\2\2\7t\3\2\2\2\7v\3\2\2\2\7x\3\2\2\2\7z\3\2\2\2\b|\3\2"+
		"\2\2\n~\3\2\2\2\f\u0080\3\2\2\2\16\u0082\3\2\2\2\20\u0084\3\2\2\2\22\u0093"+
		"\3\2\2\2\24\u009c\3\2\2\2\26\u00a3\3\2\2\2\30\u00aa\3\2\2\2\32\u00b9\3"+
		"\2\2\2\34\u00c1\3\2\2\2\36\u00c6\3\2\2\2 \u00cb\3\2\2\2\"\u00d0\3\2\2"+
		"\2$\u00d9\3\2\2\2&\u00e2\3\2\2\2(\u00ef\3\2\2\2*\u0105\3\2\2\2,\u0107"+
		"\3\2\2\2.\u0109\3\2\2\2\60\u010b\3\2\2\2\62\u010d\3\2\2\2\64\u010f\3\2"+
		"\2\2\66\u0111\3\2\2\28\u0113\3\2\2\2:\u011c\3\2\2\2<\u012c\3\2\2\2>\u0135"+
		"\3\2\2\2@\u013c\3\2\2\2B\u0147\3\2\2\2D\u014d\3\2\2\2F\u0154\3\2\2\2H"+
		"\u015b\3\2\2\2J\u0183\3\2\2\2L\u0186\3\2\2\2N\u018d\3\2\2\2P\u0196\3\2"+
		"\2\2R\u019d\3\2\2\2T\u01a7\3\2\2\2V\u01b3\3\2\2\2X\u01b6\3\2\2\2Z\u01bf"+
		"\3\2\2\2\\\u01c6\3\2\2\2^\u01d7\3\2\2\2`\u01d9\3\2\2\2b\u01ec\3\2\2\2"+
		"d\u01f3\3\2\2\2f\u01fc\3\2\2\2h\u0203\3\2\2\2j\u020e\3\2\2\2l\u0214\3"+
		"\2\2\2n\u021b\3\2\2\2p\u0222\3\2\2\2r\u0224\3\2\2\2t\u0227\3\2\2\2v\u0230"+
		"\3\2\2\2x\u0237\3\2\2\2z\u0240\3\2\2\2|}\t\2\2\2}\t\3\2\2\2~\177\4\62"+
		";\2\177\13\3\2\2\2\u0080\u0081\t\3\2\2\u0081\r\3\2\2\2\u0082\u0083\t\4"+
		"\2\2\u0083\17\3\2\2\2\u0084\u0088\7@\2\2\u0085\u0087\5\f\4\2\u0086\u0085"+
		"\3\2\2\2\u0087\u008a\3\2\2\2\u0088\u0086\3\2\2\2\u0088\u0089\3\2\2\2\u0089"+
		"\u008b\3\2\2\2\u008a\u0088\3\2\2\2\u008b\u008c\7#\2\2\u008c\u008d\7%\2"+
		"\2\u008d\u008f\3\2\2\2\u008e\u0090\n\5\2\2\u008f\u008e\3\2\2\2\u0090\u0091"+
		"\3\2\2\2\u0091\u008f\3\2\2\2\u0091\u0092\3\2\2\2\u0092\21\3\2\2\2\u0093"+
		"\u0095\7@\2\2\u0094\u0096\n\5\2\2\u0095\u0094\3\2\2\2\u0096\u0097\3\2"+
		"\2\2\u0097\u0095\3\2\2\2\u0097\u0098\3\2\2\2\u0098\u0099\3\2\2\2\u0099"+
		"\u009a\b\7\2\2\u009a\23\3\2\2\2\u009b\u009d\5\f\4\2\u009c\u009b\3\2\2"+
		"\2\u009d\u009e\3\2\2\2\u009e\u009c\3\2\2\2\u009e\u009f\3\2\2\2\u009f\u00a0"+
		"\3\2\2\2\u00a0\u00a1\b\b\2\2\u00a1\25\3\2\2\2\u00a2\u00a4\7\17\2\2\u00a3"+
		"\u00a2\3\2\2\2\u00a3\u00a4\3\2\2\2\u00a4\u00a5\3\2\2\2\u00a5\u00a6\7\f"+
		"\2\2\u00a6\u00a7\3\2\2\2\u00a7\u00a8\b\t\2\2\u00a8\27\3\2\2\2\u00a9\u00ab"+
		"\7%\2\2\u00aa\u00a9\3\2\2\2\u00ab\u00ac\3\2\2\2\u00ac\u00aa\3\2\2\2\u00ac"+
		"\u00ad\3\2\2\2\u00ad\u00af\3\2\2\2\u00ae\u00b0\5\f\4\2\u00af\u00ae\3\2"+
		"\2\2\u00b0\u00b1\3\2\2\2\u00b1\u00af\3\2\2\2\u00b1\u00b2\3\2\2\2\u00b2"+
		"\u00b3\3\2\2\2\u00b3\u00b4\7A\2\2\u00b4\u00b5\b\n\3\2\u00b5\u00b6\3\2"+
		"\2\2\u00b6\u00b7\b\n\4\2\u00b7\31\3\2\2\2\u00b8\u00ba\7%\2\2\u00b9\u00b8"+
		"\3\2\2\2\u00ba\u00bb\3\2\2\2\u00bb\u00b9\3\2\2\2\u00bb\u00bc\3\2\2\2\u00bc"+
		"\u00bd\3\2\2\2\u00bd\u00be\b\13\5\2\u00be\u00bf\3\2\2\2\u00bf\u00c0\b"+
		"\13\6\2\u00c0\33\3\2\2\2\u00c1\u00c2\5\16\5\2\u00c2\u00c3\b\f\7\2\u00c3"+
		"\u00c4\3\2\2\2\u00c4\u00c5\b\f\b\2\u00c5\35\3\2\2\2\u00c6\u00c7\7&\2\2"+
		"\u00c7\u00c8\b\r\t\2\u00c8\u00c9\3\2\2\2\u00c9\u00ca\b\r\n\2\u00ca\37"+
		"\3\2\2\2\u00cb\u00cc\7B\2\2\u00cc\u00cd\b\16\13\2\u00cd\u00ce\3\2\2\2"+
		"\u00ce\u00cf\b\16\f\2\u00cf!\3\2\2\2\u00d0\u00d4\7]\2\2\u00d1\u00d3\13"+
		"\2\2\2\u00d2\u00d1\3\2\2\2\u00d3\u00d6\3\2\2\2\u00d4\u00d5\3\2\2\2\u00d4"+
		"\u00d2\3\2\2\2\u00d5\u00d7\3\2\2\2\u00d6\u00d4\3\2\2\2\u00d7\u00d8\7_"+
		"\2\2\u00d8#\3\2\2\2\u00d9\u00dd\7*\2\2\u00da\u00dc\13\2\2\2\u00db\u00da"+
		"\3\2\2\2\u00dc\u00df\3\2\2\2\u00dd\u00de\3\2\2\2\u00dd\u00db\3\2\2\2\u00de"+
		"\u00e0\3\2\2\2\u00df\u00dd\3\2\2\2\u00e0\u00e1\7+\2\2\u00e1%\3\2\2\2\u00e2"+
		"\u00e3\7,\2\2\u00e3\u00e4\7,\2\2\u00e4\u00e5\7H\2\2\u00e5\u00e6\7k\2\2"+
		"\u00e6\u00e7\7n\2\2\u00e7\u00e8\7v\2\2\u00e8\u00e9\7g\2\2\u00e9\u00ea"+
		"\7t\2\2\u00ea\u00eb\7u\2\2\u00eb\u00ec\7<\2\2\u00ec\u00ed\7,\2\2\u00ed"+
		"\u00ee\7,\2\2\u00ee\'\3\2\2\2\u00ef\u00f0\7b\2\2\u00f0\u00f1\7b\2\2\u00f1"+
		"\u00f2\7b\2\2\u00f2\u00f3\7o\2\2\u00f3\u00f4\7c\2\2\u00f4\u00f5\7t\2\2"+
		"\u00f5\u00f6\7m\2\2\u00f6\u00f7\7f\2\2\u00f7\u00f8\7q\2\2\u00f8\u00f9"+
		"\7y\2\2\u00f9\u00fa\7p\2\2\u00fa\u00fe\3\2\2\2\u00fb\u00fd\13\2\2\2\u00fc"+
		"\u00fb\3\2\2\2\u00fd\u0100\3\2\2\2\u00fe\u00ff\3\2\2\2\u00fe\u00fc\3\2"+
		"\2\2\u00ff\u0101\3\2\2\2\u0100\u00fe\3\2\2\2\u0101\u0102\7b\2\2\u0102"+
		"\u0103\7b\2\2\u0103\u0104\7b\2\2\u0104)\3\2\2\2\u0105\u0106\13\2\2\2\u0106"+
		"+\3\2\2\2\u0107\u0108\7?\2\2\u0108-\3\2\2\2\u0109\u010a\7]\2\2\u010a/"+
		"\3\2\2\2\u010b\u010c\7_\2\2\u010c\61\3\2\2\2\u010d\u010e\7\61\2\2\u010e"+
		"\63\3\2\2\2\u010f\u0110\7)\2\2\u0110\65\3\2\2\2\u0111\u0112\7$\2\2\u0112"+
		"\67\3\2\2\2\u0113\u0114\7j\2\2\u0114\u0115\7c\2\2\u0115\u0116\7u\2\2\u0116"+
		"\u0117\7T\2\2\u0117\u0118\7q\2\2\u0118\u0119\7n\2\2\u0119\u011a\7g\2\2"+
		"\u011a\u011b\7u\2\2\u011b9\3\2\2\2\u011c\u011d\7w\2\2\u011d\u011e\7u\2"+
		"\2\u011e\u011f\7g\2\2\u011f\u0120\7u\2\2\u0120\u0121\7H\2\2\u0121\u0122"+
		"\7g\2\2\u0122\u0123\7c\2\2\u0123\u0124\7v\2\2\u0124\u0125\7w\2\2\u0125"+
		"\u0126\7t\2\2\u0126\u0127\7g\2\2\u0127\u0129\3\2\2\2\u0128\u012a\7u\2"+
		"\2\u0129\u0128\3\2\2\2\u0129\u012a\3\2\2\2\u012a;\3\2\2\2\u012b\u012d"+
		"\5\f\4\2\u012c\u012b\3\2\2\2\u012d\u012e\3\2\2\2\u012e\u012c\3\2\2\2\u012e"+
		"\u012f\3\2\2\2\u012f\u0130\3\2\2\2\u0130\u0131\6\34\2\2\u0131\u0132\3"+
		"\2\2\2\u0132\u0133\b\34\2\2\u0133=\3\2\2\2\u0134\u0136\5\f\4\2\u0135\u0134"+
		"\3\2\2\2\u0136\u0137\3\2\2\2\u0137\u0135\3\2\2\2\u0137\u0138\3\2\2\2\u0138"+
		"\u0139\3\2\2\2\u0139\u013a\b\35\r\2\u013a?\3\2\2\2\u013b\u013d\7\17\2"+
		"\2\u013c\u013b\3\2\2\2\u013c\u013d\3\2\2\2\u013d\u013e\3\2\2\2\u013e\u013f"+
		"\7\f\2\2\u013f\u0140\b\36\16\2\u0140\u0141\3\2\2\2\u0141\u0142\b\36\17"+
		"\2\u0142\u0143\b\36\20\2\u0143A\3\2\2\2\u0144\u0148\5\b\2\2\u0145\u0148"+
		"\5\n\3\2\u0146\u0148\t\6\2\2\u0147\u0144\3\2\2\2\u0147\u0145\3\2\2\2\u0147"+
		"\u0146\3\2\2\2\u0148\u0149\3\2\2\2\u0149\u0147\3\2\2\2\u0149\u014a\3\2"+
		"\2\2\u014a\u014b\3\2\2\2\u014b\u014c\b\37\21\2\u014cC\3\2\2\2\u014d\u0151"+
		"\7]\2\2\u014e\u0150\n\7\2\2\u014f\u014e\3\2\2\2\u0150\u0153\3\2\2\2\u0151"+
		"\u014f\3\2\2\2\u0151\u0152\3\2\2\2\u0152E\3\2\2\2\u0153\u0151\3\2\2\2"+
		"\u0154\u0158\7\61\2\2\u0155\u0157\n\5\2\2\u0156\u0155\3\2\2\2\u0157\u015a"+
		"\3\2\2\2\u0158\u0156\3\2\2\2\u0158\u0159\3\2\2\2\u0159G\3\2\2\2\u015a"+
		"\u0158\3\2\2\2\u015b\u015c\t\b\2\2\u015cI\3\2\2\2\u015d\u015e\7u\2\2\u015e"+
		"\u015f\7k\2\2\u015f\u0160\7o\2\2\u0160\u0161\7r\2\2\u0161\u0162\7n\2\2"+
		"\u0162\u0184\7g\2\2\u0163\u0164\7n\2\2\u0164\u0165\7k\2\2\u0165\u0166"+
		"\7u\2\2\u0166\u0184\7v\2\2\u0167\u0168\7t\2\2\u0168\u0169\7g\2\2\u0169"+
		"\u016a\7i\2\2\u016a\u016b\7g\2\2\u016b\u0184\7z\2\2\u016c\u016d\7r\2\2"+
		"\u016d\u016e\7t\2\2\u016e\u016f\7g\2\2\u016f\u0170\7d\2\2\u0170\u0171"+
		"\7w\2\2\u0171\u0172\7k\2\2\u0172\u0173\7n\2\2\u0173\u0184\7v\2\2\u0174"+
		"\u0175\7e\2\2\u0175\u0176\7q\2\2\u0176\u0177\7o\2\2\u0177\u0178\7r\2\2"+
		"\u0178\u0179\7q\2\2\u0179\u017a\7u\2\2\u017a\u017b\7k\2\2\u017b\u017c"+
		"\7v\2\2\u017c\u0184\7g\2\2\u017d\u017e\7p\2\2\u017e\u017f\7f\2\2\u017f"+
		"\u0180\7g\2\2\u0180\u0181\7r\2\2\u0181\u0182\7v\2\2\u0182\u0184\7j\2\2"+
		"\u0183\u015d\3\2\2\2\u0183\u0163\3\2\2\2\u0183\u0167\3\2\2\2\u0183\u016c"+
		"\3\2\2\2\u0183\u0174\3\2\2\2\u0183\u017d\3\2\2\2\u0184K\3\2\2\2\u0185"+
		"\u0187\n\t\2\2\u0186\u0185\3\2\2\2\u0187\u0188\3\2\2\2\u0188\u0186\3\2"+
		"\2\2\u0188\u0189\3\2\2\2\u0189\u018a\3\2\2\2\u018a\u018b\b$\22\2\u018b"+
		"M\3\2\2\2\u018c\u018e\5\f\4\2\u018d\u018c\3\2\2\2\u018e\u018f\3\2\2\2"+
		"\u018f\u018d\3\2\2\2\u018f\u0190\3\2\2\2\u0190\u0191\3\2\2\2\u0191\u0192"+
		"\6%\3\2\u0192\u0193\3\2\2\2\u0193\u0194\b%\2\2\u0194O\3\2\2\2\u0195\u0197"+
		"\5\f\4\2\u0196\u0195\3\2\2\2\u0197\u0198\3\2\2\2\u0198\u0196\3\2\2\2\u0198"+
		"\u0199\3\2\2\2\u0199\u019a\3\2\2\2\u019a\u019b\b&\r\2\u019bQ\3\2\2\2\u019c"+
		"\u019e\7\17\2\2\u019d\u019c\3\2\2\2\u019d\u019e\3\2\2\2\u019e\u019f\3"+
		"\2\2\2\u019f\u01a0\7\f\2\2\u01a0\u01a1\3\2\2\2\u01a1\u01a2\b\'\17\2\u01a2"+
		"\u01a3\b\'\20\2\u01a3S\3\2\2\2\u01a4\u01a8\5\b\2\2\u01a5\u01a8\5\n\3\2"+
		"\u01a6\u01a8\7a\2\2\u01a7\u01a4\3\2\2\2\u01a7\u01a5\3\2\2\2\u01a7\u01a6"+
		"\3\2\2\2\u01a8\u01ae\3\2\2\2\u01a9\u01ad\5\b\2\2\u01aa\u01ad\5\n\3\2\u01ab"+
		"\u01ad\t\n\2\2\u01ac\u01a9\3\2\2\2\u01ac\u01aa\3\2\2\2\u01ac\u01ab\3\2"+
		"\2\2\u01ad\u01b0\3\2\2\2\u01ae\u01ac\3\2\2\2\u01ae\u01af\3\2\2\2\u01af"+
		"\u01b1\3\2\2\2\u01b0\u01ae\3\2\2\2\u01b1\u01b2\b(\23\2\u01b2U\3\2\2\2"+
		"\u01b3\u01b4\7\60\2\2\u01b4W\3\2\2\2\u01b5\u01b7\5\f\4\2\u01b6\u01b5\3"+
		"\2\2\2\u01b7\u01b8\3\2\2\2\u01b8\u01b6\3\2\2\2\u01b8\u01b9\3\2\2\2\u01b9"+
		"\u01ba\3\2\2\2\u01ba\u01bb\6*\4\2\u01bb\u01bc\3\2\2\2\u01bc\u01bd\b*\2"+
		"\2\u01bdY\3\2\2\2\u01be\u01c0\5\f\4\2\u01bf\u01be\3\2\2\2\u01c0\u01c1"+
		"\3\2\2\2\u01c1\u01bf\3\2\2\2\u01c1\u01c2\3\2\2\2\u01c2\u01c3\3\2\2\2\u01c3"+
		"\u01c4\b+\r\2\u01c4[\3\2\2\2\u01c5\u01c7\7\17\2\2\u01c6\u01c5\3\2\2\2"+
		"\u01c6\u01c7\3\2\2\2\u01c7\u01c8\3\2\2\2\u01c8\u01c9\7\f\2\2\u01c9\u01ca"+
		"\b,\24\2\u01ca\u01cb\3\2\2\2\u01cb\u01cc\b,\17\2\u01cc\u01cd\b,\20\2\u01cd"+
		"]\3\2\2\2\u01ce\u01cf\7^\2\2\u01cf\u01d8\7}\2\2\u01d0\u01d1\7^\2\2\u01d1"+
		"\u01d8\7]\2\2\u01d2\u01d3\7^\2\2\u01d3\u01d8\7^\2\2\u01d4\u01d5\7^\2\2"+
		"\u01d5\u01d6\t\13\2\2\u01d6\u01d8\b-\25\2\u01d7\u01ce\3\2\2\2\u01d7\u01d0"+
		"\3\2\2\2\u01d7\u01d2\3\2\2\2\u01d7\u01d4\3\2\2\2\u01d8_\3\2\2\2\u01d9"+
		"\u01e5\7}\2\2\u01da\u01e4\n\f\2\2\u01db\u01df\7}\2\2\u01dc\u01de\n\5\2"+
		"\2\u01dd\u01dc\3\2\2\2\u01de\u01e1\3\2\2\2\u01df\u01dd\3\2\2\2\u01df\u01e0"+
		"\3\2\2\2\u01e0\u01e2\3\2\2\2\u01e1\u01df\3\2\2\2\u01e2\u01e4\7\177\2\2"+
		"\u01e3\u01da\3\2\2\2\u01e3\u01db\3\2\2\2\u01e4\u01e7\3\2\2\2\u01e5\u01e3"+
		"\3\2\2\2\u01e5\u01e6\3\2\2\2\u01e6\u01e8\3\2\2\2\u01e7\u01e5\3\2\2\2\u01e8"+
		"\u01e9\7\177\2\2\u01e9\u01ea\b.\26\2\u01eaa\3\2\2\2\u01eb\u01ed\n\r\2"+
		"\2\u01ec\u01eb\3\2\2\2\u01ed\u01ee\3\2\2\2\u01ee\u01ec\3\2\2\2\u01ee\u01ef"+
		"\3\2\2\2\u01ef\u01f0\3\2\2\2\u01f0\u01f1\b/\27\2\u01f1c\3\2\2\2\u01f2"+
		"\u01f4\5\f\4\2\u01f3\u01f2\3\2\2\2\u01f4\u01f5\3\2\2\2\u01f5\u01f3\3\2"+
		"\2\2\u01f5\u01f6\3\2\2\2\u01f6\u01f7\3\2\2\2\u01f7\u01f8\6\60\5\2\u01f8"+
		"\u01f9\3\2\2\2\u01f9\u01fa\b\60\2\2\u01fae\3\2\2\2\u01fb\u01fd\5\f\4\2"+
		"\u01fc\u01fb\3\2\2\2\u01fd\u01fe\3\2\2\2\u01fe\u01fc\3\2\2\2\u01fe\u01ff"+
		"\3\2\2\2\u01ff\u0200\3\2\2\2\u0200\u0201\b\61\r\2\u0201g\3\2\2\2\u0202"+
		"\u0204\7\17\2\2\u0203\u0202\3\2\2\2\u0203\u0204\3\2\2\2\u0204\u0205\3"+
		"\2\2\2\u0205\u0206\7\f\2\2\u0206\u0207\b\62\30\2\u0207\u0208\3\2\2\2\u0208"+
		"\u0209\b\62\17\2\u0209\u020a\b\62\20\2\u020ai\3\2\2\2\u020b\u020f\5\b"+
		"\2\2\u020c\u020f\5\n\3\2\u020d\u020f\t\6\2\2\u020e\u020b\3\2\2\2\u020e"+
		"\u020c\3\2\2\2\u020e\u020d\3\2\2\2\u020f\u0210\3\2\2\2\u0210\u020e\3\2"+
		"\2\2\u0210\u0211\3\2\2\2\u0211\u0212\3\2\2\2\u0212\u0213\b\63\31\2\u0213"+
		"k\3\2\2\2\u0214\u0218\7]\2\2\u0215\u0217\n\7\2\2\u0216\u0215\3\2\2\2\u0217"+
		"\u021a\3\2\2\2\u0218\u0216\3\2\2\2\u0218\u0219\3\2\2\2\u0219m\3\2\2\2"+
		"\u021a\u0218\3\2\2\2\u021b\u021f\7\61\2\2\u021c\u021e\n\5\2\2\u021d\u021c"+
		"\3\2\2\2\u021e\u0221\3\2\2\2\u021f\u021d\3\2\2\2\u021f\u0220\3\2\2\2\u0220"+
		"o\3\2\2\2\u0221\u021f\3\2\2\2\u0222\u0223\7<\2\2\u0223q\3\2\2\2\u0224"+
		"\u0225\t\b\2\2\u0225s\3\2\2\2\u0226\u0228\5\f\4\2\u0227\u0226\3\2\2\2"+
		"\u0228\u0229\3\2\2\2\u0229\u0227\3\2\2\2\u0229\u022a\3\2\2\2\u022a\u022b"+
		"\3\2\2\2\u022b\u022c\68\6\2\u022c\u022d\3\2\2\2\u022d\u022e\b8\2\2\u022e"+
		"u\3\2\2\2\u022f\u0231\5\f\4\2\u0230\u022f\3\2\2\2\u0231\u0232\3\2\2\2"+
		"\u0232\u0230\3\2\2\2\u0232\u0233\3\2\2\2\u0233\u0234\3\2\2\2\u0234\u0235"+
		"\b9\r\2\u0235w\3\2\2\2\u0236\u0238\7\17\2\2\u0237\u0236\3\2\2\2\u0237"+
		"\u0238\3\2\2\2\u0238\u0239\3\2\2\2\u0239\u023a\7\f\2\2\u023a\u023b\b:"+
		"\32\2\u023b\u023c\3\2\2\2\u023c\u023d\b:\17\2\u023d\u023e\b:\20\2\u023e"+
		"y\3\2\2\2\u023f\u0241\n\r\2\2\u0240\u023f\3\2\2\2\u0241\u0242\3\2\2\2"+
		"\u0242\u0240\3\2\2\2\u0242\u0243\3\2\2\2\u0243\u0244\3\2\2\2\u0244\u0245"+
		"\b;\33\2\u0245{\3\2\2\2\66\2\3\4\5\6\7\u0088\u0091\u0097\u009e\u00a3\u00ac"+
		"\u00b1\u00bb\u00d4\u00dd\u00fe\u0129\u012e\u0137\u013c\u0147\u0149\u0151"+
		"\u0158\u0183\u0188\u018f\u0198\u019d\u01a7\u01ac\u01ae\u01b8\u01c1\u01c6"+
		"\u01d7\u01df\u01e3\u01e5\u01ee\u01f5\u01fe\u0203\u020e\u0210\u0218\u021f"+
		"\u0229\u0232\u0237\u0242\34\b\2\2\3\n\2\7\7\2\3\13\3\7\4\2\3\f\4\7\5\2"+
		"\3\r\5\7\6\2\3\16\6\7\3\2\t\5\2\3\36\7\t\6\2\6\2\2\3\37\b\3$\t\3(\n\3"+
		",\13\3-\f\3.\r\3/\16\3\62\17\3\63\20\3:\21\3;\22";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}