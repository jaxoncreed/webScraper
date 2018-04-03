

export default class DB {
  constructor() {
    this.hash = {};
    this.base = '';
    this.prefixes = [];
  }

  setBase(base) {
    this.base = base;
  }

  addPrefix(prefix, url) {
    this.prefixes.push({ prefix, url });
  }

  add(subject, predicate, object) {
    if (!this.hash[subject]) {
      this.hash[subject] = {};
    }
    if (!this.hash[subject][predicate]) {
      this.hash[subject][predicate] = [];
    }
    this.hash[subject][predicate].push(object);
  }

  toString() {
    let result = '';
    result += `@base <${this.base}> .\n`
    this.prefixes.forEach((prefix) => {
      result += `@prefix ${prefix.prefix}: <${prefix.url}> .\n`;
    });
    result += `\n`;
    Object.keys(this.hash).forEach((subject) => {
      result += `${subject}\n`
      Object.keys(this.hash[subject]).forEach((predicate) => {
        this.hash[subject][predicate].forEach((object) => {
          result += `  ${predicate} ${object} ;\n`
        });
      });
      result = result.slice(0, -2) + '.\n\n';
    });
    return result;
  }
}