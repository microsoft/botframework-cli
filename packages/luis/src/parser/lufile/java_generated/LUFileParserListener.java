// Generated from LUFileParser.g4 by ANTLR 4.7.2
import org.antlr.v4.runtime.tree.ParseTreeListener;

/**
 * This interface defines a complete listener for a parse tree produced by
 * {@link LUFileParser}.
 */
public interface LUFileParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by {@link LUFileParser#file}.
	 * @param ctx the parse tree
	 */
	void enterFile(LUFileParser.FileContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#file}.
	 * @param ctx the parse tree
	 */
	void exitFile(LUFileParser.FileContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#paragraph}.
	 * @param ctx the parse tree
	 */
	void enterParagraph(LUFileParser.ParagraphContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#paragraph}.
	 * @param ctx the parse tree
	 */
	void exitParagraph(LUFileParser.ParagraphContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newline}.
	 * @param ctx the parse tree
	 */
	void enterNewline(LUFileParser.NewlineContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newline}.
	 * @param ctx the parse tree
	 */
	void exitNewline(LUFileParser.NewlineContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#intentDefinition}.
	 * @param ctx the parse tree
	 */
	void enterIntentDefinition(LUFileParser.IntentDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#intentDefinition}.
	 * @param ctx the parse tree
	 */
	void exitIntentDefinition(LUFileParser.IntentDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#intentNameLine}.
	 * @param ctx the parse tree
	 */
	void enterIntentNameLine(LUFileParser.IntentNameLineContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#intentNameLine}.
	 * @param ctx the parse tree
	 */
	void exitIntentNameLine(LUFileParser.IntentNameLineContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#intentName}.
	 * @param ctx the parse tree
	 */
	void enterIntentName(LUFileParser.IntentNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#intentName}.
	 * @param ctx the parse tree
	 */
	void exitIntentName(LUFileParser.IntentNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#intentNameIdentifier}.
	 * @param ctx the parse tree
	 */
	void enterIntentNameIdentifier(LUFileParser.IntentNameIdentifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#intentNameIdentifier}.
	 * @param ctx the parse tree
	 */
	void exitIntentNameIdentifier(LUFileParser.IntentNameIdentifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#intentBody}.
	 * @param ctx the parse tree
	 */
	void enterIntentBody(LUFileParser.IntentBodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#intentBody}.
	 * @param ctx the parse tree
	 */
	void exitIntentBody(LUFileParser.IntentBodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#normalIntentBody}.
	 * @param ctx the parse tree
	 */
	void enterNormalIntentBody(LUFileParser.NormalIntentBodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#normalIntentBody}.
	 * @param ctx the parse tree
	 */
	void exitNormalIntentBody(LUFileParser.NormalIntentBodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#normalIntentString}.
	 * @param ctx the parse tree
	 */
	void enterNormalIntentString(LUFileParser.NormalIntentStringContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#normalIntentString}.
	 * @param ctx the parse tree
	 */
	void exitNormalIntentString(LUFileParser.NormalIntentStringContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityDefinition}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityDefinition(LUFileParser.NewEntityDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityDefinition}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityDefinition(LUFileParser.NewEntityDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityListbody}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityListbody(LUFileParser.NewEntityListbodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityListbody}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityListbody(LUFileParser.NewEntityListbodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityLine}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityLine(LUFileParser.NewEntityLineContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityLine}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityLine(LUFileParser.NewEntityLineContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newCompositeInlineDefinition}.
	 * @param ctx the parse tree
	 */
	void enterNewCompositeInlineDefinition(LUFileParser.NewCompositeInlineDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newCompositeInlineDefinition}.
	 * @param ctx the parse tree
	 */
	void exitNewCompositeInlineDefinition(LUFileParser.NewCompositeInlineDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newRegexInlineDefinition}.
	 * @param ctx the parse tree
	 */
	void enterNewRegexInlineDefinition(LUFileParser.NewRegexInlineDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newRegexInlineDefinition}.
	 * @param ctx the parse tree
	 */
	void exitNewRegexInlineDefinition(LUFileParser.NewRegexInlineDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityType}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityType(LUFileParser.NewEntityTypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityType}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityType(LUFileParser.NewEntityTypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityRoles}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityRoles(LUFileParser.NewEntityRolesContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityRoles}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityRoles(LUFileParser.NewEntityRolesContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityUsesFeatures}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityUsesFeatures(LUFileParser.NewEntityUsesFeaturesContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityUsesFeatures}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityUsesFeatures(LUFileParser.NewEntityUsesFeaturesContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityName}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityName(LUFileParser.NewEntityNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityName}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityName(LUFileParser.NewEntityNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#newEntityNameWithWS}.
	 * @param ctx the parse tree
	 */
	void enterNewEntityNameWithWS(LUFileParser.NewEntityNameWithWSContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#newEntityNameWithWS}.
	 * @param ctx the parse tree
	 */
	void exitNewEntityNameWithWS(LUFileParser.NewEntityNameWithWSContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#entityDefinition}.
	 * @param ctx the parse tree
	 */
	void enterEntityDefinition(LUFileParser.EntityDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#entityDefinition}.
	 * @param ctx the parse tree
	 */
	void exitEntityDefinition(LUFileParser.EntityDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#entityLine}.
	 * @param ctx the parse tree
	 */
	void enterEntityLine(LUFileParser.EntityLineContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#entityLine}.
	 * @param ctx the parse tree
	 */
	void exitEntityLine(LUFileParser.EntityLineContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#entityName}.
	 * @param ctx the parse tree
	 */
	void enterEntityName(LUFileParser.EntityNameContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#entityName}.
	 * @param ctx the parse tree
	 */
	void exitEntityName(LUFileParser.EntityNameContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#entityType}.
	 * @param ctx the parse tree
	 */
	void enterEntityType(LUFileParser.EntityTypeContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#entityType}.
	 * @param ctx the parse tree
	 */
	void exitEntityType(LUFileParser.EntityTypeContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#compositeEntityIdentifier}.
	 * @param ctx the parse tree
	 */
	void enterCompositeEntityIdentifier(LUFileParser.CompositeEntityIdentifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#compositeEntityIdentifier}.
	 * @param ctx the parse tree
	 */
	void exitCompositeEntityIdentifier(LUFileParser.CompositeEntityIdentifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#regexEntityIdentifier}.
	 * @param ctx the parse tree
	 */
	void enterRegexEntityIdentifier(LUFileParser.RegexEntityIdentifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#regexEntityIdentifier}.
	 * @param ctx the parse tree
	 */
	void exitRegexEntityIdentifier(LUFileParser.RegexEntityIdentifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#entityIdentifier}.
	 * @param ctx the parse tree
	 */
	void enterEntityIdentifier(LUFileParser.EntityIdentifierContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#entityIdentifier}.
	 * @param ctx the parse tree
	 */
	void exitEntityIdentifier(LUFileParser.EntityIdentifierContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#entityListBody}.
	 * @param ctx the parse tree
	 */
	void enterEntityListBody(LUFileParser.EntityListBodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#entityListBody}.
	 * @param ctx the parse tree
	 */
	void exitEntityListBody(LUFileParser.EntityListBodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#normalItemString}.
	 * @param ctx the parse tree
	 */
	void enterNormalItemString(LUFileParser.NormalItemStringContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#normalItemString}.
	 * @param ctx the parse tree
	 */
	void exitNormalItemString(LUFileParser.NormalItemStringContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#importDefinition}.
	 * @param ctx the parse tree
	 */
	void enterImportDefinition(LUFileParser.ImportDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#importDefinition}.
	 * @param ctx the parse tree
	 */
	void exitImportDefinition(LUFileParser.ImportDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#qnaDefinition}.
	 * @param ctx the parse tree
	 */
	void enterQnaDefinition(LUFileParser.QnaDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#qnaDefinition}.
	 * @param ctx the parse tree
	 */
	void exitQnaDefinition(LUFileParser.QnaDefinitionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#qnaQuestion}.
	 * @param ctx the parse tree
	 */
	void enterQnaQuestion(LUFileParser.QnaQuestionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#qnaQuestion}.
	 * @param ctx the parse tree
	 */
	void exitQnaQuestion(LUFileParser.QnaQuestionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#questionText}.
	 * @param ctx the parse tree
	 */
	void enterQuestionText(LUFileParser.QuestionTextContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#questionText}.
	 * @param ctx the parse tree
	 */
	void exitQuestionText(LUFileParser.QuestionTextContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#moreQuestionsBody}.
	 * @param ctx the parse tree
	 */
	void enterMoreQuestionsBody(LUFileParser.MoreQuestionsBodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#moreQuestionsBody}.
	 * @param ctx the parse tree
	 */
	void exitMoreQuestionsBody(LUFileParser.MoreQuestionsBodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#moreQuestion}.
	 * @param ctx the parse tree
	 */
	void enterMoreQuestion(LUFileParser.MoreQuestionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#moreQuestion}.
	 * @param ctx the parse tree
	 */
	void exitMoreQuestion(LUFileParser.MoreQuestionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#qnaAnswerBody}.
	 * @param ctx the parse tree
	 */
	void enterQnaAnswerBody(LUFileParser.QnaAnswerBodyContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#qnaAnswerBody}.
	 * @param ctx the parse tree
	 */
	void exitQnaAnswerBody(LUFileParser.QnaAnswerBodyContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#filterSection}.
	 * @param ctx the parse tree
	 */
	void enterFilterSection(LUFileParser.FilterSectionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#filterSection}.
	 * @param ctx the parse tree
	 */
	void exitFilterSection(LUFileParser.FilterSectionContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#filterLine}.
	 * @param ctx the parse tree
	 */
	void enterFilterLine(LUFileParser.FilterLineContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#filterLine}.
	 * @param ctx the parse tree
	 */
	void exitFilterLine(LUFileParser.FilterLineContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#multiLineAnswer}.
	 * @param ctx the parse tree
	 */
	void enterMultiLineAnswer(LUFileParser.MultiLineAnswerContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#multiLineAnswer}.
	 * @param ctx the parse tree
	 */
	void exitMultiLineAnswer(LUFileParser.MultiLineAnswerContext ctx);
	/**
	 * Enter a parse tree produced by {@link LUFileParser#modelInfoDefinition}.
	 * @param ctx the parse tree
	 */
	void enterModelInfoDefinition(LUFileParser.ModelInfoDefinitionContext ctx);
	/**
	 * Exit a parse tree produced by {@link LUFileParser#modelInfoDefinition}.
	 * @param ctx the parse tree
	 */
	void exitModelInfoDefinition(LUFileParser.ModelInfoDefinitionContext ctx);
}