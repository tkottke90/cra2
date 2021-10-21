import DirectoryParserClass from "@classes/abstract-directory-parser.class";

class ServiceIndexClass extends DirectoryParserClass{

  init() {
    return this.parseDirectoryPath(__dirname, /.*\.service.*/);
  }
}

export default new ServiceIndexClass();
