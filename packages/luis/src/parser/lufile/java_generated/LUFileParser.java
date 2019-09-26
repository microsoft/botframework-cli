// Generated from LUFileParser.g4 by ANTLR 4.7.2
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
		RULE_file = 0, RULE_paragraph = 1, RULE_newline = 2, RULE_intentDefinition = 3, 
		RULE_intentNameLine = 4, RULE_intentName = 5, RULE_intentNameIdentifier = 6, 
		RULE_intentBody = 7, RULE_normalIntentBody = 8, RULE_normalIntentString = 9, 
		RULE_newEntityDefinition = 10, RULE_newEntityListbody = 11, RULE_newEntityLine = 12, 
		RULE_newCompositeInlineDefinition = 13, RULE_newRegexInlineDefinition = 14, 
		RULE_newEntityType = 15, RULE_newEntityRoles = 16, RULE_newEntityUsesFeatures = 17, 
		RULE_newEntityName = 18, RULE_newEntityNameWithWS = 19, RULE_entityDefinition = 20, 
		RULE_entityLine = 21, RULE_entityName = 22, RULE_entityType = 23, RULE_compositeEntityIdentifier = 24, 
		RULE_regexEntityIdentifier = 25, RULE_entityIdentifier = 26, RULE_entityListBody = 27, 
		RULE_normalItemString = 28, RULE_importDefinition = 29, RULE_qnaDefinition = 30, 
		RULE_qnaQuestion = 31, RULE_questionText = 32, RULE_moreQuestionsBody = 33, 
		RULE_moreQuestion = 34, RULE_qnaAnswerBody = 35, RULE_filterSection = 36, 
		RULE_filterLine = 37, RULE_multiLineAnswer = 38, RULE_modelInfoDefinition = 39;
	private static String[] makeRuleNames() {
		return new String[] {
			"file", "paragraph", "newline", "intentDefinition", "intentNameLine", 
			"intentName", "intentNameIdentifier", "intentBody", "normalIntentBody", 
			"normalIntentString", "newEntityDefinition", "newEntityListbody", "newEntityLine", 
			"newCompositeInlineDefinition", "newRegexInlineDefinition", "newEntityType", 
			"newEntityRoles", "newEntityUsesFeatures", "newEntityName", "newEntityNameWithWS", 
			"entityDefinition", "entityLine", "entityName", "entityType", "compositeEntityIdentifier", 
			"regexEntityIdentifier", "entityIdentifier", "entityListBody", "normalItemString", 
			"importDefinition", "qnaDefinition", "qnaQuestion", "questionText", "moreQuestionsBody", 
			"moreQuestion", "qnaAnswerBody", "filterSection", "filterLine", "multiLineAnswer", 
			"modelInfoDefinition"
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterFile(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitFile(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitFile(this);
			else return visitor.visitChildren(this);
		}
	}

	public final FileContext file() throws RecognitionException {
		FileContext _localctx = new FileContext(_ctx, getState());
		enterRule(_localctx, 0, RULE_file);
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(81); 
			_errHandler.sync(this);
			_alt = 1+1;
			do {
				switch (_alt) {
				case 1+1:
					{
					{
					setState(80);
					paragraph();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(83); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,0,_ctx);
			} while ( _alt!=1 && _alt!=org.antlr.v4.runtime.atn.ATN.INVALID_ALT_NUMBER );
			setState(85);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterParagraph(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitParagraph(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitParagraph(this);
			else return visitor.visitChildren(this);
		}
	}

	public final ParagraphContext paragraph() throws RecognitionException {
		ParagraphContext _localctx = new ParagraphContext(_ctx, getState());
		enterRule(_localctx, 2, RULE_paragraph);
		try {
			setState(94);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case EOF:
			case NEWLINE:
				enterOuterAlt(_localctx, 1);
				{
				setState(87);
				newline();
				}
				break;
			case HASH:
				enterOuterAlt(_localctx, 2);
				{
				setState(88);
				intentDefinition();
				}
				break;
			case AT:
				enterOuterAlt(_localctx, 3);
				{
				setState(89);
				newEntityDefinition();
				}
				break;
			case DOLLAR:
				enterOuterAlt(_localctx, 4);
				{
				setState(90);
				entityDefinition();
				}
				break;
			case IMPORT_DESC:
				enterOuterAlt(_localctx, 5);
				{
				setState(91);
				importDefinition();
				}
				break;
			case QNA:
				enterOuterAlt(_localctx, 6);
				{
				setState(92);
				qnaDefinition();
				}
				break;
			case MODEL_INFO:
				enterOuterAlt(_localctx, 7);
				{
				setState(93);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewline(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewline(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewline(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewlineContext newline() throws RecognitionException {
		NewlineContext _localctx = new NewlineContext(_ctx, getState());
		enterRule(_localctx, 4, RULE_newline);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(96);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterIntentDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitIntentDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitIntentDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final IntentDefinitionContext intentDefinition() throws RecognitionException {
		IntentDefinitionContext _localctx = new IntentDefinitionContext(_ctx, getState());
		enterRule(_localctx, 6, RULE_intentDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(98);
			intentNameLine();
			setState(99);
			newline();
			setState(101);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DASH) {
				{
				setState(100);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterIntentNameLine(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitIntentNameLine(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitIntentNameLine(this);
			else return visitor.visitChildren(this);
		}
	}

	public final IntentNameLineContext intentNameLine() throws RecognitionException {
		IntentNameLineContext _localctx = new IntentNameLineContext(_ctx, getState());
		enterRule(_localctx, 8, RULE_intentNameLine);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(103);
			match(HASH);
			setState(104);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterIntentName(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitIntentName(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitIntentName(this);
			else return visitor.visitChildren(this);
		}
	}

	public final IntentNameContext intentName() throws RecognitionException {
		IntentNameContext _localctx = new IntentNameContext(_ctx, getState());
		enterRule(_localctx, 10, RULE_intentName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(106);
			intentNameIdentifier();
			setState(111);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==IDENTIFIER) {
				{
				setState(109);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case WS:
					{
					setState(107);
					match(WS);
					}
					break;
				case IDENTIFIER:
					{
					setState(108);
					intentNameIdentifier();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(113);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterIntentNameIdentifier(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitIntentNameIdentifier(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitIntentNameIdentifier(this);
			else return visitor.visitChildren(this);
		}
	}

	public final IntentNameIdentifierContext intentNameIdentifier() throws RecognitionException {
		IntentNameIdentifierContext _localctx = new IntentNameIdentifierContext(_ctx, getState());
		enterRule(_localctx, 12, RULE_intentNameIdentifier);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(114);
			match(IDENTIFIER);
			setState(119);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==DOT) {
				{
				{
				setState(115);
				match(DOT);
				setState(116);
				match(IDENTIFIER);
				}
				}
				setState(121);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterIntentBody(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitIntentBody(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitIntentBody(this);
			else return visitor.visitChildren(this);
		}
	}

	public final IntentBodyContext intentBody() throws RecognitionException {
		IntentBodyContext _localctx = new IntentBodyContext(_ctx, getState());
		enterRule(_localctx, 14, RULE_intentBody);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(122);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNormalIntentBody(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNormalIntentBody(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNormalIntentBody(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NormalIntentBodyContext normalIntentBody() throws RecognitionException {
		NormalIntentBodyContext _localctx = new NormalIntentBodyContext(_ctx, getState());
		enterRule(_localctx, 16, RULE_normalIntentBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(127); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(124);
				normalIntentString();
				setState(125);
				newline();
				}
				}
				setState(129); 
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNormalIntentString(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNormalIntentString(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNormalIntentString(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NormalIntentStringContext normalIntentString() throws RecognitionException {
		NormalIntentStringContext _localctx = new NormalIntentStringContext(_ctx, getState());
		enterRule(_localctx, 18, RULE_normalIntentString);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(131);
			match(DASH);
			setState(135);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << WS) | (1L << ESCAPE_CHARACTER) | (1L << EXPRESSION) | (1L << TEXT))) != 0)) {
				{
				{
				setState(132);
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
				setState(137);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityDefinitionContext newEntityDefinition() throws RecognitionException {
		NewEntityDefinitionContext _localctx = new NewEntityDefinitionContext(_ctx, getState());
		enterRule(_localctx, 20, RULE_newEntityDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(138);
			newEntityLine();
			setState(139);
			newline();
			setState(141);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DASH) {
				{
				setState(140);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityListbody(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityListbody(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityListbody(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityListbodyContext newEntityListbody() throws RecognitionException {
		NewEntityListbodyContext _localctx = new NewEntityListbodyContext(_ctx, getState());
		enterRule(_localctx, 22, RULE_newEntityListbody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(146); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(143);
				normalItemString();
				setState(144);
				newline();
				}
				}
				setState(148); 
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
		public List<NewEntityRolesContext> newEntityRoles() {
			return getRuleContexts(NewEntityRolesContext.class);
		}
		public NewEntityRolesContext newEntityRoles(int i) {
			return getRuleContext(NewEntityRolesContext.class,i);
		}
		public List<NewEntityUsesFeaturesContext> newEntityUsesFeatures() {
			return getRuleContexts(NewEntityUsesFeaturesContext.class);
		}
		public NewEntityUsesFeaturesContext newEntityUsesFeatures(int i) {
			return getRuleContext(NewEntityUsesFeaturesContext.class,i);
		}
		public TerminalNode NEW_EQUAL() { return getToken(LUFileParser.NEW_EQUAL, 0); }
		public NewCompositeInlineDefinitionContext newCompositeInlineDefinition() {
			return getRuleContext(NewCompositeInlineDefinitionContext.class,0);
		}
		public NewRegexInlineDefinitionContext newRegexInlineDefinition() {
			return getRuleContext(NewRegexInlineDefinitionContext.class,0);
		}
		public NewEntityLineContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityLine; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityLine(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityLine(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityLine(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityLineContext newEntityLine() throws RecognitionException {
		NewEntityLineContext _localctx = new NewEntityLineContext(_ctx, getState());
		enterRule(_localctx, 24, RULE_newEntityLine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(150);
			match(AT);
			setState(151);
			newEntityType();
			setState(154);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NEW_ENTITY_IDENTIFIER:
				{
				setState(152);
				newEntityName();
				}
				break;
			case SINGLE_QUOTE:
			case DOUBLE_QUOTE:
				{
				setState(153);
				newEntityNameWithWS();
				}
				break;
			case EOF:
			case WS:
			case NEWLINE:
			case NEW_EQUAL:
			case NEW_COMPOSITE_DECORATION_LEFT:
			case NEW_REGEX_DECORATION:
			case HAS_ROLES_LABEL:
			case HAS_FEATURES_LABEL:
			case NEW_TEXT:
				break;
			default:
				break;
			}
			setState(160);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << WS) | (1L << HAS_ROLES_LABEL) | (1L << HAS_FEATURES_LABEL) | (1L << NEW_TEXT))) != 0)) {
				{
				setState(158);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case WS:
				case HAS_ROLES_LABEL:
				case NEW_TEXT:
					{
					setState(156);
					newEntityRoles();
					}
					break;
				case HAS_FEATURES_LABEL:
					{
					setState(157);
					newEntityUsesFeatures();
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(162);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(164);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==NEW_EQUAL) {
				{
				setState(163);
				match(NEW_EQUAL);
				}
			}

			setState(168);
			_errHandler.sync(this);
			switch (_input.LA(1)) {
			case NEW_COMPOSITE_DECORATION_LEFT:
				{
				setState(166);
				newCompositeInlineDefinition();
				}
				break;
			case NEW_REGEX_DECORATION:
				{
				setState(167);
				newRegexInlineDefinition();
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

	public static class NewCompositeInlineDefinitionContext extends ParserRuleContext {
		public TerminalNode NEW_COMPOSITE_DECORATION_LEFT() { return getToken(LUFileParser.NEW_COMPOSITE_DECORATION_LEFT, 0); }
		public TerminalNode NEW_COMPOSITE_DECORATION_RIGHT() { return getToken(LUFileParser.NEW_COMPOSITE_DECORATION_RIGHT, 0); }
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> NEW_TEXT() { return getTokens(LUFileParser.NEW_TEXT); }
		public TerminalNode NEW_TEXT(int i) {
			return getToken(LUFileParser.NEW_TEXT, i);
		}
		public NewCompositeInlineDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newCompositeInlineDefinition; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewCompositeInlineDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewCompositeInlineDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewCompositeInlineDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewCompositeInlineDefinitionContext newCompositeInlineDefinition() throws RecognitionException {
		NewCompositeInlineDefinitionContext _localctx = new NewCompositeInlineDefinitionContext(_ctx, getState());
		enterRule(_localctx, 26, RULE_newCompositeInlineDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(170);
			match(NEW_COMPOSITE_DECORATION_LEFT);
			setState(174);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==NEW_TEXT) {
				{
				{
				setState(171);
				_la = _input.LA(1);
				if ( !(_la==WS || _la==NEW_TEXT) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(176);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(177);
			match(NEW_COMPOSITE_DECORATION_RIGHT);
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

	public static class NewRegexInlineDefinitionContext extends ParserRuleContext {
		public List<TerminalNode> NEW_REGEX_DECORATION() { return getTokens(LUFileParser.NEW_REGEX_DECORATION); }
		public TerminalNode NEW_REGEX_DECORATION(int i) {
			return getToken(LUFileParser.NEW_REGEX_DECORATION, i);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> NEW_TEXT() { return getTokens(LUFileParser.NEW_TEXT); }
		public TerminalNode NEW_TEXT(int i) {
			return getToken(LUFileParser.NEW_TEXT, i);
		}
		public NewRegexInlineDefinitionContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newRegexInlineDefinition; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewRegexInlineDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewRegexInlineDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewRegexInlineDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewRegexInlineDefinitionContext newRegexInlineDefinition() throws RecognitionException {
		NewRegexInlineDefinitionContext _localctx = new NewRegexInlineDefinitionContext(_ctx, getState());
		enterRule(_localctx, 28, RULE_newRegexInlineDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(179);
			match(NEW_REGEX_DECORATION);
			setState(183);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==NEW_TEXT) {
				{
				{
				setState(180);
				_la = _input.LA(1);
				if ( !(_la==WS || _la==NEW_TEXT) ) {
				_errHandler.recoverInline(this);
				}
				else {
					if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
					_errHandler.reportMatch(this);
					consume();
				}
				}
				}
				setState(185);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(186);
			match(NEW_REGEX_DECORATION);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityType(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityType(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityType(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityTypeContext newEntityType() throws RecognitionException {
		NewEntityTypeContext _localctx = new NewEntityTypeContext(_ctx, getState());
		enterRule(_localctx, 30, RULE_newEntityType);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(188);
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
		public TerminalNode HAS_ROLES_LABEL() { return getToken(LUFileParser.HAS_ROLES_LABEL, 0); }
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> NEW_TEXT() { return getTokens(LUFileParser.NEW_TEXT); }
		public TerminalNode NEW_TEXT(int i) {
			return getToken(LUFileParser.NEW_TEXT, i);
		}
		public NewEntityRolesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityRoles; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityRoles(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityRoles(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityRoles(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityRolesContext newEntityRoles() throws RecognitionException {
		NewEntityRolesContext _localctx = new NewEntityRolesContext(_ctx, getState());
		enterRule(_localctx, 32, RULE_newEntityRoles);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(191);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==HAS_ROLES_LABEL) {
				{
				setState(190);
				match(HAS_ROLES_LABEL);
				}
			}

			setState(194); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(193);
					_la = _input.LA(1);
					if ( !(_la==WS || _la==NEW_TEXT) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(196); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,18,_ctx);
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

	public static class NewEntityUsesFeaturesContext extends ParserRuleContext {
		public TerminalNode HAS_FEATURES_LABEL() { return getToken(LUFileParser.HAS_FEATURES_LABEL, 0); }
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public List<TerminalNode> NEW_TEXT() { return getTokens(LUFileParser.NEW_TEXT); }
		public TerminalNode NEW_TEXT(int i) {
			return getToken(LUFileParser.NEW_TEXT, i);
		}
		public NewEntityUsesFeaturesContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityUsesFeatures; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityUsesFeatures(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityUsesFeatures(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityUsesFeatures(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityUsesFeaturesContext newEntityUsesFeatures() throws RecognitionException {
		NewEntityUsesFeaturesContext _localctx = new NewEntityUsesFeaturesContext(_ctx, getState());
		enterRule(_localctx, 34, RULE_newEntityUsesFeatures);
		int _la;
		try {
			int _alt;
			enterOuterAlt(_localctx, 1);
			{
			setState(198);
			match(HAS_FEATURES_LABEL);
			setState(200); 
			_errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					setState(199);
					_la = _input.LA(1);
					if ( !(_la==WS || _la==NEW_TEXT) ) {
					_errHandler.recoverInline(this);
					}
					else {
						if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
						_errHandler.reportMatch(this);
						consume();
					}
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				setState(202); 
				_errHandler.sync(this);
				_alt = getInterpreter().adaptivePredict(_input,19,_ctx);
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

	public static class NewEntityNameContext extends ParserRuleContext {
		public TerminalNode NEW_ENTITY_IDENTIFIER() { return getToken(LUFileParser.NEW_ENTITY_IDENTIFIER, 0); }
		public NewEntityNameContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityName; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityName(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityName(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityName(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityNameContext newEntityName() throws RecognitionException {
		NewEntityNameContext _localctx = new NewEntityNameContext(_ctx, getState());
		enterRule(_localctx, 36, RULE_newEntityName);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(204);
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
		public List<TerminalNode> SINGLE_QUOTE() { return getTokens(LUFileParser.SINGLE_QUOTE); }
		public TerminalNode SINGLE_QUOTE(int i) {
			return getToken(LUFileParser.SINGLE_QUOTE, i);
		}
		public List<TerminalNode> DOUBLE_QUOTE() { return getTokens(LUFileParser.DOUBLE_QUOTE); }
		public TerminalNode DOUBLE_QUOTE(int i) {
			return getToken(LUFileParser.DOUBLE_QUOTE, i);
		}
		public List<NewEntityNameContext> newEntityName() {
			return getRuleContexts(NewEntityNameContext.class);
		}
		public NewEntityNameContext newEntityName(int i) {
			return getRuleContext(NewEntityNameContext.class,i);
		}
		public List<TerminalNode> WS() { return getTokens(LUFileParser.WS); }
		public TerminalNode WS(int i) {
			return getToken(LUFileParser.WS, i);
		}
		public NewEntityNameWithWSContext(ParserRuleContext parent, int invokingState) {
			super(parent, invokingState);
		}
		@Override public int getRuleIndex() { return RULE_newEntityNameWithWS; }
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNewEntityNameWithWS(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNewEntityNameWithWS(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNewEntityNameWithWS(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NewEntityNameWithWSContext newEntityNameWithWS() throws RecognitionException {
		NewEntityNameWithWSContext _localctx = new NewEntityNameWithWSContext(_ctx, getState());
		enterRule(_localctx, 38, RULE_newEntityNameWithWS);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(206);
			_la = _input.LA(1);
			if ( !(_la==SINGLE_QUOTE || _la==DOUBLE_QUOTE) ) {
			_errHandler.recoverInline(this);
			}
			else {
				if ( _input.LA(1)==Token.EOF ) matchedEOF = true;
				_errHandler.reportMatch(this);
				consume();
			}
			setState(211);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==NEW_ENTITY_IDENTIFIER) {
				{
				setState(209);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case NEW_ENTITY_IDENTIFIER:
					{
					setState(207);
					newEntityName();
					}
					break;
				case WS:
					{
					setState(208);
					match(WS);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(213);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(214);
			_la = _input.LA(1);
			if ( !(_la==SINGLE_QUOTE || _la==DOUBLE_QUOTE) ) {
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterEntityDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitEntityDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitEntityDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final EntityDefinitionContext entityDefinition() throws RecognitionException {
		EntityDefinitionContext _localctx = new EntityDefinitionContext(_ctx, getState());
		enterRule(_localctx, 40, RULE_entityDefinition);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(216);
			entityLine();
			setState(217);
			newline();
			setState(219);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==DASH) {
				{
				setState(218);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterEntityLine(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitEntityLine(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitEntityLine(this);
			else return visitor.visitChildren(this);
		}
	}

	public final EntityLineContext entityLine() throws RecognitionException {
		EntityLineContext _localctx = new EntityLineContext(_ctx, getState());
		enterRule(_localctx, 42, RULE_entityLine);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(221);
			match(DOLLAR);
			setState(222);
			entityName();
			setState(223);
			match(COLON_MARK);
			setState(224);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterEntityName(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitEntityName(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitEntityName(this);
			else return visitor.visitChildren(this);
		}
	}

	public final EntityNameContext entityName() throws RecognitionException {
		EntityNameContext _localctx = new EntityNameContext(_ctx, getState());
		enterRule(_localctx, 44, RULE_entityName);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(230);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==ENTITY_IDENTIFIER) {
				{
				setState(228);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ENTITY_IDENTIFIER:
					{
					setState(226);
					entityIdentifier();
					}
					break;
				case WS:
					{
					setState(227);
					match(WS);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(232);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterEntityType(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitEntityType(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitEntityType(this);
			else return visitor.visitChildren(this);
		}
	}

	public final EntityTypeContext entityType() throws RecognitionException {
		EntityTypeContext _localctx = new EntityTypeContext(_ctx, getState());
		enterRule(_localctx, 46, RULE_entityType);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(241);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while ((((_la) & ~0x3f) == 0 && ((1L << _la) & ((1L << WS) | (1L << ENTITY_IDENTIFIER) | (1L << COMPOSITE_ENTITY) | (1L << REGEX_ENTITY) | (1L << COLON_MARK) | (1L << SPECIAL_CHAR_MARK))) != 0)) {
				{
				setState(239);
				_errHandler.sync(this);
				switch (_input.LA(1)) {
				case ENTITY_IDENTIFIER:
					{
					setState(233);
					entityIdentifier();
					}
					break;
				case COMPOSITE_ENTITY:
					{
					setState(234);
					compositeEntityIdentifier();
					}
					break;
				case REGEX_ENTITY:
					{
					setState(235);
					regexEntityIdentifier();
					}
					break;
				case SPECIAL_CHAR_MARK:
					{
					setState(236);
					match(SPECIAL_CHAR_MARK);
					}
					break;
				case COLON_MARK:
					{
					setState(237);
					match(COLON_MARK);
					}
					break;
				case WS:
					{
					setState(238);
					match(WS);
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				}
				setState(243);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterCompositeEntityIdentifier(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitCompositeEntityIdentifier(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitCompositeEntityIdentifier(this);
			else return visitor.visitChildren(this);
		}
	}

	public final CompositeEntityIdentifierContext compositeEntityIdentifier() throws RecognitionException {
		CompositeEntityIdentifierContext _localctx = new CompositeEntityIdentifierContext(_ctx, getState());
		enterRule(_localctx, 48, RULE_compositeEntityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(244);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterRegexEntityIdentifier(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitRegexEntityIdentifier(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitRegexEntityIdentifier(this);
			else return visitor.visitChildren(this);
		}
	}

	public final RegexEntityIdentifierContext regexEntityIdentifier() throws RecognitionException {
		RegexEntityIdentifierContext _localctx = new RegexEntityIdentifierContext(_ctx, getState());
		enterRule(_localctx, 50, RULE_regexEntityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(246);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterEntityIdentifier(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitEntityIdentifier(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitEntityIdentifier(this);
			else return visitor.visitChildren(this);
		}
	}

	public final EntityIdentifierContext entityIdentifier() throws RecognitionException {
		EntityIdentifierContext _localctx = new EntityIdentifierContext(_ctx, getState());
		enterRule(_localctx, 52, RULE_entityIdentifier);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(248);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterEntityListBody(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitEntityListBody(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitEntityListBody(this);
			else return visitor.visitChildren(this);
		}
	}

	public final EntityListBodyContext entityListBody() throws RecognitionException {
		EntityListBodyContext _localctx = new EntityListBodyContext(_ctx, getState());
		enterRule(_localctx, 54, RULE_entityListBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(253); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(250);
				normalItemString();
				setState(251);
				newline();
				}
				}
				setState(255); 
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterNormalItemString(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitNormalItemString(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitNormalItemString(this);
			else return visitor.visitChildren(this);
		}
	}

	public final NormalItemStringContext normalItemString() throws RecognitionException {
		NormalItemStringContext _localctx = new NormalItemStringContext(_ctx, getState());
		enterRule(_localctx, 56, RULE_normalItemString);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(257);
			match(DASH);
			setState(261);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==TEXT) {
				{
				{
				setState(258);
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
				setState(263);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterImportDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitImportDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitImportDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final ImportDefinitionContext importDefinition() throws RecognitionException {
		ImportDefinitionContext _localctx = new ImportDefinitionContext(_ctx, getState());
		enterRule(_localctx, 58, RULE_importDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(264);
			match(IMPORT_DESC);
			setState(265);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterQnaDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitQnaDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitQnaDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final QnaDefinitionContext qnaDefinition() throws RecognitionException {
		QnaDefinitionContext _localctx = new QnaDefinitionContext(_ctx, getState());
		enterRule(_localctx, 60, RULE_qnaDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(267);
			qnaQuestion();
			setState(268);
			moreQuestionsBody();
			setState(269);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterQnaQuestion(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitQnaQuestion(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitQnaQuestion(this);
			else return visitor.visitChildren(this);
		}
	}

	public final QnaQuestionContext qnaQuestion() throws RecognitionException {
		QnaQuestionContext _localctx = new QnaQuestionContext(_ctx, getState());
		enterRule(_localctx, 62, RULE_qnaQuestion);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(271);
			match(QNA);
			setState(272);
			questionText();
			setState(273);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterQuestionText(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitQuestionText(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitQuestionText(this);
			else return visitor.visitChildren(this);
		}
	}

	public final QuestionTextContext questionText() throws RecognitionException {
		QuestionTextContext _localctx = new QuestionTextContext(_ctx, getState());
		enterRule(_localctx, 64, RULE_questionText);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(278);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==QNA_TEXT) {
				{
				{
				setState(275);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterMoreQuestionsBody(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitMoreQuestionsBody(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitMoreQuestionsBody(this);
			else return visitor.visitChildren(this);
		}
	}

	public final MoreQuestionsBodyContext moreQuestionsBody() throws RecognitionException {
		MoreQuestionsBodyContext _localctx = new MoreQuestionsBodyContext(_ctx, getState());
		enterRule(_localctx, 66, RULE_moreQuestionsBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(286);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==DASH) {
				{
				{
				setState(281);
				moreQuestion();
				setState(282);
				newline();
				}
				}
				setState(288);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterMoreQuestion(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitMoreQuestion(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitMoreQuestion(this);
			else return visitor.visitChildren(this);
		}
	}

	public final MoreQuestionContext moreQuestion() throws RecognitionException {
		MoreQuestionContext _localctx = new MoreQuestionContext(_ctx, getState());
		enterRule(_localctx, 68, RULE_moreQuestion);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(289);
			match(DASH);
			setState(293);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==TEXT) {
				{
				{
				setState(290);
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
				setState(295);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterQnaAnswerBody(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitQnaAnswerBody(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitQnaAnswerBody(this);
			else return visitor.visitChildren(this);
		}
	}

	public final QnaAnswerBodyContext qnaAnswerBody() throws RecognitionException {
		QnaAnswerBodyContext _localctx = new QnaAnswerBodyContext(_ctx, getState());
		enterRule(_localctx, 70, RULE_qnaAnswerBody);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(297);
			_errHandler.sync(this);
			_la = _input.LA(1);
			if (_la==FILTER_MARK) {
				{
				setState(296);
				filterSection();
				}
			}

			setState(299);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterFilterSection(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitFilterSection(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitFilterSection(this);
			else return visitor.visitChildren(this);
		}
	}

	public final FilterSectionContext filterSection() throws RecognitionException {
		FilterSectionContext _localctx = new FilterSectionContext(_ctx, getState());
		enterRule(_localctx, 72, RULE_filterSection);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(301);
			match(FILTER_MARK);
			setState(303); 
			_errHandler.sync(this);
			_la = _input.LA(1);
			do {
				{
				{
				setState(302);
				filterLine();
				}
				}
				setState(305); 
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterFilterLine(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitFilterLine(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitFilterLine(this);
			else return visitor.visitChildren(this);
		}
	}

	public final FilterLineContext filterLine() throws RecognitionException {
		FilterLineContext _localctx = new FilterLineContext(_ctx, getState());
		enterRule(_localctx, 74, RULE_filterLine);
		int _la;
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(307);
			match(DASH);
			setState(311);
			_errHandler.sync(this);
			_la = _input.LA(1);
			while (_la==WS || _la==TEXT) {
				{
				{
				setState(308);
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
				setState(313);
				_errHandler.sync(this);
				_la = _input.LA(1);
			}
			setState(314);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterMultiLineAnswer(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitMultiLineAnswer(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitMultiLineAnswer(this);
			else return visitor.visitChildren(this);
		}
	}

	public final MultiLineAnswerContext multiLineAnswer() throws RecognitionException {
		MultiLineAnswerContext _localctx = new MultiLineAnswerContext(_ctx, getState());
		enterRule(_localctx, 76, RULE_multiLineAnswer);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(316);
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
		@Override
		public void enterRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).enterModelInfoDefinition(this);
		}
		@Override
		public void exitRule(ParseTreeListener listener) {
			if ( listener instanceof LUFileParserListener ) ((LUFileParserListener)listener).exitModelInfoDefinition(this);
		}
		@Override
		public <T> T accept(ParseTreeVisitor<? extends T> visitor) {
			if ( visitor instanceof LUFileParserVisitor ) return ((LUFileParserVisitor<? extends T>)visitor).visitModelInfoDefinition(this);
			else return visitor.visitChildren(this);
		}
	}

	public final ModelInfoDefinitionContext modelInfoDefinition() throws RecognitionException {
		ModelInfoDefinitionContext _localctx = new ModelInfoDefinitionContext(_ctx, getState());
		enterRule(_localctx, 78, RULE_modelInfoDefinition);
		try {
			enterOuterAlt(_localctx, 1);
			{
			setState(318);
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
		"\3\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964\3.\u0143\4\2\t\2\4"+
		"\3\t\3\4\4\t\4\4\5\t\5\4\6\t\6\4\7\t\7\4\b\t\b\4\t\t\t\4\n\t\n\4\13\t"+
		"\13\4\f\t\f\4\r\t\r\4\16\t\16\4\17\t\17\4\20\t\20\4\21\t\21\4\22\t\22"+
		"\4\23\t\23\4\24\t\24\4\25\t\25\4\26\t\26\4\27\t\27\4\30\t\30\4\31\t\31"+
		"\4\32\t\32\4\33\t\33\4\34\t\34\4\35\t\35\4\36\t\36\4\37\t\37\4 \t \4!"+
		"\t!\4\"\t\"\4#\t#\4$\t$\4%\t%\4&\t&\4\'\t\'\4(\t(\4)\t)\3\2\6\2T\n\2\r"+
		"\2\16\2U\3\2\3\2\3\3\3\3\3\3\3\3\3\3\3\3\3\3\5\3a\n\3\3\4\3\4\3\5\3\5"+
		"\3\5\5\5h\n\5\3\6\3\6\3\6\3\7\3\7\3\7\7\7p\n\7\f\7\16\7s\13\7\3\b\3\b"+
		"\3\b\7\bx\n\b\f\b\16\b{\13\b\3\t\3\t\3\n\3\n\3\n\6\n\u0082\n\n\r\n\16"+
		"\n\u0083\3\13\3\13\7\13\u0088\n\13\f\13\16\13\u008b\13\13\3\f\3\f\3\f"+
		"\5\f\u0090\n\f\3\r\3\r\3\r\6\r\u0095\n\r\r\r\16\r\u0096\3\16\3\16\3\16"+
		"\3\16\5\16\u009d\n\16\3\16\3\16\7\16\u00a1\n\16\f\16\16\16\u00a4\13\16"+
		"\3\16\5\16\u00a7\n\16\3\16\3\16\5\16\u00ab\n\16\3\17\3\17\7\17\u00af\n"+
		"\17\f\17\16\17\u00b2\13\17\3\17\3\17\3\20\3\20\7\20\u00b8\n\20\f\20\16"+
		"\20\u00bb\13\20\3\20\3\20\3\21\3\21\3\22\5\22\u00c2\n\22\3\22\6\22\u00c5"+
		"\n\22\r\22\16\22\u00c6\3\23\3\23\6\23\u00cb\n\23\r\23\16\23\u00cc\3\24"+
		"\3\24\3\25\3\25\3\25\7\25\u00d4\n\25\f\25\16\25\u00d7\13\25\3\25\3\25"+
		"\3\26\3\26\3\26\5\26\u00de\n\26\3\27\3\27\3\27\3\27\3\27\3\30\3\30\7\30"+
		"\u00e7\n\30\f\30\16\30\u00ea\13\30\3\31\3\31\3\31\3\31\3\31\3\31\7\31"+
		"\u00f2\n\31\f\31\16\31\u00f5\13\31\3\32\3\32\3\33\3\33\3\34\3\34\3\35"+
		"\3\35\3\35\6\35\u0100\n\35\r\35\16\35\u0101\3\36\3\36\7\36\u0106\n\36"+
		"\f\36\16\36\u0109\13\36\3\37\3\37\3\37\3 \3 \3 \3 \3!\3!\3!\3!\3\"\7\""+
		"\u0117\n\"\f\"\16\"\u011a\13\"\3#\3#\3#\7#\u011f\n#\f#\16#\u0122\13#\3"+
		"$\3$\7$\u0126\n$\f$\16$\u0129\13$\3%\5%\u012c\n%\3%\3%\3&\3&\6&\u0132"+
		"\n&\r&\16&\u0133\3\'\3\'\7\'\u0138\n\'\f\'\16\'\u013b\13\'\3\'\3\'\3("+
		"\3(\3)\3)\3)\3U\2*\2\4\6\b\n\f\16\20\22\24\26\30\32\34\36 \"$&(*,.\60"+
		"\62\64\668:<>@BDFHJLNP\2\b\3\3\6\6\4\2\5\5$&\4\2\5\5\37\37\3\2\25\26\4"+
		"\2\5\5&&\4\2\5\5..\2\u0148\2S\3\2\2\2\4`\3\2\2\2\6b\3\2\2\2\bd\3\2\2\2"+
		"\ni\3\2\2\2\fl\3\2\2\2\16t\3\2\2\2\20|\3\2\2\2\22\u0081\3\2\2\2\24\u0085"+
		"\3\2\2\2\26\u008c\3\2\2\2\30\u0094\3\2\2\2\32\u0098\3\2\2\2\34\u00ac\3"+
		"\2\2\2\36\u00b5\3\2\2\2 \u00be\3\2\2\2\"\u00c1\3\2\2\2$\u00c8\3\2\2\2"+
		"&\u00ce\3\2\2\2(\u00d0\3\2\2\2*\u00da\3\2\2\2,\u00df\3\2\2\2.\u00e8\3"+
		"\2\2\2\60\u00f3\3\2\2\2\62\u00f6\3\2\2\2\64\u00f8\3\2\2\2\66\u00fa\3\2"+
		"\2\28\u00ff\3\2\2\2:\u0103\3\2\2\2<\u010a\3\2\2\2>\u010d\3\2\2\2@\u0111"+
		"\3\2\2\2B\u0118\3\2\2\2D\u0120\3\2\2\2F\u0123\3\2\2\2H\u012b\3\2\2\2J"+
		"\u012f\3\2\2\2L\u0135\3\2\2\2N\u013e\3\2\2\2P\u0140\3\2\2\2RT\5\4\3\2"+
		"SR\3\2\2\2TU\3\2\2\2UV\3\2\2\2US\3\2\2\2VW\3\2\2\2WX\7\2\2\3X\3\3\2\2"+
		"\2Ya\5\6\4\2Za\5\b\5\2[a\5\26\f\2\\a\5*\26\2]a\5<\37\2^a\5> \2_a\5P)\2"+
		"`Y\3\2\2\2`Z\3\2\2\2`[\3\2\2\2`\\\3\2\2\2`]\3\2\2\2`^\3\2\2\2`_\3\2\2"+
		"\2a\5\3\2\2\2bc\t\2\2\2c\7\3\2\2\2de\5\n\6\2eg\5\6\4\2fh\5\20\t\2gf\3"+
		"\2\2\2gh\3\2\2\2h\t\3\2\2\2ij\7\b\2\2jk\5\f\7\2k\13\3\2\2\2lq\5\16\b\2"+
		"mp\7\5\2\2np\5\16\b\2om\3\2\2\2on\3\2\2\2ps\3\2\2\2qo\3\2\2\2qr\3\2\2"+
		"\2r\r\3\2\2\2sq\3\2\2\2ty\7!\2\2uv\7\"\2\2vx\7!\2\2wu\3\2\2\2x{\3\2\2"+
		"\2yw\3\2\2\2yz\3\2\2\2z\17\3\2\2\2{y\3\2\2\2|}\5\22\n\2}\21\3\2\2\2~\177"+
		"\5\24\13\2\177\u0080\5\6\4\2\u0080\u0082\3\2\2\2\u0081~\3\2\2\2\u0082"+
		"\u0083\3\2\2\2\u0083\u0081\3\2\2\2\u0083\u0084\3\2\2\2\u0084\23\3\2\2"+
		"\2\u0085\u0089\7\t\2\2\u0086\u0088\t\3\2\2\u0087\u0086\3\2\2\2\u0088\u008b"+
		"\3\2\2\2\u0089\u0087\3\2\2\2\u0089\u008a\3\2\2\2\u008a\25\3\2\2\2\u008b"+
		"\u0089\3\2\2\2\u008c\u008d\5\32\16\2\u008d\u008f\5\6\4\2\u008e\u0090\5"+
		"\30\r\2\u008f\u008e\3\2\2\2\u008f\u0090\3\2\2\2\u0090\27\3\2\2\2\u0091"+
		"\u0092\5:\36\2\u0092\u0093\5\6\4\2\u0093\u0095\3\2\2\2\u0094\u0091\3\2"+
		"\2\2\u0095\u0096\3\2\2\2\u0096\u0094\3\2\2\2\u0096\u0097\3\2\2\2\u0097"+
		"\31\3\2\2\2\u0098\u0099\7\13\2\2\u0099\u009c\5 \21\2\u009a\u009d\5&\24"+
		"\2\u009b\u009d\5(\25\2\u009c\u009a\3\2\2\2\u009c\u009b\3\2\2\2\u009c\u009d"+
		"\3\2\2\2\u009d\u00a2\3\2\2\2\u009e\u00a1\5\"\22\2\u009f\u00a1\5$\23\2"+
		"\u00a0\u009e\3\2\2\2\u00a0\u009f\3\2\2\2\u00a1\u00a4\3\2\2\2\u00a2\u00a0"+
		"\3\2\2\2\u00a2\u00a3\3\2\2\2\u00a3\u00a6\3\2\2\2\u00a4\u00a2\3\2\2\2\u00a5"+
		"\u00a7\7\21\2\2\u00a6\u00a5\3\2\2\2\u00a6\u00a7\3\2\2\2\u00a7\u00aa\3"+
		"\2\2\2\u00a8\u00ab\5\34\17\2\u00a9\u00ab\5\36\20\2\u00aa\u00a8\3\2\2\2"+
		"\u00aa\u00a9\3\2\2\2\u00aa\u00ab\3\2\2\2\u00ab\33\3\2\2\2\u00ac\u00b0"+
		"\7\22\2\2\u00ad\u00af\t\4\2\2\u00ae\u00ad\3\2\2\2\u00af\u00b2\3\2\2\2"+
		"\u00b0\u00ae\3\2\2\2\u00b0\u00b1\3\2\2\2\u00b1\u00b3\3\2\2\2\u00b2\u00b0"+
		"\3\2\2\2\u00b3\u00b4\7\23\2\2\u00b4\35\3\2\2\2\u00b5\u00b9\7\24\2\2\u00b6"+
		"\u00b8\t\4\2\2\u00b7\u00b6\3\2\2\2\u00b8\u00bb\3\2\2\2\u00b9\u00b7\3\2"+
		"\2\2\u00b9\u00ba\3\2\2\2\u00ba\u00bc\3\2\2\2\u00bb\u00b9\3\2\2\2\u00bc"+
		"\u00bd\7\24\2\2\u00bd\37\3\2\2\2\u00be\u00bf\7\36\2\2\u00bf!\3\2\2\2\u00c0"+
		"\u00c2\7\27\2\2\u00c1\u00c0\3\2\2\2\u00c1\u00c2\3\2\2\2\u00c2\u00c4\3"+
		"\2\2\2\u00c3\u00c5\t\4\2\2\u00c4\u00c3\3\2\2\2\u00c5\u00c6\3\2\2\2\u00c6"+
		"\u00c4\3\2\2\2\u00c6\u00c7\3\2\2\2\u00c7#\3\2\2\2\u00c8\u00ca\7\30\2\2"+
		"\u00c9\u00cb\t\4\2\2\u00ca\u00c9\3\2\2\2\u00cb\u00cc\3\2\2\2\u00cc\u00ca"+
		"\3\2\2\2\u00cc\u00cd\3\2\2\2\u00cd%\3\2\2\2\u00ce\u00cf\7\32\2\2\u00cf"+
		"\'\3\2\2\2\u00d0\u00d5\t\5\2\2\u00d1\u00d4\5&\24\2\u00d2\u00d4\7\5\2\2"+
		"\u00d3\u00d1\3\2\2\2\u00d3\u00d2\3\2\2\2\u00d4\u00d7\3\2\2\2\u00d5\u00d3"+
		"\3\2\2\2\u00d5\u00d6\3\2\2\2\u00d6\u00d8\3\2\2\2\u00d7\u00d5\3\2\2\2\u00d8"+
		"\u00d9\t\5\2\2\u00d9)\3\2\2\2\u00da\u00db\5,\27\2\u00db\u00dd\5\6\4\2"+
		"\u00dc\u00de\58\35\2\u00dd\u00dc\3\2\2\2\u00dd\u00de\3\2\2\2\u00de+\3"+
		"\2\2\2\u00df\u00e0\7\n\2\2\u00e0\u00e1\5.\30\2\u00e1\u00e2\7+\2\2\u00e2"+
		"\u00e3\5\60\31\2\u00e3-\3\2\2\2\u00e4\u00e7\5\66\34\2\u00e5\u00e7\7\5"+
		"\2\2\u00e6\u00e4\3\2\2\2\u00e6\u00e5\3\2\2\2\u00e7\u00ea\3\2\2\2\u00e8"+
		"\u00e6\3\2\2\2\u00e8\u00e9\3\2\2\2\u00e9/\3\2\2\2\u00ea\u00e8\3\2\2\2"+
		"\u00eb\u00f2\5\66\34\2\u00ec\u00f2\5\62\32\2\u00ed\u00f2\5\64\33\2\u00ee"+
		"\u00f2\7,\2\2\u00ef\u00f2\7+\2\2\u00f0\u00f2\7\5\2\2\u00f1\u00eb\3\2\2"+
		"\2\u00f1\u00ec\3\2\2\2\u00f1\u00ed\3\2\2\2\u00f1\u00ee\3\2\2\2\u00f1\u00ef"+
		"\3\2\2\2\u00f1\u00f0\3\2\2\2\u00f2\u00f5\3\2\2\2\u00f3\u00f1\3\2\2\2\u00f3"+
		"\u00f4\3\2\2\2\u00f4\61\3\2\2\2\u00f5\u00f3\3\2\2\2\u00f6\u00f7\7)\2\2"+
		"\u00f7\63\3\2\2\2\u00f8\u00f9\7*\2\2\u00f9\65\3\2\2\2\u00fa\u00fb\7(\2"+
		"\2\u00fb\67\3\2\2\2\u00fc\u00fd\5:\36\2\u00fd\u00fe\5\6\4\2\u00fe\u0100"+
		"\3\2\2\2\u00ff\u00fc\3\2\2\2\u0100\u0101\3\2\2\2\u0101\u00ff\3\2\2\2\u0101"+
		"\u0102\3\2\2\2\u01029\3\2\2\2\u0103\u0107\7\t\2\2\u0104\u0106\t\6\2\2"+
		"\u0105\u0104\3\2\2\2\u0106\u0109\3\2\2\2\u0107\u0105\3\2\2\2\u0107\u0108"+
		"\3\2\2\2\u0108;\3\2\2\2\u0109\u0107\3\2\2\2\u010a\u010b\7\f\2\2\u010b"+
		"\u010c\7\r\2\2\u010c=\3\2\2\2\u010d\u010e\5@!\2\u010e\u010f\5D#\2\u010f"+
		"\u0110\5H%\2\u0110?\3\2\2\2\u0111\u0112\7\7\2\2\u0112\u0113\5B\"\2\u0113"+
		"\u0114\5\6\4\2\u0114A\3\2\2\2\u0115\u0117\t\7\2\2\u0116\u0115\3\2\2\2"+
		"\u0117\u011a\3\2\2\2\u0118\u0116\3\2\2\2\u0118\u0119\3\2\2\2\u0119C\3"+
		"\2\2\2\u011a\u0118\3\2\2\2\u011b\u011c\5F$\2\u011c\u011d\5\6\4\2\u011d"+
		"\u011f\3\2\2\2\u011e\u011b\3\2\2\2\u011f\u0122\3\2\2\2\u0120\u011e\3\2"+
		"\2\2\u0120\u0121\3\2\2\2\u0121E\3\2\2\2\u0122\u0120\3\2\2\2\u0123\u0127"+
		"\7\t\2\2\u0124\u0126\t\6\2\2\u0125\u0124\3\2\2\2\u0126\u0129\3\2\2\2\u0127"+
		"\u0125\3\2\2\2\u0127\u0128\3\2\2\2\u0128G\3\2\2\2\u0129\u0127\3\2\2\2"+
		"\u012a\u012c\5J&\2\u012b\u012a\3\2\2\2\u012b\u012c\3\2\2\2\u012c\u012d"+
		"\3\2\2\2\u012d\u012e\5N(\2\u012eI\3\2\2\2\u012f\u0131\7\16\2\2\u0130\u0132"+
		"\5L\'\2\u0131\u0130\3\2\2\2\u0132\u0133\3\2\2\2\u0133\u0131\3\2\2\2\u0133"+
		"\u0134\3\2\2\2\u0134K\3\2\2\2\u0135\u0139\7\t\2\2\u0136\u0138\t\6\2\2"+
		"\u0137\u0136\3\2\2\2\u0138\u013b\3\2\2\2\u0139\u0137\3\2\2\2\u0139\u013a"+
		"\3\2\2\2\u013a\u013c\3\2\2\2\u013b\u0139\3\2\2\2\u013c\u013d\5\6\4\2\u013d"+
		"M\3\2\2\2\u013e\u013f\7\17\2\2\u013fO\3\2\2\2\u0140\u0141\7\3\2\2\u0141"+
		"Q\3\2\2\2%U`goqy\u0083\u0089\u008f\u0096\u009c\u00a0\u00a2\u00a6\u00aa"+
		"\u00b0\u00b9\u00c1\u00c6\u00cc\u00d3\u00d5\u00dd\u00e6\u00e8\u00f1\u00f3"+
		"\u0101\u0107\u0118\u0120\u0127\u012b\u0133\u0139";
	public static final ATN _ATN =
		new ATNDeserializer().deserialize(_serializedATN.toCharArray());
	static {
		_decisionToDFA = new DFA[_ATN.getNumberOfDecisions()];
		for (int i = 0; i < _ATN.getNumberOfDecisions(); i++) {
			_decisionToDFA[i] = new DFA(_ATN.getDecisionState(i), i);
		}
	}
}