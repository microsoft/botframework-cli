// Generated from c:\repos\botframework-cli\packages\luis\src\parser\lufile\LUFileParser.g4 by ANTLR 4.7.1
import org.antlr.v4.runtime.atn.*;
import org.antlr.v4.runtime.dfa.DFA;
import org.antlr.v4.runtime.*;
import org.antlr.v4.runtime.misc.*;
import org.antlr.v4.runtime.tree.*;
import java.util.List;
import java.util.Iterator;
import java.util.ArrayList;

@SuppressWarnings({"all", "warnings", "unchecked", "unused", "cast"})
public class LUFileParser extends Parser {
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
		RULE_file = 0, RULE_paragraph = 1, RULE_newline = 2, RULE_intentDefinition = 3, 
		RULE_intentNameLine = 4, RULE_intentName = 5, RULE_intentNameIdentifier = 6, 
		RULE_intentBody = 7, RULE_normalIntentBody = 8, RULE_normalIntentString = 9, 
		RULE_newEntityDefinition = 10, RULE_newEntityListbody = 11, RULE_newEntityLine = 12, 
		RULE_newCompositeDefinition = 13, RULE_newRegexDefinition = 14, RULE_newEntityType = 15, 
		RULE_newEntityRoles = 16, RULE_newEntityUsesFeatures = 17, RULE_newEntityRoleOrFeatures = 18, 
		RULE_text = 19, RULE_newEntityName = 20, RULE_newEntityNameWithWS = 21, 
		RULE_entityDefinition = 22, RULE_entityLine = 23, RULE_entityName = 24, 
		RULE_entityType = 25, RULE_compositeEntityIdentifier = 26, RULE_regexEntityIdentifier = 27, 
		RULE_entityIdentifier = 28, RULE_entityListBody = 29, RULE_normalItemString = 30, 
		RULE_importDefinition = 31, RULE_qnaDefinition = 32, RULE_qnaQuestion = 33, 
		RULE_questionText = 34, RULE_moreQuestionsBody = 35, RULE_moreQuestion = 36, 
		RULE_qnaAnswerBody = 37, RULE_filterSection = 38, RULE_filterLine = 39, 
		RULE_multiLineAnswer = 40, RULE_modelInfoDefinition = 41;
	public static final String[] ruleNames = {
		"file", "paragraph", "newline", "intentDefinition", "intentNameLine", 
		"intentName", "intentNameIdentifier", "intentBody", "normalIntentBody", 
		"normalIntentString", "newEntityDefinition", "newEntityListbody", "newEntityLine", 
		"newCompositeDefinition", "newRegexDefinition", "newEntityType", "newEntityRoles", 
		"newEntityUsesFeatures", "newEntityRoleOrFeatures", "text", "newEntityName", 
		"newEntityNameWithWS", "entityDefinition", "entityLine", "entityName", 
		"entityType", "compositeEntityIdentifier", "regexEntityIdentifier", "entityIdentifier", 
		"entityListBody", "normalItemString", "importDefinition", "qnaDefinition", 
		"qnaQuestion", "questionText", "moreQuestionsBody", "moreQuestion", "qnaAnswerBody", 
		"filterSection", "filterLine", "multiLineAnswer", "modelInfoDefinition"
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

	@Override
	public String getGrammarFileName() { return "LUFileParser.g4"; }

	@Override
	public String[] getRuleNames() { return ruleNames; }

	@Override
	public String getSerializedATN() { return _serializedATN; }

	@Override
	public ATN getATN() { return _ATN; }

	public LUFileParser(TokenStream input) {
		super(input);
		_interp = new ParserATNSimulator(this,_ATN,_decisionToDFA,_sharedContextCache);
	}
	public static class FileContext extends ParserRuleContext {
		public TerminalNode EOF() { return getToken(LUFileParser.EOF, 0); }
		public List<ParagraphContext> paragraph() {
			return getRuleContexts(ParagraphContext.class);
		}
		public ParagraphContext paragraph(int i) {
			return getRuleContext(ParagraphContext.class,i);
		}
		public FileContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_file; }
	}

	public final FileContext file() throws RecognitionException {
		FileContext _localctx = new FileContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_file);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(85); 
			_errHandler.sync(this);
			_alt = 1+1;
			do {
				switch (_alt) {
				case 1+1:
					{
					{
					setState(84);
					paragraph();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(87); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			} while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			setState(89);
			match(EOF);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ParagraphContext extends ParserRuleContext {
		public NewlineContext newline() {
			return getRuleContext(NewlineContext.class,0);
		}
		public IntentDefinitionContext intentDefinition() {
			return getRuleContext(IntentDefinitionContext.class,0);
		}
		public NewEntityDefinitionContext newEntityDefinition() {
			return getRuleContext(NewEntityDefinitionContext.class,0);
		}
		public EntityDefinitionContext entityDefinition() {
			return getRuleContext(EntityDefinitionContext.class,0);
		}
		public ImportDefinitionContext importDefinition() {
			return getRuleContext(ImportDefinitionContext.class,0);
		}
		public QnaDefinitionContext qnaDefinition() {
			return getRuleContext(QnaDefinitionContext.class,0);
		}
		public ModelInfoDefinitionContext modelInfoDefinition() {
			return getRuleContext(ModelInfoDefinitionContext.class,0);
		}
		public ParagraphContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_paragraph; }
	}

	public final ParagraphContext paragraph() throws RecognitionException {
		ParagraphContext _localctx = new ParagraphContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_paragraph);
		try {
			setState(98);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case EOF:
			case NEWLINE:
				enterOuterAlt(_localctx, 1);
				{
				setState(91);
				newline();
				}
				break;
			case HASH:
				enterOuterAlt(_localctx, 2);
				{
				setState(92);
				intentDefinition();
				}
				break;
			case AT:
				enterOuterAlt(_localctx, 3);
				{
				setState(93);
				newEntityDefinition();
				}
				break;
			case DOLLAR:
				enterOuterAlt(_localctx, 4);
				{
				setState(94);
				entityDefinition();
				}
				break;
			case IMPORT_DESC:
				enterOuterAlt(_localctx, 5);
				{
				setState(95);
				importDefinition();
				}
				break;
			case QNA:
				enterOuterAlt(_localctx, 6);
				{
				setState(96);
				qnaDefinition();
				}
				break;
			case MODEL_INFO:
				enterOuterAlt(_localctx, 7);
				{
				setState(97);
				modelInfoDefinition();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewlineContext extends ParserRuleContext {
		public TerminalNode NEWLINE() { return getToken(LUFileParser.NEWLINE, 0); }
		public TerminalNode EOF() { return getToken(LUFileParser.EOF, 0); }
		public NewlineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newline; }
	}

	public final NewlineContext newline() throws RecognitionException {
		NewlineContext _localctx = new NewlineContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_newline);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(100);
			_la = _input.LA(1);
			if ( !(_la==EOF || _la==NEWLINE) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntentDefinitionContext extends ParserRuleContext {
		public IntentNameLineContext intentNameLine() {
			return getRuleContext(IntentNameLineContext.class,0);
		}
		public NewlineContext newline() {
			return getRuleContext(NewlineContext.class,0);
		}
		public IntentBodyContext intentBody() {
			return getRuleContext(IntentBodyContext.class,0);
		}
		public IntentDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intentDefinition; }
	}

	public final IntentDefinitionContext intentDefinition() throws RecognitionException {
		IntentDefinitionContext _localctx = new IntentDefinitionContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_intentDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(102);
			intentNameLine();
			setState(103);
			newline();
			setState(105);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DASH) {
				{
				setState(104);
				intentBody();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntentNameLineContext extends ParserRuleContext {
		public TerminalNode HASH() { return getToken(LUFileParser.HASH, 0); }
		public IntentNameContext intentName() {
			return getRuleContext(IntentNameContext.class,0);
		}
		public IntentNameLineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intentNameLine; }
	}

	public final IntentNameLineContext intentNameLine() throws RecognitionException {
		IntentNameLineContext _localctx = new IntentNameLineContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_intentNameLine);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(107);
			match(HASH);
			setState(108);
			intentName();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntentNameContext extends ParserRuleContext {
		public List<IntentNameIdentifierContext> intentNameIdentifier() {
			return getRuleContexts(IntentNameIdentifierContext.class);
		}
		public IntentNameIdentifierContext intentNameIdentifier(int i) {
			return getRuleContext(IntentNameIdentifierContext.class,i);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public IntentNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intentName; }
	}

	public final IntentNameContext intentName() throws RecognitionException {
		IntentNameContext _localctx = new IntentNameContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_intentName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(110);
			intentNameIdentifier();
			setState(115);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==IDENTIFIER) {
				{
				setState(113);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case WS:
					{
					setState(111);
					match(WS);
					}
					break;
				case IDENTIFIER:
					{
					setState(112);
					intentNameIdentifier();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(117);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntentNameIdentifierContext extends ParserRuleContext {
		public List<TerminalNode> IDENTIFIER() { return getTokens(LUFileParser.IDENTIFIER); }
		public TerminalNode IDENTIFIER(int i) {
			return getToken(LUFileParser.IDENTIFIER, i);
		}
		public List<TerminalNode> DOT() { return getTokens(LUFileParser.DOT); }
		public TerminalNode DOT(int i) {
			return getToken(LUFileParser.DOT, i);
		}
		public IntentNameIdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intentNameIdentifier; }
	}

	public final IntentNameIdentifierContext intentNameIdentifier() throws RecognitionException {
		IntentNameIdentifierContext _localctx = new IntentNameIdentifierContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_intentNameIdentifier);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(118);
			match(IDENTIFIER);
			setState(123);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==DOT) {
				{
				{
				setState(119);
				match(DOT);
				setState(120);
				match(IDENTIFIER);
				}
				}
				setState(125);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class IntentBodyContext extends ParserRuleContext {
		public NormalIntentBodyContext normalIntentBody() {
			return getRuleContext(NormalIntentBodyContext.class,0);
		}
		public IntentBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intentBody; }
	}

	public final IntentBodyContext intentBody() throws RecognitionException {
		IntentBodyContext _localctx = new IntentBodyContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_intentBody);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(126);
			normalIntentBody();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NormalIntentBodyContext extends ParserRuleContext {
		public List<NormalIntentStringContext> normalIntentString() {
			return getRuleContexts(NormalIntentStringContext.class);
		}
		public NormalIntentStringContext normalIntentString(int i) {
			return getRuleContext(NormalIntentStringContext.class,i);
		}
		public List<NewlineContext> newline() {
			return getRuleContexts(NewlineContext.class);
		}
		public NewlineContext newline(int i) {
			return getRuleContext(NewlineContext.class,i);
		}
		public NormalIntentBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_normalIntentBody; }
	}

	public final NormalIntentBodyContext normalIntentBody() throws RecognitionException {
		NormalIntentBodyContext _localctx = new NormalIntentBodyContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_normalIntentBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(131); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(128);
				normalIntentString();
				setState(129);
				newline();
				}
				}
				setState(133); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==DASH );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NormalIntentStringContext extends ParserRuleContext {
		public TerminalNode DASH() { return getToken(LUFileParser.DASH, 0); }
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> TEXT() { return getTokens(LUFileParser.TEXT); }
		public TerminalNode TEXT(int i) {
			return getToken(LUFileParser.TEXT, i);
		}
		public List<TerminalNode> EXPRESSION() { return getTokens(LUFileParser.EXPRESSION); }
		public TerminalNode EXPRESSION(int i) {
			return getToken(LUFileParser.EXPRESSION, i);
		}
		public List<TerminalNode> ESCAPE_CHARACTER() { return getTokens(LUFileParser.ESCAPE_CHARACTER); }
		public TerminalNode ESCAPE_CHARACTER(int i) {
			return getToken(LUFileParser.ESCAPE_CHARACTER, i);
		}
		public NormalIntentStringContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_normalIntentString; }
	}

	public final NormalIntentStringContext normalIntentString() throws RecognitionException {
		NormalIntentStringContext _localctx = new NormalIntentStringContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_normalIntentString);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(135);
			match(DASH);
			setState(139);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << WS) | (1L << ESCAPE_CHARACTER) | (1L << EXPRESSION) | (1L << TEXT))) != 0)) {
				{
				{
				setState(136);
				_la = _input.LA(1);
				if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << WS) | (1L << ESCAPE_CHARACTER) | (1L << EXPRESSION) | (1L << TEXT))) != 0)) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(141);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityDefinitionContext extends ParserRuleContext {
		public NewEntityLineContext newEntityLine() {
			return getRuleContext(NewEntityLineContext.class,0);
		}
		public NewlineContext newline() {
			return getRuleContext(NewlineContext.class,0);
		}
		public NewEntityListbodyContext newEntityListbody() {
			return getRuleContext(NewEntityListbodyContext.class,0);
		}
		public NewEntityDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityDefinition; }
	}

	public final NewEntityDefinitionContext newEntityDefinition() throws RecognitionException {
		NewEntityDefinitionContext _localctx = new NewEntityDefinitionContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_newEntityDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(142);
			newEntityLine();
			setState(143);
			newline();
			setState(145);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DASH) {
				{
				setState(144);
				newEntityListbody();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityListbodyContext extends ParserRuleContext {
		public List<NormalItemStringContext> normalItemString() {
			return getRuleContexts(NormalItemStringContext.class);
		}
		public NormalItemStringContext normalItemString(int i) {
			return getRuleContext(NormalItemStringContext.class,i);
		}
		public List<NewlineContext> newline() {
			return getRuleContexts(NewlineContext.class);
		}
		public NewlineContext newline(int i) {
			return getRuleContext(NewlineContext.class,i);
		}
		public NewEntityListbodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityListbody; }
	}

	public final NewEntityListbodyContext newEntityListbody() throws RecognitionException {
		NewEntityListbodyContext _localctx = new NewEntityListbodyContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_newEntityListbody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(150); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(147);
				normalItemString();
				setState(148);
				newline();
				}
				}
				setState(152); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==DASH );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityLineContext extends ParserRuleContext {
		public TerminalNode AT() { return getToken(LUFileParser.AT, 0); }
		public NewEntityTypeContext newEntityType() {
			return getRuleContext(NewEntityTypeContext.class,0);
		}
		public NewEntityNameContext newEntityName() {
			return getRuleContext(NewEntityNameContext.class,0);
		}
		public NewEntityNameWithWSContext newEntityNameWithWS() {
			return getRuleContext(NewEntityNameWithWSContext.class,0);
		}
		public NewEntityRolesContext newEntityRoles() {
			return getRuleContext(NewEntityRolesContext.class,0);
		}
		public NewEntityUsesFeaturesContext newEntityUsesFeatures() {
			return getRuleContext(NewEntityUsesFeaturesContext.class,0);
		}
		public TerminalNode NEW_EQUAL() { return getToken(LUFileParser.NEW_EQUAL, 0); }
		public NewCompositeDefinitionContext newCompositeDefinition() {
			return getRuleContext(NewCompositeDefinitionContext.class,0);
		}
		public NewRegexDefinitionContext newRegexDefinition() {
			return getRuleContext(NewRegexDefinitionContext.class,0);
		}
		public NewEntityLineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityLine; }
	}

	public final NewEntityLineContext newEntityLine() throws RecognitionException {
		NewEntityLineContext _localctx = new NewEntityLineContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_newEntityLine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(154);
			match(AT);
			setState(155);
			newEntityType();
			setState(158);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NEW_ENTITY_IDENTIFIER:
				{
				setState(156);
				newEntityName();
				}
				break;
			case NEW_ENTITY_IDENTIFIER_WITH_WS:
				{
				setState(157);
				newEntityNameWithWS();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(161);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << HAS_ROLES_LABEL) | (1L << NEW_ENTITY_IDENTIFIER) | (1L << NEW_TEXT))) != 0)) {
				{
				setState(160);
				newEntityRoles();
				}
			}

			setState(164);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==HAS_FEATURES_LABEL) {
				{
				setState(163);
				newEntityUsesFeatures();
				}
			}

			setState(167);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEW_EQUAL) {
				{
				setState(166);
				match(NEW_EQUAL);
				}
			}

			setState(171);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NEW_COMPOSITE_ENTITY:
				{
				setState(169);
				newCompositeDefinition();
				}
				break;
			case NEW_REGEX_ENTITY:
				{
				setState(170);
				newRegexDefinition();
				}
				break;
			case EOF:
			case NEWLINE:
				break;
			default:
				break;
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewCompositeDefinitionContext extends ParserRuleContext {
		public TerminalNode NEW_COMPOSITE_ENTITY() { return getToken(LUFileParser.NEW_COMPOSITE_ENTITY, 0); }
		public NewCompositeDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newCompositeDefinition; }
	}

	public final NewCompositeDefinitionContext newCompositeDefinition() throws RecognitionException {
		NewCompositeDefinitionContext _localctx = new NewCompositeDefinitionContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_newCompositeDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(173);
			match(NEW_COMPOSITE_ENTITY);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewRegexDefinitionContext extends ParserRuleContext {
		public TerminalNode NEW_REGEX_ENTITY() { return getToken(LUFileParser.NEW_REGEX_ENTITY, 0); }
		public NewRegexDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newRegexDefinition; }
	}

	public final NewRegexDefinitionContext newRegexDefinition() throws RecognitionException {
		NewRegexDefinitionContext _localctx = new NewRegexDefinitionContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_newRegexDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(175);
			match(NEW_REGEX_ENTITY);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityTypeContext extends ParserRuleContext {
		public TerminalNode NEW_ENTITY_TYPE_IDENTIFIER() { return getToken(LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER, 0); }
		public NewEntityTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityType; }
	}

	public final NewEntityTypeContext newEntityType() throws RecognitionException {
		NewEntityTypeContext _localctx = new NewEntityTypeContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_newEntityType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(177);
			match(NEW_ENTITY_TYPE_IDENTIFIER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityRolesContext extends ParserRuleContext {
		public NewEntityRoleOrFeaturesContext newEntityRoleOrFeatures() {
			return getRuleContext(NewEntityRoleOrFeaturesContext.class,0);
		}
		public TerminalNode HAS_ROLES_LABEL() { return getToken(LUFileParser.HAS_ROLES_LABEL, 0); }
		public NewEntityRolesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityRoles; }
	}

	public final NewEntityRolesContext newEntityRoles() throws RecognitionException {
		NewEntityRolesContext _localctx = new NewEntityRolesContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_newEntityRoles);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(180);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==HAS_ROLES_LABEL) {
				{
				setState(179);
				match(HAS_ROLES_LABEL);
				}
			}

			setState(182);
			newEntityRoleOrFeatures();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityUsesFeaturesContext extends ParserRuleContext {
		public TerminalNode HAS_FEATURES_LABEL() { return getToken(LUFileParser.HAS_FEATURES_LABEL, 0); }
		public NewEntityRoleOrFeaturesContext newEntityRoleOrFeatures() {
			return getRuleContext(NewEntityRoleOrFeaturesContext.class,0);
		}
		public NewEntityUsesFeaturesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityUsesFeatures; }
	}

	public final NewEntityUsesFeaturesContext newEntityUsesFeatures() throws RecognitionException {
		NewEntityUsesFeaturesContext _localctx = new NewEntityUsesFeaturesContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_newEntityUsesFeatures);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(184);
			match(HAS_FEATURES_LABEL);
			setState(185);
			newEntityRoleOrFeatures();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityRoleOrFeaturesContext extends ParserRuleContext {
		public List<TextContext> text() {
			return getRuleContexts(TextContext.class);
		}
		public TextContext text(int i) {
			return getRuleContext(TextContext.class,i);
		}
		public List<TerminalNode> COMMA() { return getTokens(LUFileParser.COMMA); }
		public TerminalNode COMMA(int i) {
			return getToken(LUFileParser.COMMA, i);
		}
		public NewEntityRoleOrFeaturesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityRoleOrFeatures; }
	}

	public final NewEntityRoleOrFeaturesContext newEntityRoleOrFeatures() throws RecognitionException {
		NewEntityRoleOrFeaturesContext _localctx = new NewEntityRoleOrFeaturesContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_newEntityRoleOrFeatures);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(187);
			text();
			setState(192);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(188);
				match(COMMA);
				setState(189);
				text();
				}
				}
				setState(194);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class TextContext extends ParserRuleContext {
		public TerminalNode NEW_TEXT() { return getToken(LUFileParser.NEW_TEXT, 0); }
		public TerminalNode NEW_ENTITY_IDENTIFIER() { return getToken(LUFileParser.NEW_ENTITY_IDENTIFIER, 0); }
		public TextContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_text; }
	}

	public final TextContext text() throws RecognitionException {
		TextContext _localctx = new TextContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_text);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(195);
			_la = _input.LA(1);
			if ( !(_la==NEW_ENTITY_IDENTIFIER || _la==NEW_TEXT) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityNameContext extends ParserRuleContext {
		public TerminalNode NEW_ENTITY_IDENTIFIER() { return getToken(LUFileParser.NEW_ENTITY_IDENTIFIER, 0); }
		public NewEntityNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityName; }
	}

	public final NewEntityNameContext newEntityName() throws RecognitionException {
		NewEntityNameContext _localctx = new NewEntityNameContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_newEntityName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(197);
			match(NEW_ENTITY_IDENTIFIER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NewEntityNameWithWSContext extends ParserRuleContext {
		public TerminalNode NEW_ENTITY_IDENTIFIER_WITH_WS() { return getToken(LUFileParser.NEW_ENTITY_IDENTIFIER_WITH_WS, 0); }
		public NewEntityNameWithWSContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityNameWithWS; }
	}

	public final NewEntityNameWithWSContext newEntityNameWithWS() throws RecognitionException {
		NewEntityNameWithWSContext _localctx = new NewEntityNameWithWSContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_newEntityNameWithWS);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(199);
			match(NEW_ENTITY_IDENTIFIER_WITH_WS);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityDefinitionContext extends ParserRuleContext {
		public EntityLineContext entityLine() {
			return getRuleContext(EntityLineContext.class,0);
		}
		public NewlineContext newline() {
			return getRuleContext(NewlineContext.class,0);
		}
		public EntityListBodyContext entityListBody() {
			return getRuleContext(EntityListBodyContext.class,0);
		}
		public EntityDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityDefinition; }
	}

	public final EntityDefinitionContext entityDefinition() throws RecognitionException {
		EntityDefinitionContext _localctx = new EntityDefinitionContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_entityDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(201);
			entityLine();
			setState(202);
			newline();
			setState(204);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DASH) {
				{
				setState(203);
				entityListBody();
				}
			}

			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityLineContext extends ParserRuleContext {
		public TerminalNode DOLLAR() { return getToken(LUFileParser.DOLLAR, 0); }
		public EntityNameContext entityName() {
			return getRuleContext(EntityNameContext.class,0);
		}
		public TerminalNode COLON_MARK() { return getToken(LUFileParser.COLON_MARK, 0); }
		public EntityTypeContext entityType() {
			return getRuleContext(EntityTypeContext.class,0);
		}
		public EntityLineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityLine; }
	}

	public final EntityLineContext entityLine() throws RecognitionException {
		EntityLineContext _localctx = new EntityLineContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_entityLine);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(206);
			match(DOLLAR);
			setState(207);
			entityName();
			setState(208);
			match(COLON_MARK);
			setState(209);
			entityType();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityNameContext extends ParserRuleContext {
		public List<EntityIdentifierContext> entityIdentifier() {
			return getRuleContexts(EntityIdentifierContext.class);
		}
		public EntityIdentifierContext entityIdentifier(int i) {
			return getRuleContext(EntityIdentifierContext.class,i);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public EntityNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityName; }
	}

	public final EntityNameContext entityName() throws RecognitionException {
		EntityNameContext _localctx = new EntityNameContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_entityName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(215);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==ENTITY_IDENTIFIER) {
				{
				setState(213);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ENTITY_IDENTIFIER:
					{
					setState(211);
					entityIdentifier();
					}
					break;
				case WS:
					{
					setState(212);
					match(WS);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(217);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityTypeContext extends ParserRuleContext {
		public List<EntityIdentifierContext> entityIdentifier() {
			return getRuleContexts(EntityIdentifierContext.class);
		}
		public EntityIdentifierContext entityIdentifier(int i) {
			return getRuleContext(EntityIdentifierContext.class,i);
		}
		public List<CompositeEntityIdentifierContext> compositeEntityIdentifier() {
			return getRuleContexts(CompositeEntityIdentifierContext.class);
		}
		public CompositeEntityIdentifierContext compositeEntityIdentifier(int i) {
			return getRuleContext(CompositeEntityIdentifierContext.class,i);
		}
		public List<RegexEntityIdentifierContext> regexEntityIdentifier() {
			return getRuleContexts(RegexEntityIdentifierContext.class);
		}
		public RegexEntityIdentifierContext regexEntityIdentifier(int i) {
			return getRuleContext(RegexEntityIdentifierContext.class,i);
		}
		public List<TerminalNode> SPECIAL_CHAR_MARK() { return getTokens(LUFileParser.SPECIAL_CHAR_MARK); }
		public TerminalNode SPECIAL_CHAR_MARK(int i) {
			return getToken(LUFileParser.SPECIAL_CHAR_MARK, i);
		}
		public List<TerminalNode> COLON_MARK() { return getTokens(LUFileParser.COLON_MARK); }
		public TerminalNode COLON_MARK(int i) {
			return getToken(LUFileParser.COLON_MARK, i);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public EntityTypeContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityType; }
	}

	public final EntityTypeContext entityType() throws RecognitionException {
		EntityTypeContext _localctx = new EntityTypeContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_entityType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(226);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << WS) | (1L << ENTITY_IDENTIFIER) | (1L << COMPOSITE_ENTITY) | (1L << REGEX_ENTITY) | (1L << COLON_MARK) | (1L << SPECIAL_CHAR_MARK))) != 0)) {
				{
				setState(224);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ENTITY_IDENTIFIER:
					{
					setState(218);
					entityIdentifier();
					}
					break;
				case COMPOSITE_ENTITY:
					{
					setState(219);
					compositeEntityIdentifier();
					}
					break;
				case REGEX_ENTITY:
					{
					setState(220);
					regexEntityIdentifier();
					}
					break;
				case SPECIAL_CHAR_MARK:
					{
					setState(221);
					match(SPECIAL_CHAR_MARK);
					}
					break;
				case COLON_MARK:
					{
					setState(222);
					match(COLON_MARK);
					}
					break;
				case WS:
					{
					setState(223);
					match(WS);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(228);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class CompositeEntityIdentifierContext extends ParserRuleContext {
		public TerminalNode COMPOSITE_ENTITY() { return getToken(LUFileParser.COMPOSITE_ENTITY, 0); }
		public CompositeEntityIdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_compositeEntityIdentifier; }
	}

	public final CompositeEntityIdentifierContext compositeEntityIdentifier() throws RecognitionException {
		CompositeEntityIdentifierContext _localctx = new CompositeEntityIdentifierContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_compositeEntityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(229);
			match(COMPOSITE_ENTITY);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class RegexEntityIdentifierContext extends ParserRuleContext {
		public TerminalNode REGEX_ENTITY() { return getToken(LUFileParser.REGEX_ENTITY, 0); }
		public RegexEntityIdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_regexEntityIdentifier; }
	}

	public final RegexEntityIdentifierContext regexEntityIdentifier() throws RecognitionException {
		RegexEntityIdentifierContext _localctx = new RegexEntityIdentifierContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_regexEntityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(231);
			match(REGEX_ENTITY);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityIdentifierContext extends ParserRuleContext {
		public TerminalNode ENTITY_IDENTIFIER() { return getToken(LUFileParser.ENTITY_IDENTIFIER, 0); }
		public EntityIdentifierContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityIdentifier; }
	}

	public final EntityIdentifierContext entityIdentifier() throws RecognitionException {
		EntityIdentifierContext _localctx = new EntityIdentifierContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_entityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(233);
			match(ENTITY_IDENTIFIER);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class EntityListBodyContext extends ParserRuleContext {
		public List<NormalItemStringContext> normalItemString() {
			return getRuleContexts(NormalItemStringContext.class);
		}
		public NormalItemStringContext normalItemString(int i) {
			return getRuleContext(NormalItemStringContext.class,i);
		}
		public List<NewlineContext> newline() {
			return getRuleContexts(NewlineContext.class);
		}
		public NewlineContext newline(int i) {
			return getRuleContext(NewlineContext.class,i);
		}
		public EntityListBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityListBody; }
	}

	public final EntityListBodyContext entityListBody() throws RecognitionException {
		EntityListBodyContext _localctx = new EntityListBodyContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_entityListBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(238); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(235);
				normalItemString();
				setState(236);
				newline();
				}
				}
				setState(240); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==DASH );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class NormalItemStringContext extends ParserRuleContext {
		public TerminalNode DASH() { return getToken(LUFileParser.DASH, 0); }
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> TEXT() { return getTokens(LUFileParser.TEXT); }
		public TerminalNode TEXT(int i) {
			return getToken(LUFileParser.TEXT, i);
		}
		public NormalItemStringContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_normalItemString; }
	}

	public final NormalItemStringContext normalItemString() throws RecognitionException {
		NormalItemStringContext _localctx = new NormalItemStringContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_normalItemString);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(242);
			match(DASH);
			setState(246);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==TEXT) {
				{
				{
				setState(243);
				_la = _input.LA(1);
				if ( !(_la==WS || _la==TEXT) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(248);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ImportDefinitionContext extends ParserRuleContext {
		public TerminalNode IMPORT_DESC() { return getToken(LUFileParser.IMPORT_DESC, 0); }
		public TerminalNode IMPORT_PATH() { return getToken(LUFileParser.IMPORT_PATH, 0); }
		public ImportDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_importDefinition; }
	}

	public final ImportDefinitionContext importDefinition() throws RecognitionException {
		ImportDefinitionContext _localctx = new ImportDefinitionContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_importDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(249);
			match(IMPORT_DESC);
			setState(250);
			match(IMPORT_PATH);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QnaDefinitionContext extends ParserRuleContext {
		public QnaQuestionContext qnaQuestion() {
			return getRuleContext(QnaQuestionContext.class,0);
		}
		public MoreQuestionsBodyContext moreQuestionsBody() {
			return getRuleContext(MoreQuestionsBodyContext.class,0);
		}
		public QnaAnswerBodyContext qnaAnswerBody() {
			return getRuleContext(QnaAnswerBodyContext.class,0);
		}
		public QnaDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_qnaDefinition; }
	}

	public final QnaDefinitionContext qnaDefinition() throws RecognitionException {
		QnaDefinitionContext _localctx = new QnaDefinitionContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_qnaDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(252);
			qnaQuestion();
			setState(253);
			moreQuestionsBody();
			setState(254);
			qnaAnswerBody();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QnaQuestionContext extends ParserRuleContext {
		public TerminalNode QNA() { return getToken(LUFileParser.QNA, 0); }
		public QuestionTextContext questionText() {
			return getRuleContext(QuestionTextContext.class,0);
		}
		public NewlineContext newline() {
			return getRuleContext(NewlineContext.class,0);
		}
		public QnaQuestionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_qnaQuestion; }
	}

	public final QnaQuestionContext qnaQuestion() throws RecognitionException {
		QnaQuestionContext _localctx = new QnaQuestionContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_qnaQuestion);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(256);
			match(QNA);
			setState(257);
			questionText();
			setState(258);
			newline();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QuestionTextContext extends ParserRuleContext {
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> QNA_TEXT() { return getTokens(LUFileParser.QNA_TEXT); }
		public TerminalNode QNA_TEXT(int i) {
			return getToken(LUFileParser.QNA_TEXT, i);
		}
		public QuestionTextContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_questionText; }
	}

	public final QuestionTextContext questionText() throws RecognitionException {
		QuestionTextContext _localctx = new QuestionTextContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_questionText);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(263);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==QNA_TEXT) {
				{
				{
				setState(260);
				_la = _input.LA(1);
				if ( !(_la==WS || _la==QNA_TEXT) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(265);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MoreQuestionsBodyContext extends ParserRuleContext {
		public List<MoreQuestionContext> moreQuestion() {
			return getRuleContexts(MoreQuestionContext.class);
		}
		public MoreQuestionContext moreQuestion(int i) {
			return getRuleContext(MoreQuestionContext.class,i);
		}
		public List<NewlineContext> newline() {
			return getRuleContexts(NewlineContext.class);
		}
		public NewlineContext newline(int i) {
			return getRuleContext(NewlineContext.class,i);
		}
		public MoreQuestionsBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_moreQuestionsBody; }
	}

	public final MoreQuestionsBodyContext moreQuestionsBody() throws RecognitionException {
		MoreQuestionsBodyContext _localctx = new MoreQuestionsBodyContext(_ctx, getState());
		enterRule(_localctx, 70, RULE_moreQuestionsBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(271);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==DASH) {
				{
				{
				setState(266);
				moreQuestion();
				setState(267);
				newline();
				}
				}
				setState(273);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MoreQuestionContext extends ParserRuleContext {
		public TerminalNode DASH() { return getToken(LUFileParser.DASH, 0); }
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> TEXT() { return getTokens(LUFileParser.TEXT); }
		public TerminalNode TEXT(int i) {
			return getToken(LUFileParser.TEXT, i);
		}
		public MoreQuestionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_moreQuestion; }
	}

	public final MoreQuestionContext moreQuestion() throws RecognitionException {
		MoreQuestionContext _localctx = new MoreQuestionContext(_ctx, getState());
		enterRule(_localctx, 72, RULE_moreQuestion);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(274);
			match(DASH);
			setState(278);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==TEXT) {
				{
				{
				setState(275);
				_la = _input.LA(1);
				if ( !(_la==WS || _la==TEXT) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(280);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class QnaAnswerBodyContext extends ParserRuleContext {
		public MultiLineAnswerContext multiLineAnswer() {
			return getRuleContext(MultiLineAnswerContext.class,0);
		}
		public FilterSectionContext filterSection() {
			return getRuleContext(FilterSectionContext.class,0);
		}
		public QnaAnswerBodyContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_qnaAnswerBody; }
	}

	public final QnaAnswerBodyContext qnaAnswerBody() throws RecognitionException {
		QnaAnswerBodyContext _localctx = new QnaAnswerBodyContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_qnaAnswerBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(282);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==FILTER_MARK) {
				{
				setState(281);
				filterSection();
				}
			}

			setState(284);
			multiLineAnswer();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FilterSectionContext extends ParserRuleContext {
		public TerminalNode FILTER_MARK() { return getToken(LUFileParser.FILTER_MARK, 0); }
		public List<FilterLineContext> filterLine() {
			return getRuleContexts(FilterLineContext.class);
		}
		public FilterLineContext filterLine(int i) {
			return getRuleContext(FilterLineContext.class,i);
		}
		public FilterSectionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_filterSection; }
	}

	public final FilterSectionContext filterSection() throws RecognitionException {
		FilterSectionContext _localctx = new FilterSectionContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_filterSection);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(286);
			match(FILTER_MARK);
			setState(288); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(287);
				filterLine();
				}
				}
				setState(290); 
				_errHandler.sync(this);
				_la = _input.LA(1);
			} while ( _la==DASH );
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class FilterLineContext extends ParserRuleContext {
		public TerminalNode DASH() { return getToken(LUFileParser.DASH, 0); }
		public NewlineContext newline() {
			return getRuleContext(NewlineContext.class,0);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> TEXT() { return getTokens(LUFileParser.TEXT); }
		public TerminalNode TEXT(int i) {
			return getToken(LUFileParser.TEXT, i);
		}
		public FilterLineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_filterLine; }
	}

	public final FilterLineContext filterLine() throws RecognitionException {
		FilterLineContext _localctx = new FilterLineContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_filterLine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(292);
			match(DASH);
			setState(296);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==TEXT) {
				{
				{
				setState(293);
				_la = _input.LA(1);
				if ( !(_la==WS || _la==TEXT) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(298);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(299);
			newline();
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class MultiLineAnswerContext extends ParserRuleContext {
		public TerminalNode MULTI_LINE_TEXT() { return getToken(LUFileParser.MULTI_LINE_TEXT, 0); }
		public MultiLineAnswerContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_multiLineAnswer; }
	}

	public final MultiLineAnswerContext multiLineAnswer() throws RecognitionException {
		MultiLineAnswerContext _localctx = new MultiLineAnswerContext(_ctx, getState());
		enterRule(_localctx, 80, RULE_multiLineAnswer);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(301);
			match(MULTI_LINE_TEXT);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static class ModelInfoDefinitionContext extends ParserRuleContext {
		public TerminalNode MODEL_INFO() { return getToken(LUFileParser.MODEL_INFO, 0); }
		public ModelInfoDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_modelInfoDefinition; }
	}

	public final ModelInfoDefinitionContext modelInfoDefinition() throws RecognitionException {
		ModelInfoDefinitionContext _localctx = new ModelInfoDefinitionContext(_ctx, getState());
		enterRule(_localctx, 82, RULE_modelInfoDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(303);
			match(MODEL_INFO);
			}
		}
		catch (RecognitionException re) {
			_localctx.exception = re;
			_errHandler.reportError(this, re);
			_errHandler.recover(this, re);
		}
		finally {
			exitRule();
		}
		return _localctx;
	}

	public static final String _serializedATN =
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3*\u0134\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
		"\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\4*\t*\4+\t+\3"+
		"\2\6\2X\n\2\r\2\16\2Y\3\2\3\2\3\3\3\3\3\3\3\3\3\3\3\3\3\3\5\3e\n\3\3\4"+
		"\3\4\3\5\3\5\3\5\5\5l\n\5\3\6\3\6\3\6\3\7\3\7\3\7\7\7t\n\7\f\7\16\7w\13"+
		"\7\3\b\3\b\3\b\7\b|\n\b\f\b\16\b\177\13\b\3\t\3\t\3\n\3\n\3\n\6\n\u0086"+
		"\n\n\r\n\16\n\u0087\3\13\3\13\7\13\u008c\n\13\f\13\16\13\u008f\13\13\3"+
		"\f\3\f\3\f\5\f\u0094\n\f\3\r\3\r\3\r\6\r\u0099\n\r\r\r\16\r\u009a\3\16"+
		"\3\16\3\16\3\16\5\16\u00a1\n\16\3\16\5\16\u00a4\n\16\3\16\5\16\u00a7\n"+
		"\16\3\16\5\16\u00aa\n\16\3\16\3\16\5\16\u00ae\n\16\3\17\3\17\3\20\3\20"+
		"\3\21\3\21\3\22\5\22\u00b7\n\22\3\22\3\22\3\23\3\23\3\23\3\24\3\24\3\24"+
		"\7\24\u00c1\n\24\f\24\16\24\u00c4\13\24\3\25\3\25\3\26\3\26\3\27\3\27"+
		"\3\30\3\30\3\30\5\30\u00cf\n\30\3\31\3\31\3\31\3\31\3\31\3\32\3\32\7\32"+
		"\u00d8\n\32\f\32\16\32\u00db\13\32\3\33\3\33\3\33\3\33\3\33\3\33\7\33"+
		"\u00e3\n\33\f\33\16\33\u00e6\13\33\3\34\3\34\3\35\3\35\3\36\3\36\3\37"+
		"\3\37\3\37\6\37\u00f1\n\37\r\37\16\37\u00f2\3 \3 \7 \u00f7\n \f \16 \u00fa"+
		"\13 \3!\3!\3!\3\"\3\"\3\"\3\"\3#\3#\3#\3#\3$\7$\u0108\n$\f$\16$\u010b"+
		"\13$\3%\3%\3%\7%\u0110\n%\f%\16%\u0113\13%\3&\3&\7&\u0117\n&\f&\16&\u011a"+
		"\13&\3\'\5\'\u011d\n\'\3\'\3\'\3(\3(\6(\u0123\n(\r(\16(\u0124\3)\3)\7"+
		")\u0129\n)\f)\16)\u012c\13)\3)\3)\3*\3*\3+\3+\3+\3Y\2,\2\4\6\b\n\f\16"+
		"\20\22\24\26\30\32\34\36 \"$&(*,.\60\62\64\668:<>@BDFHJLNPRT\2\7\3\3\6"+
		"\6\4\2\5\5 \"\4\2\27\27\33\33\4\2\5\5\"\"\4\2\5\5**\2\u0131\2W\3\2\2\2"+
		"\4d\3\2\2\2\6f\3\2\2\2\bh\3\2\2\2\nm\3\2\2\2\fp\3\2\2\2\16x\3\2\2\2\20"+
		"\u0080\3\2\2\2\22\u0085\3\2\2\2\24\u0089\3\2\2\2\26\u0090\3\2\2\2\30\u0098"+
		"\3\2\2\2\32\u009c\3\2\2\2\34\u00af\3\2\2\2\36\u00b1\3\2\2\2 \u00b3\3\2"+
		"\2\2\"\u00b6\3\2\2\2$\u00ba\3\2\2\2&\u00bd\3\2\2\2(\u00c5\3\2\2\2*\u00c7"+
		"\3\2\2\2,\u00c9\3\2\2\2.\u00cb\3\2\2\2\60\u00d0\3\2\2\2\62\u00d9\3\2\2"+
		"\2\64\u00e4\3\2\2\2\66\u00e7\3\2\2\28\u00e9\3\2\2\2:\u00eb\3\2\2\2<\u00f0"+
		"\3\2\2\2>\u00f4\3\2\2\2@\u00fb\3\2\2\2B\u00fe\3\2\2\2D\u0102\3\2\2\2F"+
		"\u0109\3\2\2\2H\u0111\3\2\2\2J\u0114\3\2\2\2L\u011c\3\2\2\2N\u0120\3\2"+
		"\2\2P\u0126\3\2\2\2R\u012f\3\2\2\2T\u0131\3\2\2\2VX\5\4\3\2WV\3\2\2\2"+
		"XY\3\2\2\2YZ\3\2\2\2YW\3\2\2\2Z[\3\2\2\2[\\\7\2\2\3\\\3\3\2\2\2]e\5\6"+
		"\4\2^e\5\b\5\2_e\5\26\f\2`e\5.\30\2ae\5@!\2be\5B\"\2ce\5T+\2d]\3\2\2\2"+
		"d^\3\2\2\2d_\3\2\2\2d`\3\2\2\2da\3\2\2\2db\3\2\2\2dc\3\2\2\2e\5\3\2\2"+
		"\2fg\t\2\2\2g\7\3\2\2\2hi\5\n\6\2ik\5\6\4\2jl\5\20\t\2kj\3\2\2\2kl\3\2"+
		"\2\2l\t\3\2\2\2mn\7\b\2\2no\5\f\7\2o\13\3\2\2\2pu\5\16\b\2qt\7\5\2\2r"+
		"t\5\16\b\2sq\3\2\2\2sr\3\2\2\2tw\3\2\2\2us\3\2\2\2uv\3\2\2\2v\r\3\2\2"+
		"\2wu\3\2\2\2x}\7\35\2\2yz\7\36\2\2z|\7\35\2\2{y\3\2\2\2|\177\3\2\2\2}"+
		"{\3\2\2\2}~\3\2\2\2~\17\3\2\2\2\177}\3\2\2\2\u0080\u0081\5\22\n\2\u0081"+
		"\21\3\2\2\2\u0082\u0083\5\24\13\2\u0083\u0084\5\6\4\2\u0084\u0086\3\2"+
		"\2\2\u0085\u0082\3\2\2\2\u0086\u0087\3\2\2\2\u0087\u0085\3\2\2\2\u0087"+
		"\u0088\3\2\2\2\u0088\23\3\2\2\2\u0089\u008d\7\t\2\2\u008a\u008c\t\3\2"+
		"\2\u008b\u008a\3\2\2\2\u008c\u008f\3\2\2\2\u008d\u008b\3\2\2\2\u008d\u008e"+
		"\3\2\2\2\u008e\25\3\2\2\2\u008f\u008d\3\2\2\2\u0090\u0091\5\32\16\2\u0091"+
		"\u0093\5\6\4\2\u0092\u0094\5\30\r\2\u0093\u0092\3\2\2\2\u0093\u0094\3"+
		"\2\2\2\u0094\27\3\2\2\2\u0095\u0096\5> \2\u0096\u0097\5\6\4\2\u0097\u0099"+
		"\3\2\2\2\u0098\u0095\3\2\2\2\u0099\u009a\3\2\2\2\u009a\u0098\3\2\2\2\u009a"+
		"\u009b\3\2\2\2\u009b\31\3\2\2\2\u009c\u009d\7\13\2\2\u009d\u00a0\5 \21"+
		"\2\u009e\u00a1\5*\26\2\u009f\u00a1\5,\27\2\u00a0\u009e\3\2\2\2\u00a0\u009f"+
		"\3\2\2\2\u00a1\u00a3\3\2\2\2\u00a2\u00a4\5\"\22\2\u00a3\u00a2\3\2\2\2"+
		"\u00a3\u00a4\3\2\2\2\u00a4\u00a6\3\2\2\2\u00a5\u00a7\5$\23\2\u00a6\u00a5"+
		"\3\2\2\2\u00a6\u00a7\3\2\2\2\u00a7\u00a9\3\2\2\2\u00a8\u00aa\7\23\2\2"+
		"\u00a9\u00a8\3\2\2\2\u00a9\u00aa\3\2\2\2\u00aa\u00ad\3\2\2\2\u00ab\u00ae"+
		"\5\34\17\2\u00ac\u00ae\5\36\20\2\u00ad\u00ab\3\2\2\2\u00ad\u00ac\3\2\2"+
		"\2\u00ad\u00ae\3\2\2\2\u00ae\33\3\2\2\2\u00af\u00b0\7\31\2\2\u00b0\35"+
		"\3\2\2\2\u00b1\u00b2\7\32\2\2\u00b2\37\3\2\2\2\u00b3\u00b4\7\26\2\2\u00b4"+
		"!\3\2\2\2\u00b5\u00b7\7\24\2\2\u00b6\u00b5\3\2\2\2\u00b6\u00b7\3\2\2\2"+
		"\u00b7\u00b8\3\2\2\2\u00b8\u00b9\5&\24\2\u00b9#\3\2\2\2\u00ba\u00bb\7"+
		"\25\2\2\u00bb\u00bc\5&\24\2\u00bc%\3\2\2\2\u00bd\u00c2\5(\25\2\u00be\u00bf"+
		"\7\22\2\2\u00bf\u00c1\5(\25\2\u00c0\u00be\3\2\2\2\u00c1\u00c4\3\2\2\2"+
		"\u00c2\u00c0\3\2\2\2\u00c2\u00c3\3\2\2\2\u00c3\'\3\2\2\2\u00c4\u00c2\3"+
		"\2\2\2\u00c5\u00c6\t\4\2\2\u00c6)\3\2\2\2\u00c7\u00c8\7\27\2\2\u00c8+"+
		"\3\2\2\2\u00c9\u00ca\7\30\2\2\u00ca-\3\2\2\2\u00cb\u00cc\5\60\31\2\u00cc"+
		"\u00ce\5\6\4\2\u00cd\u00cf\5<\37\2\u00ce\u00cd\3\2\2\2\u00ce\u00cf\3\2"+
		"\2\2\u00cf/\3\2\2\2\u00d0\u00d1\7\n\2\2\u00d1\u00d2\5\62\32\2\u00d2\u00d3"+
		"\7\'\2\2\u00d3\u00d4\5\64\33\2\u00d4\61\3\2\2\2\u00d5\u00d8\5:\36\2\u00d6"+
		"\u00d8\7\5\2\2\u00d7\u00d5\3\2\2\2\u00d7\u00d6\3\2\2\2\u00d8\u00db\3\2"+
		"\2\2\u00d9\u00d7\3\2\2\2\u00d9\u00da\3\2\2\2\u00da\63\3\2\2\2\u00db\u00d9"+
		"\3\2\2\2\u00dc\u00e3\5:\36\2\u00dd\u00e3\5\66\34\2\u00de\u00e3\58\35\2"+
		"\u00df\u00e3\7(\2\2\u00e0\u00e3\7\'\2\2\u00e1\u00e3\7\5\2\2\u00e2\u00dc"+
		"\3\2\2\2\u00e2\u00dd\3\2\2\2\u00e2\u00de\3\2\2\2\u00e2\u00df\3\2\2\2\u00e2"+
		"\u00e0\3\2\2\2\u00e2\u00e1\3\2\2\2\u00e3\u00e6\3\2\2\2\u00e4\u00e2\3\2"+
		"\2\2\u00e4\u00e5\3\2\2\2\u00e5\65\3\2\2\2\u00e6\u00e4\3\2\2\2\u00e7\u00e8"+
		"\7%\2\2\u00e8\67\3\2\2\2\u00e9\u00ea\7&\2\2\u00ea9\3\2\2\2\u00eb\u00ec"+
		"\7$\2\2\u00ec;\3\2\2\2\u00ed\u00ee\5> \2\u00ee\u00ef\5\6\4\2\u00ef\u00f1"+
		"\3\2\2\2\u00f0\u00ed\3\2\2\2\u00f1\u00f2\3\2\2\2\u00f2\u00f0\3\2\2\2\u00f2"+
		"\u00f3\3\2\2\2\u00f3=\3\2\2\2\u00f4\u00f8\7\t\2\2\u00f5\u00f7\t\5\2\2"+
		"\u00f6\u00f5\3\2\2\2\u00f7\u00fa\3\2\2\2\u00f8\u00f6\3\2\2\2\u00f8\u00f9"+
		"\3\2\2\2\u00f9?\3\2\2\2\u00fa\u00f8\3\2\2\2\u00fb\u00fc\7\f\2\2\u00fc"+
		"\u00fd\7\r\2\2\u00fdA\3\2\2\2\u00fe\u00ff\5D#\2\u00ff\u0100\5H%\2\u0100"+
		"\u0101\5L\'\2\u0101C\3\2\2\2\u0102\u0103\7\7\2\2\u0103\u0104\5F$\2\u0104"+
		"\u0105\5\6\4\2\u0105E\3\2\2\2\u0106\u0108\t\6\2\2\u0107\u0106\3\2\2\2"+
		"\u0108\u010b\3\2\2\2\u0109\u0107\3\2\2\2\u0109\u010a\3\2\2\2\u010aG\3"+
		"\2\2\2\u010b\u0109\3\2\2\2\u010c\u010d\5J&\2\u010d\u010e\5\6\4\2\u010e"+
		"\u0110\3\2\2\2\u010f\u010c\3\2\2\2\u0110\u0113\3\2\2\2\u0111\u010f\3\2"+
		"\2\2\u0111\u0112\3\2\2\2\u0112I\3\2\2\2\u0113\u0111\3\2\2\2\u0114\u0118"+
		"\7\t\2\2\u0115\u0117\t\5\2\2\u0116\u0115\3\2\2\2\u0117\u011a\3\2\2\2\u0118"+
		"\u0116\3\2\2\2\u0118\u0119\3\2\2\2\u0119K\3\2\2\2\u011a\u0118\3\2\2\2"+
		"\u011b\u011d\5N(\2\u011c\u011b\3\2\2\2\u011c\u011d\3\2\2\2\u011d\u011e"+
		"\3\2\2\2\u011e\u011f\5R*\2\u011fM\3\2\2\2\u0120\u0122\7\16\2\2\u0121\u0123"+
		"\5P)\2\u0122\u0121\3\2\2\2\u0123\u0124\3\2\2\2\u0124\u0122\3\2\2\2\u0124"+
		"\u0125\3\2\2\2\u0125O\3\2\2\2\u0126\u012a\7\t\2\2\u0127\u0129\t\5\2\2"+
		"\u0128\u0127\3\2\2\2\u0129\u012c\3\2\2\2\u012a\u0128\3\2\2\2\u012a\u012b"+
		"\3\2\2\2\u012b\u012d\3\2\2\2\u012c\u012a\3\2\2\2\u012d\u012e\5\6\4\2\u012e"+
		"Q\3\2\2\2\u012f\u0130\7\17\2\2\u0130S\3\2\2\2\u0131\u0132\7\3\2\2\u0132"+
		"U\3\2\2\2 Ydksu}\u0087\u008d\u0093\u009a\u00a0\u00a3\u00a6\u00a9\u00ad"+
		"\u00b6\u00c2\u00ce\u00d7\u00d9\u00e2\u00e4\u00f2\u00f8\u0109\u0111\u0118"+
		"\u011c\u0124\u012a";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}