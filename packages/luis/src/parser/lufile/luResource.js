class LUResource {
  /**
   * @param {any[]} sections
   * @param {string} content
   * @param {any[]} errors
   */
  constructor(sections, content, errors) {
    this.Sections = sections;
    this.Content = content;
    this.Errors = errors;
  }

  // TODO Add CRUD
}

module.exports = LUResource;