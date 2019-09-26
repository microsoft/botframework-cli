// Generated from LUFileParser.g4 by ANTLR 4.7.2
import org.antlr.v4.runtime.tree.ParseTreeVisitor;

/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by {@link LUFileParser}.
 *
 * @param <T> The return type of the visit operation. Use {@link Void} for
 * operations with no return type.
 */
public interface LUFileParserVisitor<T> extends ParseTreeVisitor<T> {
	/**
	 * Visit a parse tree produced by {@link LUFileParser#file}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFile(LUFileParser.FileContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#paragraph}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitParagraph(LUFileParser.ParagraphContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newline}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewline(LUFileParser.NewlineContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#intentDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIntentDefinition(LUFileParser.IntentDefinitionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#intentNameLine}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIntentNameLine(LUFileParser.IntentNameLineContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#intentName}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIntentName(LUFileParser.IntentNameContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#intentNameIdentifier}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIntentNameIdentifier(LUFileParser.IntentNameIdentifierContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#intentBody}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitIntentBody(LUFileParser.IntentBodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#normalIntentBody}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNormalIntentBody(LUFileParser.NormalIntentBodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#normalIntentString}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNormalIntentString(LUFileParser.NormalIntentStringContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityDefinition(LUFileParser.NewEntityDefinitionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityListbody}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityListbody(LUFileParser.NewEntityListbodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityLine}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityLine(LUFileParser.NewEntityLineContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newCompositeInlineDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewCompositeInlineDefinition(LUFileParser.NewCompositeInlineDefinitionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newRegexInlineDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewRegexInlineDefinition(LUFileParser.NewRegexInlineDefinitionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityType}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityType(LUFileParser.NewEntityTypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityRoles}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityRoles(LUFileParser.NewEntityRolesContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityUsesFeatures}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityUsesFeatures(LUFileParser.NewEntityUsesFeaturesContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityName}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityName(LUFileParser.NewEntityNameContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#newEntityNameWithWS}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNewEntityNameWithWS(LUFileParser.NewEntityNameWithWSContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#entityDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEntityDefinition(LUFileParser.EntityDefinitionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#entityLine}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEntityLine(LUFileParser.EntityLineContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#entityName}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEntityName(LUFileParser.EntityNameContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#entityType}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEntityType(LUFileParser.EntityTypeContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#compositeEntityIdentifier}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitCompositeEntityIdentifier(LUFileParser.CompositeEntityIdentifierContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#regexEntityIdentifier}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitRegexEntityIdentifier(LUFileParser.RegexEntityIdentifierContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#entityIdentifier}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEntityIdentifier(LUFileParser.EntityIdentifierContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#entityListBody}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitEntityListBody(LUFileParser.EntityListBodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#normalItemString}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitNormalItemString(LUFileParser.NormalItemStringContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#importDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitImportDefinition(LUFileParser.ImportDefinitionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#qnaDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQnaDefinition(LUFileParser.QnaDefinitionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#qnaQuestion}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQnaQuestion(LUFileParser.QnaQuestionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#questionText}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQuestionText(LUFileParser.QuestionTextContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#moreQuestionsBody}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMoreQuestionsBody(LUFileParser.MoreQuestionsBodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#moreQuestion}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMoreQuestion(LUFileParser.MoreQuestionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#qnaAnswerBody}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitQnaAnswerBody(LUFileParser.QnaAnswerBodyContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#filterSection}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFilterSection(LUFileParser.FilterSectionContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#filterLine}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitFilterLine(LUFileParser.FilterLineContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#multiLineAnswer}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitMultiLineAnswer(LUFileParser.MultiLineAnswerContext ctx);
	/**
	 * Visit a parse tree produced by {@link LUFileParser#modelInfoDefinition}.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	T visitModelInfoDefinition(LUFileParser.ModelInfoDefinitionContext ctx);
}