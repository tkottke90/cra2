import DirectoryParserClass from "@classes/abstract-directory-parser.class";

class ModelIndexClass extends DirectoryParserClass{

  init() {
    return this.parseDirectoryPath(__dirname, /.*\.model.*/);
  }
}

export default new ModelIndexClass();
