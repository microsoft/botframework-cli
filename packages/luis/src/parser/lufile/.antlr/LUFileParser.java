// Generated from /Users/vishwacsenakannan/repos/botframework-cli/packages/luis/src/parser/lufile/LUFileParser.g4 by ANTLR 4.7.1
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
		NEW_EQUAL=17, HAS_ROLES_LABEL=18, INSTANCE_OF_LABEL=19, HAS_FEATURES_LABEL=20, 
		NEW_ENTITY_TYPE_IDENTIFIER=21, NEW_ENTITY_IDENTIFIER=22, NEW_ENTITY_IDENTIFIER_WITH_WS=23, 
		NEW_COMPOSITE_ENTITY=24, NEW_REGEX_ENTITY=25, NEW_TEXT=26, WS_IN_NAME_IGNORED=27, 
		IDENTIFIER=28, DOT=29, WS_IN_LIST_BODY_IGNORED=30, ESCAPE_CHARACTER=31, 
		EXPRESSION=32, TEXT=33, WS_IN_ENTITY_IGNORED=34, ENTITY_IDENTIFIER=35, 
		COMPOSITE_ENTITY=36, REGEX_ENTITY=37, COLON_MARK=38, SPECIAL_CHAR_MARK=39, 
		WS_IN_QNA_IGNORED=40, QNA_TEXT=41;
	public static final int
		RULE_file = 0, RULE_paragraph = 1, RULE_newline = 2, RULE_intentDefinition = 3, 
		RULE_intentNameLine = 4, RULE_intentName = 5, RULE_intentNameIdentifier = 6, 
		RULE_intentBody = 7, RULE_normalIntentBody = 8, RULE_normalIntentString = 9, 
		RULE_newEntityDefinition = 10, RULE_newEntityListbody = 11, RULE_newEntityItemString = 12, 
		RULE_newEntityLine = 13, RULE_newCompositeDefinition = 14, RULE_newRegexDefinition = 15, 
		RULE_newEntityType = 16, RULE_newEntityRoles = 17, RULE_newEntityUsesFeatures = 18, 
		RULE_newEntityRoleOrFeatures = 19, RULE_text = 20, RULE_newEntityName = 21, 
		RULE_newEntityNameWithWS = 22, RULE_entityDefinition = 23, RULE_entityLine = 24, 
		RULE_entityName = 25, RULE_entityType = 26, RULE_compositeEntityIdentifier = 27, 
		RULE_regexEntityIdentifier = 28, RULE_entityIdentifier = 29, RULE_entityListBody = 30, 
		RULE_normalItemString = 31, RULE_importDefinition = 32, RULE_qnaDefinition = 33, 
		RULE_qnaQuestion = 34, RULE_questionText = 35, RULE_moreQuestionsBody = 36, 
		RULE_moreQuestion = 37, RULE_qnaAnswerBody = 38, RULE_filterSection = 39, 
		RULE_filterLine = 40, RULE_multiLineAnswer = 41, RULE_modelInfoDefinition = 42;
	public static final String[] ruleNames = {
		"file", "paragraph", "newline", "intentDefinition", "intentNameLine", 
		"intentName", "intentNameIdentifier", "intentBody", "normalIntentBody", 
		"normalIntentString", "newEntityDefinition", "newEntityListbody", "newEntityItemString", 
		"newEntityLine", "newCompositeDefinition", "newRegexDefinition", "newEntityType", 
		"newEntityRoles", "newEntityUsesFeatures", "newEntityRoleOrFeatures", 
		"text", "newEntityName", "newEntityNameWithWS", "entityDefinition", "entityLine", 
		"entityName", "entityType", "compositeEntityIdentifier", "regexEntityIdentifier", 
		"entityIdentifier", "entityListBody", "normalItemString", "importDefinition", 
		"qnaDefinition", "qnaQuestion", "questionText", "moreQuestionsBody", "moreQuestion", 
		"qnaAnswerBody", "filterSection", "filterLine", "multiLineAnswer", "modelInfoDefinition"
	};

	private static final String[] _LITERAL_NAMES = {
		null, null, null, null, null, null, null, null, null, null, null, null, 
		"'**Filters:**'", null, null, null, "','", "'='", null, "'instanceOf'", 
		null, null, null, null, null, null, null, null, null, "'.'", null, null, 
		null, null, null, null, null, null, "':'"
	};
	private static final String[] _SYMBOLIC_NAMES = {
		null, "MODEL_INFO", "COMMENT", "WS", "NEWLINE", "QNA", "HASH", "DASH", 
		"DOLLAR", "AT", "IMPORT_DESC", "IMPORT_PATH", "FILTER_MARK", "MULTI_LINE_TEXT", 
		"INVALID_TOKEN_DEFAULT_MODE", "WS_IN_NEW_ENTITY_IGNORED", "COMMA", "NEW_EQUAL", 
		"HAS_ROLES_LABEL", "INSTANCE_OF_LABEL", "HAS_FEATURES_LABEL", "NEW_ENTITY_TYPE_IDENTIFIER", 
		"NEW_ENTITY_IDENTIFIER", "NEW_ENTITY_IDENTIFIER_WITH_WS", "NEW_COMPOSITE_ENTITY", 
		"NEW_REGEX_ENTITY", "NEW_TEXT", "WS_IN_NAME_IGNORED", "IDENTIFIER", "DOT", 
		"WS_IN_LIST_BODY_IGNORED", "ESCAPE_CHARACTER", "EXPRESSION", "TEXT", "WS_IN_ENTITY_IGNORED", 
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
			setState(87); 
			_errHandler.sync(this);
			_alt = 1+1;
			do {
				switch (_alt) {
				case 1+1:
					{
					{
					setState(86);
					paragraph();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(89); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			} while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			setState(91);
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
			setState(100);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,1,_ctx) ) {
			case 1:
				enterOuterAlt(_localctx, 1);
				{
				setState(93);
				newline();
				}
				break;
			case 2:
				enterOuterAlt(_localctx, 2);
				{
				setState(94);
				intentDefinition();
				}
				break;
			case 3:
				enterOuterAlt(_localctx, 3);
				{
				setState(95);
				newEntityDefinition();
				}
				break;
			case 4:
				enterOuterAlt(_localctx, 4);
				{
				setState(96);
				entityDefinition();
				}
				break;
			case 5:
				enterOuterAlt(_localctx, 5);
				{
				setState(97);
				importDefinition();
				}
				break;
			case 6:
				enterOuterAlt(_localctx, 6);
				{
				setState(98);
				qnaDefinition();
				}
				break;
			case 7:
				enterOuterAlt(_localctx, 7);
				{
				setState(99);
				modelInfoDefinition();
				}
				break;
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
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
			setState(105);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(102);
				match(WS);
				}
				}
				setState(107);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(108);
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
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(110);
			intentNameLine();
			setState(111);
			newline();
			setState(113);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,3,_ctx) ) {
			case 1:
				{
				setState(112);
				intentBody();
				}
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

	public static class IntentNameLineContext extends ParserRuleContext {
		public TerminalNode HASH() { return getToken(LUFileParser.HASH, 0); }
		public IntentNameContext intentName() {
			return getRuleContext(IntentNameContext.class,0);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public IntentNameLineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_intentNameLine; }
	}

	public final IntentNameLineContext intentNameLine() throws RecognitionException {
		IntentNameLineContext _localctx = new IntentNameLineContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_intentNameLine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(118);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(115);
				match(WS);
				}
				}
				setState(120);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(121);
			match(HASH);
			setState(122);
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
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(124);
			intentNameIdentifier();
			setState(129);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,6,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					setState(127);
					_errHandler.sync(this);
					switch (_input.LA(1)) {
					case WS:
						{
						setState(125);
						match(WS);
						}
						break;
					case IDENTIFIER:
						{
						setState(126);
						intentNameIdentifier();
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					} 
				}
				setState(131);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,6,_ctx);
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
			setState(132);
			match(IDENTIFIER);
			setState(137);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==DOT) {
				{
				{
				setState(133);
				match(DOT);
				setState(134);
				match(IDENTIFIER);
				}
				}
				setState(139);
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
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
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(143);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(140);
					match(WS);
					}
					} 
				}
				setState(145);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,8,_ctx);
			}
			setState(146);
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
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
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(151);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,9,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(148);
					match(WS);
					}
					} 
				}
				setState(153);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,9,_ctx);
			}
			setState(157); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(154);
					normalIntentString();
					setState(155);
					newline();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(159); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,10,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
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
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(164);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(161);
				match(WS);
				}
				}
				setState(166);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(167);
			match(DASH);
			setState(171);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,12,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(168);
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
				}
				setState(173);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,12,_ctx);
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
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(174);
			newEntityLine();
			setState(175);
			newline();
			setState(177);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,13,_ctx) ) {
			case 1:
				{
				setState(176);
				newEntityListbody();
				}
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

	public static class NewEntityListbodyContext extends ParserRuleContext {
		public List<NewEntityItemStringContext> newEntityItemString() {
			return getRuleContexts(NewEntityItemStringContext.class);
		}
		public NewEntityItemStringContext newEntityItemString(int i) {
			return getRuleContext(NewEntityItemStringContext.class,i);
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
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(182); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(179);
					newEntityItemString();
					setState(180);
					newline();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(184); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,14,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
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

	public static class NewEntityItemStringContext extends ParserRuleContext {
		public TerminalNode DASH() { return getToken(LUFileParser.DASH, 0); }
		public NewEntityNameContext newEntityName() {
			return getRuleContext(NewEntityNameContext.class,0);
		}
		public NewEntityNameWithWSContext newEntityNameWithWS() {
			return getRuleContext(NewEntityNameWithWSContext.class,0);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public NewEntityUsesFeaturesContext newEntityUsesFeatures() {
			return getRuleContext(NewEntityUsesFeaturesContext.class,0);
		}
		public TerminalNode NEW_EQUAL() { return getToken(LUFileParser.NEW_EQUAL, 0); }
		public NewEntityItemStringContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityItemString; }
	}

	public final NewEntityItemStringContext newEntityItemString() throws RecognitionException {
		NewEntityItemStringContext _localctx = new NewEntityItemStringContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_newEntityItemString);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(189);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(186);
				match(WS);
				}
				}
				setState(191);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(192);
			match(DASH);
			setState(195);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NEW_ENTITY_TYPE_IDENTIFIER:
			case NEW_ENTITY_IDENTIFIER:
				{
				setState(193);
				newEntityName();
				}
				break;
			case NEW_ENTITY_IDENTIFIER_WITH_WS:
				{
				setState(194);
				newEntityNameWithWS();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(198);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==HAS_FEATURES_LABEL) {
				{
				setState(197);
				newEntityUsesFeatures();
				}
			}

			setState(201);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEW_EQUAL) {
				{
				setState(200);
				match(NEW_EQUAL);
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

	public static class NewEntityLineContext extends ParserRuleContext {
		public TerminalNode AT() { return getToken(LUFileParser.AT, 0); }
		public NewEntityNameContext newEntityName() {
			return getRuleContext(NewEntityNameContext.class,0);
		}
		public NewEntityNameWithWSContext newEntityNameWithWS() {
			return getRuleContext(NewEntityNameWithWSContext.class,0);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public NewEntityTypeContext newEntityType() {
			return getRuleContext(NewEntityTypeContext.class,0);
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
		enterRule(_localctx, 26, RULE_newEntityLine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(206);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(203);
				match(WS);
				}
				}
				setState(208);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(209);
			match(AT);
			setState(211);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,20,_ctx) ) {
			case 1:
				{
				setState(210);
				newEntityType();
				}
				break;
			}
			setState(215);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NEW_ENTITY_TYPE_IDENTIFIER:
			case NEW_ENTITY_IDENTIFIER:
				{
				setState(213);
				newEntityName();
				}
				break;
			case NEW_ENTITY_IDENTIFIER_WITH_WS:
				{
				setState(214);
				newEntityNameWithWS();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			setState(218);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << HAS_ROLES_LABEL) | (1L << NEW_ENTITY_IDENTIFIER) | (1L << NEW_TEXT))) != 0)) {
				{
				setState(217);
				newEntityRoles();
				}
			}

			setState(221);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==HAS_FEATURES_LABEL) {
				{
				setState(220);
				newEntityUsesFeatures();
				}
			}

			setState(224);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEW_EQUAL) {
				{
				setState(223);
				match(NEW_EQUAL);
				}
			}

			setState(228);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NEW_COMPOSITE_ENTITY:
				{
				setState(226);
				newCompositeDefinition();
				}
				break;
			case NEW_REGEX_ENTITY:
				{
				setState(227);
				newRegexDefinition();
				}
				break;
			case EOF:
			case WS:
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
		enterRule(_localctx, 28, RULE_newCompositeDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(230);
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
		enterRule(_localctx, 30, RULE_newRegexDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(232);
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
		enterRule(_localctx, 32, RULE_newEntityType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(234);
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
		enterRule(_localctx, 34, RULE_newEntityRoles);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(237);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==HAS_ROLES_LABEL) {
				{
				setState(236);
				match(HAS_ROLES_LABEL);
				}
			}

			setState(239);
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
		enterRule(_localctx, 36, RULE_newEntityUsesFeatures);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(241);
			match(HAS_FEATURES_LABEL);
			setState(242);
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
		enterRule(_localctx, 38, RULE_newEntityRoleOrFeatures);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(244);
			text();
			setState(249);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==COMMA) {
				{
				{
				setState(245);
				match(COMMA);
				setState(246);
				text();
				}
				}
				setState(251);
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
		enterRule(_localctx, 40, RULE_text);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(252);
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
		public TerminalNode NEW_ENTITY_TYPE_IDENTIFIER() { return getToken(LUFileParser.NEW_ENTITY_TYPE_IDENTIFIER, 0); }
		public TerminalNode NEW_ENTITY_IDENTIFIER() { return getToken(LUFileParser.NEW_ENTITY_IDENTIFIER, 0); }
		public NewEntityNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityName; }
	}

	public final NewEntityNameContext newEntityName() throws RecognitionException {
		NewEntityNameContext _localctx = new NewEntityNameContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_newEntityName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(254);
			_la = _input.LA(1);
			if ( !(_la==NEW_ENTITY_TYPE_IDENTIFIER || _la==NEW_ENTITY_IDENTIFIER) ) {
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

	public static class NewEntityNameWithWSContext extends ParserRuleContext {
		public TerminalNode NEW_ENTITY_IDENTIFIER_WITH_WS() { return getToken(LUFileParser.NEW_ENTITY_IDENTIFIER_WITH_WS, 0); }
		public NewEntityNameWithWSContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityNameWithWS; }
	}

	public final NewEntityNameWithWSContext newEntityNameWithWS() throws RecognitionException {
		NewEntityNameWithWSContext _localctx = new NewEntityNameWithWSContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_newEntityNameWithWS);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(256);
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
		enterRule(_localctx, 46, RULE_entityDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(258);
			entityLine();
			setState(259);
			newline();
			setState(261);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,28,_ctx) ) {
			case 1:
				{
				setState(260);
				entityListBody();
				}
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

	public static class EntityLineContext extends ParserRuleContext {
		public TerminalNode DOLLAR() { return getToken(LUFileParser.DOLLAR, 0); }
		public EntityNameContext entityName() {
			return getRuleContext(EntityNameContext.class,0);
		}
		public TerminalNode COLON_MARK() { return getToken(LUFileParser.COLON_MARK, 0); }
		public EntityTypeContext entityType() {
			return getRuleContext(EntityTypeContext.class,0);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public EntityLineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_entityLine; }
	}

	public final EntityLineContext entityLine() throws RecognitionException {
		EntityLineContext _localctx = new EntityLineContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_entityLine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(266);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(263);
				match(WS);
				}
				}
				setState(268);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(269);
			match(DOLLAR);
			setState(270);
			entityName();
			setState(271);
			match(COLON_MARK);
			setState(272);
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
		enterRule(_localctx, 50, RULE_entityName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(278);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==ENTITY_IDENTIFIER) {
				{
				setState(276);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ENTITY_IDENTIFIER:
					{
					setState(274);
					entityIdentifier();
					}
					break;
				case WS:
					{
					setState(275);
					match(WS);
					}
					break;
				default:
					throw new NoViableAltException(this);
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
		enterRule(_localctx, 52, RULE_entityType);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(289);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,33,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					setState(287);
					_errHandler.sync(this);
					switch (_input.LA(1)) {
					case ENTITY_IDENTIFIER:
						{
						setState(281);
						entityIdentifier();
						}
						break;
					case COMPOSITE_ENTITY:
						{
						setState(282);
						compositeEntityIdentifier();
						}
						break;
					case REGEX_ENTITY:
						{
						setState(283);
						regexEntityIdentifier();
						}
						break;
					case SPECIAL_CHAR_MARK:
						{
						setState(284);
						match(SPECIAL_CHAR_MARK);
						}
						break;
					case COLON_MARK:
						{
						setState(285);
						match(COLON_MARK);
						}
						break;
					case WS:
						{
						setState(286);
						match(WS);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					} 
				}
				setState(291);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,33,_ctx);
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
		enterRule(_localctx, 54, RULE_compositeEntityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(292);
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
		enterRule(_localctx, 56, RULE_regexEntityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(294);
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
		enterRule(_localctx, 58, RULE_entityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(296);
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
		enterRule(_localctx, 60, RULE_entityListBody);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(301); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(298);
					normalItemString();
					setState(299);
					newline();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(303); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,34,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
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
		public List<TerminalNode> EXPRESSION() { return getTokens(LUFileParser.EXPRESSION); }
		public TerminalNode EXPRESSION(int i) {
			return getToken(LUFileParser.EXPRESSION, i);
		}
		public NormalItemStringContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_normalItemString; }
	}

	public final NormalItemStringContext normalItemString() throws RecognitionException {
		NormalItemStringContext _localctx = new NormalItemStringContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_normalItemString);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(308);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(305);
				match(WS);
				}
				}
				setState(310);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(311);
			match(DASH);
			setState(315);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,36,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(312);
					_la = _input.LA(1);
					if ( !((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << WS) | (1L << EXPRESSION) | (1L << TEXT))) != 0)) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					} 
				}
				setState(317);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,36,_ctx);
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
		enterRule(_localctx, 64, RULE_importDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(318);
			match(IMPORT_DESC);
			setState(319);
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
		enterRule(_localctx, 66, RULE_qnaDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(321);
			qnaQuestion();
			setState(322);
			moreQuestionsBody();
			setState(323);
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public QnaQuestionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_qnaQuestion; }
	}

	public final QnaQuestionContext qnaQuestion() throws RecognitionException {
		QnaQuestionContext _localctx = new QnaQuestionContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_qnaQuestion);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(328);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(325);
				match(WS);
				}
				}
				setState(330);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(331);
			match(QNA);
			setState(332);
			questionText();
			setState(333);
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
		enterRule(_localctx, 70, RULE_questionText);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(338);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,38,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(335);
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
				}
				setState(340);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,38,_ctx);
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
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
		enterRule(_localctx, 72, RULE_moreQuestionsBody);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(344);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,39,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(341);
					match(WS);
					}
					} 
				}
				setState(346);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,39,_ctx);
			}
			setState(352);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==DASH) {
				{
				{
				setState(347);
				moreQuestion();
				setState(348);
				newline();
				}
				}
				setState(354);
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
		enterRule(_localctx, 74, RULE_moreQuestion);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(355);
			match(DASH);
			setState(359);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,41,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(356);
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
				}
				setState(361);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,41,_ctx);
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
		enterRule(_localctx, 76, RULE_qnaAnswerBody);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(363);
			_errHandler.sync(this);
			switch ( getInterpreter().adaptivePredict(_input,42,_ctx) ) {
			case 1:
				{
				setState(362);
				filterSection();
				}
				break;
			}
			setState(365);
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
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
		enterRule(_localctx, 78, RULE_filterSection);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(370);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(367);
				match(WS);
				}
				}
				setState(372);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(373);
			match(FILTER_MARK);
			setState(375); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(374);
					filterLine();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(377); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,44,_ctx);
			} while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
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
		enterRule(_localctx, 80, RULE_filterLine);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(382);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(379);
				match(WS);
				}
				}
				setState(384);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(385);
			match(DASH);
			setState(389);
			_errHandler.sync(this);
			_alt = getInterpreter().adaptivePredict(_input,46,_ctx);
			while ( _alt!=2 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER ) {
				if ( _alt==1 ) {
					{
					{
					setState(386);
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
				}
				setState(391);
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,46,_ctx);
			}
			setState(392);
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public MultiLineAnswerContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_multiLineAnswer; }
	}

	public final MultiLineAnswerContext multiLineAnswer() throws RecognitionException {
		MultiLineAnswerContext _localctx = new MultiLineAnswerContext(_ctx, getState());
		enterRule(_localctx, 82, RULE_multiLineAnswer);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(397);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(394);
				match(WS);
				}
				}
				setState(399);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(400);
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
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public ModelInfoDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_modelInfoDefinition; }
	}

	public final ModelInfoDefinitionContext modelInfoDefinition() throws RecognitionException {
		ModelInfoDefinitionContext _localctx = new ModelInfoDefinitionContext(_ctx, getState());
		enterRule(_localctx, 84, RULE_modelInfoDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(405);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS) {
				{
				{
				setState(402);
				match(WS);
				}
				}
				setState(407);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(408);
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
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3+\u019d\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
		"\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\4*\t*\4+\t+\4"+
		",\t,\3\2\6\2Z\n\2\r\2\16\2[\3\2\3\2\3\3\3\3\3\3\3\3\3\3\3\3\3\3\5\3g\n"+
		"\3\3\4\7\4j\n\4\f\4\16\4m\13\4\3\4\3\4\3\5\3\5\3\5\5\5t\n\5\3\6\7\6w\n"+
		"\6\f\6\16\6z\13\6\3\6\3\6\3\6\3\7\3\7\3\7\7\7\u0082\n\7\f\7\16\7\u0085"+
		"\13\7\3\b\3\b\3\b\7\b\u008a\n\b\f\b\16\b\u008d\13\b\3\t\7\t\u0090\n\t"+
		"\f\t\16\t\u0093\13\t\3\t\3\t\3\n\7\n\u0098\n\n\f\n\16\n\u009b\13\n\3\n"+
		"\3\n\3\n\6\n\u00a0\n\n\r\n\16\n\u00a1\3\13\7\13\u00a5\n\13\f\13\16\13"+
		"\u00a8\13\13\3\13\3\13\7\13\u00ac\n\13\f\13\16\13\u00af\13\13\3\f\3\f"+
		"\3\f\5\f\u00b4\n\f\3\r\3\r\3\r\6\r\u00b9\n\r\r\r\16\r\u00ba\3\16\7\16"+
		"\u00be\n\16\f\16\16\16\u00c1\13\16\3\16\3\16\3\16\5\16\u00c6\n\16\3\16"+
		"\5\16\u00c9\n\16\3\16\5\16\u00cc\n\16\3\17\7\17\u00cf\n\17\f\17\16\17"+
		"\u00d2\13\17\3\17\3\17\5\17\u00d6\n\17\3\17\3\17\5\17\u00da\n\17\3\17"+
		"\5\17\u00dd\n\17\3\17\5\17\u00e0\n\17\3\17\5\17\u00e3\n\17\3\17\3\17\5"+
		"\17\u00e7\n\17\3\20\3\20\3\21\3\21\3\22\3\22\3\23\5\23\u00f0\n\23\3\23"+
		"\3\23\3\24\3\24\3\24\3\25\3\25\3\25\7\25\u00fa\n\25\f\25\16\25\u00fd\13"+
		"\25\3\26\3\26\3\27\3\27\3\30\3\30\3\31\3\31\3\31\5\31\u0108\n\31\3\32"+
		"\7\32\u010b\n\32\f\32\16\32\u010e\13\32\3\32\3\32\3\32\3\32\3\32\3\33"+
		"\3\33\7\33\u0117\n\33\f\33\16\33\u011a\13\33\3\34\3\34\3\34\3\34\3\34"+
		"\3\34\7\34\u0122\n\34\f\34\16\34\u0125\13\34\3\35\3\35\3\36\3\36\3\37"+
		"\3\37\3 \3 \3 \6 \u0130\n \r \16 \u0131\3!\7!\u0135\n!\f!\16!\u0138\13"+
		"!\3!\3!\7!\u013c\n!\f!\16!\u013f\13!\3\"\3\"\3\"\3#\3#\3#\3#\3$\7$\u0149"+
		"\n$\f$\16$\u014c\13$\3$\3$\3$\3$\3%\7%\u0153\n%\f%\16%\u0156\13%\3&\7"+
		"&\u0159\n&\f&\16&\u015c\13&\3&\3&\3&\7&\u0161\n&\f&\16&\u0164\13&\3\'"+
		"\3\'\7\'\u0168\n\'\f\'\16\'\u016b\13\'\3(\5(\u016e\n(\3(\3(\3)\7)\u0173"+
		"\n)\f)\16)\u0176\13)\3)\3)\6)\u017a\n)\r)\16)\u017b\3*\7*\u017f\n*\f*"+
		"\16*\u0182\13*\3*\3*\7*\u0186\n*\f*\16*\u0189\13*\3*\3*\3+\7+\u018e\n"+
		"+\f+\16+\u0191\13+\3+\3+\3,\7,\u0196\n,\f,\16,\u0199\13,\3,\3,\3,\3[\2"+
		"-\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36 \"$&(*,.\60\62\64\668:<>@BDF"+
		"HJLNPRTV\2\t\3\3\6\6\4\2\5\5!#\4\2\30\30\34\34\3\2\27\30\4\2\5\5\"#\4"+
		"\2\5\5++\4\2\5\5##\2\u01ac\2Y\3\2\2\2\4f\3\2\2\2\6k\3\2\2\2\bp\3\2\2\2"+
		"\nx\3\2\2\2\f~\3\2\2\2\16\u0086\3\2\2\2\20\u0091\3\2\2\2\22\u0099\3\2"+
		"\2\2\24\u00a6\3\2\2\2\26\u00b0\3\2\2\2\30\u00b8\3\2\2\2\32\u00bf\3\2\2"+
		"\2\34\u00d0\3\2\2\2\36\u00e8\3\2\2\2 \u00ea\3\2\2\2\"\u00ec\3\2\2\2$\u00ef"+
		"\3\2\2\2&\u00f3\3\2\2\2(\u00f6\3\2\2\2*\u00fe\3\2\2\2,\u0100\3\2\2\2."+
		"\u0102\3\2\2\2\60\u0104\3\2\2\2\62\u010c\3\2\2\2\64\u0118\3\2\2\2\66\u0123"+
		"\3\2\2\28\u0126\3\2\2\2:\u0128\3\2\2\2<\u012a\3\2\2\2>\u012f\3\2\2\2@"+
		"\u0136\3\2\2\2B\u0140\3\2\2\2D\u0143\3\2\2\2F\u014a\3\2\2\2H\u0154\3\2"+
		"\2\2J\u015a\3\2\2\2L\u0165\3\2\2\2N\u016d\3\2\2\2P\u0174\3\2\2\2R\u0180"+
		"\3\2\2\2T\u018f\3\2\2\2V\u0197\3\2\2\2XZ\5\4\3\2YX\3\2\2\2Z[\3\2\2\2["+
		"\\\3\2\2\2[Y\3\2\2\2\\]\3\2\2\2]^\7\2\2\3^\3\3\2\2\2_g\5\6\4\2`g\5\b\5"+
		"\2ag\5\26\f\2bg\5\60\31\2cg\5B\"\2dg\5D#\2eg\5V,\2f_\3\2\2\2f`\3\2\2\2"+
		"fa\3\2\2\2fb\3\2\2\2fc\3\2\2\2fd\3\2\2\2fe\3\2\2\2g\5\3\2\2\2hj\7\5\2"+
		"\2ih\3\2\2\2jm\3\2\2\2ki\3\2\2\2kl\3\2\2\2ln\3\2\2\2mk\3\2\2\2no\t\2\2"+
		"\2o\7\3\2\2\2pq\5\n\6\2qs\5\6\4\2rt\5\20\t\2sr\3\2\2\2st\3\2\2\2t\t\3"+
		"\2\2\2uw\7\5\2\2vu\3\2\2\2wz\3\2\2\2xv\3\2\2\2xy\3\2\2\2y{\3\2\2\2zx\3"+
		"\2\2\2{|\7\b\2\2|}\5\f\7\2}\13\3\2\2\2~\u0083\5\16\b\2\177\u0082\7\5\2"+
		"\2\u0080\u0082\5\16\b\2\u0081\177\3\2\2\2\u0081\u0080\3\2\2\2\u0082\u0085"+
		"\3\2\2\2\u0083\u0081\3\2\2\2\u0083\u0084\3\2\2\2\u0084\r\3\2\2\2\u0085"+
		"\u0083\3\2\2\2\u0086\u008b\7\36\2\2\u0087\u0088\7\37\2\2\u0088\u008a\7"+
		"\36\2\2\u0089\u0087\3\2\2\2\u008a\u008d\3\2\2\2\u008b\u0089\3\2\2\2\u008b"+
		"\u008c\3\2\2\2\u008c\17\3\2\2\2\u008d\u008b\3\2\2\2\u008e\u0090\7\5\2"+
		"\2\u008f\u008e\3\2\2\2\u0090\u0093\3\2\2\2\u0091\u008f\3\2\2\2\u0091\u0092"+
		"\3\2\2\2\u0092\u0094\3\2\2\2\u0093\u0091\3\2\2\2\u0094\u0095\5\22\n\2"+
		"\u0095\21\3\2\2\2\u0096\u0098\7\5\2\2\u0097\u0096\3\2\2\2\u0098\u009b"+
		"\3\2\2\2\u0099\u0097\3\2\2\2\u0099\u009a\3\2\2\2\u009a\u009f\3\2\2\2\u009b"+
		"\u0099\3\2\2\2\u009c\u009d\5\24\13\2\u009d\u009e\5\6\4\2\u009e\u00a0\3"+
		"\2\2\2\u009f\u009c\3\2\2\2\u00a0\u00a1\3\2\2\2\u00a1\u009f\3\2\2\2\u00a1"+
		"\u00a2\3\2\2\2\u00a2\23\3\2\2\2\u00a3\u00a5\7\5\2\2\u00a4\u00a3\3\2\2"+
		"\2\u00a5\u00a8\3\2\2\2\u00a6\u00a4\3\2\2\2\u00a6\u00a7\3\2\2\2\u00a7\u00a9"+
		"\3\2\2\2\u00a8\u00a6\3\2\2\2\u00a9\u00ad\7\t\2\2\u00aa\u00ac\t\3\2\2\u00ab"+
		"\u00aa\3\2\2\2\u00ac\u00af\3\2\2\2\u00ad\u00ab\3\2\2\2\u00ad\u00ae\3\2"+
		"\2\2\u00ae\25\3\2\2\2\u00af\u00ad\3\2\2\2\u00b0\u00b1\5\34\17\2\u00b1"+
		"\u00b3\5\6\4\2\u00b2\u00b4\5\30\r\2\u00b3\u00b2\3\2\2\2\u00b3\u00b4\3"+
		"\2\2\2\u00b4\27\3\2\2\2\u00b5\u00b6\5\32\16\2\u00b6\u00b7\5\6\4\2\u00b7"+
		"\u00b9\3\2\2\2\u00b8\u00b5\3\2\2\2\u00b9\u00ba\3\2\2\2\u00ba\u00b8\3\2"+
		"\2\2\u00ba\u00bb\3\2\2\2\u00bb\31\3\2\2\2\u00bc\u00be\7\5\2\2\u00bd\u00bc"+
		"\3\2\2\2\u00be\u00c1\3\2\2\2\u00bf\u00bd\3\2\2\2\u00bf\u00c0\3\2\2\2\u00c0"+
		"\u00c2\3\2\2\2\u00c1\u00bf\3\2\2\2\u00c2\u00c5\7\t\2\2\u00c3\u00c6\5,"+
		"\27\2\u00c4\u00c6\5.\30\2\u00c5\u00c3\3\2\2\2\u00c5\u00c4\3\2\2\2\u00c6"+
		"\u00c8\3\2\2\2\u00c7\u00c9\5&\24\2\u00c8\u00c7\3\2\2\2\u00c8\u00c9\3\2"+
		"\2\2\u00c9\u00cb\3\2\2\2\u00ca\u00cc\7\23\2\2\u00cb\u00ca\3\2\2\2\u00cb"+
		"\u00cc\3\2\2\2\u00cc\33\3\2\2\2\u00cd\u00cf\7\5\2\2\u00ce\u00cd\3\2\2"+
		"\2\u00cf\u00d2\3\2\2\2\u00d0\u00ce\3\2\2\2\u00d0\u00d1\3\2\2\2\u00d1\u00d3"+
		"\3\2\2\2\u00d2\u00d0\3\2\2\2\u00d3\u00d5\7\13\2\2\u00d4\u00d6\5\"\22\2"+
		"\u00d5\u00d4\3\2\2\2\u00d5\u00d6\3\2\2\2\u00d6\u00d9\3\2\2\2\u00d7\u00da"+
		"\5,\27\2\u00d8\u00da\5.\30\2\u00d9\u00d7\3\2\2\2\u00d9\u00d8\3\2\2\2\u00da"+
		"\u00dc\3\2\2\2\u00db\u00dd\5$\23\2\u00dc\u00db\3\2\2\2\u00dc\u00dd\3\2"+
		"\2\2\u00dd\u00df\3\2\2\2\u00de\u00e0\5&\24\2\u00df\u00de\3\2\2\2\u00df"+
		"\u00e0\3\2\2\2\u00e0\u00e2\3\2\2\2\u00e1\u00e3\7\23\2\2\u00e2\u00e1\3"+
		"\2\2\2\u00e2\u00e3\3\2\2\2\u00e3\u00e6\3\2\2\2\u00e4\u00e7\5\36\20\2\u00e5"+
		"\u00e7\5 \21\2\u00e6\u00e4\3\2\2\2\u00e6\u00e5\3\2\2\2\u00e6\u00e7\3\2"+
		"\2\2\u00e7\35\3\2\2\2\u00e8\u00e9\7\32\2\2\u00e9\37\3\2\2\2\u00ea\u00eb"+
		"\7\33\2\2\u00eb!\3\2\2\2\u00ec\u00ed\7\27\2\2\u00ed#\3\2\2\2\u00ee\u00f0"+
		"\7\24\2\2\u00ef\u00ee\3\2\2\2\u00ef\u00f0\3\2\2\2\u00f0\u00f1\3\2\2\2"+
		"\u00f1\u00f2\5(\25\2\u00f2%\3\2\2\2\u00f3\u00f4\7\26\2\2\u00f4\u00f5\5"+
		"(\25\2\u00f5\'\3\2\2\2\u00f6\u00fb\5*\26\2\u00f7\u00f8\7\22\2\2\u00f8"+
		"\u00fa\5*\26\2\u00f9\u00f7\3\2\2\2\u00fa\u00fd\3\2\2\2\u00fb\u00f9\3\2"+
		"\2\2\u00fb\u00fc\3\2\2\2\u00fc)\3\2\2\2\u00fd\u00fb\3\2\2\2\u00fe\u00ff"+
		"\t\4\2\2\u00ff+\3\2\2\2\u0100\u0101\t\5\2\2\u0101-\3\2\2\2\u0102\u0103"+
		"\7\31\2\2\u0103/\3\2\2\2\u0104\u0105\5\62\32\2\u0105\u0107\5\6\4\2\u0106"+
		"\u0108\5> \2\u0107\u0106\3\2\2\2\u0107\u0108\3\2\2\2\u0108\61\3\2\2\2"+
		"\u0109\u010b\7\5\2\2\u010a\u0109\3\2\2\2\u010b\u010e\3\2\2\2\u010c\u010a"+
		"\3\2\2\2\u010c\u010d\3\2\2\2\u010d\u010f\3\2\2\2\u010e\u010c\3\2\2\2\u010f"+
		"\u0110\7\n\2\2\u0110\u0111\5\64\33\2\u0111\u0112\7(\2\2\u0112\u0113\5"+
		"\66\34\2\u0113\63\3\2\2\2\u0114\u0117\5<\37\2\u0115\u0117\7\5\2\2\u0116"+
		"\u0114\3\2\2\2\u0116\u0115\3\2\2\2\u0117\u011a\3\2\2\2\u0118\u0116\3\2"+
		"\2\2\u0118\u0119\3\2\2\2\u0119\65\3\2\2\2\u011a\u0118\3\2\2\2\u011b\u0122"+
		"\5<\37\2\u011c\u0122\58\35\2\u011d\u0122\5:\36\2\u011e\u0122\7)\2\2\u011f"+
		"\u0122\7(\2\2\u0120\u0122\7\5\2\2\u0121\u011b\3\2\2\2\u0121\u011c\3\2"+
		"\2\2\u0121\u011d\3\2\2\2\u0121\u011e\3\2\2\2\u0121\u011f\3\2\2\2\u0121"+
		"\u0120\3\2\2\2\u0122\u0125\3\2\2\2\u0123\u0121\3\2\2\2\u0123\u0124\3\2"+
		"\2\2\u0124\67\3\2\2\2\u0125\u0123\3\2\2\2\u0126\u0127\7&\2\2\u01279\3"+
		"\2\2\2\u0128\u0129\7\'\2\2\u0129;\3\2\2\2\u012a\u012b\7%\2\2\u012b=\3"+
		"\2\2\2\u012c\u012d\5@!\2\u012d\u012e\5\6\4\2\u012e\u0130\3\2\2\2\u012f"+
		"\u012c\3\2\2\2\u0130\u0131\3\2\2\2\u0131\u012f\3\2\2\2\u0131\u0132\3\2"+
		"\2\2\u0132?\3\2\2\2\u0133\u0135\7\5\2\2\u0134\u0133\3\2\2\2\u0135\u0138"+
		"\3\2\2\2\u0136\u0134\3\2\2\2\u0136\u0137\3\2\2\2\u0137\u0139\3\2\2\2\u0138"+
		"\u0136\3\2\2\2\u0139\u013d\7\t\2\2\u013a\u013c\t\6\2\2\u013b\u013a\3\2"+
		"\2\2\u013c\u013f\3\2\2\2\u013d\u013b\3\2\2\2\u013d\u013e\3\2\2\2\u013e"+
		"A\3\2\2\2\u013f\u013d\3\2\2\2\u0140\u0141\7\f\2\2\u0141\u0142\7\r\2\2"+
		"\u0142C\3\2\2\2\u0143\u0144\5F$\2\u0144\u0145\5J&\2\u0145\u0146\5N(\2"+
		"\u0146E\3\2\2\2\u0147\u0149\7\5\2\2\u0148\u0147\3\2\2\2\u0149\u014c\3"+
		"\2\2\2\u014a\u0148\3\2\2\2\u014a\u014b\3\2\2\2\u014b\u014d\3\2\2\2\u014c"+
		"\u014a\3\2\2\2\u014d\u014e\7\7\2\2\u014e\u014f\5H%\2\u014f\u0150\5\6\4"+
		"\2\u0150G\3\2\2\2\u0151\u0153\t\7\2\2\u0152\u0151\3\2\2\2\u0153\u0156"+
		"\3\2\2\2\u0154\u0152\3\2\2\2\u0154\u0155\3\2\2\2\u0155I\3\2\2\2\u0156"+
		"\u0154\3\2\2\2\u0157\u0159\7\5\2\2\u0158\u0157\3\2\2\2\u0159\u015c\3\2"+
		"\2\2\u015a\u0158\3\2\2\2\u015a\u015b\3\2\2\2\u015b\u0162\3\2\2\2\u015c"+
		"\u015a\3\2\2\2\u015d\u015e\5L\'\2\u015e\u015f\5\6\4\2\u015f\u0161\3\2"+
		"\2\2\u0160\u015d\3\2\2\2\u0161\u0164\3\2\2\2\u0162\u0160\3\2\2\2\u0162"+
		"\u0163\3\2\2\2\u0163K\3\2\2\2\u0164\u0162\3\2\2\2\u0165\u0169\7\t\2\2"+
		"\u0166\u0168\t\b\2\2\u0167\u0166\3\2\2\2\u0168\u016b\3\2\2\2\u0169\u0167"+
		"\3\2\2\2\u0169\u016a\3\2\2\2\u016aM\3\2\2\2\u016b\u0169\3\2\2\2\u016c"+
		"\u016e\5P)\2\u016d\u016c\3\2\2\2\u016d\u016e\3\2\2\2\u016e\u016f\3\2\2"+
		"\2\u016f\u0170\5T+\2\u0170O\3\2\2\2\u0171\u0173\7\5\2\2\u0172\u0171\3"+
		"\2\2\2\u0173\u0176\3\2\2\2\u0174\u0172\3\2\2\2\u0174\u0175\3\2\2\2\u0175"+
		"\u0177\3\2\2\2\u0176\u0174\3\2\2\2\u0177\u0179\7\16\2\2\u0178\u017a\5"+
		"R*\2\u0179\u0178\3\2\2\2\u017a\u017b\3\2\2\2\u017b\u0179\3\2\2\2\u017b"+
		"\u017c\3\2\2\2\u017cQ\3\2\2\2\u017d\u017f\7\5\2\2\u017e\u017d\3\2\2\2"+
		"\u017f\u0182\3\2\2\2\u0180\u017e\3\2\2\2\u0180\u0181\3\2\2\2\u0181\u0183"+
		"\3\2\2\2\u0182\u0180\3\2\2\2\u0183\u0187\7\t\2\2\u0184\u0186\t\b\2\2\u0185"+
		"\u0184\3\2\2\2\u0186\u0189\3\2\2\2\u0187\u0185\3\2\2\2\u0187\u0188\3\2"+
		"\2\2\u0188\u018a\3\2\2\2\u0189\u0187\3\2\2\2\u018a\u018b\5\6\4\2\u018b"+
		"S\3\2\2\2\u018c\u018e\7\5\2\2\u018d\u018c\3\2\2\2\u018e\u0191\3\2\2\2"+
		"\u018f\u018d\3\2\2\2\u018f\u0190\3\2\2\2\u0190\u0192\3\2\2\2\u0191\u018f"+
		"\3\2\2\2\u0192\u0193\7\17\2\2\u0193U\3\2\2\2\u0194\u0196\7\5\2\2\u0195"+
		"\u0194\3\2\2\2\u0196\u0199\3\2\2\2\u0197\u0195\3\2\2\2\u0197\u0198\3\2"+
		"\2\2\u0198\u019a\3\2\2\2\u0199\u0197\3\2\2\2\u019a\u019b\7\3\2\2\u019b"+
		"W\3\2\2\2\63[fksx\u0081\u0083\u008b\u0091\u0099\u00a1\u00a6\u00ad\u00b3"+
		"\u00ba\u00bf\u00c5\u00c8\u00cb\u00d0\u00d5\u00d9\u00dc\u00df\u00e2\u00e6"+
		"\u00ef\u00fb\u0107\u010c\u0116\u0118\u0121\u0123\u0131\u0136\u013d\u014a"+
		"\u0154\u015a\u0162\u0169\u016d\u0174\u017b\u0180\u0187\u018f\u0197";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}